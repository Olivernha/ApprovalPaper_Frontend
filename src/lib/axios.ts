// src/lib/axios.ts
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_FRONTEND_API_URL,
  withCredentials: true,
})

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.username) {
      config.headers['X-User-Name'] = userStore.username
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
