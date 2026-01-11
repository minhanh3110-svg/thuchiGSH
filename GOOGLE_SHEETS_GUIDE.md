# 📊 Hướng dẫn sử dụng Google Sheets với App

## 🎯 Tại sao dùng Google Sheets?

- ✅ **Miễn phí** - Không giới hạn
- ✅ **Dễ xem** - Xem trực tiếp trên trình duyệt
- ✅ **Dễ chỉnh sửa** - Sửa trực tiếp trên Sheets
- ✅ **Chia sẻ dễ dàng** - Share với người khác
- ✅ **Backup tự động** - Google tự động backup

## 📥 Cách 1: Export Excel → Upload lên Google Sheets (Đơn giản)

### Bước 1: Xuất Excel từ App
1. Vào trang **"Báo cáo"** hoặc **"Nhật ký"**
2. Click nút **"Excel"** để xuất file
3. File sẽ được tải về máy

### Bước 2: Upload lên Google Sheets
1. Mở [Google Sheets](https://sheets.google.com)
2. Click **"Blank"** để tạo sheet mới
3. Vào **File → Import**
4. Chọn tab **"Upload"**
5. Kéo thả file Excel vừa tải về
6. Chọn **"Replace spreadsheet"** hoặc **"Insert new sheet(s)"**
7. Click **"Import data"**

### Bước 3: Xem và chỉnh sửa
- Dữ liệu sẽ hiển thị trên Google Sheets
- Có thể chỉnh sửa trực tiếp
- Có thể chia sẻ với người khác

## 🔄 Cách 2: Import từ Google Sheets vào App (Nếu cần)

### Bước 1: Xuất từ Google Sheets
1. Mở Google Sheets có dữ liệu
2. Vào **File → Download → Comma Separated Values (.csv)**
3. Hoặc **File → Download → Microsoft Excel (.xlsx)**

### Bước 2: Import vào App
1. Vào **"Cài đặt"** trong app
2. Click **"Chọn file để nhập"**
3. Chọn file CSV hoặc Excel vừa tải về
4. Chọn chế độ: **"Gộp"** hoặc **"Thay thế"**
5. Xong!

## 💡 Tips

### Tip 1: Tự động hóa với Google Apps Script
Nếu muốn sync tự động, có thể dùng Google Apps Script:
1. Vào Google Sheets
2. **Extensions → Apps Script**
3. Viết script để đọc/ghi dữ liệu
4. Tạo API endpoint
5. Tích hợp vào app (cần code thêm)

### Tip 2: Format dữ liệu
- **Cột 1:** Ngày (YYYY-MM-DD)
- **Cột 2:** Loại (Thu/Chi)
- **Cột 3:** Người
- **Cột 4:** Khách hàng (nếu là Thu)
- **Cột 5:** Danh mục
- **Cột 6:** Số tiền
- **Cột 7:** Ghi chú

### Tip 3: Chia sẻ với team
1. Click **"Share"** trên Google Sheets
2. Thêm email người cần chia sẻ
3. Chọn quyền: **Viewer**, **Commenter**, hoặc **Editor**
4. Gửi link

## ⚠️ Lưu ý

- **Không sync tự động** - Phải export/import thủ công
- **Format phải đúng** - Nếu import, phải đúng format như app xuất ra
- **Backup định kỳ** - Nên export định kỳ để backup

## 🚀 Nâng cấp: Tích hợp Google Sheets API (Tự động sync)

Nếu muốn sync tự động như Firebase, cần:
1. Tạo Google Cloud Project
2. Enable Google Sheets API
3. Setup OAuth 2.0
4. Tích hợp vào app

**Ưu điểm:**
- ✅ Sync tự động
- ✅ Real-time updates
- ✅ Không cần export/import thủ công

**Nhược điểm:**
- ❌ Cần setup phức tạp
- ❌ Cần Google Cloud account
- ❌ Có rate limits

---

**Hiện tại app đã hỗ trợ Export Excel → Bạn có thể upload lên Google Sheets ngay!** 🎉
