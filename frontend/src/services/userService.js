/**
 * userService.js
 * Terhubung ke backend asli untuk certificates, leaderboard, notifications.
 */

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET /api/certificates/user/:userId
export async function getCertificates(userId) {
  const res = await fetch(`/api/certificates/user/${userId}`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data sertifikat');
  const data = await res.json();

  // Terjemahkan bentuk API (course: {...}) ke bentuk lama yang dipakai komponen
  return data.map((cert) => ({
    certificate_id: cert.id,
    user_id: cert.user_id,
    course_id: cert.course_id,
    certificate_title: cert.course?.course_title ?? 'Sertifikat',
    certificate_number: cert.certificate_number,
    file_url: cert.file_url,
    issue_date: cert.issue_date,
  }));
}

// POST /api/certificates/generate — generate sertifikat baru (dipanggil setelah course 100% selesai)
export async function generateCertificate(courseId) {
  const res = await fetch('/api/certificates/generate', {
    cache: "no-store",
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ course_id: courseId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal generate sertifikat');
  }
  return res.json();
}

// GET /api/leaderboard
export async function getLeaderboard() {
  const res = await fetch('/api/leaderboard', {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data leaderboard');
  const data = await res.json();

  return data.map((u) => ({
    user_id: u.id,
    full_name: u.full_name,
    email: u.email,
    department_name: u.department?.name ?? '',
    role_name: u.role?.name ?? '',
    total_points: u.total_points,
  }));
}

// GET /api/notifications
export async function getNotifications() {
  const res = await fetch("/api/notifications", {
    cache: "no-store",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil notifikasi");
  }

  const data = await res.json();

  const notifications = Array.isArray(data)
    ? data
    : [];

  return notifications.map((n) => ({
    notification_id: n.id,
    user_id: n.user_id,
    title: n.title,
    message: n.message,
    type:
      n.type ??
      n.notification_type ??
      "general",
    is_read: n.is_read,
    created_date: n.created_date,
  }));
}

// PUT /api/notifications/:id/read
export async function markNotificationRead(notificationId) {
  const res = await fetch(`/api/notifications/${notificationId}/read`, {
    cache: "no-store",
    method: 'PUT',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menandai notifikasi');
  return res.json();
}

// PUT /api/notifications/read-all
export async function markAllNotificationsRead() {
  const res = await fetch('/api/notifications/read-all', {
    cache: "no-store",
    method: 'PUT',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menandai semua notifikasi');
  return res.json();
}

// GET /api/users/me
export async function getMyProfile() {
  const res = await fetch('/api/users/me', {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil profil');
  return res.json();
}

// PUT /api/users/me
export async function updateMyProfile(fullName) {
  const res = await fetch('/api/users/me', {
    cache: "no-store",
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ full_name: fullName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal menyimpan profil');
  }
  return res.json();
}

// POST /api/users/me/photo
export async function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);

  const res = await fetch('/api/users/me/photo', {
    cache: "no-store",
    method: 'POST',
    headers: authHeaders(), // jangan set Content-Type manual, biarkan browser set boundary
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal upload foto');
  }
  return res.json();
}

// PUT /api/users/me/notifications
export async function updateNotificationPreferences(preferences) {
  const res = await fetch('/api/users/me/notifications', {
    cache: "no-store",
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(preferences),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal menyimpan preferensi notifikasi');
  }
  return res.json();
}

