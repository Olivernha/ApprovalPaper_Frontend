import { defineStore } from 'pinia'
import type { ApiDocumentType, DocumentType } from '@/types/documentTypes'
export const useDocumentTypeStore = defineStore('documentTypeStore', {
  state: () => ({
    documentTypes: [] as DocumentType[],
    departmentId: '6833f6aa54080b8ffb83f778',
  }),
  actions: {
    async fetchDocumentTypes() {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/department/${this.departmentId}/document-types`,
      )
      if (!response.ok) {
        throw new Error('Failed to fetch document types')
      }
      const data = await response.json()
      this.documentTypes = (data || []).map((type: ApiDocumentType) => ({
        id: type._id,
        name: type.name,
        prefix: type.prefix,
        padding: type.padding,
        created_date: type.created_date,
      }))
    },
  },
})
