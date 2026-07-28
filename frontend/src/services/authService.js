/**
 * Authentication service for email/password and Google OAuth.
 */

async function parseResponse(response) {
  const contentType =
    response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    const text = await response.text()

    console.error(
      'Server returned a non-JSON response:',
      text
    )

    throw new Error(
      'The server returned an invalid response. Check the API or Nginx configuration.'
    )
  }

  return response.json()
}

export async function loginWithEmail(
  email,
  password
) {
  const response = await fetch(
    '/api/auth/login',
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type':
          'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  )

  const data =
    await parseResponse(response)

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Failed to sign in.'
    )
  }

  return data
}

export function loginWithGoogle() {
  window.location.assign(
    '/api/auth/google'
  )
}

export async function fetchUserFromToken(
  token
) {
  if (!token) {
    throw new Error(
      'Authentication token is missing.'
    )
  }

  const response = await fetch(
    '/api/auth/me',
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization:
          `Bearer ${token}`
      },
      cache: 'no-store'
    }
  )

  const data =
    await parseResponse(response)

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Authentication session is invalid.'
    )
  }

  return data
}

export async function logoutFromBackend(
  token
) {
  try {
    const response = await fetch(
      '/api/auth/logout',
      {
        method: 'POST',
        credentials: 'include',
        headers: token
          ? {
              Authorization:
                `Bearer ${token}`
            }
          : {}
      }
    )

    const data =
      await parseResponse(response)

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Failed to log out.'
      )
    }

    return data
  } catch (error) {
    console.error(
      'Backend logout request failed:',
      error
    )

    return {
      message:
        'Local logout completed.'
    }
  }
}
