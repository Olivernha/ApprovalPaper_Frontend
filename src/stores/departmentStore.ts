import api from '@/lib/axios.ts'
import { defineStore } from 'pinia'

interface DocumentType {
  name: string
  prefix: string
  created_date: string
  _id: string
}
interface Department {
  name: string
  created_date: string
  _id: string,
  document_types: DocumentType[]
}
export const useDepartmentStore = defineStore('departmentStore', {
  state: () => ({
    departments: [] as Department[],
    isLoading : false,
  }),

  actions: {
    async fetchDepartments() {
      try {
        this.isLoading = true
        const response = await api.get(import.meta.env.VITE_BACKEND_API_BASE_URL + '/department')
        if (response.status !== 200) {
          console.error('Failed to fetch departments: ', response.statusText)
          throw new Error('Failed to fetch departments')
        }
        const data = await response.data
        console.log(data)
        this.departments = data
      } catch (error) {
        console.error('Error fetching departments:', error)
        throw error
      }finally {
        this.isLoading = false
      }
    },
  },
})
