import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roleName, setRoleName] = useState(null);

  // Dipanggil dari halaman Login setelah authService mengembalikan hasil.
  // Menerima shape { user, role } — sama baik dari mock maupun nanti dari API asli.
  function login({ user: loggedInUser, role }) {
    setUser(loggedInUser);
    setRoleName(role);
  }

  function logout() {
    setUser(null);
    setRoleName(null);
  }

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{ user, roleName, isAuthenticated, login, logout }}
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