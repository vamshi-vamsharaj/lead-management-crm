/**
 * src/services/api/axios.config.js
 *
 * Centralized Axios instance — the single HTTP client for the entire app.
 *
 * WHY ONE AXIOS INSTANCE?
 *   If every component creates its own axios call:
 *   - Base URL is duplicated in 20 files
 *   - Auth headers must be added everywhere
 *   - Error handling is inconsistent
 *   - Changing the base URL requires a project-wide find/replace
 *
 *   One instance = one place to configure EVERYTHING.
 *   Real companies (Stripe, Linear, Notion) all use this pattern.
 *
 * WHY INTERCEPTORS?
 *   Interceptors are middleware for HTTP requests/responses.
 *   Request interceptor:  runs BEFORE every request leaves the browser
 *   Response interceptor: runs AFTER every response arrives
 *
 *   This lets you:
 *   - Inject auth tokens without touching component code
 *   - Transform error shapes before components see them
 *   - Show global toast notifications for API errors
 *   - Log requests in development
 *   - Redirect to login on 401 — once, globally
 */

import axios from 'axios'
import toast from 'react-hot-toast'

// ── Create instance ────────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: '/api/v1',   // Vite proxies this to http://localhost:5000/api/v1
  timeout: 10000,       // 10s — fail fast rather than hang indefinitely
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Placeholder: inject auth token here when you add authentication
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`

    if (import.meta.env.DEV) {
      console.log(`→ ${config.method?.toUpperCase()} ${config.url}`, config.data || '')
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(

  // ✅ Success handler (2xx responses)
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`← ${response.status} ${response.config.url}`, response.data)
    }
    // Unwrap the data envelope so callers get response.data.data directly
    return response
  },

  // ❌ Error handler (non-2xx responses + network errors)
  (error) => {
    const { response, request, message } = error

    if (response) {
      // The server responded with a non-2xx status
      const serverMessage = response.data?.message || 'Something went wrong'
      const fieldErrors   = response.data?.errors || []

      switch (response.status) {
        case 400:
          // Show the first field error if available, otherwise the message
          if (fieldErrors.length > 0) {
            toast.error(`${fieldErrors[0].field}: ${fieldErrors[0].message}`)
          } else {
            toast.error(serverMessage)
          }
          break

        case 404:
          toast.error(serverMessage)
          break

        case 409:
          toast.error(serverMessage)
          break

        case 500:
          toast.error('Server error. Please try again shortly.')
          break

        default:
          toast.error(serverMessage)
      }

    } else if (request) {
      // Request was made but no response received (network down, CORS, timeout)
      toast.error('Cannot reach the server. Check your connection.')
    } else {
      // Something went wrong setting up the request
      toast.error(`Request error: ${message}`)
    }

    // Re-reject so React Query's onError handlers still fire
    return Promise.reject(error)
  }
)

export default apiClient