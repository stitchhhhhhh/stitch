function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getTrainerCourses() {
  const res = await fetch('/api/courses/trainer/me', {
    cache: 'no-store',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to retrieve trainer courses');
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getTrainerCourseRequests(trainerId) {
  const res = await fetch(`/api/course-requests/trainer/${trainerId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data permintaan kursus');
  return res.json();
}

export async function updateCourseRequestStatus(requestId, status) {
  const res = await fetch(`/api/course-requests/${requestId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Gagal update status permintaan');
  return res.json();
}

export async function getPrograms() {
  const res = await fetch('/api/programs', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data program');
  return res.json();
}

export async function createCourse({ program_id, course_title, description, deadline }) {
  const res = await fetch('/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ program_id, course_title, description, deadline }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal membuat kursus');
  }
  return res.json();
}

export async function submitCourseForReview(courseId) {
  const res = await fetch(`/api/courses/${courseId}/submit`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal submit kursus');
  return res.json();
}

export async function uploadMaterial({ course_id, material_title, material_type, file }) {
  const formData = new FormData();
  formData.append('course_id', course_id);
  formData.append('material_title', material_title);
  formData.append('material_type', material_type);
  formData.append('file', file);

  const res = await fetch('/api/materials/upload', {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal upload materi');
  }
  return res.json();
}

export async function getCourseMaterials(courseId) {
  const res = await fetch(`/api/materials/course/${courseId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil materi kursus');
  return res.json();
}

export async function deleteMaterial(materialId) {
  const res = await fetch(`/api/materials/${materialId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menghapus materi');
  return res.json();
}

export async function createProgram({ program_name, description }) {
  const res = await fetch('/api/programs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({
      program_name,
      description,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal membuat program');
  }

  return res.json();
}

export async function getProposals() {
  const res = await fetch('/api/proposals', {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil proposal');
  }

  return res.json();
}

export async function createProposal({
  proposal_title,
  description,
}) {
  const res = await fetch('/api/proposals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({
      proposal_title,
      description,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal membuat proposal');
  }

  return res.json();
}

export async function reviewProposal(id, status) {
  const res = await fetch(`/api/proposals/${id}/review`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal review proposal');
  }

  return res.json();
}

export async function getNotifications() {
  const res = await fetch('/api/notifications', {
    cache: 'no-store',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Gagal mengambil notifikasi');
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function markNotificationAsRead(notificationId) {
  const res = await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Gagal menandai notifikasi');
  }

  return res.json();
}

export async function markAllNotificationsAsRead() {
  const res = await fetch('/api/notifications/read-all', {
    method: 'PUT',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Gagal menandai semua notifikasi'
    );
  }

  return res.json();
}

export async function getCurrentTrainerProfile() {
  const res = await fetch('/api/users/me', {
    cache: 'no-store',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    throw new Error(
      error.message || 'Gagal mengambil profil trainer'
    );
  }

  return res.json();
}

export async function updateTrainerProfile(fullName) {
  const res = await fetch('/api/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({
      full_name: fullName,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    throw new Error(
      error.message || 'Gagal memperbarui profil trainer'
    );
  }

  return res.json();
}

export async function updateTrainerNotifications({
  notify_course,
  notify_deadline,
  notify_certificate,
}) {
  const res = await fetch('/api/users/me/notifications', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({
      notify_course,
      notify_deadline,
      notify_certificate,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    throw new Error(
      error.message ||
        'Gagal memperbarui preferensi notifikasi'
    );
  }

  return res.json();
}

export async function uploadTrainerPhoto(file) {
  if (!(file instanceof File)) {
    throw new Error('File foto tidak valid');
  }

  const formData = new FormData();
  formData.append('photo', file);

  const res = await fetch('/api/users/me/photo', {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    throw new Error(
      error.message || 'Gagal mengunggah foto trainer'
    );
  }

  return res.json();
}
