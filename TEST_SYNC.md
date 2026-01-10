# 🧪 HƯỚNG DẪN TEST FIREBASE SYNC

## ✅ BƯỚC 1: XÁC ĐỊNH EMAIL

**Trên máy tính (Edge):**
1. Mở DevTools (F12)
2. Console tab
3. Gõ: `localStorage.getItem('firebaseUser')`
4. Xem email đang dùng

---

## ✅ BƯỚC 2: ĐĂNG NHẬP ĐÚNG EMAIL

**Trên iPhone (Chrome):**
1. Vào: https://thuchi-gsh.vercel.app
2. Chọn "☁️ Cloud Sync"
3. Nhập **ĐÚNG** email như máy tính
4. Nhập mật khẩu

---

## ✅ BƯỚC 3: KIỂM TRA AUTO-SYNC

### Test 1: Tải dữ liệu có sẵn
1. **iPhone:** Sau khi đăng nhập
2. Mở DevTools mobile (Chrome menu → More Tools → Inspect)
3. Xem Console có log: `🔥 Firebase mode detected - setting up auto-sync...`
4. Chờ 3-5 giây
5. Vào màn hình Home → Kiểm tra có data không

### Test 2: Realtime sync
1. **Máy tính:** Thêm 1 giao dịch mới
2. **iPhone:** 
   - KHÔNG CẦN NHẤN GÌ
   - Chờ 3-5 giây
   - Refresh trang (kéo xuống)
   - Data mới sẽ xuất hiện

---

## 🐛 NẾU KHÔNG THẤY DATA:

### Cách 1: Clear cache và thử lại
```
iPhone → Chrome Settings → Privacy → Clear Browsing Data
→ Chọn: Cached images and files
→ Clear
→ Đăng nhập lại
```

### Cách 2: Kiểm tra Console logs
```
Chrome Mobile → Menu (⋮) → More tools → Inspect
→ Console tab
→ Xem có lỗi gì không
```

### Cách 3: Test trên máy tính với trình duyệt khác
```
Máy tính → Mở Chrome (thay vì Edge)
→ Đăng nhập với CÙNG email
→ Xem có sync không
```

---

## 📊 FIREBASE DATA STRUCTURE

```
Firebase Firestore:
└── users/
    ├── userId1 (của email1@gmail.com)
    │   └── transactions/
    │       ├── transaction1
    │       └── transaction2
    │
    └── userId2 (của email2@gmail.com)
        └── transactions/
            ├── transaction3
            └── transaction4
```

**Chú ý:** Mỗi email = 1 userId riêng = Data riêng!

---

## ✅ KẾT QUẢ MONG ĐỢI:

- ✅ Đăng nhập → Tự động tải data
- ✅ Thêm giao dịch → Tự động lên Firebase
- ✅ Máy khác → Tự động nhận data
- ❌ KHÔNG cần nhấn "Đẩy lên" hoặc "Tải xuống"

---

## 🔧 NẾU VẪN PHẢI THỦ CÔNG:

Có nghĩa là **CODE MỚI CHƯA DEPLOY** hoặc **CACHE CŨ**.

Giải pháp:
1. Clear cache trình duyệt
2. Hard refresh: Ctrl + Shift + R (máy tính)
3. Hoặc đợi 5 phút để Vercel deploy xong
