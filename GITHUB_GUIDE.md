# 🚀 HƯỚNG DẪN ĐẨY CODE LÊN GITHUB

## 📋 Chuẩn bị

### 1. **Cài đặt Git** (nếu chưa có)
Download và cài đặt Git từ: https://git-scm.com/download/win

Kiểm tra đã cài Git chưa:
```bash
git --version
```

### 2. **Tạo tài khoản GitHub** (nếu chưa có)
- Truy cập: https://github.com
- Sign up miễn phí

### 3. **Config Git lần đầu**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 🎯 BƯỚC 1: Tạo Repository trên GitHub

1. Đăng nhập GitHub: https://github.com
2. Click nút **"+"** góc trên bên phải → **"New repository"**
3. Điền thông tin:
   - **Repository name:** `quanlythuchi-webapp`
   - **Description:** "Web app quản lý thu chi"
   - **Public** hoặc **Private** (tùy chọn)
   - ⚠️ **KHÔNG** tick "Add a README file"
   - ⚠️ **KHÔNG** chọn .gitignore
   - ⚠️ **KHÔNG** chọn license
4. Click **"Create repository"**

→ Bạn sẽ thấy màn hình với câu lệnh git

---

## 💻 BƯỚC 2: Đẩy code từ máy lên GitHub

### **Mở PowerShell/Terminal:**

```bash
# Di chuyển vào thư mục webapp
cd D:\QUANLYTHUCHI\webapp

# Khởi tạo Git (nếu chưa có)
git init

# Thêm tất cả file vào Git
git add .

# Commit (lưu snapshot)
git commit -m "Initial commit - Quản lý Thu Chi App"

# Đổi tên branch thành main
git branch -M main

# Kết nối với GitHub (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/quanlythuchi-webapp.git

# Đẩy code lên GitHub
git push -u origin main
```

### **⚠️ Lưu ý:**
- Thay `YOUR_USERNAME` bằng username GitHub của bạn
- Ví dụ: `https://github.com/johndoe/quanlythuchi-webapp.git`

---

## 🔐 BƯỚC 3: Xác thực (Authentication)

Khi push lần đầu, GitHub sẽ yêu cầu đăng nhập:

### **Cách 1: Personal Access Token (Khuyến nghị)**

1. Vào GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. "Generate new token (classic)"
4. Chọn scopes:
   - ✅ `repo` (full control)
5. Generate token
6. **Copy token** (chỉ hiện 1 lần!)
7. Khi git yêu cầu password → **Paste token**

### **Cách 2: GitHub CLI** (Đơn giản hơn)

```bash
# Cài GitHub CLI
winget install --id GitHub.cli

# Login
gh auth login
# Chọn: GitHub.com → HTTPS → Login with browser
```

---

## ✅ BƯỚC 4: Kiểm tra

Sau khi push thành công:

1. Refresh trang GitHub repo
2. Thấy tất cả file đã lên
3. ✅ **DONE!**

---

## 🔄 Update code sau này

Khi sửa code và muốn push lại:

```bash
cd D:\QUANLYTHUCHI\webapp

# Xem file đã thay đổi
git status

# Thêm file đã thay đổi
git add .

# Commit với message mô tả
git commit -m "Thêm tính năng lọc theo người"

# Push lên GitHub
git push
```

---

## 📝 Commit Messages hay

```bash
git commit -m "Thêm dashboard báo cáo"
git commit -m "Fix lỗi mobile responsive"
git commit -m "Cải thiện UI form"
git commit -m "Thêm tính năng export dữ liệu"
```

---

## 🚨 Xử lý lỗi thường gặp

### **Lỗi 1: "fatal: remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/quanlythuchi-webapp.git
```

### **Lỗi 2: "Authentication failed"**
→ Dùng Personal Access Token thay vì password

### **Lỗi 3: "Permission denied"**
→ Kiểm tra username trong URL có đúng không

### **Lỗi 4: "Updates were rejected"**
```bash
git pull origin main --rebase
git push
```

---

## 📂 Cấu trúc sau khi push

```
GitHub Repo
├── .gitignore
├── README.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
├── vercel.json
├── netlify.toml
├── public/
├── src/
│   ├── components/
│   ├── screens/
│   ├── services/
│   ├── constants/
│   └── utils/
└── docs/ (nếu có)
```

---

## 🎯 Sau khi lên GitHub

### **Bạn có thể:**
1. ✅ Deploy lên Vercel (tự động)
2. ✅ Deploy lên Netlify (tự động)
3. ✅ Chia sẻ code với người khác
4. ✅ Làm việc nhóm
5. ✅ Backup code an toàn
6. ✅ Track changes/history

### **Tiếp theo:**
→ Deploy lên Vercel (xem file DEPLOY_ONLINE.md)

---

## 💡 Tips

### **Clone về máy khác:**
```bash
git clone https://github.com/YOUR_USERNAME/quanlythuchi-webapp.git
cd quanlythuchi-webapp
npm install
npm run dev
```

### **Xem lịch sử:**
```bash
git log --oneline
```

### **Rollback về commit trước:**
```bash
git reset --hard COMMIT_HASH
```

### **Tạo branch mới:**
```bash
git checkout -b feature/new-feature
```

---

## 📚 Resources

- **Git Docs:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com
- **Git Cheat Sheet:** https://training.github.com

---

## ✅ Checklist

- [ ] Cài Git
- [ ] Tạo GitHub account
- [ ] Config git (user.name, user.email)
- [ ] Tạo repo trên GitHub
- [ ] git init
- [ ] git add .
- [ ] git commit -m "message"
- [ ] git remote add origin
- [ ] git push -u origin main
- [ ] Kiểm tra trên GitHub
- [ ] ✅ Success!

---

**Làm theo từng bước trên là code sẽ lên GitHub! 🚀**
