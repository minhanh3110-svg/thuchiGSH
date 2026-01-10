import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomeScreen from './screens/HomeScreen';
import AddIncomeScreen from './screens/AddIncomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ReportScreen from './screens/ReportScreen';
import { initStorage } from './services/storage';

function App() {
  useEffect(() => {
    // Initialize storage on app load
    initStorage();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/add-income" element={<AddIncomeScreen />} />
          <Route path="/add-expense" element={<AddExpenseScreen />} />
          <Route path="/report" element={<ReportScreen />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
