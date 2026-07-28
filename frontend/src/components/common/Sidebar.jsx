import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

// Logo sidebar atas
import companyLogo from "../../assets/company-logo.png";

// Icon menu
import dashboardLogo from "../../assets/dashboard-logo.png";
import coursesLogo from "../../assets/courses-logo.png";
import certificatesLogo from "../../assets/topi1.png";
import { Settings } from "lucide-react";

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
    },
    {
      label: "Notifications",
      path: "/employee/notifications",
    },
    {
      label: "Settings",
      path: "/employee/settings",
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
    icon: dashboardLogo,
  },
  {
    label: "Notifications",
    path: "/manager/notifications",
    icon: dashboardLogo,
  },
  {
    label: "Settings",
    path: "/manager/Settings",
    icon: dashboardLogo,
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
      icon: dashboardLogo,
    },
    {
      label: "Reports",
      path: "/hr/reports",
      icon: certificatesLogo,
    },
    {
      label: "Notifications",
      path: "/hr/notifications",
      icon: dashboardLogo,
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
    },
    {
      label: "Settings",
      path: "/trainer/settings",
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
      <aside
  className="
    flex h-screen w-[260px]
    min-w-[260px] flex-col
    overflow-hidden
    bg-[#2F3FE4]
    text-white
  "
>
        {/* Logo */}
        <div className="flex justify-center px-6 pt-8 pb-10">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-[170px] object-contain"
          />
        </div>

        {/* Menu */}
        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
          {menus.map((menu) => (
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
                  ? "flex items-center gap-3 rounded-2xl bg-[#4453F2] px-5 py-4 text-white"
                  : "flex items-center gap-3 rounded-2xl px-5 py-4 text-white/80 hover:bg-white/10"
              }
            >
              <div className="w-8 flex justify-center">
                {menu.icon && (
                  <img
                    src={menu.icon}
                    alt={menu.label}
                    className="w-5 h-5 object-contain"
                  />
                )}
              </div>

              <span className="text-sm font-medium">
                {menu.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4">
          {roleName === ROLES.HR ? (
            <NavLink
              to="/hr/settings"
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 rounded-2xl bg-[#4453F2] px-5 py-4 text-white"
                  : "flex items-center gap-3 rounded-2xl px-5 py-4 text-white/80 hover:bg-white/10"
              }
            >
              <div className="w-8 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.983 3.5a1 1 0 011.034.757l.188.75a7.965 7.965 0 011.56.646l.66-.396a1 1 0 011.273.146l1.06 1.06a1 1 0 01.146 1.273l-.396.66c.275.5.492 1.02.646 1.56l.75.188a1 1 0 01.757 1.034v1.5a1 1 0 01-.757 1.034l-.75.188a7.965 7.965 0 01-.646 1.56l.396.66a1 1 0 01-.146 1.273l-1.06 1.06a1 1 0 01-1.273.146l-.66-.396a7.965 7.965 0 01-1.56.646l-.188.75a1 1 0 01-1.034.757h-1.5a1 1 0 01-1.034-.757l-.188-.75a7.965 7.965 0 01-1.56-.646l-.66.396a1 1 0 01-1.273-.146l-1.06-1.06a1 1 0 01-.146-1.273l.396-.66a7.965 7.965 0 01-.646-1.56l-.75-.188A1 1 0 013.5 12.733v-1.5a1 1 0 01.757-1.034l.75-.188a7.965 7.965 0 01.646-1.56l-.396-.66a1 1 0 01.146-1.273l1.06-1.06a1 1 0 011.273-.146l.66.396a7.965 7.965 0 011.56-.646l.188-.75A1 1 0 0110.483 3.5h1.5z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>

              <span className="text-sm font-medium">
                Settings
              </span>
            </NavLink>
          ) : (
            <div className="rounded-2xl bg-[#4453F2] p-4">
              <p className="font-semibold">
                {user?.full_name || "Employee"}
              </p>

              <p className="mt-1 text-sm text-white/70 uppercase">
                {roleName || "Employee"}
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
