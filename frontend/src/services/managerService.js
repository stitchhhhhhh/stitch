function authHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function getManagerDashboard() {
  const res = await fetch("/api/dashboard/summary", {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to load manager dashboard");
  }

  return res.json();
}

export async function getManagerAnalytics(departmentId) {
  if (!departmentId) {
    throw new Error("Department ID is required");
  }

  const res = await fetch(
    `/api/analytics/department/${departmentId}`,
    {
      headers: authHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load department analytics");
  }

  return res.json();
}

export async function getRecentAssessmentResults() {
  const res = await fetch("/api/assessment-results/recent", {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to load recent assessment results");
  }

  return res.json();
}


export async function getPrograms() {
  const res = await fetch("/api/programs", {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to load programs");
  }

  return res.json();
}

export async function getCourses() {
  const res = await fetch("/api/courses?limit=100", {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to load courses");
  }

  const result = await res.json();

  return Array.isArray(result)
    ? result
    : result.data ?? [];
}
