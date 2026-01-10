# ⚡ PUSH LÊN GITHUB - 5 PHÚT

## Bước 1: Tạo repo trên GitHub

1. Vào https://github.com/new
2. Tên repo: `quanlythuchi-webapp`
3. Chọn Public hoặc Private
4. ⚠️ KHÔNG tick "Add README"
5. Create repository

---

## Bước 2: Chạy lệnh này

**Mở PowerShell/CMD:**

```bash
cd D:\QUANLYTHUCHI\webapp
```

**Copy paste từng dòng:**

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial commit"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/YOUR_USERNAME/quanlythuchi-webapp.git
```
⚠️ **Thay YOUR_USERNAME bằng username GitHub của bạn**

```bash
git push -u origin main
```

---

## Bước 3: Đăng nhập

Khi push, GitHub sẽ hỏi:
- **Username:** GitHub username của bạn
- **Password:** Dùng **Personal Access Token**

### Tạo Token:
1. GitHub → Settings → Developer settings
2. Personal access tokens → Generate new token
3. Chọn `repo`
4. Copy token
5. Paste khi Git hỏi password

---

## ✅ Done!

Refresh trang GitHub → Thấy code đã lên!

---

## Update sau này:

```bash
cd D:\QUANLYTHUCHI\webapp
git add .
git commit -m "Update features"
git push
```

---

**Chi tiết đầy đủ:** Xem `GITHUB_GUIDE.md`
