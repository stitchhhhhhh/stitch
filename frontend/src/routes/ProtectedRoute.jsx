import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({
  allowedRoles = []
}) {
  const {
    isAuthenticated,
    isAuthLoading,
    roleName
  } = useAuth()

  if (isAuthLoading) {
    return (
      <div className="auth-loading-screen">
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  const normalizedAllowedRoles =
    allowedRoles.map((role) =>
      String(role).toUpperCase()
    )

  const normalizedCurrentRole =
    String(roleName || '').toUpperCase()

  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(
      normalizedCurrentRole
    )
  ) {
    const rolePaths = {
      EMPLOYEE: '/employee',
      MANAGER: '/manager',
      TRAINER: '/trainer',
      HR: '/hr'
    }

    const destination =
      rolePaths[normalizedCurrentRole] || '/login'

    return (
      <Navigate
        to={destination}
        replace
      />
    )
  }

  return <Outlet />
}