import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

// Logo sidebar atas
import companyLogo from "../../assets/company-logo.png";

// Icon menu assets
import dashboardLogo from "../../assets/dashboard-logo.png";
import coursesLogo from "../../assets/courses-logo.png";
import certificatesLogo from "../../assets/topi1.png";

import {
  Trophy,
  Bell,
  Settings,
  LayoutDashboard,
  BookOpen,
  Award,
  BarChart2,
  FileSpreadsheet,
} from "lucide-react";

const MENUS_BY_ROLE = {
  [ROLES.EMPLOYEE]: [
    {
      label: "Dashboard",
      path: "/employee",
      icon: dashboardLogo,
    },
    {
      label: "Courses",
      path: "/employee/courses",
      icon: coursesLogo,
    },
    {
      label: "Certificates",
      path: "/employee/certificates",
      icon: certificatesLogo,
    },
    {
      label: "Leaderboard",
      path: "/employee/leaderboard",
      lucideIcon: Trophy,
    },
    {
      label: "Notifications",
      path: "/employee/notifications",
      lucideIcon: Bell,
    },
    {
      label: "Settings",
      path: "/employee/settings",
      lucideIcon: Settings,
    },
  ],

  [ROLES.MANAGER]: [
    {
      label: "Dashboard",
      path: "/manager",
      icon: dashboardLogo,
    },
    {
      label: "Training Proposals",
      path: "/manager/proposals",
      icon: coursesLogo,
    },
    {
      label: "Department Training",
      path: "/manager/department-training",
      icon: coursesLogo,
    },
    {
      label: "Employee Progress",
      path: "/manager/progress",
      icon: certificatesLogo,
    },
    {
      label: "Analytics",
      path: "/manager/analytics",
      lucideIcon: BarChart2,
    },
    {
      label: "Notifications",
      path: "/manager/notifications",
      lucideIcon: Bell,
    },
    {
      label: "Settings",
      path: "/manager/settings",
      lucideIcon: Settings,
    },
  ],

  [ROLES.HR]: [
    {
      label: "Dashboard",
      path: "/hr",
      icon: dashboardLogo,
    },
    {
      label: "General Training",
      path: "/hr/programs",
      icon: coursesLogo,
    },
    {
      label: "Course Requests",
      path: "/hr/course-requests",
      icon: coursesLogo,
    },
    {
      label: "Training Request",
      path: "/hr/training-requests",
      icon: coursesLogo,
    },
    {
      label: "Analytics",
      path: "/hr/analytics",
      lucideIcon: BarChart2,
    },
    {
      label: "Reports",
      path: "/hr/reports",
      lucideIcon: FileSpreadsheet,
    },
    {
      label: "Notifications",
      path: "/hr/notifications",
      lucideIcon: Bell,
    },
    {
      label: "Settings",
      path: "/hr/settings",
      lucideIcon: Settings,
    },
  ],

  [ROLES.TRAINER]: [
    {
      label: "Dashboard",
      path: "/trainer",
      icon: dashboardLogo,
    },
    {
      label: "Course Requests",
      path: "/trainer/requests",
      icon: coursesLogo,
    },
    {
      label: "My Courses",
      path: "/trainer/courses",
      icon: coursesLogo,
    },
    {
      label: "Notifications",
      path: "/trainer/notifications",
      lucideIcon: Bell,
    },
    {
      label: "Settings",
      path: "/trainer/settings",
      lucideIcon: Settings,
    },
  ],
};

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
}) {
  const { roleName, user } = useAuth();

  const menus =
    MENUS_BY_ROLE[roleName] || MENUS_BY_ROLE[ROLES.EMPLOYEE];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
        />
      )}

      <aside
        className={
          `fixed md:static inset-y-0 left-0 z-50 w-[260px] min-w-[260px] min-h-screen ` +
          `bg-[#2F3FE4] text-white flex flex-col transform transition-transform duration-300 ease-in-out ` +
          `${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 shadow-xl md:shadow-none`
        }
      >
        {/* Logo */}
        <div className="flex justify-center px-6 pt-8 pb-8 shrink-0">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-[170px] object-contain"
          />
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
          {menus.map((menu) => {
            const IconComponent = menu.lucideIcon;
            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                end={
                  menu.path === "/employee" ||
                  menu.path === "/manager" ||
                  menu.path === "/trainer" ||
                  menu.path === "/hr"
                }
                onClick={onClose}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 rounded-2xl bg-[#4453F2] px-5 py-3.5 text-white font-medium"
                    : "flex items-center gap-3 rounded-2xl px-5 py-3.5 text-white/80 hover:bg-white/10 font-medium transition-colors"
                }
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {menu.icon ? (
                    <img
                      src={menu.icon}
                      alt={menu.label}
                      className="w-5 h-5 object-contain"
                    />
                  ) : IconComponent ? (
                    <IconComponent size={20} className="text-white/90" />
                  ) : null}
                </div>

                <span className="text-sm">
                  {menu.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile Info */}
        <div className="p-4 mt-auto shrink-0 border-t border-white/10">
          <div className="rounded-2xl bg-[#4453F2] p-4">
            <p className="font-semibold text-sm truncate">
              {user?.full_name || "User"}
            </p>
            <p className="mt-0.5 text-xs text-white/70 uppercase tracking-wider font-medium">
              {roleName || "EMPLOYEE"}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

