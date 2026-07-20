function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAllCourses() {
  const res = await fetch('/api/courses?limit=100', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data kursus');
  const data = await res.json();
  return data.data ?? data;
}

export async function getCourseDetail(courseId) {
  const res = await fetch(`/api/courses/${courseId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil detail kursus');
  return res.json();
}

export async function reviewCourse(courseId, status) {
  const res = await fetch(`/api/courses/${courseId}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal review kursus');
  }
  return res.json();
}

export async function getTrainers() {
  const res = await fetch('/api/users/trainers', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data trainer');
  return res.json();
}

export async function requestCourseFromTrainer({ program_id, trainer_id }) {
  const res = await fetch('/api/course-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ program_id, trainer_id }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal mengirim request ke trainer');
  }
  return res.json();
}

export async function getCompanyAnalytics() {
  const res = await fetch('/api/analytics/company', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data analytics');
  return res.json();
}

export async function getDepartments() {
  const res = await fetch('/api/departments', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data departemen');
  return res.json();
}

export async function getDepartmentAnalytics(deptId) {
  const res = await fetch(`/api/analytics/department/${deptId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data analytics departemen');
  return res.json();
}

export async function getRecentAssessmentResults() {
  const res = await fetch('/api/assessment-results/recent', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil hasil assessment terbaru');
  return res.json();
}

export async function getRecentCertificates() {
  const res = await fetch('/api/certificates/recent', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil sertifikat terbaru');
  return res.json();
}
