import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  fetchUserFromToken,
  logoutFromBackend
} from '../services/authService'

const AuthContext = createContext(null)

const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const ROLE_KEY = 'role'
const AUTH_EVENT_KEY = 'auth_event'

function clearStoredAuthentication() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [roleName, setRoleName] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const clearAuthenticationState = useCallback(() => {
    setUser(null)
    setRoleName(null)
    setToken(null)
    clearStoredAuthentication()
  }, [])

  const restoreAuthentication = useCallback(async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY)

    if (!savedToken) {
      clearAuthenticationState()
      setIsAuthLoading(false)
      return
    }

    try {
      const authenticationData =
        await fetchUserFromToken(savedToken)

      const authenticatedUser = {
        ...authenticationData.user,
        role: authenticationData.role
      }

      setToken(savedToken)
      setUser(authenticatedUser)
      setRoleName(authenticationData.role)

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(authenticatedUser)
      )

      localStorage.setItem(
        ROLE_KEY,
        authenticationData.role
      )
    } catch (error) {
      console.error('Authentication restoration failed:', error)
      clearAuthenticationState()
    } finally {
      setIsAuthLoading(false)
    }
  }, [clearAuthenticationState])

  useEffect(() => {
    restoreAuthentication()
  }, [restoreAuthentication])

  useEffect(() => {
    function handleStorageChange(event) {
      if (
        event.key !== TOKEN_KEY &&
        event.key !== AUTH_EVENT_KEY
      ) {
        return
      }

      const latestToken = localStorage.getItem(TOKEN_KEY)

      if (!latestToken) {
        clearAuthenticationState()
        return
      }

      setIsAuthLoading(true)
      restoreAuthentication()
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [clearAuthenticationState, restoreAuthentication])

  const login = useCallback(
    ({
      user: loggedInUser,
      role,
      token: newToken
    }) => {
      if (!newToken || !loggedInUser || !role) {
        throw new Error(
          'Incomplete authentication response.'
        )
      }

      const normalizedRole = String(role).toUpperCase()

      const authenticatedUser = {
        ...loggedInUser,
        role: normalizedRole
      }

      setUser(authenticatedUser)
      setRoleName(normalizedRole)
      setToken(newToken)
      setIsAuthLoading(false)

      localStorage.setItem(TOKEN_KEY, newToken)
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(authenticatedUser)
      )
      localStorage.setItem(ROLE_KEY, normalizedRole)

      localStorage.setItem(
        AUTH_EVENT_KEY,
        JSON.stringify({
          type: 'LOGIN',
          timestamp: Date.now()
        })
      )
    },
    []
  )

  const logout = useCallback(async () => {
    const currentToken =
      token || localStorage.getItem(TOKEN_KEY)

    await logoutFromBackend(currentToken)

clearAuthenticationState()

window.location.replace('/login')

    localStorage.setItem(
      AUTH_EVENT_KEY,
      JSON.stringify({
        type: 'LOGOUT',
        timestamp: Date.now()
      })
    )
  }, [clearAuthenticationState, token])

  const isAuthenticated =
    Boolean(token) && Boolean(user) && Boolean(roleName)

  const value = useMemo(
    () => ({
      user,
      roleName,
      token,
      isAuthenticated,
      isAuthLoading,
      login,
      logout,
      refreshAuthentication: restoreAuthentication
    }),
    [
      user,
      roleName,
      token,
      isAuthenticated,
      isAuthLoading,
      login,
      logout,
      restoreAuthentication
    ]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider.'
    )
  }

  return context
}