import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchUserFromToken } from '../../services/authService';

const DASHBOARD_PATH_BY_ROLE = {
  EMPLOYEE: '/employee',
  MANAGER: '/manager',
  HR: '/hr',
  TRAINER: '/trainer',
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      if (error === 'user_not_found') {
        setError('Akun Google kamu tidak terdaftar di sistem. Hubungi HR.');
      } else {
        setError('Login gagal. Coba lagi.');
      }
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (token) {
      fetchUserFromToken(token)
        .then((data) => {
          console.log('DATA FROM TOKEN:', data); // debug
          const role = data.role?.toUpperCase?.() ?? '';
          login({ user: data.user, role, token });
          navigate(DASHBOARD_PATH_BY_ROLE[role] ?? '/employee');
        })
        .catch(() => {
          setError('Gagal mengambil data user. Coba lagi.');
          setTimeout(() => navigate('/login'), 3000);
        });
    } else {
      navigate('/login');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{error}</p>
          <p className="text-gray-400 text-sm mt-2">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
      <p className="text-gray-500">Memproses login...</p>
    </div>
  );
}