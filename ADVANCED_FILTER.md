# 🔍 BỘ LỌC NÂNG CAO

## ✨ Tính năng mới đã thêm:

### 1. **Lọc riêng theo loại giao dịch**
- ✅ **Tất cả** - Hiển thị cả thu và chi
- ✅ **📈 Chỉ Thu** - Chỉ hiển thị giao dịch thu
- ✅ **📉 Chỉ Chi** - Chỉ hiển thị giao dịch chi

### 2. **Tìm kiếm theo tên người**
- ✅ Tìm theo tên người thu
- ✅ Tìm theo tên người chi
- ✅ Tìm kiếm real-time (gõ là lọc luôn)

---

## 🎨 Giao diện mới:

```
┌──────────────────────────────────────────────────┐
│ 🔍 Lọc giao dịch                                 │
├──────────────────────────────────────────────────┤
│ Row 1: Lọc theo thời gian                        │
│ ┌─────────┬─────────────┬─────────────┐         │
│ │ Thời gian│ [Tùy chọn] │             │         │
│ │ [Tháng▼]│ [T1/2026▼] │             │         │
│ └─────────┴─────────────┴─────────────┘         │
├──────────────────────────────────────────────────┤
│ Row 2: Lọc theo loại và tên người               │
│ ┌──────────────────┬───────────────────┐        │
│ │ Loại giao dịch   │ Tên người thu/chi │        │
│ │ [Tất cả ▼]       │ [🔍 Tìm...]      │        │
│ └──────────────────┴───────────────────┘        │
├──────────────────────────────────────────────────┤
│ Đang lọc: [📈 Thu] [👤 Nguyễn]  [✕ Xóa]       │
└──────────────────────────────────────────────────┘
```

---

## 📊 Ví dụ sử dụng:

### **Ví dụ 1: Xem tất cả khoản THU tháng này**
```
Bước 1: Thời gian → Chọn tháng → Tháng 1/2026
Bước 2: Loại giao dịch → Chỉ Thu

Kết quả:
📈 Tổng Thu: 20,000,000đ
📉 Tổng Chi: 0đ (không có chi vì lọc chỉ thu)
💰 Số Dư: 20,000,000đ

Giao dịch: Chỉ hiển thị các khoản thu tháng 1
```

### **Ví dụ 2: Xem tất cả khoản CHI hôm nay**
```
Bước 1: Thời gian → Hôm nay
Bước 2: Loại giao dịch → Chỉ Chi

Kết quả:
📈 Tổng Thu: 0đ
📉 Tổng Chi: 2,000,000đ (chỉ chi hôm nay)
💰 Số Dư: -2,000,000đ

Giao dịch: Chỉ các khoản chi hôm nay
```

### **Ví dụ 3: Tìm tất cả giao dịch của "Nguyễn Văn A"**
```
Bước 1: Thời gian → Tất cả
Bước 2: Loại → Tất cả
Bước 3: Tên người → Gõ "Nguyễn Văn A"

Kết quả:
Hiển thị tất cả giao dịch (cả thu và chi) 
của Nguyễn Văn A từ trước đến nay

📈 Tổng Thu: 15,000,000đ (của NVA)
📉 Tổng Chi: 8,000,000đ (của NVA)
💰 Số Dư: 7,000,000đ
```

### **Ví dụ 4: Xem ai đã CHI tiền tháng 12**
```
Bước 1: Thời gian → Tháng 12/2025
Bước 2: Loại → Chỉ Chi

Kết quả:
Danh sách tất cả người đã chi tiền tháng 12
Có thể tìm thêm theo tên cụ thể
```

### **Ví dụ 5: Tìm khoản THU từ "Khách hàng X" hôm nay**
```
Bước 1: Thời gian → Hôm nay
Bước 2: Loại → Chỉ Thu
Bước 3: Tìm → "Khách hàng X"

Kết quả:
Chỉ các khoản thu từ Khách hàng X hôm nay
```

---

## 🎯 Layout chi tiết:

