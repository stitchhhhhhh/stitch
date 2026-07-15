import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Membungkus DashboardLayout. Kalau belum login, lempar balik ke /login.
// Begitu backend auth siap (cek token di localStorage/cookie, dsb),
// logic pengecekannya tinggal ditambah di sini — komponen lain tidak berubah.
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}