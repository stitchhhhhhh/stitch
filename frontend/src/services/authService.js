/**
 * authService.js
 * Email/Password + Google OAuth
 */

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Server returned non-JSON response:", text);

    throw new Error(
      "Server mengembalikan HTML, bukan JSON. Periksa konfigurasi API atau Nginx."
    );
  }

  return response.json();
}

// ===============================
// Login Email + Password
// ===============================
export async function loginWithEmail(email, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Login gagal.");
  }

  return data;
}

// ===============================
// Google OAuth
// ===============================
export function loginWithGoogle() {
  window.location.href = "/api/auth/google";
}

// ===============================
// Ambil user dari token
// ===============================
export async function fetchUserFromToken(token) {
  const response = await fetch("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil user.");
  }

  return data;
}