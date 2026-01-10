import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { addIncome } from '../services/storage';
import { getCurrentDate } from '../utils/formatters';
import { IncomeSources } from '../constants/categories';
import Logo from '../components/Logo';

const AddIncomeScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    person: '',
    amount: '',
    source: '',
    note: '',
    date: getCurrentDate(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.person || !formData.amount) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      addIncome({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      alert('Thêm thu nhập thành công!');
      navigate('/');
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 shadow-xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-white hover:text-green-100 transition-colors text-sm"
            >
              <ArrowLeft size={18} className="mr-1" />
              Quay lại
            </button>
            <Logo size="sm" />
          </div>
          <h1 className="text-xl font-bold flex items-center">
            <PlusCircle size={24} className="mr-2" />
            Thêm Thu Nhập
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-3 py-4 sm:px-4 sm:py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 border border-green-100">
          <div className="space-y-4">
            {/* Người thu */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Người thu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="person"
                value={formData.person}
                onChange={handleChange}
                placeholder="VD: Nguyễn Văn A"
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                required
                autoComplete="name"
              />
            </div>

            {/* Số tiền */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Số tiền <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 pr-16 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-500">VNĐ</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nguồn tiền */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Nguồn tiền
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none bg-white appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">-- Chọn nguồn --</option>
                  {IncomeSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ngày */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Ngày
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Ghi chú
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Ghi chú thêm..."
                rows="3"
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center text-base touch-manipulation"
          >
            <PlusCircle size={20} className="mr-2" />
            Thêm Thu Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeScreen;
