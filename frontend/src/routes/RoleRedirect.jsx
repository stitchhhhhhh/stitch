import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_PATHS = {
  EMPLOYEE: '/employee',
  MANAGER: '/manager',
  TRAINER: '/trainer',
  HR: '/hr'
}

export default function RoleRedirect() {
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

  const normalizedRole = String(roleName || '').toUpperCase()
  const destination = ROLE_PATHS[normalizedRole]

  if (!destination) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return (
    <Navigate
      to={destination}
      replace
    />
  )
}