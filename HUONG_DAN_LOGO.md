# 🎨 CÁCH THÊM LOGO

## Bước 1: Chuẩn bị file logo

1. Lưu logo Green Straw Hat thành file `logo.png`
2. Kích thước khuyến nghị: 200x200px hoặc 400x400px
3. Nền trong suốt (PNG) hoặc nền trắng

## Bước 2: Copy logo vào project

Copy file `logo.png` vào thư mục:

```
D:\QUANLYTHUCHI\webapp\public\
```

**Lưu ý:** Nếu chưa có thư mục `public`, tạo mới thư mục này.

## Bước 3: Đổi tên file (nếu cần)

Nếu logo có tên khác, đổi tên thành `logo.png` hoặc sửa trong file:
- `webapp/src/components/Logo.jsx` (dòng 16)

```jsx
src="/logo.png"  // Đổi thành tên file logo của bạn
```

## Bước 4: Chạy lại app

```bash
npm run dev
```

Logo sẽ xuất hiện ở:
- ✅ Header trang chủ (góc trái)
- ✅ Header form thêm thu (góc phải)
- ✅ Header form thêm chi (góc phải)
- ✅ Header báo cáo (góc trái)

---

## 📝 Nếu không có file logo

App vẫn chạy bình thường, chỉ không hiển thị logo.
Text "Green Straw Hat - Happiness Together" vẫn hiện.

---

## 🔄 Thay logo khác

1. Copy logo mới vào `public/logo.png`
2. Refresh trình duyệt (Ctrl + F5)

---

**Cấu trúc thư mục sau khi thêm logo:**

```
webapp/
├── public/
│   └── logo.png          ← Logo ở đây
├── src/
│   └── components/
│       └── Logo.jsx      ← Component logo
└── ...
```
