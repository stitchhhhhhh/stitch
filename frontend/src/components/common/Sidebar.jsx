import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../mock/entitySchemas';

// Logo sidebar atas
import companyLogo from '../../assets/company-logo.png';

// Icon menu
import dashboardLogo from '../../assets/dashboard-logo.png';
import coursesLogo from '../../assets/courses-logo.png';
import certificatesLogo from '../../assets/topi1.png';

const MENUS_BY_ROLE = {
  [ROLES.EMPLOYEE]: [
    {
      label: 'Dashboard',
      path: '/employee',
      icon: dashboardLogo,
    },
    {
      label: 'Courses',
      path: '/employee/courses',
      icon: coursesLogo,
    },
    {
      label: 'Certificates',
      path: '/employee/certificates',
      icon: certificatesLogo,
    },
    {
      label: 'Leaderboard',
      path: '/employee/leaderboard',
    },
    {
      label: 'Notifications',
      path: '/employee/notifications',
    },
    {
      label: 'Settings',
      path: '/employee/settings',
    },
  ],

  [ROLES.MANAGER]: [
    { label: 'Dashboard', path: '/manager' },
    { label: 'Training Proposals', path: '/manager/proposals' },
    { label: 'Employee Progress', path: '/manager/progress' },
    { label: 'Notifications', path: '/manager/notifications' },
    { label: 'Settings', path: '/manager/settings' },
  ],

  [ROLES.HR]: [
    { label: 'Dashboard', path: '/hr' },
    { label: 'General Training Program', path: '/hr/programs' },
    { label: 'Course Requests', path: '/hr/course-requests' },
    { label: 'Training Reports', path: '/hr/reports' },
    { label: 'Settings', path: '/hr/settings' },
  ],

[ROLES.TRAINER]: [
  { label: 'Dashboard', path: '/trainer', icon: dashboardLogo },
  { label: 'Course Requests', path: '/trainer/requests', icon: coursesLogo },
  { label: 'My Courses', path: '/trainer/courses', icon: coursesLogo },
  { label: 'Notifications', path: '/trainer/notifications' },
  { label: 'Settings', path: '/trainer/settings' },
],
};

export default function Sidebar() {
  const { roleName, user } = useAuth();

  const menus =
    MENUS_BY_ROLE[roleName] || MENUS_BY_ROLE[ROLES.EMPLOYEE];

  return (
    <aside className="w-[260px] min-h-screen bg-[#2F3FE4] text-white flex flex-col">

      {/* Logo atas */}
      <div className="flex justify-center px-6 pt-8 pb-10">
        <img
          src={companyLogo}
          alt="Company Logo"
          className="w-[170px] object-contain"
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            end={menu.path === '/employee'}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 rounded-2xl bg-[#4453F2] px-5 py-4 text-white'
                : 'flex items-center gap-3 rounded-2xl px-5 py-4 text-white/80 hover:bg-white/10'
            }
          >
            <div className="w-8 flex justify-center">
              {menu.icon && (
                <img
                  src={menu.icon}
                  alt={menu.label}
                  className={
                    menu.label === 'Certificates'
                      ? 'w-8 h-8 object-contain'
                      : 'w-5 h-5 object-contain'
                  }
                />
              )}
            </div>
            <span className="text-sm font-medium">
              {menu.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="p-4">
        <div className="rounded-2xl bg-[#4453F2] p-4">
          <p className="font-semibold">
            {user?.full_name || 'Employee'}
          </p>

          <p className="mt-1 text-sm text-white/70">
            {roleName || 'Employee'}
          </p>
        </div>
      </div>

    </aside>
  );
}