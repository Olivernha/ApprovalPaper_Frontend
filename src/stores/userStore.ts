import axios from 'axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    username: '',
    userData: null as { full_name: string; isAdmin: boolean } | null,
  }),
  actions: {
    setUsername(name: string) {
      this.username = name
    },

    async fetchUserData() {
      try {
        const bounceRes = await axios.get(`${import.meta.env.VITE_BACKEND_API_USERNAME_URL}`, {
          withCredentials: true,
        })

        const username = bounceRes.data.substring(8)
        this.setUsername(username)

        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_GET_USERS_URL}/${username}`)
        this.userData = { full_name: userRes.data.name, isAdmin: false }

        const adminRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/users/admin/${username}`,
        )

        this.userData.isAdmin = adminRes.data
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    },
    // fetchUserData() {
    //   //MOCKED DATA
    //   this.setUsername('alvinloh')
    //   this.userData = { full_name: 'Mocked User', isAdmin: true }
    // },
  },
})
