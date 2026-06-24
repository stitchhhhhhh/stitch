/**
 * authService.js
 *
 * SEKARANG: simulasi login — tidak ada network call asli, cuma pilih
 * mock user berdasarkan role yang dipilih di dropdown "Login as" (testing only).
 *
 * NANTI (begitu tim backend kasih kontrak API):
 *   export async function loginWithSso() {
 *     const res = await api.post('/auth/sso-callback');
 *     return res.data; // { user, role, token }
 *   }
 *
 * Bentuk return value SENGAJA dibuat mirip kemungkinan response asli:
 * { user, role, token } — supaya saat nanti diganti axios call,
 * komponen yang sudah memakai loginWithRole()/loginWithSso() TIDAK perlu diubah,
 * cukup isi function ini saja yang diganti.
 */

import { users, roles } from '../mock/users';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Dipakai dropdown "Login as" — HANYA untuk development/testing,
// hapus pemanggilan ini begitu backend auth sudah siap.
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
    token: 'mock-token-' + user.user_id, // placeholder, nanti dari JWT asli BE
  };
}

// Placeholder untuk nanti — dipanggil saat tombol "Login with Company SSO" diklik.
export async function loginWithSso() {
  await delay();
  // TODO: ganti dengan redirect ke SSO provider / axios.post('/auth/sso-callback')
  throw new Error('SSO belum terhubung ke backend. Gunakan dropdown "Login as" untuk testing.');
}