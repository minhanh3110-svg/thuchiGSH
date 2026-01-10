# 🚀 HƯỚNG DẪN DEPLOY NHANH

## Bước 1: Build project

```bash
cd D:\QUANLYTHUCHI\webapp
npm run build
```

✅ Tạo thư mục `dist/`

---

## Bước 2A: Deploy Vercel (Khuyến nghị)

### **Với GitHub:**
1. Push code lên GitHub
2. Vào https://vercel.com
3. "Import Project"
4. Chọn repo
5. Deploy (1 click)

### **Không dùng GitHub:**
1. Cài Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd D:\QUANLYTHUCHI\webapp
vercel
```

3. Làm theo hướng dẫn
4. Done!

---

## Bước 2B: Deploy Netlify

### **Drag & Drop (Siêu đơn giản):**
1. Build xong (có thư mục `dist/`)
2. Vào https://app.netlify.com/drop
3. Kéo thả thư mục `dist/`
4. Done!

### **Với GitHub:**
1. Push code lên GitHub
2. Vào https://app.netlify.com
3. "Add new site" → "Import"
4. Chọn repo
5. Settings:
   - Build: `npm run build`
   - Publish: `dist`
6. Deploy

---

## Kết quả

✅ URL: `https://your-app.vercel.app`
✅ HTTPS tự động
✅ Truy cập từ mọi nơi
✅ Chia sẻ với người khác

---

## Update sau khi deploy

**Vercel/Netlify với GitHub:**
```bash
git add .
git commit -m "Update"
git push
# Tự động deploy
```

**Netlify Manual:**
```bash
npm run build
# Kéo thả dist/ mới
```

---

**Chi tiết:** Xem file `DEPLOY_ONLINE.md`
