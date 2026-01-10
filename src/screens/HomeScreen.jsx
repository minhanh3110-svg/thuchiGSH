import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import StatCard from '../components/StatCard';
import TransactionCard from '../components/TransactionCard';
import TransactionFilter from '../components/TransactionFilter';
import Logo from '../components/Logo';
import { 
  getAllTransactions, 
  deleteTransaction, 
  getMonthlyStats,
  getTransactionsByDate,
  getTransactionsByMonth,
  getStatsByDate,
  getTodayTransactions,
  getTodayStats
} from '../services/storage';
import { getCurrentDate, parseMonthString } from '../utils/formatters';

const HomeScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [filterType, setFilterType] = useState('month'); // 'all', 'today', 'date', 'month'
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [transactionType, setTransactionType] = useState('all'); // 'all', 'income', 'expense'
  const [searchPerson, setSearchPerson] = useState(''); // Search by person name

  const loadData = () => {
    setLoading(true);
    try {
      let data = [];
      let statsData = { totalIncome: 0, totalExpense: 0, balance: 0 };

      switch (filterType) {
        case 'all':
          data = getAllTransactions();
          break;

        case 'today':
          data = getTodayTransactions();
          break;

        case 'date':
          data = getTransactionsByDate(selectedDate);
          break;

        case 'month':
          const { year, month } = parseMonthString(selectedMonth);
          data = getTransactionsByMonth(year, month);
          break;

        default:
          data = getAllTransactions();
      }

      // Apply transaction type filter
      if (transactionType !== 'all') {
        data = data.filter(t => t.type === transactionType);
      }

      // Apply person name search filter
      if (searchPerson.trim()) {
        const searchLower = searchPerson.toLowerCase().trim();
        data = data.filter(t => 
          t.person.toLowerCase().includes(searchLower)
        );
      }

      // Calculate stats from filtered data
      const totalIncome = data
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const totalExpense = data
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      statsData = {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
      };

      setTransactions(data);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterType, selectedDate, selectedMonth, transactionType, searchPerson]);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa giao dịch này?')) {
      try {
        deleteTransaction(id);
        loadData();
      } catch (error) {
        alert('Không thể xóa giao dịch');
      }
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 shadow-xl">
        <div className="max-w-screen-lg mx-auto">
          {/* Logo ở giữa */}
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          
          {/* Title và refresh button */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-1">Quản lý Thu Chi</h1>
              <div className="text-xs opacity-90">
                {filterType === 'all' && 'Tất cả giao dịch'}
                {filterType === 'today' && `Hôm nay - ${new Date().toLocaleDateString('vi-VN')}`}
                {filterType === 'date' && `Ngày ${new Date(selectedDate).toLocaleDateString('vi-VN')}`}
                {filterType === 'month' && (() => {
                  const { year, month } = parseMonthString(selectedMonth);
                  return `Tháng ${month}/${year}`;
                })()}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-blue-500 rounded-full transition-colors flex-shrink-0"
              disabled={loading}
              title="Làm mới"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-screen-lg mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Tổng Thu"
            amount={stats.totalIncome}
            type="income"
            icon="📈"
          />
          <StatCard
            title="Tổng Chi"
            amount={stats.totalExpense}
            type="expense"
            icon="📉"
          />
          <StatCard
            title="Số Dư"
            amount={stats.balance}
            type="balance"
            icon="💰"
          />
        </div>

        {/* Filter Component */}
        <TransactionFilter
          filterType={filterType}
          setFilterType={setFilterType}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          searchPerson={searchPerson}
          setSearchPerson={setSearchPerson}
        />

        {/* Transactions List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Giao dịch gần đây
            </h2>
            {transactions.length > 0 && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {transactions.length} giao dịch
              </span>
            )}
          </div>
          
          {transactions.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-16 text-center shadow-md">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-600 text-base font-semibold mb-2">Chưa có giao dịch nào</p>
              <p className="text-gray-400 text-sm">
                Thêm giao dịch thu hoặc chi để bắt đầu theo dõi tài chính
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
