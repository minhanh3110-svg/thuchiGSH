import { useState, useEffect } from 'react';
import { Trash2, Calendar, User, DollarSign, Tag, Edit, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Logo from '../components/Logo';
import { getAllTransactions, deleteTransaction } from '../services/storage';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [sortOrder, setSortOrder] = useState('desc'); // desc = mới nhất, asc = cũ nhất
  const navigate = useNavigate();

  useEffect(() => {
    loadTransactions();
    
    // Listen for Firebase sync events
    const handleSync = () => {
      console.log('📜 HistoryScreen: Sync event received, reloading...');
      loadTransactions();
    };
    
    window.addEventListener('firebase-sync', handleSync);
    window.addEventListener('storage', handleSync);
    
    return () => {
      window.removeEventListener('firebase-sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
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

  const handleEdit = (transaction) => {
    // Chuyển đến trang edit với transaction data
    const editPath = transaction.type === 'income' ? '/add-income' : '/add-expense';
    navigate(editPath, { state: { editMode: true, transaction } });
  };

  const getTypeColor = (type) => {
    return type === 'income' 
      ? 'bg-green-100 text-green-700 border-green-300' 
      : 'bg-red-100 text-red-700 border-red-300';
  };

  const getTypeLabel = (type) => {
    return type === 'income' ? 'Thu' : 'Chi';
  };

  const handleExportExcel = () => {
    const filterLabel = filter === 'all' ? 'Tất cả' : (filter === 'income' ? 'Thu' : 'Chi');
    const sortLabel = sortOrder === 'desc' ? 'Mới nhất' : 'Cũ nhất';
    const fileName = `Nhat-Ky-${filterLabel}-${new Date().toISOString().split('T')[0]}.xlsx`;

    // Dữ liệu export
    const data = [
      ['NHẬT KÝ THU CHI'],
      ['Loại:', filterLabel],
      ['Sắp xếp:', sortLabel],
      ['Tổng số giao dịch:', transactions.length],
      ['Ngày xuất:', new Date().toLocaleString('vi-VN')],
      [],
      ['Ngày', 'Loại', 'Người', 'Khách hàng', 'Danh mục', 'Số tiền', 'Ghi chú']
    ];

    transactions.forEach(t => {
      data.push([
        formatDate(t.date),
        t.type === 'income' ? 'Thu' : 'Chi',
        t.person || '',
        t.customerName || '',
        t.category || '',
        t.amount,
        t.note || ''
      ]);
    });

    // Tạo workbook và worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Định dạng cột
    ws['!cols'] = [
      { wch: 12 }, // Ngày
      { wch: 8 },  // Loại
      { wch: 20 }, // Người
      { wch: 20 }, // Khách hàng
      { wch: 15 }, // Danh mục
      { wch: 15 }, // Số tiền
      { wch: 30 }  // Ghi chú
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Nhật ký');
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-screen-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold shadow-lg"
              title="Xuất Excel"
            >
              <FileSpreadsheet size={18} />
              <span>Excel</span>
            </button>
          </div>
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

                      {/* Tên khách hàng (chỉ hiển thị cho Thu) */}
                      {transaction.type === 'income' && transaction.customerName && (
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span className="text-green-600 font-medium">KH: {transaction.customerName}</span>
                        </div>
                      )}

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

                  {/* Nút sửa và xóa */}
                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa giao dịch"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa giao dịch"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
