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
      method: "PATCH",
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
      method: "PATCH",
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