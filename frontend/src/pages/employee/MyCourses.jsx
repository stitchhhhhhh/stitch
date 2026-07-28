import {
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  Medal,
  Settings,
  Trophy,
  UserCheck,
  Users
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

import companyLogo from '../../assets/company-logo.png'
import { ROLES } from '../../constants/roles'
import { useAuth } from '../../context/AuthContext'

const MENUS_BY_ROLE = {
  [ROLES.EMPLOYEE]: [
    {
      label: 'Dashboard',
      path: '/employee',
      icon: LayoutDashboard,
      end: true
    },
    {
      label: 'Courses',
      path: '/employee/courses',
      icon: BookOpen
    },
    {
      label: 'Certificates',
      path: '/employee/certificates',
      icon: GraduationCap
    },
    {
      label: 'Leaderboard',
      path: '/employee/leaderboard',
      icon: Trophy
    },
    {
      label: 'Notifications',
      path: '/employee/notifications',
      icon: Bell
    },
    {
      label: 'Settings',
      path: '/employee/settings',
      icon: Settings
    }
  ],

  [ROLES.MANAGER]: [
    {
      label: 'Dashboard',
      path: '/manager',
      icon: LayoutDashboard,
      end: true
    },
    {
      label: 'Training Proposals',
      path: '/manager/proposals',
      icon: ClipboardList
    },
    {
      label: 'Department Training',
      path: '/manager/department-training',
      icon: Users
    },
    {
      label: 'Employee Progress',
      path: '/manager/progress',
      icon: UserCheck
    },
    {
      label: 'Analytics',
      path: '/manager/analytics',
      icon: BarChart3
    },
    {
      label: 'Notifications',
      path: '/manager/notifications',
      icon: Bell
    },
    {
      label: 'Settings',
      path: '/manager/settings',
      icon: Settings
    }
  ],

  [ROLES.HR]: [
    {
      label: 'Dashboard',
      path: '/hr',
      icon: LayoutDashboard,
      end: true
    },
    {
      label: 'General Training',
      path: '/hr/programs',
      icon: GraduationCap
    },
    {
      label: 'Course Requests',
      path: '/hr/course-requests',
      icon: BookOpen
    },
    {
      label: 'Training Requests',
      path: '/hr/training-requests',
      icon: ClipboardList
    },
    {
      label: 'Analytics',
      path: '/hr/analytics',
      icon: BarChart3
    },
    {
      label: 'Reports',
      path: '/hr/reports',
      icon: FileBarChart
    },
    {
      label: 'Notifications',
      path: '/hr/notifications',
      icon: Bell
    },
    {
      label: 'Settings',
      path: '/hr/settings',
      icon: Settings
    }
  ],

  [ROLES.TRAINER]: [
    {
      label: 'Dashboard',
      path: '/trainer',
      icon: LayoutDashboard,
      end: true
    },
    {
      label: 'Course Requests',
      path: '/trainer/requests',
      icon: ClipboardList
    },
    {
      label: 'My Courses',
      path: '/trainer/courses',
      icon: BookOpen
    },
    {
      label: 'Notifications',
      path: '/trainer/notifications',
      icon: Bell
    },
    {
      label: 'Settings',
      path: '/trainer/settings',
      icon: Settings
    }
  ]
}

function SidebarMenuItem({ menu }) {
  const Icon = menu.icon

  return (
    <NavLink
      to={menu.path}
      end={Boolean(menu.end)}
      title={menu.label}
      className={({ isActive }) =>
        [
          'group flex min-h-12 w-full cursor-pointer',
          'items-center gap-3 rounded-2xl px-4 py-3',
          'text-sm font-medium transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-white/40',
          isActive
            ? 'bg-[#4453F2] text-white shadow-sm'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        ].join(' ')
      }
    >
      <span
        className="
          flex h-8 w-8 shrink-0
          items-center justify-center
          rounded-lg
          text-white/90
          group-hover:text-white
        "
      >
        <Icon
          size={20}
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>

      <span className="min-w-0 truncate">
        {menu.label}
      </span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { roleName, user } = useAuth()

  const normalizedRole = String(
    roleName ||
      user?.role ||
      ''
  )
    .trim()
    .toUpperCase()

  const menus =
    MENUS_BY_ROLE[normalizedRole] || []

  const displayName =
    user?.full_name ||
    user?.name ||
    user?.email ||
    'User'

  return (
    <aside
      className="
        flex h-screen w-[260px]
        min-w-[260px] shrink-0
        flex-col overflow-hidden
        bg-[#2F3FE4] text-white
      "
      aria-label="Main navigation"
    >
      <div
        className="
          flex shrink-0
          justify-center
          px-6 pb-8 pt-8
        "
      >
        <img
          src={companyLogo}
          alt="Learning Company"
          className="
            h-auto w-[170px]
            max-w-full object-contain
          "
        />
      </div>

      <nav
        className="
          min-h-0 flex-1
          space-y-2 overflow-y-auto
          overflow-x-hidden
          px-4 pb-4
        "
      >
        {menus.map((menu) => (
          <SidebarMenuItem
            key={menu.path}
            menu={menu}
          />
        ))}

        {menus.length === 0 && (
          <div
            className="
              rounded-2xl bg-white/10
              px-4 py-3
              text-sm text-white/70
            "
          >
            Navigation is unavailable.
          </div>
        )}
      </nav>

      <div
        className="
          shrink-0 border-t
          border-white/10 p-4
        "
      >
        <div
          className="
            rounded-2xl
            bg-[#4453F2]
            px-4 py-3
          "
        >
          <p
            className="
              truncate text-sm
              font-semibold text-white
            "
            title={displayName}
          >
            {displayName}
          </p>

          <p
            className="
              mt-1 truncate
              text-xs font-medium
              uppercase tracking-wide
              text-white/70
            "
          >
            {normalizedRole || 'USER'}
          </p>
        </div>
      </div>
    </aside>
  )
}