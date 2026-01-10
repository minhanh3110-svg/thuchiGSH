import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download, Database, AlertTriangle } from 'lucide-react';
import Logo from '../components/Logo';
import { getAllTransactions } from '../services/storage';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [importMode, setImportMode] = useState('merge'); // merge or replace

  // Export toàn bộ dữ liệu
  const handleExportData = () => {
    try {
      const transactions = getAllTransactions();
      
      const dataToExport = {
        appName: 'Quản lý Thu Chi - Green Straw Hat',
        exportDate: new Date().toISOString(),
        version: '1.0',
        totalTransactions: transactions.length,
        data: transactions
      };

      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QuanLyThuChi-Backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      alert(`✅ Đã xuất ${transactions.length} giao dịch thành công!`);
    } catch (error) {
      alert('❌ Lỗi khi xuất dữ liệu: ' + error.message);
    }
  };

  // Import dữ liệu từ file
  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result);
        
        // Validate data
        if (!importedData.data || !Array.isArray(importedData.data)) {
          throw new Error('File không đúng định dạng!');
        }

        const currentTransactions = getAllTransactions();
        let newTransactions = [];

        if (importMode === 'replace') {
          // Thay thế toàn bộ
          newTransactions = importedData.data;
          localStorage.setItem('quanlythuchi_transactions', JSON.stringify(newTransactions));
          alert(`✅ Đã thay thế toàn bộ!\nNhập: ${importedData.data.length} giao dịch`);
        } else {
          // Merge (gộp, không trùng lặp)
          const existingIds = new Set(currentTransactions.map(t => t.id));
          const newItems = importedData.data.filter(t => !existingIds.has(t.id));
          
          newTransactions = [...currentTransactions, ...newItems];
          localStorage.setItem('quanlythuchi_transactions', JSON.stringify(newTransactions));
          
          alert(`✅ Đã gộp dữ liệu!\nĐã có: ${currentTransactions.length}\nThêm mới: ${newItems.length}\nTổng: ${newTransactions.length}`);
        }

        // Reload page để cập nhật
        window.location.reload();
      } catch (error) {
        alert('❌ Lỗi khi nhập dữ liệu: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    const confirmed = confirm('⚠️ XÓA TOÀN BỘ DỮ LIỆU?\n\nHành động này không thể hoàn tác!\n\nĐề nghị XUẤT DỮ LIỆU trước khi xóa.');
    
    if (confirmed) {
      const doubleCheck = confirm('🔴 XÁC NHẬN LẦN CUỐI!\n\nBạn có CHẮC CHẮN muốn xóa tất cả?');
      
      if (doubleCheck) {
        localStorage.removeItem('quanlythuchi_transactions');
        alert('✅ Đã xóa toàn bộ dữ liệu!');
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-white hover:text-blue-100 transition-colors text-sm"
            >
              <ArrowLeft size={18} className="mr-1" />
              Quay lại
            </button>
            <Logo size="sm" />
          </div>
          <h1 className="text-xl font-bold">⚙️ Cài đặt & Sao lưu</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Export Data */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Xuất dữ liệu</h3>
              <p className="text-sm text-gray-600 mb-3">
                Sao lưu toàn bộ dữ liệu ra file JSON. Dùng để chuyển sang máy khác hoặc backup.
              </p>
              <button
                onClick={handleExportData}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                <Download size={18} className="inline mr-2" />
                Xuất toàn bộ dữ liệu
              </button>
            </div>
          </div>
        </div>

        {/* Import Data */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-green-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Upload size={24} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Nhập dữ liệu</h3>
              <p className="text-sm text-gray-600 mb-3">
                Nhập file JSON đã xuất từ máy khác. Chọn chế độ gộp hoặc thay thế.
              </p>

              {/* Import Mode */}
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chế độ nhập:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={(e) => setImportMode(e.target.value)}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-sm">
                      <strong>Gộp</strong> - Giữ dữ liệu cũ + thêm dữ liệu mới (khuyến nghị)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={(e) => setImportMode(e.target.value)}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-sm">
                      <strong>Thay thế</strong> - Xóa dữ liệu cũ, chỉ giữ dữ liệu mới
                    </span>
                  </label>
                </div>
              </div>

              <label className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center cursor-pointer">
                <Upload size={18} className="mr-2" />
                Chọn file để nhập
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Clear Data */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-red-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Xóa toàn bộ dữ liệu</h3>
              <p className="text-sm text-gray-600 mb-3">
                ⚠️ Nguy hiểm! Xóa vĩnh viễn tất cả giao dịch. Không thể hoàn tác.
              </p>
              <button
                onClick={handleClearData}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                <AlertTriangle size={18} className="inline mr-2" />
                Xóa toàn bộ dữ liệu
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Cách sử dụng:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li><strong>Máy A:</strong> Xuất dữ liệu → Lưu file JSON</li>
            <li><strong>Chuyển file:</strong> Email, USB, Google Drive...</li>
            <li><strong>Máy B:</strong> Nhập dữ liệu → Chọn file → Xong!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
