import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, MinusCircle, BarChart3, BookOpen, Settings, LogOut } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Trang chủ', color: 'blue' },
    { path: '/add-income', icon: PlusCircle, label: 'Thu', color: 'green' },
    { path: '/add-expense', icon: MinusCircle, label: 'Chi', color: 'red' },
    { path: '/history', icon: BookOpen, label: 'Nhật ký', color: 'orange' },
    { path: '/report', icon: BarChart3, label: 'Báo cáo', color: 'purple' },
    { path: '/settings', icon: Settings, label: 'Cài đặt', color: 'gray' },
  ];

  const getColorClass = (color, isActive) => {
    if (!isActive) return 'text-gray-400 hover:text-gray-600';
    
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      red: 'text-red-600 bg-red-50',
      orange: 'text-orange-600 bg-orange-50',
      purple: 'text-purple-600 bg-purple-50',
      gray: 'text-gray-600 bg-gray-50',
    };
    return colors[color] || 'text-blue-600 bg-blue-50';
  };

  return (
    <nav className="bg-white border-t-2 border-gray-200 fixed bottom-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-screen-lg mx-auto flex justify-around items-center h-16 px-1">
        {navItems.map(({ path, icon: Icon, label, color }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center flex-1 h-12 rounded-xl mx-0.5 transition-all ${
                getColorClass(color, isActive)
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs mt-0.5 font-${isActive ? 'bold' : 'medium'}`}>
                {label}
              </span>
            </Link>
          );
        })}
        
        {/* Nút đăng xuất */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 h-12 rounded-xl mx-0.5 transition-all text-gray-400 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} strokeWidth={2} />
          <span className="text-xs mt-0.5 font-medium">
            Thoát
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
