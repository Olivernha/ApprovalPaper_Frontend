import api from '@/lib/axios'
import type { ApiDocument, DocumentState, UpdateDocument, Document } from '@/types/documentTypes'
import { defineStore } from 'pinia'
export const useDocumentStore = defineStore('documentStore', {
  state: (): DocumentState => ({
    documents: [],
    searchQuery: '',
    selectedDocumentType: '',
    statusFilter: '',
    departmentId: import.meta.env.VITE_DEPARTMENT_ID || '', // Verify this ID
    rowsPerPage: 10,
    currentPage: 1,
    sortField: 'created_date',
    sortDirection: 'desc',
    totalDocuments: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    isLoading: false,
    selectedItems: [] as string[],
    countStatus: {},
  }),
  getters: {
    paginationText: (state) => {
      const totalPages = Math.ceil(state.totalDocuments / state.rowsPerPage)
      return `Page ${state.currentPage} of ${totalPages} — Total ${state.totalDocuments} records`
    },
    isAllSelected: (state: { documents: Document[]; selectedItems: string[] }) => {
      return (
        state.documents.length > 0 &&
        state.documents.every((doc: Document) =>
          state.selectedItems.includes(doc.id?.toString() || ''),
        )
      )
    },

    isIndeterminate: (state) => {
      return state.selectedItems.length > 0 && state.selectedItems.length < state.documents.length
    },

    selectedCount: (state) => state.selectedItems.length,

    // all documents count by status
    getUnfiledDocumentsCount: (state) => {
      return state.countStatus['Not Filed'] || 0
    },
    getFiledDocumentsCount: (state) => {
      return state.countStatus['Filed'] || 0
    },
    getSuspendedDocumentsCount: (state) => {
      return state.countStatus['Suspended'] || 0
    },
  },
  actions: {
    async fetchDocuments() {
      this.isLoading = true
      try {
        const fieldMap: { [key: string]: string } = {
          ref_no: 'ref_no',
          full_ref: 'full_ref',
          title: 'title',
          created_by: 'created_by',
          created_date: 'created_date',
          status: 'status',
        }
        const apiSortField = fieldMap[this.sortField] || this.sortField
        const sortOrder = this.sortDirection === 'asc' ? 1 : -1

        const params = new URLSearchParams({
          page: this.currentPage.toString(),
          limit: this.rowsPerPage.toString(),
          ...(this.searchQuery && { search: this.searchQuery }),
          ...(this.statusFilter && { status: this.statusFilter }),
          ...(this.departmentId && { department_id: this.departmentId }),
          ...(this.selectedDocumentType && { document_type_id: this.selectedDocumentType }),
          sort_field: apiSortField,
          sort_order: sortOrder.toString(),
        })

        const response = await api.get(`http://127.0.0.1:8000/api/v1/document/paginated`, {
          params,
        })

        if (response.status !== 200) {
          console.error('Failed to fetch document  ', response.statusText)
          throw new Error('Failed to fetch document')
        }
        const data = await response.data
        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid JSON response')
        }
        this.documents = (data.documents || []).map((doc: ApiDocument) => ({
          ref_no: doc.ref_no.split('/').pop() || '',
          full_ref: doc.ref_no.substring(0, doc.ref_no.lastIndexOf('/')) || '',
          title: doc.title,
          created_by: doc.created_by,
          created_date: doc.created_date,
          status: doc.status,
          document_type_id: doc.document_type_id,
          department_id: doc.department_id,
          id: doc._id,
          file_id: doc.file_id || '',
          filed_by: doc.filed_by || '',
          filed_date: doc.filed_date || '',
        }))
        this.totalDocuments = data.total || 0
        this.totalPages = data.pages || 1
        this.currentPage = data.page || 1
        this.rowsPerPage = data.limit || 10
        this.hasNext = data.has_next || false
        this.hasPrev = data.has_prev || false
        this.isLoading = false
      } catch (error) {
        console.error('Error fetching documents:', error)
        this.documents = []
        this.totalDocuments = 0
        this.totalPages = 1
        this.hasNext = false
        this.hasPrev = false
      } finally {
        await this.fetchDocCount()
        this.isLoading = false
      }
    },
    sortBy(field: string) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDirection = 'asc'
      }
    },
    nextPage() {
      if (this.hasNext) {
        this.currentPage++
      }
    },
    previousPage() {
      if (this.hasPrev) {
        this.currentPage--
      }
    },

    async addDocument(newDoc: { document_type_id: string; title: string; department_id?: string }) {
      try {
        this.isLoading = true
        const response = await api.post('http://127.0.0.1:8000/api/v1/document/', {
          document_type_id: newDoc.document_type_id,
          title: newDoc.title,
          ...(newDoc.department_id && { department_id: newDoc.department_id }),
        })

        if (response.status !== 201) {
          throw new Error(`Failed to add document: ${response.statusText}`)
        }

        // Refetch documents to update the list
        await this.fetchDocuments()

        this.isLoading = false
      } catch (error) {
        console.error('Error adding document:', error)
        throw error
      }
    },

    async updateDocument(updateData: UpdateDocument) {
      console.log('Updating document with data:', updateData)
      this.isLoading = true
      try {
        const formData = new FormData()
        for (const [key, value] of Object.entries(updateData)) {
          if (value && key === 'status') {
            formData.append('doc_status', value)
          } else if (value instanceof File) {
            formData.append('file', value)
          } else if (value && key !== 'file') {
            formData.append(key, String(value))
          }
        }

        const response = await api.put(
          `http://127.0.0.1:8000/api/v1/document/${updateData.id}`,
          formData,
        )
        if (response.status !== 200) {
          console.error('Failed to update document: ', response.statusText)
          throw new Error('Failed to update document')
        }

        await this.fetchDocuments()
      } catch (err) {
        console.error('Error updating document:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async downloadAttachment(documentId: string) {
      try {
        const response = await api.get(
          `http://127.0.0.1:8000/api/v1/document/download/${documentId}`,
          {
            responseType: 'blob',
          },
        )

        const blob = new Blob([response.data], { type: response.data.type })
        const downloadUrl = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = downloadUrl

        // Try extracting the filename from response headers if available
        const contentDisposition = response.headers['content-disposition']
        let filename = 'downloaded_file'
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/)
          if (match?.[1]) {
            filename = match[1]
          }
        }

        link.download = filename
        link.click()
        window.URL.revokeObjectURL(downloadUrl)
      } catch (error) {
        console.error('Error downloading file:', error)
      }
    },

    async deleteDocument(documentId: string) {
      this.isLoading = true
      try {
        const response = await api.delete(`http://127.0.0.1:8000/api/v1/document/${documentId}`)
        if (response.status !== 200) {
          console.error('Failed to delete document: ', response.statusText)
          throw new Error('Failed to delete document')
        }
        await this.fetchDocuments()
      } catch (error) {
        console.error('Error deleting document:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    toggleSelect(documentId: string) {
      const index = this.selectedItems.indexOf(documentId)
      if (index > -1) {
        this.selectedItems.splice(index, 1)
      } else {
        this.selectedItems.push(documentId)
      }
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedItems = []
      } else {
        this.selectedItems = this.documents.map((doc) => doc.id || '')
      }
    },

    clearSelection() {
      this.selectedItems = []
    },

    isSelected(documentId: string) {
      return this.selectedItems.includes(documentId)
    },

    async applyBulkAction(action: string) {
      this.isLoading = true
      let url = ''
      let payload: { status?: string; document_ids?: string[] } = {}
      if (action !== 'Delete') {
        url = 'http://127.0.0.1:8000/api/v1/document/bulk-update-status'
        payload = {
          status: action,
          document_ids: [...this.selectedItems],
        }
      } else {
        url = 'http://127.0.0.1:8000/api/v1/document/bulk-delete'
        payload = {
          document_ids: [...this.selectedItems],
        }
      }
      {
        // "document_ids": [
        //   "66488b368a6801e71d70dfe9",
        //   "66488b368a6801e71d70dfea"
        // ],
        // "status": "Filed"
      }
      console.log('Applying bulk action:', action, 'on documents:', this.selectedItems)
      try {
        const response = await api.post(url, payload)
        if (response.status !== 200) {
          console.error('Failed to apply bulk action: ', response.statusText)
          throw new Error('Failed to apply bulk action')
        }
        await this.fetchDocuments()
      } catch (error) {
        console.error('Error applying bulk action:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchDocCount() {
      try {
        const response = await api.get(
          `http://127.0.0.1:8000/api/v1/document/count_status/${this.departmentId}`,
        )
        if (response.status !== 200) {
          console.error('Failed to fetch document count: ', response.statusText)
          throw new Error('Failed to fetch document count')
        }
        const data = await response.data
        console.log(data)
        this.countStatus = data
      } catch (error) {
        console.error('Error fetching document count:', error)
        throw error
      }
    },
  },
})
