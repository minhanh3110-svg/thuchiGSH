# 📝 Tóm tắt dự án

## Web App Quản Lý Thu Chi

Web application hoàn chỉnh để quản lý thu chi cá nhân/doanh nghiệp nhỏ.

### ✅ Đã hoàn thành

1. **Cấu trúc dự án**
   - React 18 + Vite
   - Tailwind CSS
   - React Router
   - LocalStorage database

2. **Các tính năng chính**
   - ✅ Thêm thu nhập (với người thu, nguồn tiền, ngày, ghi chú)
   - ✅ Thêm chi tiêu (với người chi, lý do chi, ngày, ghi chú)
   - ✅ Hiển thị danh sách giao dịch
   - ✅ Xóa giao dịch (có confirm)
   - ✅ Báo cáo theo tháng
   - ✅ Thống kê thu/chi/số dư
   - ✅ Phân tích chi tiêu theo danh mục
   - ✅ Chọn tháng để xem báo cáo
   - ✅ Responsive design (mobile/tablet/desktop)

3. **UI Components**
   - Navigation bar (bottom)
   - StatCard (hiển thị thống kê)
   - TransactionCard (hiển thị giao dịch)
   - Form screens (thu/chi)
   - Report screen với charts

### 🎨 Giao diện

- **Trang chủ**: Màu xanh dương
- **Thêm thu**: Màu xanh lá
- **Thêm chi**: Màu đỏ
- **Báo cáo**: Màu tím

### 📊 Dữ liệu

Lưu trữ trong LocalStorage với cấu trúc:

```json
{
  "id": 1234567890,
  "type": "income" | "expense",
  "person": "Tên người",
  "amount": 1000000,
  "category": "Danh mục", // cho expense
  "source": "Nguồn tiền",  // cho income
  "note": "Ghi chú",
  "date": "2026-01-10",
  "createdAt": "2026-01-10T10:00:00.000Z"
}
```

### 🚀 Cách chạy

```bash
cd webapp
npm install
npm run dev
```

### 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.3.6",
  "vite": "^5.0.8"
}
```

### 🌐 Deploy

Có thể deploy miễn phí lên:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### 🔮 Tính năng có thể thêm sau

- [ ] Export/Import dữ liệu (CSV, JSON)
- [ ] Biểu đồ (Chart.js hoặc Recharts)
- [ ] Dark mode
- [ ] Tìm kiếm giao dịch
- [ ] Lọc theo danh mục
- [ ] Backup tự động
- [ ] Multi-currency support
- [ ] Print báo cáo
- [ ] PWA (Progressive Web App)

### 📁 File structure

```
webapp/
├── src/
│   ├── components/       # Reusable components
│   ├── screens/          # Page components
│   ├── services/         # Business logic
│   ├── constants/        # Static data
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Root component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

**Dự án đã sẵn sàng để sử dụng! 🎉**
