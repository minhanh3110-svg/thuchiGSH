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

    // Load Firebase data if using Firebase auth
    const authMode = localStorage.getItem('authMode');
    let unsubscribe = null;
    
    if (authMode === 'firebase' && isAuthenticated) {
      console.log('🔥 Firebase mode detected - setting up auto-sync...');
      loadFirebaseData();
      unsubscribe = setupFirebaseListener();
    }

    // Lắng nghe thay đổi authentication
    const checkAuth = () => {
      const newAuthState = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(newAuthState);
      
      // Load data when login with Firebase
      const newAuthMode = localStorage.getItem('authMode');
      if (newAuthState && newAuthMode === 'firebase') {
        console.log('🔥 Auth changed - reloading Firebase data...');
        loadFirebaseData();
        if (unsubscribe) unsubscribe(); // Clean up old listener
        unsubscribe = setupFirebaseListener();
      }
    };

    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      if (unsubscribe) unsubscribe(); // Clean up listener on unmount
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
      console.log('🔄 Firebase realtime update received:', transactions.length, 'transactions');
      
      const localData = JSON.parse(localStorage.getItem('quanlythuchi_transactions') || '[]');
      
      // Merge Firebase data with local (Firebase is source of truth for synced data)
      const dataMap = new Map();
      
      // Add local data first
      localData.forEach(t => {
        dataMap.set(t.id, t);
      });
      
      // Override with Firebase data
      transactions.forEach(t => {
        dataMap.set(t.id, t);
      });
      
      const mergedData = Array.from(dataMap.values());
      
      // Check if data actually changed (avoid infinite loops)
      const currentDataStr = JSON.stringify(
        localData.sort((a,b) => String(a.id).localeCompare(String(b.id)))
      );
      const newDataStr = JSON.stringify(
        mergedData.sort((a,b) => String(a.id).localeCompare(String(b.id)))
      );
      
      if (currentDataStr !== newDataStr) {
        console.log('✅ Data changed! Updating localStorage...');
        localStorage.setItem('quanlythuchi_transactions', JSON.stringify(mergedData));
        
        // Dispatch custom event to notify all components
        window.dispatchEvent(new CustomEvent('firebase-sync', { 
          detail: { transactions: mergedData } 
        }));
        
        // Also trigger storage event
        window.dispatchEvent(new Event('storage'));
      } else {
        console.log('ℹ️ No data change detected');
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
