/**
 * authService.js
 * Terintegrasi dengan backend Google OAuth (localhost:3000)
 */
import { users, roles } from '../mock/users';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// HANYA untuk development/testing
export async function loginWithRole(roleName) {
  await delay();
  const role = roles.find((r) => r.role_name === roleName);
  const user = users.find((u) => u.role_id === role?.role_id);
  if (!user) {
    throw new Error(`Tidak ada mock user untuk role "${roleName}"`);
  }
  return {
    user,
    role: roleName,
    token: 'mock-token-' + user.user_id,
  };
}

// Login dengan Google OAuth — redirect ke backend
export async function loginWithGoogle() {
  window.location.href = '/api/auth/google';
}

// Dipanggil di AuthCallback setelah redirect balik dari Google
export async function fetchUserFromToken(token) {
  const res = await fetch('http://localhost:3000/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Gagal mengambil data user');
  return res.json(); // { user, role }
}