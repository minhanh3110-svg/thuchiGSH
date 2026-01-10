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

  useEffect(() => {
    // Initialize storage on app load
    initStorage();

    // Load Firebase data if using Firebase auth
    const authMode = localStorage.getItem('authMode');
    if (authMode === 'firebase' && isAuthenticated) {
      loadFirebaseData();
      setupFirebaseListener();
    }

    // Lắng nghe thay đổi authentication
    const checkAuth = () => {
      const newAuthState = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(newAuthState);
      
      // Load data when login with Firebase
      const newAuthMode = localStorage.getItem('authMode');
      if (newAuthState && newAuthMode === 'firebase') {
        loadFirebaseData();
        setupFirebaseListener();
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [isAuthenticated]);

  const loadFirebaseData = async () => {
    try {
      setSyncing(true);
      const result = await getAllTransactionsFromFirebase();
      
      if (result.success && result.transactions) {
        // Merge with local data
        const localData = JSON.parse(localStorage.getItem('quanlythuchi_transactions') || '[]');
        const firebaseData = result.transactions;
        
        // Create a map to avoid duplicates
        const dataMap = new Map();
        [...localData, ...firebaseData].forEach(t => {
          dataMap.set(t.id, t);
        });
        
        const mergedData = Array.from(dataMap.values());
        localStorage.setItem('quanlythuchi_transactions', JSON.stringify(mergedData));
        
        console.log('✅ Synced from Firebase:', mergedData.length, 'transactions');
      }
    } catch (error) {
      console.error('Firebase load error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const setupFirebaseListener = () => {
    // Listen to realtime changes
    const unsubscribe = listenToTransactions((transactions) => {
      if (transactions && transactions.length > 0) {
        const localData = JSON.parse(localStorage.getItem('quanlythuchi_transactions') || '[]');
        
        // Merge Firebase data with local
        const dataMap = new Map();
        [...localData, ...transactions].forEach(t => {
          dataMap.set(t.id, t);
        });
        
        const mergedData = Array.from(dataMap.values());
        localStorage.setItem('quanlythuchi_transactions', JSON.stringify(mergedData));
        
        console.log('🔄 Realtime sync:', mergedData.length, 'transactions');
        
        // Trigger reload
        window.dispatchEvent(new Event('storage'));
      }
    });

    // Cleanup on unmount
    return unsubscribe;
  };

  return (
    <Router>
      <div className="App">
        {/* Sync indicator */}
        {syncing && (
          <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span className="text-sm font-semibold">Đang đồng bộ...</span>
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
