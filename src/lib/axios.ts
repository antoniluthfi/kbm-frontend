import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login')
    const isOnLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login'

    if (error.response?.status === 401 && !isLoginRequest && !isOnLoginPage) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
