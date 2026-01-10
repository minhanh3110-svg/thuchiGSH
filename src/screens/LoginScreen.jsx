import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const CREDENTIALS = {
  username: 'GSH',
  password: '1405'
};

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      // Lưu trạng thái đăng nhập
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      navigate('/');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo />
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {/* Hiển thị lỗi */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 active:scale-98 transition-all shadow-lg"
          >
            Đăng nhập
          </button>
        </form>

        {/* Thông tin hỗ trợ */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Green Straw Hat - Happiness Together</p>
        </div>
      </div>
    </div>
  );
}
