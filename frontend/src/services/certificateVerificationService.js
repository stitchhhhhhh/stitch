const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  '/api'

export async function verifyCertificate(
  certificateNumber
) {
  const response = await fetch(
    `${API_BASE_URL}/certificates/verify/${encodeURIComponent(
      certificateNumber
    )}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Certificate verification failed'
    )
  }

  return data
}
