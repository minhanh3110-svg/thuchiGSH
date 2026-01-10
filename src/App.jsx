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

// Component bảo vệ route
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    // Initialize storage on app load
    initStorage();

    // Lắng nghe thay đổi authentication
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Router>
      <div className="App">
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
