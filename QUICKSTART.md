# 🚀 HƯỚNG DẪN NHANH - Chạy Web App

## Bước 1: Mở Terminal/CMD

Mở Command Prompt hoặc PowerShell trên Windows

## Bước 2: Di chuyển vào thư mục webapp

```bash
cd D:\QUANLYTHUCHI\webapp
```

## Bước 3: Cài đặt packages (lần đầu tiên)

```bash
npm install
```

⏳ Đợi khoảng 1-2 phút để cài đặt xong

## Bước 4: Chạy ứng dụng

```bash
npm run dev
```

✅ App sẽ tự động mở tại: **http://localhost:3000**

## 🎯 Sử dụng

### Trang chủ 🏠
- Xem tổng thu, tổng chi, số dư tháng hiện tại
- Danh sách tất cả giao dịch
- Xóa giao dịch bằng nút 🗑️

### Thêm Thu 📈
- Nhập người thu
- Nhập số tiền
- Chọn nguồn tiền (Khách hàng, Bán hàng, etc.)
- Ghi chú (tùy chọn)

### Thêm Chi 📉
- Nhập người chi
- Nhập số tiền
- Chọn lý do chi (Nhân công, Nguyên vật liệu, etc.)
- Ghi chú (tùy chọn)

### Báo cáo 📊
- Chọn tháng muốn xem
- Xem thống kê thu chi
- Phân tích chi tiêu theo danh mục
- Biểu đồ % chi tiêu

## ⚠️ Lưu ý quan trọng

- Dữ liệu lưu trên **trình duyệt** (LocalStorage)
- **KHÔNG** xóa cache/dữ liệu trình duyệt nếu không muốn mất dữ liệu
- Mỗi trình duyệt có dữ liệu riêng (Chrome khác Edge)

## 🛑 Dừng ứng dụng

Trong terminal, nhấn: **Ctrl + C**

## 🔄 Chạy lại

```bash
npm run dev
```

## ❓ Gặp lỗi?

### Lỗi: "npm not found"
➡️ Cài Node.js từ: https://nodejs.org

### Lỗi: Port 3000 đang được sử dụng
➡️ Đóng ứng dụng khác đang chạy port 3000
➡️ Hoặc sửa port trong `vite.config.js`

### Lỗi khác
➡️ Xóa thư mục `node_modules` và file `package-lock.json`
➡️ Chạy lại `npm install`

## 📱 Truy cập từ điện thoại

1. Máy tính và điện thoại **cùng WiFi**
2. Xem IP máy tính: `ipconfig` (Windows)
3. Trên điện thoại mở: `http://[IP-của-máy]:3000`

Ví dụ: `http://192.168.1.100:3000`

---

**Chúc bạn sử dụng vui vẻ! 🎉**
