import { defineStore } from 'pinia'
import api from '@/lib/axios'
import type { ApiDocumentType, DocumentType } from '@/types/documentTypes'
export const useDocumentTypeStore = defineStore('documentTypeStore', {
  state: () => ({
    documentTypes: [] as DocumentType[],
    departmentId: '68341e8d1205c9c876f44c3a',
    isLoading: false
  }),
  actions: {
    async fetchDocumentTypes() {
      try {
        this.isLoading = true; // Set loading state
        const response = await api.get(
          `http://127.0.0.1:8000/api/v1/department/${this.departmentId}/document-types`,
        )
        if (response.status !== 200) {
          console.error('Failed to fetch document types: ', response.statusText);
          throw new Error('Failed to fetch document types');
        }
        const data = await response.data;
        this.documentTypes = (data || []).map((type: ApiDocumentType) => ({
          id: type._id,
          name: type.name,
          prefix: type.prefix,
          padding: type.padding,
          created_date: type.created_date,
        }))
        this.isLoading = false; // Reset loading state
      } catch (error) {
        console.error('Error fetching document types:', error);
        throw error;
      }
    },
  },
})
