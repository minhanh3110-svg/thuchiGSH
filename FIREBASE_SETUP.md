# HƯỚNG DẪN THIẾT LẬP FIREBASE ☁️

## 🎯 Bước 1: Tạo Firebase Project

1. Truy cập: https://console.firebase.google.com/
2. Click **"Add project"** hoặc **"Thêm dự án"**
3. Đặt tên project: `quanlythuchi` (hoặc tên khác)
4. Bỏ chọn "Enable Google Analytics" (không cần)
5. Click **"Create project"**

## 🔧 Bước 2: Cấu hình Web App

1. Trong Firebase Console, click vào icon **</> (Web)**
2. Đặt tên app: `Quản lý Thu Chi`
3. Click **"Register app"**
4. Copy toàn bộ `firebaseConfig` object

## 📝 Bước 3: Cập nhật Config

Mở file: `webapp/src/services/firebase.js`

Thay thế đoạn này:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Bằng config từ Firebase (ví dụ):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "quanlythuchi-xxxxx.firebaseapp.com",
  projectId: "quanlythuchi-xxxxx",
  storageBucket: "quanlythuchi-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

## 🔐 Bước 4: Bật Authentication

1. Trong Firebase Console, vào **"Authentication"**
2. Click **"Get started"**
3. Tab **"Sign-in method"**
4. Enable **"Email/Password"**
5. Click **"Save"**

## 💾 Bước 5: Bật Firestore Database

1. Trong Firebase Console, vào **"Firestore Database"**
2. Click **"Create database"**
3. Chọn **"Start in production mode"** (hoặc test mode để dễ dàng hơn)
4. Chọn location: `asia-southeast1 (Singapore)` hoặc gần bạn
5. Click **"Enable"**

## 🔒 Bước 6: Cấu hình Security Rules (Quan trọng!)

Vào **"Rules"** tab trong Firestore, paste code này:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **"Publish"**

## ✅ Hoàn tất!

Bây giờ:
1. Lưu file `firebase.js` với config mới
2. Chạy lại app: `npm run dev`
3. Đăng ký tài khoản đầu tiên
4. Dữ liệu sẽ tự động sync lên Firebase!

## 🔄 Cách sử dụng:

- **Máy 1:** Đăng nhập → Nhập dữ liệu → Tự động sync ☁️
- **Máy 2:** Đăng nhập (cùng tài khoản) → Dữ liệu tự động hiện ✨
- **Máy 3:** Đăng nhập → Sync ngay lập tức 🚀

## ⚠️ Lưu ý:

- Mỗi người cần tài khoản riêng (email + password)
- Dữ liệu được mã hóa và bảo mật
- Chỉ chủ tài khoản mới thấy dữ liệu của mình
- Miễn phí đến 1GB dữ liệu và 50K reads/day

## 🆘 Nếu gặp lỗi:

1. Kiểm tra `firebaseConfig` đã đúng chưa
2. Kiểm tra Authentication đã enable chưa
3. Kiểm tra Firestore đã tạo chưa
4. Kiểm tra Security Rules đã đúng chưa
5. Xem console.log trong browser (F12)
