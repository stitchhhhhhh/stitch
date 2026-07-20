function authHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function getDashboardSummary() {
  const res = await fetch(
    "/api/dashboard/summary",
    {
      headers: authHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed");
  }

  return await res.json();
}
