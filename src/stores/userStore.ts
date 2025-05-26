import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    username: '',
  }),
  actions: {
    setUsername(name: string) {
      this.username = name
    },
  },
})
