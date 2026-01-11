import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, Database, AlertTriangle, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import Logo from '../components/Logo';
import { getAllTransactions } from '../services/storage';
import { getAllTransactionsFromFirebase, syncTransactionToFirebase } from '../services/firebase';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [importMode, setImportMode] = useState('merge'); // merge or replace
  const [syncing, setSyncing] = useState(false);

  // Sync from Firebase manually
  const handleSyncFromFirebase = async () => {
    const authMode = localStorage.getItem('authMode');
    
    if (authMode !== 'firebase') {
      alert('⚠️ Bạn cần đăng nhập bằng ☁️ Cloud Sync để dùng chức năng này!');
      return;
    }

    try {
      setSyncing(true);
      const result = await getAllTransactionsFromFirebase();
      
      if (result.success && result.transactions) {
        const localData = JSON.parse(localStorage.getItem('quanlythuchi_transactions') || '[]');
        const firebaseData = result.transactions;
        
        // Merge data
        const dataMap = new Map();
        [...localData, ...firebaseData].forEach(t => {
          dataMap.set(t.id, t);
        });
        
        const mergedData = Array.from(dataMap.values());
        localStorage.setItem('quanlythuchi_transactions', JSON.stringify(mergedData));
        
        alert(`✅ Đã tải ${firebaseData.length} giao dịch từ Cloud!\nTổng: ${mergedData.length} giao dịch`);
        window.location.reload();
      } else {
        alert('❌ Không có dữ liệu trên Cloud hoặc có lỗi: ' + (result.error || ''));
      }
    } catch (error) {
      alert('❌ Lỗi khi đồng bộ: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  // Sync to Firebase manually
  const handleSyncToFirebase = async () => {
    const authMode = localStorage.getItem('authMode');
    
    if (authMode !== 'firebase') {
      alert('⚠️ Bạn cần đăng nhập bằng ☁️ Cloud Sync để dùng chức năng này!');
      return;
    }

    try {
      setSyncing(true);
      const localTransactions = getAllTransactions();
      
      if (localTransactions.length === 0) {
        alert('⚠️ Không có dữ liệu để đồng bộ!');
        return;
      }

      let successCount = 0;
      for (const transaction of localTransactions) {
        const result = await syncTransactionToFirebase(transaction);
        if (result.success) successCount++;
      }
      
      alert(`✅ Đã đồng bộ ${successCount}/${localTransactions.length} giao dịch lên Cloud!`);
    } catch (error) {
      alert('❌ Lỗi khi đồng bộ: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

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

  // Parse Excel/CSV to transactions
  const parseExcelToTransactions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Tìm sheet có dữ liệu giao dịch (thường là sheet "Chi tiết" hoặc sheet đầu tiên)
          let sheetName = workbook.SheetNames.find(name => 
            name.toLowerCase().includes('chi tiết') || 
            name.toLowerCase().includes('nhật ký') ||
            name.toLowerCase().includes('detail')
          ) || workbook.SheetNames[0];
          
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Tìm dòng header (có chứa "Ngày", "Loại", "Số tiền"...)
          let headerRowIndex = -1;
          for (let i = 0; i < Math.min(20, jsonData.length); i++) {
            const row = jsonData[i];
            if (Array.isArray(row) && row.some(cell => {
              if (!cell) return false;
              const cellStr = String(cell).toLowerCase().trim();
              return cellStr.includes('ngày') || 
                     cellStr.includes('date') ||
                     cellStr.includes('loại') ||
                     cellStr.includes('type') ||
                     cellStr.includes('số tiền') ||
                     cellStr.includes('amount') ||
                     cellStr.includes('tiền');
            })) {
              headerRowIndex = i;
              break;
            }
          }
          
          if (headerRowIndex === -1) {
            throw new Error('Không tìm thấy header trong file Excel! Vui lòng đảm bảo file có cột "Ngày" hoặc "Số tiền".');
          }
          
          // Map headers safely, filter out undefined/null
          const headers = jsonData[headerRowIndex]
            .map(h => {
              if (h === null || h === undefined) return '';
              return String(h).toLowerCase().trim().replace(/\s+/g, ' '); // Normalize spaces
            })
            .filter(h => h !== '');
          
          if (headers.length === 0) {
            throw new Error('Header rỗng hoặc không hợp lệ!');
          }
          
          // Helper function to find header index with flexible matching
          const findHeaderIndex = (keywords) => {
            return headers.findIndex(h => {
              if (!h) return false;
              const normalizedH = h.replace(/\s+/g, ''); // Remove all spaces for comparison
              return keywords.some(keyword => {
                const normalizedKeyword = keyword.replace(/\s+/g, '');
                return normalizedH.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedH);
              });
            });
          };
          
          const transactions = [];
          
          // Map header indices - flexible matching (không phân biệt hoa/thường, bỏ qua khoảng trắng)
          const dateIndex = findHeaderIndex(['ngày', 'date', 'thời gian', 'datetime', 'ngay']);
          const typeIndex = findHeaderIndex(['loại', 'type', 'kind', 'loai']);
          const personIndex = findHeaderIndex(['người', 'person', 'nguoi', 'tên người', 'ten nguoi']);
          const customerIndex = findHeaderIndex(['khách', 'customer', 'khach', 'khách hàng', 'khach hang', 'client']);
          const categoryIndex = findHeaderIndex(['danh mục', 'category', 'danh muc', 'mục', 'muc']);
          const amountIndex = findHeaderIndex(['số tiền', 'amount', 'so tien', 'tiền', 'tien', 'số tiền (vnđ)', 'giá trị', 'gia tri', 'money', 'value']);
          const noteIndex = findHeaderIndex(['ghi chú', 'note', 'ghi chu', 'mô tả', 'mo ta', 'description', 'memo', 'comment']);
          
          // Debug: Log found headers
          console.log('📊 Headers found:', headers);
          console.log('📊 Indices:', { dateIndex, typeIndex, amountIndex, personIndex, customerIndex, categoryIndex, noteIndex });
          
          // Validate required fields - at least need amount OR date
          if (dateIndex === -1 && amountIndex === -1) {
            const headerList = headers.join(', ');
            throw new Error(`Không tìm thấy cột "Ngày" hoặc "Số tiền" trong file!\n\nCác cột tìm thấy: ${headerList}\n\nVui lòng đảm bảo file có ít nhất một trong các cột:\n- Ngày / Date\n- Số tiền / Amount / Tiền`);
          }
          
          // Parse rows
          for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || !Array.isArray(row) || row.length === 0) continue;
            
            // Skip empty rows
            if (row.every(cell => cell === null || cell === undefined || String(cell).trim() === '')) continue;
            
            // Parse date
            let date = new Date().toISOString().split('T')[0]; // default to today
            if (dateIndex >= 0 && row[dateIndex] !== undefined && row[dateIndex] !== null) {
              const dateValue = row[dateIndex];
              try {
                if (typeof dateValue === 'number') {
                  // Excel date serial number
                  const excelEpoch = new Date(1899, 11, 30);
                  const parsedDate = new Date(excelEpoch.getTime() + dateValue * 86400000);
                  if (!isNaN(parsedDate.getTime())) {
                    date = parsedDate.toISOString().split('T')[0];
                  }
                } else if (typeof dateValue === 'string' && dateValue.trim() !== '') {
                  // Try to parse string date
                  const parsed = new Date(dateValue);
                  if (!isNaN(parsed.getTime())) {
                    date = parsed.toISOString().split('T')[0];
                  }
                } else if (dateValue instanceof Date) {
                  date = dateValue.toISOString().split('T')[0];
                }
              } catch (e) {
                // Keep default date if parsing fails
                console.warn('Date parsing error:', e);
              }
            }
            
            // Parse type
            let type = 'expense'; // default
            if (typeIndex >= 0 && row[typeIndex] !== undefined && row[typeIndex] !== null) {
              const typeValue = String(row[typeIndex] || '').toLowerCase();
              if (typeValue.includes('thu') || typeValue.includes('income')) {
                type = 'income';
              }
            }
            
            // Parse amount
            let amount = 0;
            if (amountIndex >= 0 && row[amountIndex] !== undefined && row[amountIndex] !== null) {
              try {
                const amountValue = row[amountIndex];
                if (typeof amountValue === 'number') {
                  amount = Math.abs(amountValue);
                } else if (typeof amountValue === 'string' && amountValue.trim() !== '') {
                  // Remove commas, spaces, currency symbols
                  const cleaned = amountValue.replace(/[,\s₫$]/g, '');
                  const parsed = parseFloat(cleaned);
                  if (!isNaN(parsed)) {
                    amount = Math.abs(parsed);
                  }
                }
              } catch (e) {
                console.warn('Amount parsing error:', e);
              }
            }
            
            // Skip if no amount
            if (amount === 0 || isNaN(amount)) continue;
            
            const transaction = {
              id: `import_${Date.now()}_${i}`,
              type,
              date,
              amount,
              person: personIndex >= 0 && row[personIndex] !== undefined && row[personIndex] !== null 
                ? String(row[personIndex]).trim() : '',
              customerName: customerIndex >= 0 && row[customerIndex] !== undefined && row[customerIndex] !== null 
                ? String(row[customerIndex]).trim() : '',
              category: categoryIndex >= 0 && row[categoryIndex] !== undefined && row[categoryIndex] !== null 
                ? String(row[categoryIndex]).trim() : '',
              note: noteIndex >= 0 && row[noteIndex] !== undefined && row[noteIndex] !== null 
                ? String(row[noteIndex]).trim() : '',
            };
            
            transactions.push(transaction);
          }
          
          if (transactions.length === 0) {
            throw new Error('Không tìm thấy giao dịch nào trong file!');
          }
          
          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Lỗi đọc file!'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Import dữ liệu từ file
  const handleImportData = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let importedTransactions = [];
      
      // Check file type
      const fileName = file.name.toLowerCase();
      const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
      const isCSV = fileName.endsWith('.csv');
      const isJSON = fileName.endsWith('.json');
      
      if (isExcel || isCSV) {
        // Import from Excel/CSV
        importedTransactions = await parseExcelToTransactions(file);
      } else if (isJSON) {
        // Import from JSON
        const text = await file.text();
        const importedData = JSON.parse(text);
        
        // Validate data
        if (!importedData.data || !Array.isArray(importedData.data)) {
          throw new Error('File JSON không đúng định dạng! Cần có field "data" là array.');
        }
        
        importedTransactions = importedData.data;
      } else {
        throw new Error('File không được hỗ trợ! Chỉ chấp nhận .json, .xlsx, .xls, .csv');
      }

      if (importedTransactions.length === 0) {
        throw new Error('Không có dữ liệu để nhập!');
      }

      const currentTransactions = getAllTransactions();
      let newTransactions = [];

      if (importMode === 'replace') {
        // Thay thế toàn bộ
        newTransactions = importedTransactions;
        localStorage.setItem('quanlythuchi_transactions', JSON.stringify(newTransactions));
        alert(`✅ Đã thay thế toàn bộ!\nNhập: ${importedTransactions.length} giao dịch`);
      } else {
        // Merge (gộp, không trùng lặp)
        // Tạo map để tránh trùng lặp theo date + amount + type
        const existingMap = new Map();
        currentTransactions.forEach(t => {
          const key = `${t.date}_${t.amount}_${t.type}`;
          existingMap.set(key, true);
        });
        
        const newItems = importedTransactions.filter(t => {
          const key = `${t.date}_${t.amount}_${t.type}`;
          return !existingMap.has(key);
        });
        
        newTransactions = [...currentTransactions, ...newItems];
        localStorage.setItem('quanlythuchi_transactions', JSON.stringify(newTransactions));
        
        alert(`✅ Đã gộp dữ liệu!\nĐã có: ${currentTransactions.length}\nThêm mới: ${newItems.length}\nTổng: ${newTransactions.length}`);
      }

      // Dispatch events để các component khác reload
      console.log('📢 Dispatching storage and import events...');
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('data-imported', { detail: { count: newTransactions.length } }));
      
      // Small delay to ensure events are processed, then reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      alert('❌ Lỗi khi nhập dữ liệu: ' + error.message);
      console.error('Import error:', error);
    }
    
    // Reset file input
    event.target.value = '';
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

  const authMode = localStorage.getItem('authMode');
  const isFirebaseMode = authMode === 'firebase';

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
              ← Quay lại
            </button>
            <Logo size="sm" />
          </div>
          <h1 className="text-xl font-bold">⚙️ Cài đặt & Sao lưu</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Firebase Sync Section */}
        {isFirebaseMode && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw size={24} />
              <h3 className="font-bold text-lg">☁️ Đồng bộ Cloud</h3>
            </div>
            <p className="text-sm mb-4 text-blue-50">
              Bạn đang dùng chế độ Cloud Sync. Dữ liệu tự động đồng bộ, nhưng có thể sync thủ công nếu cần.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSyncFromFirebase}
                disabled={syncing}
                className="bg-white text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Tải xuống
              </button>
              <button
                onClick={handleSyncToFirebase}
                disabled={syncing}
                className="bg-white text-indigo-600 py-3 px-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Upload size={18} />
                Đẩy lên
              </button>
            </div>
            {syncing && (
              <div className="mt-3 text-center text-sm text-blue-100">
                <RefreshCw size={16} className="inline animate-spin mr-2" />
                Đang xử lý...
              </div>
            )}
          </div>
        )}

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
              <div className="space-y-2">
                <button
                  onClick={handleExportData}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  <Download size={18} className="inline mr-2" />
                  Xuất toàn bộ dữ liệu (JSON)
                </button>
                <a
                  href="https://sheets.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Database size={18} />
                  Mở Google Sheets
                </a>
                <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                  💡 <strong>Tip:</strong> Xuất Excel từ trang Báo cáo → Upload lên Google Sheets để xem và chỉnh sửa trực tiếp!
                </div>
              </div>
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
                Nhập file JSON, Excel (.xlsx, .xls) hoặc CSV đã xuất từ máy khác hoặc Google Sheets. Chọn chế độ gộp hoặc thay thế.
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
                Chọn file để nhập (JSON/Excel/CSV)
                <input
                  type="file"
                  accept=".json,.xlsx,.xls,.csv"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
              <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                💡 <strong>Hỗ trợ:</strong> JSON (từ app), Excel (.xlsx, .xls), CSV (từ Google Sheets)
              </div>
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
          <h4 className="font-semibold text-blue-900 mb-2">💡 Hướng dẫn:</h4>
          {isFirebaseMode ? (
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>☁️ Cloud Sync:</strong> Dữ liệu tự động đồng bộ giữa các máy</p>
              <p><strong>Nếu không thấy dữ liệu:</strong> Click "Tải xuống" để sync thủ công</p>
              <p><strong>Backup:</strong> Vẫn nên xuất dữ liệu định kỳ để an toàn</p>
            </div>
          ) : (
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li><strong>Máy A:</strong> Xuất dữ liệu → Lưu file JSON</li>
              <li><strong>Chuyển file:</strong> Email, USB, Google Drive...</li>
              <li><strong>Máy B:</strong> Nhập dữ liệu → Chọn file → Xong!</li>
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
