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

  const normalizedRole = String(
    roleName ||
      user?.role ||
      ''
  )
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
    } catch (error) {
      console.error(
        'LOGOUT ERROR:',
        error
      )
    } finally {
      navigate('/login', {
        replace: true
      })
    }
  }

  function handleNotificationClick() {
    const notificationRoutes = {
      EMPLOYEE:
        '/employee/notifications',
      MANAGER:
        '/manager/notifications',
      TRAINER:
        '/trainer/notifications',
      HR:
        '/hr/notifications'
    }

    const destination =
      notificationRoutes[
        normalizedRole
      ]

    if (!destination) {
      console.warn(
        `Notification route is not available for role: ${normalizedRole}`
      )

      return
    }

    navigate(destination)
  }

  function handleSearchSubmit(event) {
    event.preventDefault()

    const formData =
      new FormData(event.currentTarget)

    const searchQuery = String(
      formData.get('search') || ''
    ).trim()

    if (!searchQuery) {
      return
    }

    const courseRoutes = {
      EMPLOYEE:
        '/employee/courses',
      MANAGER:
        '/manager/courses',
      TRAINER:
        '/trainer/my-courses',
      HR:
        '/hr/courses'
    }

    const destination =
      courseRoutes[
        normalizedRole
      ]

    if (!destination) {
      return
    }

    navigate(
      `${destination}?search=${encodeURIComponent(
        searchQuery
      )}`
    )
  }

  return (
    <header
      className="
        sticky top-0 z-30
        flex min-h-16 w-full
        items-center justify-between
        gap-3 border-b border-gray-200
        bg-white px-4 py-3
        shadow-sm
        sm:px-5
        lg:px-6
      "
    >
      <form
        onSubmit={handleSearchSubmit}
        className="
          flex min-w-0 flex-1
          items-center
        "
      >
        <div
          className="
            flex h-10 w-full
            max-w-xl items-center
            gap-2 rounded-xl
            border border-gray-200
            bg-gray-50 px-3
            transition
            focus-within:border-brand-400
            focus-within:bg-white
            focus-within:ring-2
            focus-within:ring-brand-100
          "
        >
          <Search
            size={19}
            className="
              shrink-0 text-gray-400
            "
            aria-hidden="true"
          />

          <input
            name="search"
            type="search"
            placeholder="Search courses and materials..."
            aria-label="Search courses and materials"
            autoComplete="off"
            className="
              h-full min-w-0 flex-1
              border-none bg-transparent
              text-sm text-gray-700
              outline-none
              placeholder:text-gray-400
            "
          />
        </div>
      </form>

      <div
        className="
          flex shrink-0
          items-center gap-2
          sm:gap-3
        "
      >
        <button
          type="button"
          onClick={
            handleNotificationClick
          }
          aria-label="Open notifications"
          title="Notifications"
          className="
            inline-flex h-10 w-10
            cursor-pointer
            items-center justify-center
            rounded-full
            text-gray-600
            transition
            hover:bg-gray-100
            hover:text-brand-600
            focus:outline-none
            focus:ring-2
            focus:ring-brand-200
          "
        >
          <Bell size={21} />
        </button>

        <div
          className="
            hidden h-7 w-px
            bg-gray-200
            sm:block
          "
          aria-hidden="true"
        />

        <div
          className="
            flex min-w-0
            items-center gap-3
          "
        >
          <div
            className="
              hidden min-w-0
              text-right
              sm:block
            "
          >
            <p
              className="
                max-w-40 truncate
                text-sm font-semibold
                text-gray-800
              "
              title={displayName}
            >
              {displayName}
            </p>

            <p
              className="
                mt-0.5 text-xs
                font-medium
                tracking-wide
                text-gray-500
              "
            >
              {normalizedRole || 'USER'}
            </p>
          </div>

          <div
            className="
              flex h-10 w-10
              shrink-0 items-center
              justify-center
              rounded-full
              bg-brand-100
              text-sm font-bold
              text-brand-700
              ring-2 ring-white
            "
            aria-label={`${displayName} profile`}
            title={displayName}
          >
            {initial}
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="
            inline-flex h-10 w-10
            cursor-pointer
            items-center justify-center
            rounded-full
            text-gray-600
            transition
            hover:bg-red-50
            hover:text-red-600
            focus:outline-none
            focus:ring-2
            focus:ring-red-200
          "
        >
          <LogOut size={21} />
        </button>
      </div>
    </header>
  )
}