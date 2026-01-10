# 🌐 DEPLOY LÊN ONLINE

## 🚀 Cách 1: Vercel (Khuyến nghị) ⭐

### **Ưu điểm:**
- ✅ **Miễn phí** 100%
- ✅ Tự động deploy khi push code
- ✅ HTTPS miễn phí
- ✅ Custom domain miễn phí
- ✅ Cực kỳ nhanh

### **Bước 1: Chuẩn bị**

Đảm bảo có file này trong `webapp/`:
- ✅ `package.json`
- ✅ `vite.config.js`
- ✅ `index.html`

### **Bước 2: Push code lên GitHub**

```bash
# Nếu chưa có Git repo
cd D:\QUANLYTHUCHI\webapp
git init
git add .
git commit -m "Initial commit"

# Tạo repo trên GitHub
# https://github.com/new
# Đặt tên: quanlythuchi-webapp

# Push lên GitHub
git remote add origin https://github.com/YOUR_USERNAME/quanlythuchi-webapp.git
git branch -M main
git push -u origin main
```

### **Bước 3: Deploy trên Vercel**

1. Truy cập: **https://vercel.com**
2. Click "Sign Up" → Chọn "Continue with GitHub"
3. Cho phép Vercel truy cập GitHub
4. Click "Import Project"
5. Chọn repo `quanlythuchi-webapp`
6. Vercel tự động detect Vite
7. Click "Deploy"
8. Đợi 1-2 phút ⏳
9. **DONE!** 🎉

### **Kết quả:**
```
✅ URL: https://quanlythuchi-webapp.vercel.app
✅ Tự động HTTPS
✅ Tự động deploy khi push code mới
```

---

## 🌟 Cách 2: Netlify

### **Ưu điểm:**
- ✅ **Miễn phí** 100%
- ✅ Dễ dùng, drag & drop
- ✅ HTTPS miễn phí
- ✅ Custom domain

### **Bước 1: Build project**

```bash
cd D:\QUANLYTHUCHI\webapp
npm run build
```

→ Tạo thư mục `dist/` chứa file production

### **Bước 2: Deploy lên Netlify**

**Cách A: Drag & Drop (Đơn giản nhất)**
1. Truy cập: **https://app.netlify.com/drop**
2. Kéo thả thư mục `dist/` vào
3. Đợi upload
4. **DONE!** 🎉

**Cách B: Connect GitHub (Tự động)**
1. Truy cập: **https://app.netlify.com**
2. Click "Add new site" → "Import existing project"
3. Chọn GitHub
4. Chọn repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"
7. **DONE!** 🎉

### **Kết quả:**
```
✅ URL: https://quanlythuchi-abc123.netlify.app
✅ Tự động HTTPS
✅ Custom domain free
```

---

## 📝 File cấu hình (Tùy chọn)

### **vercel.json** (nếu cần custom)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### **netlify.toml** (nếu cần custom)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🔧 Troubleshooting

### **Lỗi: "Command not found: vite"**
```bash
npm install
npm run build
```

### **Lỗi: Page not found khi refresh**
→ Đã fix bằng redirects trong config

### **Lỗi: LocalStorage không hoạt động**
→ LocalStorage hoạt động bình thường trên cả Vercel & Netlify

---

## 🌐 Custom Domain (Tùy chọn)

### **Nếu có domain riêng:**

**Vercel:**
1. Vào project settings
2. Domains → Add domain
3. Nhập domain (vd: quanlythuchi.com)
4. Cấu hình DNS theo hướng dẫn

**Netlify:**
1. Site settings → Domain management
2. Add custom domain
3. Cấu hình DNS

---

## 📱 PWA - Cài đặt như App

Sau khi deploy, người dùng có thể:

**iOS:**
Safari → Share → Add to Home Screen

**Android:**
Chrome → Menu → Add to Home screen

→ App sẽ mở như native app!

---

## 🚀 Cập nhật app sau khi deploy

### **Vercel (Tự động):**
```bash
# Chỉ cần push code mới
git add .
git commit -m "Update features"
git push
# Vercel tự động build & deploy
```

### **Netlify với GitHub (Tự động):**
```bash
# Giống Vercel
git add .
git commit -m "Update"
git push
# Netlify tự động deploy
```

### **Netlify Manual:**
```bash
npm run build
# Drag & drop thư mục dist/ mới vào Netlify
```

---

## 💰 Chi phí

| Platform | Free Tier | Băng thông | Build time |
|----------|-----------|------------|------------|
| Vercel | ✅ Unlimited | 100GB/tháng | 6000 phút |
| Netlify | ✅ Unlimited | 100GB/tháng | 300 phút |

**Kết luận:** Cả 2 đều FREE hoàn toàn cho app này!

---

## 🎯 So sánh

| Tính năng | Vercel | Netlify |
|-----------|--------|---------|
| Dễ dùng | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Tốc độ | Cực nhanh | Nhanh |
| Tự động deploy | ✅ | ✅ |
| HTTPS | ✅ | ✅ |
| Custom domain | ✅ | ✅ |
| Drag & drop | ❌ | ✅ |
| Git integration | ✅ | ✅ |

**Khuyến nghị:** 
- Vercel - Nếu dùng GitHub thường xuyên
- Netlify - Nếu muốn drag & drop nhanh

---

## 📋 Checklist Deploy

- [ ] Code hoạt động tốt local
- [ ] `npm run build` thành công
- [ ] Thư mục `dist/` được tạo
- [ ] Push code lên GitHub (Vercel)
- [ ] Deploy trên Vercel/Netlify
- [ ] Test app online
- [ ] Chia sẻ link với team
- [ ] (Optional) Setup custom domain

---

## 🎉 Sau khi Deploy

**Bạn sẽ có:**
- ✅ URL online: `https://your-app.vercel.app`
- ✅ HTTPS tự động
- ✅ Truy cập từ mọi nơi
- ✅ Chia sẻ với người khác
- ✅ Tự động backup code trên GitHub

**Người khác có thể:**
- Truy cập qua link
- Cài đặt như app (PWA)
- Sử dụng trên điện thoại
- Bookmark để dùng nhanh

---

## 🔐 Lưu ý bảo mật

⚠️ **LocalStorage công khai:**
- Dữ liệu lưu trên máy người dùng
- Mỗi người có dữ liệu riêng
- Không chia sẻ giữa các máy

**Nếu muốn sync data giữa các thiết bị:**
→ Cần backend (Firebase, Supabase) - Hướng dẫn riêng

---

## 📞 Cần giúp?

**Vercel Docs:** https://vercel.com/docs
**Netlify Docs:** https://docs.netlify.com

---

**Chúc bạn deploy thành công! 🚀🌐✨**
