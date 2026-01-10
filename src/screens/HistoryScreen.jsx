import { useState, useEffect } from 'react';
import { Trash2, Calendar, User, DollarSign, Tag } from 'lucide-react';
import Logo from '../components/Logo';
import { getAllTransactions, deleteTransaction } from '../services/storage';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [sortOrder, setSortOrder] = useState('desc'); // desc = mới nhất, asc = cũ nhất

  useEffect(() => {
    loadTransactions();
  }, [filter, sortOrder]);

  const loadTransactions = () => {
    let allTransactions = getAllTransactions();
    
    // Lọc theo loại
    if (filter === 'income') {
      allTransactions = allTransactions.filter(t => t.type === 'income');
    } else if (filter === 'expense') {
      allTransactions = allTransactions.filter(t => t.type === 'expense');
    }

    // Sắp xếp theo thời gian
    allTransactions.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setTransactions(allTransactions);
  };

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc muốn xóa giao dịch này?')) {
      deleteTransaction(id);
      loadTransactions();
    }
  };

  const getTypeColor = (type) => {
    return type === 'income' 
      ? 'bg-green-100 text-green-700 border-green-300' 
      : 'bg-red-100 text-red-700 border-red-300';
  };

  const getTypeLabel = (type) => {
    return type === 'income' ? 'Thu' : 'Chi';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-screen-lg mx-auto px-4 py-4">
          <Logo />
          <h2 className="text-2xl font-bold text-center text-gray-800 mt-2">
            📋 Nhật ký Thu Chi
          </h2>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6">
        {/* Bộ lọc */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Lọc theo loại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại giao dịch
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Tất cả</option>
                <option value="income">Thu</option>
                <option value="expense">Chi</option>
              </select>
            </div>

            {/* Sắp xếp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="desc">Mới nhất</option>
                <option value="asc">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* Thống kê */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Tổng số giao dịch: <span className="font-bold text-purple-600">{transactions.length}</span>
            </p>
          </div>
        </div>

        {/* Danh sách giao dịch */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* Thông tin chính */}
                  <div className="flex-1">
                    {/* Loại và số tiền */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(transaction.type)}`}>
                        {getTypeLabel(transaction.type)}
                      </span>
                      <span className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>

                    {/* Chi tiết */}
                    <div className="space-y-1 text-sm text-gray-600">
                      {/* Ngày */}
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{formatDate(transaction.date)}</span>
                      </div>

                      {/* Người thu/chi */}
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <span>{transaction.person}</span>
                      </div>

                      {/* Danh mục */}
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-gray-400" />
                        <span>{transaction.category}</span>
                      </div>

                      {/* Ghi chú (nếu có) */}
                      {transaction.note && (
                        <div className="flex items-start gap-2 mt-2">
                          <DollarSign size={14} className="text-gray-400 mt-0.5" />
                          <span className="italic text-gray-500">{transaction.note}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nút xóa */}
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa giao dịch"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
