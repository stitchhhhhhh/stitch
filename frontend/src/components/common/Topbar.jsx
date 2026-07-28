import { Search, Bell, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NOTIFICATIONS_PATH_BY_ROLE = {
  EMPLOYEE: '/employee/notifications',
  MANAGER: '/manager/notifications',
  HR: '/hr/notifications',
  TRAINER: '/trainer/notifications',
};

export default function Topbar({ title, onMenuClick }) {
  const { user, roleName, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleNotificationClick() {
    navigate(NOTIFICATIONS_PATH_BY_ROLE[roleName] ?? '/employee/notifications');
  }

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg md:hidden shrink-0"
          title="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center bg-[#F4F6FF] border border-transparent focus-within:border-brand-500/30 focus-within:bg-white focus-within:shadow-sm rounded-full px-4 py-2.5 flex-1 min-w-0 transition-all duration-200">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search courses, materials..."
            className="bg-transparent outline-none ml-2.5 w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right: Notification, Profile, Logout */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        <button
          type="button"
          onClick={handleNotificationClick}
          className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors relative"
          title="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="w-px h-8 bg-gray-200 shrink-0"></div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block text-right leading-tight">
            <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
              {user?.full_name || 'User'}
            </p>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
              {roleName || 'EMPLOYEE'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#3046d6] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0 uppercase">
            {user?.full_name?.[0] ?? 'U'}
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-sm font-medium shrink-0 ml-1"
          title="Logout"
        >
          <LogOut size={18} />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

