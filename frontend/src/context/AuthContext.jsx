import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roleName, setRoleName] = useState(null);
  const [token, setToken] = useState(null);

  // Saat pertama kali load, cek apakah ada token tersimpan
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');

    if (savedToken && savedUser && savedRole) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setRoleName(savedRole);
    }
  }, []);

  // Dipanggil dari halaman Login setelah authService mengembalikan hasil.
  function login({ user: loggedInUser, role, token: newToken }) {
    setUser(loggedInUser);
    setRoleName(role);
    setToken(newToken);

    // Simpan ke localStorage supaya tidak hilang saat refresh
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

  const isAuthenticated = Boolean(user);

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