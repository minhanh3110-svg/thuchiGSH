import React from 'react';
import { formatCurrency } from '../utils/formatters';

const StatCard = ({ title, amount, type, icon }) => {
  const bgColor = type === 'income' 
    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
    : type === 'expense'
    ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
  
  const textColor = type === 'income'
    ? 'text-green-700'
    : type === 'expense'
    ? 'text-red-700'
    : 'text-blue-700';

  return (
    <div className={`${bgColor} border-2 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">{title}</h3>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className={`text-xl font-bold ${textColor}`}>
        {formatCurrency(amount)}
      </p>
    </div>
  );
};

export default StatCard;
