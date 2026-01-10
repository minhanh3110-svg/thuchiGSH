// Danh mục chi tiêu
export const ExpenseCategories = [
  {
    id: 'nhan-cong',
    label: 'Nhân công',
    value: 'Nhân công',
    color: '#FF9800',
  },
  {
    id: 'nguyen-vat-lieu',
    label: 'Nguyên vật liệu',
    value: 'Nguyên vật liệu',
    color: '#9C27B0',
  },
  {
    id: 'van-chuyen',
    label: 'Vận chuyển',
    value: 'Vận chuyển',
    color: '#2196F3',
  },
  {
    id: 'dien-nuoc',
    label: 'Điện nước',
    value: 'Điện nước',
    color: '#4CAF50',
  },
  {
    id: 'khac',
    label: 'Khác',
    value: 'Khác',
    color: '#757575',
  },
];

// Gợi ý nguồn tiền thu
export const IncomeSources = [
  'Khách hàng',
  'Bán hàng',
  'Dịch vụ',
  'Thu nợ',
  'Khác',
];

export default {
  ExpenseCategories,
  IncomeSources,
};
