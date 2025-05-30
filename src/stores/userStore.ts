
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    username: '',
    isAdmin: false,
  }),
  actions: {
    setUsername(name: string) {
      this.username = name
    },
    async checkIsAdmin() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/users/admin/${this.username}`)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.isAdmin = data // Assuming the API returns an object with isAdmin property
        return data.isAdmin
      } catch (error) {
        console.error('Error checking admin status:', error)
        return false
      }
    },
  },
})
