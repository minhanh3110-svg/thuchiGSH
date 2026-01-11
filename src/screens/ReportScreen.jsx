import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import StatCard from '../components/StatCard';
import Dashboard from '../components/Dashboard';
import IncomeDashboard from '../components/IncomeDashboard';
import ExpenseDashboard from '../components/ExpenseDashboard';
import Logo from '../components/Logo';
import { 
  getTransactionsByMonth, 
  getMonthlyStats, 
  getExpenseByCategory,
  getAvailableMonths,
  getAllTransactions,
  getAllTimeStats,
  getAllTimeExpenseByCategory,
  getIncomeByCustomer,
  getIncomeBySource,
  getAllTimeIncomeByCustomer,
  getAllTimeIncomeBySource
} from '../services/storage';
import { formatCurrency, parseMonthString, formatDate } from '../utils/formatters';

const ReportScreen = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [reportType, setReportType] = useState('month'); // 'month' or 'all'
  const [selectedMonth, setSelectedMonth] = useState(`${currentYear}-${String(currentMonth).padStart(2, '0')}`);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [categoryStats, setCategoryStats] = useState([]);
  const [incomeByCustomer, setIncomeByCustomer] = useState([]);
  const [incomeBySource, setIncomeBySource] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    loadReport();
    loadAvailableMonths();
    
    // Listen for Firebase sync events
    const handleSync = () => {
      console.log('📊 ReportScreen: Sync event received, reloading...');
      loadReport();
      loadAvailableMonths();
    };
    
    window.addEventListener('firebase-sync', handleSync);
    window.addEventListener('storage', handleSync);
    
    return () => {
      window.removeEventListener('firebase-sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [selectedMonth, reportType]);

  const loadAvailableMonths = () => {
    const months = getAvailableMonths();
    
    // Add current month if not in list
    const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    if (!months.includes(currentMonthStr)) {
      months.unshift(currentMonthStr);
    }
    
    setAvailableMonths(months);
  };

  const loadReport = () => {
    if (reportType === 'all') {
      // Load all time data
      const allStats = getAllTimeStats();
      setStats(allStats);

      const allTransactions = getAllTransactions();
      setTransactions(allTransactions);

      const allCategoryStats = getAllTimeExpenseByCategory();
      setCategoryStats(allCategoryStats);

      const allIncomeByCustomer = getAllTimeIncomeByCustomer();
      setIncomeByCustomer(allIncomeByCustomer);

      const allIncomeBySource = getAllTimeIncomeBySource();
      setIncomeBySource(allIncomeBySource);
    } else {
      // Load monthly data
      const { year, month } = parseMonthString(selectedMonth);
      
      const monthStats = getMonthlyStats(year, month);
      setStats(monthStats);

      const monthTransactions = getTransactionsByMonth(year, month);
      setTransactions(monthTransactions);

      const catStats = getExpenseByCategory(year, month);
      setCategoryStats(catStats);

      const monthIncomeByCustomer = getIncomeByCustomer(year, month);
      setIncomeByCustomer(monthIncomeByCustomer);

      const monthIncomeBySource = getIncomeBySource(year, month);
      setIncomeBySource(monthIncomeBySource);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const formatMonthDisplay = (monthStr) => {
    const { year, month } = parseMonthString(monthStr);
    return `Tháng ${month}/${year}`;
  };

  // Export data as Excel
  const handleExportExcel = () => {
    const period = reportType === 'all' ? 'Tất cả thời gian' : formatMonthDisplay(selectedMonth);
    const fileName = `Bao-Cao-Thu-Chi-${reportType === 'all' ? 'Tat-Ca' : selectedMonth}.xlsx`;

    // Sheet 1: Tổng quan
    const summaryData = [
      ['BÁO CÁO THU CHI'],
      ['Thời gian:', period],
      ['Ngày xuất:', new Date().toLocaleString('vi-VN')],
      [],
      ['TỔNG QUAN'],
      ['Tổng Thu:', stats.totalIncome],
      ['Tổng Chi:', stats.totalExpense],
      ['Số dư:', stats.balance],
    ];

    // Sheet 2: Chi tiết giao dịch
    const transactionData = [
      ['CHI TIẾT GIAO DỊCH'],
      [],
      ['Ngày', 'Loại', 'Người', 'Khách hàng', 'Danh mục', 'Số tiền', 'Ghi chú']
    ];

    transactions.forEach(t => {
      transactionData.push([
        formatDate(t.date),
        t.type === 'income' ? 'Thu' : 'Chi',
        t.person || '',
        t.customerName || '',
        t.category || '',
        t.amount,
        t.note || ''
      ]);
    });

    // Sheet 3: Thống kê theo danh mục
    const categoryData = [
      ['THỐNG KÊ CHI THEO DANH MỤC'],
      [],
      ['Danh mục', 'Số tiền', 'Phần trăm']
    ];

    const totalExpense = stats.totalExpense || 1;
    categoryStats.forEach(cat => {
      const percentage = ((cat.amount / totalExpense) * 100).toFixed(1);
      categoryData.push([
        cat.category,
        cat.amount,
        percentage + '%'
      ]);
    });

    // Tạo workbook
    const wb = XLSX.utils.book_new();

    // Thêm sheet tổng quan
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    ws1['!cols'] = [{ wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan');

    // Thêm sheet chi tiết
    const ws2 = XLSX.utils.aoa_to_sheet(transactionData);
    ws2['!cols'] = [{ wch: 12 }, { wch: 8 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Chi tiết');

    // Thêm sheet thống kê
    const ws3 = XLSX.utils.aoa_to_sheet(categoryData);
    ws3['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Thống kê');

    // Download file
    XLSX.writeFile(wb, fileName);
  };

  // Export data as JSON (keep old function for backup)
  const handleExportJSON = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      reportType: reportType,
      period: reportType === 'all' ? 'Tất cả thời gian' : formatMonthDisplay(selectedMonth),
      stats: stats,
      transactions: transactions,
      categoryStats: categoryStats
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-${reportType === 'all' ? 'tat-ca' : selectedMonth}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-xl">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <Logo size="md" />
            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1 text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold shadow-lg"
                title="Xuất Excel - Có thể upload lên Google Sheets"
              >
                <FileSpreadsheet size={16} />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <a
                href="https://sheets.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold shadow-lg"
                title="Mở Google Sheets"
              >
                <FileSpreadsheet size={16} />
                <span className="hidden sm:inline">Sheets</span>
              </a>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1 text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold"
                title="Tải JSON"
              >
                <Download size={16} />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>
          </div>
          
          <h1 className="text-xl font-bold mb-3">📊 Báo Cáo Thu Chi</h1>
          
          {/* Report Type and Period Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Report Type */}
            <div className="relative">
              <select
                value={reportType}
                onChange={handleReportTypeChange}
                className="w-full px-3.5 py-2.5 bg-white text-gray-800 text-sm rounded-xl font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="month">Theo tháng</option>
                <option value="all">Tất cả thời gian</option>
              </select>
            </div>

            {/* Month Selector (only show when reportType is 'month') */}
            {reportType === 'month' && (
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="w-full px-3.5 py-2.5 bg-white text-gray-800 text-sm rounded-xl font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {formatMonthDisplay(month)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Info badge when viewing all time */}
            {reportType === 'all' && (
              <div className="flex items-center justify-center bg-white/20 rounded-xl px-3 py-2.5">
                <span className="text-sm font-semibold">📅 Từ trước đến nay</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6">
        {/* Stats Cards */}
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

        {/* Overall Dashboard */}
        <Dashboard stats={stats} />

        {/* Income Dashboard - Phân loại Thu */}
        <IncomeDashboard 
          totalIncome={stats.totalIncome}
          customerStats={incomeByCustomer}
          sourceStats={incomeBySource}
        />

        {/* Expense Dashboard - Phân loại Chi */}
        <ExpenseDashboard 
          totalExpense={stats.totalExpense}
          categoryStats={categoryStats}
        />

        {/* Transaction Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-purple-100">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Tổng quan giao dịch
          </h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Không có giao dịch trong tháng này</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
                <span className="text-xs font-medium text-gray-700">Số giao dịch thu:</span>
                <span className="font-bold text-green-600 text-sm">
                  {transactions.filter(t => t.type === 'income').length} giao dịch
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-200">
                <span className="text-xs font-medium text-gray-700">Số giao dịch chi:</span>
                <span className="font-bold text-red-600 text-sm">
                  {transactions.filter(t => t.type === 'expense').length} giao dịch
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-xs font-medium text-gray-700">Tổng giao dịch:</span>
                <span className="font-bold text-blue-600 text-sm">
                  {transactions.length} giao dịch
                </span>
              </div>

              {stats.balance >= 0 ? (
                <div className="mt-4 p-4 bg-green-100 border-2 border-green-300 rounded-xl">
                  <p className="text-green-800 font-semibold text-center text-sm">
                    ✅ Tháng này bạn có lãi {formatCurrency(stats.balance)}
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-xl">
                  <p className="text-red-800 font-semibold text-center text-sm">
                    ⚠️ Tháng này bạn chi nhiều hơn thu {formatCurrency(Math.abs(stats.balance))}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;
