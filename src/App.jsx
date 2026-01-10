import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomeScreen from './screens/HomeScreen';
import AddIncomeScreen from './screens/AddIncomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ReportScreen from './screens/ReportScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import { initStorage } from './services/storage';
import { getAllTransactionsFromFirebase, listenToTransactions } from './services/firebase';

// Component bảo vệ route
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(''); // For status messages

  useEffect(() => {
    // Initialize storage on app load
    initStorage();

    let unsubscribe = null;

    // Function to setup Firebase sync
    const setupFirebaseSync = () => {
      const authMode = localStorage.getItem('authMode');
      const authState = localStorage.getItem('isAuthenticated') === 'true';
      
      if (authMode === 'firebase' && authState) {
        console.log('🔥 [App] Firebase mode detected - setting up auto-sync...');
        
        // Clean up old listener first
        if (unsubscribe) {
          console.log('🧹 [App] Cleaning up old listener');
          unsubscribe();
          unsubscribe = null;
        }
        
        // Small delay to ensure Firebase auth is ready
        setTimeout(() => {
          loadFirebaseData();
          unsubscribe = setupFirebaseListener();
        }, 500);
      }
    };

    // Setup on mount
    setupFirebaseSync();

    // Lắng nghe thay đổi authentication từ localStorage
    const checkAuth = () => {
      const newAuthState = localStorage.getItem('isAuthenticated') === 'true';
      const newAuthMode = localStorage.getItem('authMode');
      
      setIsAuthenticated(newAuthState);
      
      if (newAuthState && newAuthMode === 'firebase') {
        console.log('🔥 [App] Auth changed - reloading Firebase data...');
        setupFirebaseSync();
      } else if (!newAuthState && unsubscribe) {
        // Clean up listener on logout
        console.log('🧹 [App] Logging out - cleaning up listener');
        unsubscribe();
        unsubscribe = null;
      }
    };

    // Listen to storage events (from other tabs or login)
    window.addEventListener('storage', checkAuth);
    
    // Also listen to custom login event
    const handleLogin = () => {
      console.log('🔔 [App] Login event received');
      checkAuth();
    };
    window.addEventListener('firebase-login', handleLogin);
    
    // Polling check (backup mechanism) - check every 2 seconds
    const pollInterval = setInterval(() => {
      const authMode = localStorage.getItem('authMode');
      const authState = localStorage.getItem('isAuthenticated') === 'true';
      
      if (authMode === 'firebase' && authState && !unsubscribe) {
        console.log('🔄 [App] Polling detected Firebase auth - setting up listener');
        setupFirebaseSync();
      }
    }, 2000);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('firebase-login', handleLogin);
      clearInterval(pollInterval);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAuthenticated]);

  const loadFirebaseData = async () => {
    try {
      console.log('📥 [App] Loading Firebase data...');
      setSyncing(true);
      setSyncStatus('');
      const result = await getAllTransactionsFromFirebase();
      
      if (result.success && result.transactions) {
        console.log('📦 [App] Received', result.transactions.length, 'transactions from Firebase');
        // Merge with local data
        const localData = JSON.parse(localStorage.getItem('quanlythuchi_transactions') || '[]');
        const firebaseData = result.transactions;
        
        console.log('📊 [App] Local data:', localData.length, '| Firebase data:', firebaseData.length);
        
        // Create a map to avoid duplicates
        const dataMap = new Map();
        [...localData, ...firebaseData].forEach(t => {
          dataMap.set(t.id, t);
        });
        
        const mergedData = Array.from(dataMap.values());
        localStorage.setItem('quanlythuchi_transactions', JSON.stringify(mergedData));
        
        console.log('✅ [App] Synced! Total transactions:', mergedData.length);
        setSyncStatus(`✅ Đã tải ${mergedData.length} giao dịch`);
        setTimeout(() => setSyncStatus(''), 3000);
      } else {
        console.warn('⚠️ [App] Firebase load failed:', result.error);
        setSyncStatus('⚠️ Không thể tải dữ liệu');
        setTimeout(() => setSyncStatus(''), 3000);
      }
    } catch (error) {
      console.error('❌ [App] Firebase load error:', error);
      setSyncStatus('❌ Lỗi đồng bộ');
      setTimeout(() => setSyncStatus(''), 3000);
    } finally {
      setSyncing(false);
    }
  };

  const setupFirebaseListener = () => {
    // Listen to realtime changes
    const unsubscribe = listenToTransactions((transactions) => {
      console.log('🔄 [App] Firebase realtime update received:', transactions.length, 'transactions');
      
      const localData = JSON.parse(localStorage.getItem('quanlythuchi_transactions') || '[]');
      
      // Firebase is the source of truth - use Firebase data as base
      // Only keep local transactions that don't exist in Firebase (pending sync)
      const firebaseIds = new Set(transactions.map(t => String(t.id)));
      const pendingLocal = localData.filter(t => !firebaseIds.has(String(t.id)));
      
      // Merge: Firebase data (source of truth) + pending local data
      const mergedData = [...transactions, ...pendingLocal];
      
      console.log('📊 [App] Merge: Firebase:', transactions.length, '| Pending local:', pendingLocal.length, '| Total:', mergedData.length);
      
      // Check if data actually changed (avoid infinite loops)
      const currentDataStr = JSON.stringify(
        localData.sort((a,b) => String(a.id).localeCompare(String(b.id)))
      );
      const newDataStr = JSON.stringify(
        mergedData.sort((a,b) => String(a.id).localeCompare(String(b.id)))
      );
      
      if (currentDataStr !== newDataStr) {
        console.log('✅ [App] Data changed! Updating localStorage...');
        localStorage.setItem('quanlythuchi_transactions', JSON.stringify(mergedData));
        
        // Dispatch custom event to notify all components
        window.dispatchEvent(new CustomEvent('firebase-sync', { 
          detail: { transactions: mergedData } 
        }));
        
        // Also trigger storage event
        window.dispatchEvent(new Event('storage'));
      } else {
        console.log('ℹ️ [App] No data change detected');
      }
    });

    return unsubscribe;
  };

  return (
    <Router>
      <div className="App">
        {/* Sync indicator */}
        {syncing && (
          <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span className="text-sm font-semibold">Đang đồng bộ...</span>
          </div>
        )}
        
        {/* Sync status message */}
        {syncStatus && (
          <div className="fixed top-16 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
            {syncStatus}
          </div>
        )}
        
        <Routes>
          {/* Route đăng nhập */}
          <Route path="/login" element={<LoginScreen />} />
          
          {/* Routes được bảo vệ */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-income" 
            element={
              <ProtectedRoute>
                <AddIncomeScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-expense" 
            element={
              <ProtectedRoute>
                <AddExpenseScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report" 
            element={
              <ProtectedRoute>
                <ReportScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <HistoryScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsScreen />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        {/* Chỉ hiển thị Navigation khi đã đăng nhập */}
        {isAuthenticated && <Navigation />}
      </div>
    </Router>
  );
}

export default App;
