import React from 'react';
import { formatCurrency } from '../utils/formatters';

const ExpenseDashboard = ({ totalExpense, categoryStats }) => {
  return (
    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl shadow-xl p-5 mb-6 border-2 border-red-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📉</span>
        Dashboard Chi Tiêu
      </h2>

      {totalExpense === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Chưa có dữ liệu chi tiêu</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Total Expense Card */}
          <div className="bg-white rounded-xl p-4 border-2 border-red-300 shadow-md">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Tổng Chi Tiêu
            </div>
            <div className="text-3xl font-bold text-red-700">
              {formatCurrency(totalExpense)}
            </div>
          </div>

          {/* Expense by Category */}
          {categoryStats && categoryStats.length > 0 && (
            <div className="bg-white rounded-xl p-4 border-2 border-red-200">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>📋</span>
                Phân loại theo Danh mục
              </h3>
              <div className="space-y-3">
                {categoryStats.map((item, index) => {
                  const percentage = totalExpense > 0 
                    ? ((item.total / totalExpense) * 100).toFixed(1)
                    : 0;
                  
                  // Map category to icon
                  const categoryIcons = {
                    'Nhân công': '👷',
                    'Chi lương': '👷',
                    'Nguyên vật liệu': '📦',
                    'Vận chuyển': '🚚',
                    'Điện nước': '⚡',
                    'Khác': '📝'
                  };
                  
                  const icon = categoryIcons[item.category] || '📝';
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <span>{icon}</span>
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                      <div className="w-full bg-red-100 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-red-500 to-rose-500 h-2.5 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentage}% của tổng chi
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseDashboard;
