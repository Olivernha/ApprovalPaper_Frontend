import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    username: '',
  }),
  actions: {
    setUsername(name: string) {
      this.username = name
    },
    async checkIsAdmin(){
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/users/admin/${this.username}`);
        const data = await response.json();
        console.log('Admin status:', data);
        return data.isAdmin;
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    }
  },
})
