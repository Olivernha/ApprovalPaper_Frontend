import api from '@/lib/axios'
import type { ApiDocument, DocumentState } from '@/types/documentTypes'
import { defineStore } from 'pinia'

export const useDocumentStore = defineStore('documentStore', {
  state: (): DocumentState => ({
    documents: [],
    searchQuery: '',
    selectedDocumentType: '',
    statusFilter: '',
    departmentId: '68341e8d1205c9c876f44c3a', // Verify this ID
    rowsPerPage: 10,
    currentPage: 1,
    sortField: 'created_date',
    sortDirection: 'desc',
    totalDocuments: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  }),
  getters: {
    paginationText: (state) => {
      const totalPages = Math.ceil(state.totalDocuments / state.rowsPerPage)
      return `Page ${state.currentPage} of ${totalPages} — Total ${state.totalDocuments} records`
    },
  },
  actions: {
    async fetchDocuments() {
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
          console.error('Failed to fetch document  ', response.statusText);
          throw new Error('Failed to fetch document');
        }
        console.log(response)
        const data = await response.data;
        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid JSON response')
        }
        console.log('Fetched documents:', data)
        this.documents = (data.documents || []).map((doc: ApiDocument) => ({
          ref_no: doc.ref_no.split('/').pop() || '',
          full_ref: doc.ref_no.substring(0, doc.ref_no.lastIndexOf('/')) || '',
          title: doc.title,
          created_by: doc.created_by,
          created_date: doc.created_date,
          status: doc.status,
        }))
        this.totalDocuments = data.total || 0
        this.totalPages = data.pages || 1
        this.currentPage = data.page || 1
        this.rowsPerPage = data.limit || 10
        this.hasNext = data.has_next || false
        this.hasPrev = data.has_prev || false
      } catch (error) {
        console.error('Error fetching documents:', error)
        this.documents = []
        this.totalDocuments = 0
        this.totalPages = 1
        this.hasNext = false
        this.hasPrev = false
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
  },
})
