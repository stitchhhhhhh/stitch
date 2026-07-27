function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}, fallbackMessage = "Request failed.") {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || fallbackMessage);
  }

  return response.json();
}

export function getHROverview() {
  return request("/api/hr/overview", {}, "Failed to load HR overview data.");
}

export async function getAllCourses() {
  const data = await request("/api/courses?limit=100", {}, "Failed to load courses.");
  return data.data ?? data;
}

export function getCourseDetail(courseId) {
  return request(`/api/courses/${courseId}`, {}, "Failed to load course details.");
}

export function reviewCourse(courseId, status, reviewNote = "") {
  return request(
    `/api/courses/${courseId}/approve`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, review_note: reviewNote }),
    },
    "Failed to review the course."
  );
}

export function getTrainers() {
  return request("/api/users/trainers", {}, "Failed to load trainers.");
}

export function requestCourseFromTrainer({ program_id, trainer_id }) {
  return request(
    "/api/course-requests",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program_id, trainer_id }),
    },
    "Failed to send the trainer request."
  );
}

export function getCompanyAnalytics() {
  return request("/api/analytics/company", {}, "Failed to load company analytics.");
}

export function getDepartments() {
  return request("/api/departments", {}, "Failed to load departments.");
}

export function getCurrentHRProfile() {
  return request("/api/users/me", {}, "Failed to load the HR profile.");
}

export function updateHRProfile(fullName) {
  return request(
    "/api/users/me",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName }),
    },
    "Failed to update the HR profile."
  );
}

export function updateHRNotifications(preferences) {
  return request(
    "/api/users/me/notifications",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    },
    "Failed to update notification preferences."
  );
}

export function getHRNotifications() {
  return request("/api/notifications", {}, "Failed to load notifications.");
}

export function markAllHRNotificationsRead() {
  return request("/api/notifications/read-all", { method: "PUT" }, "Failed to mark notifications as read.");
}

export function markHRNotificationRead(id) {
  return request(`/api/notifications/${id}/read`, { method: "PUT" }, "Failed to mark the notification as read.");
}

export function exportHRReport(format = "pdf") {
  const token = localStorage.getItem("token");
  return fetch(`/api/reports/export/${format}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(async (response) => {
    if (!response.ok) throw new Error("Failed to export the report.");
    return response.blob();
  });
}
