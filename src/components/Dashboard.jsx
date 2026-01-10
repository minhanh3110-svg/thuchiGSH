import React from 'react';
import { formatCurrency } from '../utils/formatters';

const Dashboard = ({ stats }) => {
  const { totalIncome, totalExpense, balance } = stats;
  const total = totalIncome + totalExpense;
  
  const incomePercentage = total > 0 ? ((totalIncome / total) * 100).toFixed(1) : 0;
  const expensePercentage = total > 0 ? ((totalExpense / total) * 100).toFixed(1) : 0;

  // Calculate donut chart
  const incomeAngle = total > 0 ? (totalIncome / total) * 360 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 border-2 border-purple-100">
      <h2 className="text-base font-bold text-gray-800 mb-4">
        📊 Dashboard Thu Chi
      </h2>

      {total === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Chưa có dữ liệu để hiển thị</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Donut Chart */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Chart */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <div 
                className="w-full h-full rounded-full relative"
                style={{
                  background: `conic-gradient(
                    from 0deg,
                    #10b981 0deg ${incomeAngle}deg,
                    #ef4444 ${incomeAngle}deg 360deg
                  )`
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatCurrency(total)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Tổng</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend & Details */}
            <div className="flex-1 space-y-4 w-full">
              {/* Income */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-bold text-gray-700">Thu Nhập</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {incomePercentage}%
                  </span>
                </div>
                <div className="text-xl font-bold text-green-700">
                  {formatCurrency(totalIncome)}
                </div>
                <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${incomePercentage}%` }}
                  />
                </div>
              </div>

              {/* Expense */}
              <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border-2 border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-bold text-gray-700">Chi Tiêu</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {expensePercentage}%
                  </span>
                </div>
                <div className="text-xl font-bold text-red-700">
                  {formatCurrency(totalExpense)}
                </div>
                <div className="mt-2 w-full bg-red-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-rose-500 h-2 rounded-full transition-all"
                    style={{ width: `${expensePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Balance Summary */}
          <div className={`p-4 rounded-xl border-2 ${
            balance >= 0 
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' 
              : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  {balance >= 0 ? 'Thặng Dư' : 'Thâm Hụt'}
                </div>
                <div className={`text-2xl font-bold ${
                  balance >= 0 ? 'text-blue-700' : 'text-orange-700'
                }`}>
                  {formatCurrency(Math.abs(balance))}
                </div>
              </div>
              <div className="text-4xl">
                {balance >= 0 ? '✅' : '⚠️'}
              </div>
            </div>
            {balance >= 0 ? (
              <div className="mt-2 text-xs text-gray-600">
                Chúc mừng! Bạn đang tiết kiệm được tiền 💰
              </div>
            ) : (
              <div className="mt-2 text-xs text-gray-600">
                Cân nhắc giảm chi tiêu để cân bằng thu chi 💡
              </div>
            )}
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Tỷ lệ tiết kiệm</div>
              <div className="text-lg font-bold text-gray-800">
                {total > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Chi/Thu</div>
              <div className="text-lg font-bold text-gray-800">
                {totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
