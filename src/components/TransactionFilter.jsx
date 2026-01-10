import React from 'react';
import { Calendar, Filter, Search } from 'lucide-react';

const TransactionFilter = ({ 
  filterType, 
  setFilterType, 
  selectedDate, 
  setSelectedDate, 
  selectedMonth, 
  setSelectedMonth,
  transactionType,
  setTransactionType,
  searchPerson,
  setSearchPerson
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  // Generate month options (last 12 months)
  const monthOptions = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, currentMonth - 1 - i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    monthOptions.push({
      value: `${year}-${String(month).padStart(2, '0')}`,
      label: `Tháng ${month}/${year}`
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={18} className="text-blue-600" />
        <h3 className="text-sm font-bold text-gray-800">Lọc giao dịch</h3>
      </div>

      <div className="space-y-3">
        {/* Row 1: Time Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Filter Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Thời gian
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white"
            >
              <option value="all">Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="date">Chọn ngày</option>
              <option value="month">Chọn tháng</option>
            </select>
          </div>

          {/* Date Picker (shown when filterType is 'date') */}
          {filterType === 'date' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Chọn ngày
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          )}

          {/* Month Picker (shown when filterType is 'month') */}
          {filterType === 'month' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Chọn tháng
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white"
              >
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Row 2: Transaction Type and Person Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Transaction Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Loại giao dịch
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none bg-white"
            >
              <option value="all">Tất cả (Thu + Chi)</option>
              <option value="income">📈 Chỉ Thu</option>
              <option value="expense">📉 Chỉ Chi</option>
            </select>
          </div>

          {/* Person Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              {transactionType === 'income' 
                ? 'Tên người thu' 
                : transactionType === 'expense'
                ? 'Tên người chi'
                : 'Tên người thu/chi'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchPerson}
                onChange={(e) => setSearchPerson(e.target.value)}
                placeholder={
                  transactionType === 'income' 
                    ? 'Tìm người thu...' 
                    : transactionType === 'expense'
                    ? 'Tìm người chi...'
                    : 'Tìm theo tên...'
                }
                className="w-full px-3 py-2 pl-9 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
              />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(transactionType !== 'all' || searchPerson) && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">Đang lọc:</span>
            {transactionType !== 'all' && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                {transactionType === 'income' ? '📈 Thu' : '📉 Chi'}
              </span>
            )}
            {searchPerson && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                👤 {searchPerson}
              </span>
            )}
            <button
              onClick={() => {
                setTransactionType('all');
                setSearchPerson('');
              }}
              className="text-xs text-red-600 hover:text-red-700 font-semibold ml-auto"
            >
              ✕ Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilter;
