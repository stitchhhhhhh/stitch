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


export async function getManagerProposals() {
  const res = await fetch(
    "/api/proposals",
    {
      headers: authHeaders(),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
        "Failed to load manager proposals"
    );
  }

  return Array.isArray(result)
    ? result
    : result.proposals ??
        result.data ??
        [];
}

export async function createManagerProposal(
  data
) {
  const res = await fetch(
    "/api/proposals",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
        "Failed to create proposal"
    );
  }

  return result;
}

export async function updateManagerProposal(
  proposalId,
  data
) {
  const res = await fetch(
    `/api/proposals/${proposalId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
        "Failed to update proposal"
    );
  }

  return result;
}



export async function getManagerNotifications() {
  const res = await fetch("/api/notifications", {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to load notifications");
  }

  return res.json();
}

export async function markManagerNotificationRead(id) {
  const res = await fetch(
    `/api/notifications/${id}/read`,
    {
      method: "PUT",
      headers: authHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return res.json();
}

export async function markAllManagerNotificationsRead() {
  const res = await fetch(
    "/api/notifications/read-all",
    {
      method: "PUT",
      headers: authHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to mark all notifications as read"
    );
  }

  return res.json();
}

export async function getCurrentManagerProfile() {
  const res = await fetch("/api/users/me", {
    headers: authHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
        "Failed to load manager profile"
    );
  }

  return result;
}

export async function updateManagerProfile(data) {
  const res = await fetch("/api/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      full_name: data.full_name,
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
        "Failed to update manager profile"
    );
  }

  return result;
}

export async function updateManagerNotifications(data) {
  const res = await fetch(
    "/api/users/me/notifications",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        notify_course: data.notify_course,
        notify_deadline: data.notify_deadline,
        notify_certificate:
          data.notify_certificate,
      }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
        "Failed to update notification preferences"
    );
  }

  return result;
}

export async function uploadManagerPhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await fetch("/api/users/me/photo", {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
        "Failed to upload manager photo"
    );
  }

  return result;
}

export async function getDepartmentEnrollments(
  departmentId,
  { page = 1, limit = 100 } = {}
) {
  if (!departmentId) {
    throw new Error("Department ID is required");
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await fetch(
    `/api/enrollments/department/${departmentId}?${params}`,
    {
      headers: authHeaders(),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
        "Failed to load department enrollments"
    );
  }

  return {
    data: Array.isArray(result)
      ? result
      : result.data ?? [],
    pagination: result.pagination ?? null,
  };
}