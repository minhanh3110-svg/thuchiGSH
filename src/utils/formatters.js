// Format currency in VND
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Format date to Vietnamese format
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Format month year
export const formatMonthYear = (year, month) => {
  return `Tháng ${month}/${year}`;
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Parse month string (YYYY-MM) to year and month
export const parseMonthString = (monthStr) => {
  const [year, month] = monthStr.split('-');
  return {
    year: parseInt(year),
    month: parseInt(month),
  };
};
