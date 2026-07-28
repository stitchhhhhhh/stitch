/**
 * authService.js
 * Terintegrasi dengan backend Google OAuth
 */


// Login dengan Google OAuth — redirect ke backend
export async function loginWithGoogle() {
  window.location.href = '/api/auth/google';
}

// Dipanggil di AuthCallback setelah redirect balik dari Google
export async function fetchUserFromToken(token) {
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');

  return res.json(); // { user, role }
}
