import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import Logo from '../components/Logo';
import { firebaseSignIn, firebaseSignUp } from '../services/firebase';

const ADMIN_CREDENTIALS = {
  username: 'GSH',
  password: '1405'
};

export default function LoginScreen() {
  const [mode, setMode] = useState('admin'); // 'admin' or 'firebase'
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      localStorage.setItem('authMode', 'admin');
      navigate('/');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  const handleFirebaseAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await firebaseSignUp(email, password);
      } else {
        result = await firebaseSignIn(email, password);
      }

      if (result.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', email);
        localStorage.setItem('authMode', 'firebase');
        localStorage.setItem('firebaseUid', result.user.uid);
        navigate('/');
      } else {
        setError(result.error || 'Đã có lỗi xảy ra!');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo />
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('admin')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              mode === 'admin' 
                ? 'bg-white text-green-600 shadow-md' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Đăng nhập nhanh
          </button>
          <button
            onClick={() => setMode('firebase')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              mode === 'firebase' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ☁️ Cloud Sync
          </button>
        </div>

        {/* Admin Login Form */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-800">
                ⚡ <strong>Đăng nhập nhanh</strong> - Dữ liệu lưu trên máy này
              </p>
            </div>

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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Đăng nhập
            </button>
          </form>
        )}

        {/* Firebase Login Form */}
        {mode === 'firebase' && (
          <form onSubmit={handleFirebaseAuth} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                ☁️ <strong>Cloud Sync</strong> - Dữ liệu đồng bộ tất cả máy
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tối thiểu 6 ký tự"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>Đang xử lý...</>
              ) : isSignUp ? (
                <>
                  <UserPlus size={20} />
                  Đăng ký tài khoản
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Đăng nhập
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
            </button>
          </form>
        )}

        {/* Thông tin */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Green Straw Hat - Happiness Together</p>
        </div>
      </div>
    </div>
  );
}