### **Row 1: Bộ lọc thời gian**
```
┌──────────┬─────────────┬─────────────┐
│ Thời gian│ [Date/Month]│             │
│  (3 cột) │  (Tùy chọn) │             │
└──────────┴─────────────┴─────────────┘
```

### **Row 2: Lọc nâng cao**
```
┌──────────────────┬───────────────────┐
│ Loại giao dịch   │ Tìm theo tên      │
│ [Dropdown]       │ [Search box]      │
│ • Tất cả         │ 🔍 Icon + Input   │
│ • 📈 Chỉ Thu     │ Real-time search  │
│ • 📉 Chỉ Chi     │                   │
└──────────────────┴───────────────────┘
```

### **Row 3: Active Filters (khi có lọc)**
```
┌────────────────────────────────────┐
│ Đang lọc: [Tag 1] [Tag 2] [✕ Xóa]│
└────────────────────────────────────┘
```

---

## 💡 Tính năng thông minh:

### **1. Label động**
- Khi chọn "Chỉ Thu" → Label đổi thành "Tên người thu"
- Khi chọn "Chỉ Chi" → Label đổi thành "Tên người chi"
- Khi chọn "Tất cả" → "Tên người thu/chi"

### **2. Placeholder động**
- Chỉ Thu → "Tìm người thu..."
- Chỉ Chi → "Tìm người chi..."
- Tất cả → "Tìm theo tên..."

### **3. Active Filters Tags**
Hiển thị các bộ lọc đang active:
- 📈 Thu (màu xanh)
- 📉 Chi (màu đỏ)
- 👤 [Tên người] (màu tím)
- Nút "✕ Xóa bộ lọc" để reset

### **4. Real-time filtering**
- Gõ tên → Lọc ngay lập tức
- Không cần nhấn nút "Tìm kiếm"

### **5. Stats tự động**
- Stats (Thu/Chi/Dư) tự động tính dựa trên kết quả đã lọc
- Nếu lọc "Chỉ Thu" → Tổng Chi = 0
- Nếu lọc "Chỉ Chi" → Tổng Thu = 0

---

## 🔧 File đã cập nhật:

```
✅ src/components/TransactionFilter.jsx - Thêm 2 filter mới
✅ src/screens/HomeScreen.jsx           - Logic lọc nâng cao
```

---

## 📱 Responsive:

**Desktop:**
- Row 1: 3 cột (Thời gian, Date/Month)
- Row 2: 2 cột (Loại, Tìm kiếm)

**Mobile:**
- Tất cả fields stack vertically
- Full width

---

## 🎨 Màu sắc:

**Input focus colors:**
- Thời gian: Blue (ring-blue-500)
- Loại GD: Green (ring-green-500)
- Tìm kiếm: Purple (ring-purple-500)

**Tags:**
- Thu: bg-green-100 text-green-700
- Chi: bg-red-100 text-red-700 (nếu implement)
- Person: bg-purple-100 text-purple-700

---

## 🚀 Chạy ngay:

```bash
cd D:\QUANLYTHUCHI\webapp
npm run dev
```

---

## 💪 Use Cases phổ biến:

1. **"Xem tất cả khoản chi tháng này"**
   - Thời gian: Tháng này
   - Loại: Chỉ Chi

2. **"Kiểm tra ai đã thu tiền hôm nay"**
   - Thời gian: Hôm nay
   - Loại: Chỉ Thu
   - (Xem danh sách người)

3. **"Tìm tất cả giao dịch của nhân viên X"**
   - Thời gian: Tất cả
   - Tìm: Tên nhân viên X

4. **"Xem người A đã chi bao nhiêu tháng 12"**
   - Thời gian: Tháng 12
   - Loại: Chỉ Chi
   - Tìm: Người A

5. **"Kiểm tra khách hàng X đã trả tiền chưa"**
   - Thời gian: Tất cả
   - Loại: Chỉ Thu
   - Tìm: Khách hàng X

---

**Bộ lọc giờ rất mạnh mẽ và linh hoạt! Có thể tìm chính xác bất kỳ giao dịch nào! 🔍💪**
