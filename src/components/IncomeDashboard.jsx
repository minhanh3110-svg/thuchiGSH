import React from 'react';
import { formatCurrency } from '../utils/formatters';

const IncomeDashboard = ({ totalIncome, customerStats, sourceStats }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-5 mb-6 border-2 border-green-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📈</span>
        Dashboard Thu Nhập
      </h2>

      {totalIncome === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Chưa có dữ liệu thu nhập</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Total Income Card */}
          <div className="bg-white rounded-xl p-4 border-2 border-green-300 shadow-md">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Tổng Thu Nhập
            </div>
            <div className="text-3xl font-bold text-green-700">
              {formatCurrency(totalIncome)}
            </div>
          </div>

          {/* Income by Customer */}
          {customerStats && customerStats.length > 0 && (
            <div className="bg-white rounded-xl p-4 border-2 border-green-200">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>👥</span>
                Phân loại theo Khách hàng
              </h3>
              <div className="space-y-3">
                {customerStats.map((item, index) => {
                  const percentage = totalIncome > 0 
                    ? ((item.total / totalIncome) * 100).toFixed(1)
                    : 0;
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-gray-700">
                          {item.customer}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentage}% của tổng thu
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Income by Source */}
          {sourceStats && sourceStats.length > 0 && (
            <div className="bg-white rounded-xl p-4 border-2 border-green-200">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>💰</span>
                Phân loại theo Nguồn thu
              </h3>
              <div className="space-y-3">
                {sourceStats.map((item, index) => {
                  const percentage = totalIncome > 0 
                    ? ((item.total / totalIncome) * 100).toFixed(1)
                    : 0;
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-gray-700">
                          {item.source}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-green-400 to-teal-500 h-2.5 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentage}% của tổng thu
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

export default IncomeDashboard;
