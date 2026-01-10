// LocalStorage service for managing transactions
import { syncTransactionToFirebase, deleteTransactionFromFirebase } from './firebase';

const STORAGE_KEY = 'quanlythuchi_transactions';

// Initialize storage
export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all transactions
export const getAllTransactions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const transactions = JSON.parse(data) || [];
    // Sort by date DESC, then by id DESC
    return transactions.sort((a, b) => {
      if (b.date !== a.date) {
        return b.date.localeCompare(a.date);
      }
      return b.id - a.id;
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

// Add transaction (income or expense)
export const addTransaction = (transaction) => {
  try {
    const transactions = getAllTransactions();
    const newTransaction = {
      ...transaction,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    
    // Sync to Firebase if using Firebase auth
    const authMode = localStorage.getItem('authMode');
    if (authMode === 'firebase') {
      syncTransactionToFirebase(newTransaction).catch(err => 
        console.error('Firebase sync error:', err)
      );
    }
    
    return newTransaction;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Add income
export const addIncome = (data) => {
  return addTransaction({
    type: 'income',
    ...data,
  });
};

// Add expense
export const addExpense = (data) => {
  return addTransaction({
    type: 'expense',
    ...data,
  });
};

// Delete transaction
export const deleteTransaction = (id) => {
  try {
    let transactions = getAllTransactions();
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    
    // Sync delete to Firebase if using Firebase auth
    const authMode = localStorage.getItem('authMode');
    if (authMode === 'firebase') {
      deleteTransactionFromFirebase(id).catch(err => 
        console.error('Firebase delete error:', err)
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Update transaction
export const updateTransaction = (id, updatedData) => {
  try {
    let transactions = getAllTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    
    // Update transaction while keeping original id and createdAt
    transactions[index] = {
      ...transactions[index],
      ...updatedData,
      id: transactions[index].id, // Keep original id
      createdAt: transactions[index].createdAt, // Keep original createdAt
      updatedAt: new Date().toISOString(), // Add update timestamp
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    
    // Sync update to Firebase if using Firebase auth
    const authMode = localStorage.getItem('authMode');
    if (authMode === 'firebase') {
      syncTransactionToFirebase(transactions[index]).catch(err => 
        console.error('Firebase sync error:', err)
      );
    }
    
    return transactions[index];
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

// Get transaction by ID
export const getTransactionById = (id) => {
  try {
    const transactions = getAllTransactions();
    return transactions.find(t => t.id === parseInt(id));
  } catch (error) {
    console.error('Error getting transaction by ID:', error);
    return null;
  }
};

// Get transactions by month
export const getTransactionsByMonth = (year, month) => {
  try {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const transactions = getAllTransactions();
    return transactions.filter(t => t.date.startsWith(monthStr));
  } catch (error) {
    console.error('Error getting transactions by month:', error);
    return [];
  }
};

// Get monthly statistics
export const getMonthlyStats = (year, month) => {
  try {
    const transactions = getTransactionsByMonth(year, month);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  } catch (error) {
    console.error('Error getting monthly stats:', error);
    return {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    };
  }
};

// Get expense by category
export const getExpenseByCategory = (year, month) => {
  try {
    const transactions = getTransactionsByMonth(year, month);
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const categoryTotals = {};
    expenses.forEach(expense => {
      const category = expense.category || 'Khác';
      categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(expense.amount);
    });
    
    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    }));
  } catch (error) {
    console.error('Error getting expense by category:', error);
    return [];
  }
};

// Get all months with transactions
export const getAvailableMonths = () => {
  try {
    const transactions = getAllTransactions();
    const months = new Set();
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    
    return Array.from(months).sort().reverse();
  } catch (error) {
    console.error('Error getting available months:', error);
    return [];
  }
};

// Get transactions by date (specific day)
export const getTransactionsByDate = (dateString) => {
  try {
    const transactions = getAllTransactions();
    return transactions.filter(t => t.date === dateString);
  } catch (error) {
    console.error('Error getting transactions by date:', error);
    return [];
  }
};

// Get stats by date (specific day)
export const getStatsByDate = (dateString) => {
  try {
    const transactions = getTransactionsByDate(dateString);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  } catch (error) {
    console.error('Error getting stats by date:', error);
    return {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    };
  }
};

// Get today's transactions
export const getTodayTransactions = () => {
  const today = new Date().toISOString().split('T')[0];
  return getTransactionsByDate(today);
};

// Get today's stats
export const getTodayStats = () => {
  const today = new Date().toISOString().split('T')[0];
  return getStatsByDate(today);
};

// Get all time stats (tất cả thời gian)
export const getAllTimeStats = () => {
  try {
    const transactions = getAllTransactions();
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  } catch (error) {
    console.error('Error getting all time stats:', error);
    return {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    };
  }
};

// Get all time expense by category
export const getAllTimeExpenseByCategory = () => {
  try {
    const transactions = getAllTransactions();
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const categoryTotals = {};
    expenses.forEach(expense => {
      const category = expense.category || 'Khác';
      categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(expense.amount);
    });
    
    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    }));
  } catch (error) {
    console.error('Error getting all time expense by category:', error);
    return [];
  }
};
