import { Search, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NOTIFICATIONS_PATH_BY_ROLE = {
  EMPLOYEE: '/employee/notifications',
  MANAGER: '/manager/notifications',
  HR: '/hr/notifications',
  TRAINER: '/trainer/notifications',
};

export default function Topbar() {
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
    <header className="h-20 w-full shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

      <div className="min-w-0 flex-1 max-w-[700px] items-center bg-[#F4F6FF] rounded-full px-5 py-3 hidden sm:flex">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search courses, materials..."
          className="bg-transparent outline-none ml-3 w-full text-sm text-gray-600"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-6">
        <button className="relative" onClick={handleNotificationClick}>
          <Bell size={20} className="text-brand-500" />
        </button>

        <div className="w-px h-10 bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              {roleName || 'EMPLOYEE'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">
            {user?.full_name?.[0] ?? 'U'}
          </div>
        </div>

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
