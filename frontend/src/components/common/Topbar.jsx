import {
  Bell,
  LogOut,
  Search
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Topbar() {
  const navigate = useNavigate()

  const {
    user,
    roleName,
    logout
  } = useAuth()

  const displayName =
    user?.full_name ||
    user?.name ||
    user?.email ||
    'User'

  const normalizedRole =
    String(roleName || user?.role || '')
      .trim()
      .toUpperCase()

  const initial =
    String(displayName)
      .trim()
      .charAt(0)
      .toUpperCase() || 'U'

  async function handleLogout() {
    try {
      await logout()

      navigate('/login', {
        replace: true
      })
    } catch (error) {
      console.error('LOGOUT ERROR:', error)

      navigate('/login', {
        replace: true
      })
    }
  }

  function handleNotificationClick() {
    const notificationRoutes = {
      EMPLOYEE: '/employee/notifications',
      MANAGER: '/manager/notifications',
      TRAINER: '/trainer/notifications',
      HR: '/hr/notifications'
    }

    const destination =
      notificationRoutes[normalizedRole]

    if (destination) {
      navigate(destination)
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search
          size={20}
          aria-hidden="true"
        />

        <input
          type="search"
          placeholder="Search courses, materials..."
          aria-label="Search courses and materials"
        />
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="topbar-icon-button"
          onClick={handleNotificationClick}
          aria-label="Open notifications"
          title="Notifications"
        >
          <Bell size={22} />
        </button>

        <div className="topbar-divider" />

        <div className="topbar-user">
          <div className="topbar-user-info">
            <span className="topbar-user-name">
              {displayName}
            </span>

            <span className="topbar-user-role">
              {normalizedRole || 'USER'}
            </span>
          </div>

          <div
            className="topbar-avatar"
            aria-label={`${displayName} profile`}
          >
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt={`${displayName} profile`}
              />
            ) : (
              <span>{initial}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="topbar-icon-button topbar-logout-button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={22} />
        </button>
      </div>
    </header>
  )
}