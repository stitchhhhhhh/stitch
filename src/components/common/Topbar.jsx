import { Search, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">

      {/* Search Bar */}
      <div className="flex items-center bg-[#F4F6FF] rounded-full px-5 py-3 w-[700px] max-w-full">
        <Search size={18} className="text-gray-400" />

        <input
          type="text"
          placeholder="Search courses, materials..."
          className="bg-transparent outline-none ml-3 w-full text-sm text-gray-600"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button className="relative">
          <Bell size={20} className="text-brand-500" />
        </button>

        {/* Divider */}
        <div className="w-px h-10 bg-gray-200"></div>

        {/* User */}
        <div className="flex items-center gap-3">

          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              {user?.full_name || 'Employee'}
            </p>

            <p className="text-xs text-gray-400 uppercase">
              Employee
            </p>
          </div>

          <div className="w-11 h-11 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">
            {user?.full_name?.[0] ?? 'E'}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-500"
        >
          <LogOut size={20} />
        </button>

      </div>
    </header>
  );
}