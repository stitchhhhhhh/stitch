import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roleName, setRoleName] = useState(null);
  const [token, setToken] = useState(null);

  // Check saved session on mount and listen for storage changes across tabs
  useEffect(() => {
    function syncAuthFromStorage() {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('role');

      if (savedToken && savedUser && savedRole) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setRoleName(savedRole);
        } catch {
          logout();
        }
      } else {
        setToken(null);
        setUser(null);
        setRoleName(null);
      }
    }

    syncAuthFromStorage();

    function handleStorageChange(event) {
      if (['token', 'user', 'role'].includes(event.key)) {
        syncAuthFromStorage();
      }
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  function login({ user: loggedInUser, role, token: newToken }) {
    setUser(loggedInUser);
    setRoleName(role);
    setToken(newToken);

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('role', role);
  }

  function logout() {
    setUser(null);
    setRoleName(null);
    setToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{ user, roleName, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}