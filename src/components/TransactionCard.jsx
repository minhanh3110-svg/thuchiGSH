import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionCard = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === 'income';

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className={`text-lg font-bold ${isIncome ? 'text-income' : 'text-expense'}`}>
            {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(transaction.date)}</p>
        </div>
        <button
          onClick={() => onDelete(transaction.id)}
          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Xóa giao dịch"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex items-center">
          <span className="text-gray-500 w-24 font-medium">
            {isIncome ? 'Người thu:' : 'Người chi:'}
          </span>
          <span className="text-gray-800 font-semibold">{transaction.person}</span>
        </div>

        {isIncome && transaction.source && (
          <div className="flex items-center">
            <span className="text-gray-500 w-24 font-medium">Nguồn tiền:</span>
            <span className="text-gray-800 font-semibold">{transaction.source}</span>
          </div>
        )}

        {!isIncome && transaction.category && (
          <div className="flex items-center">
            <span className="text-gray-500 w-24 font-medium">Lý do chi:</span>
            <span className="text-gray-800 font-semibold">{transaction.category}</span>
          </div>
        )}

        {transaction.note && (
          <div className="flex items-start">
            <span className="text-gray-500 w-24 font-medium">Ghi chú:</span>
            <span className="text-gray-700">{transaction.note}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
