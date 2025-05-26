import { defineStore } from 'pinia'

// Define the frontend Document interface
interface Document {
  ref_no: string
  fullRef: string
  title: string
  createdBy: string
  date: string
  status: string
}

// Define the API response document interface (based on backend)
interface ApiDocument {
  ref_no: string
  title: string
  created_by: string
  created_date: string
  status: string
}

interface DocumentState {
  documents: Document[]
  searchQuery: string
  selectedDocumentType: string
  statusFilter: string
  departmentId: string
  rowsPerPage: number
  currentPage: number
  sortField: string
  sortDirection: 'asc' | 'desc'
  totalDocuments: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export const useDocumentStore = defineStore('documentStore', {
  state: (): DocumentState => ({
    documents: [],
    searchQuery: '',
    selectedDocumentType: '',
    statusFilter: '',
    departmentId: '6833f6aa54080b8ffb83f778', // Verify this ID
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
      console.log(
        'Calculating pagination text with state:',
        state.currentPage,
        state.rowsPerPage,
        state.totalDocuments,
      )
      const totalPages = Math.ceil(state.totalDocuments / state.rowsPerPage)
      const totalDocuments = state.totalDocuments
      return `Page ${state.currentPage}-${totalPages} of ${totalDocuments}`
    },
  },
  actions: {
    async fetchDocuments() {
      try {
        const fieldMap: { [key: string]: string } = {
          refNo: 'ref_no',
          fullRef: 'full_ref',
          title: 'title',
          created_by: 'created_by',
          date: 'created_date',
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

        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/document/paginated?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (!response.ok) {
          const text = await response.text()
          console.error('Response status:', response.status, 'Response text:', text)
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid JSON response')
        }
        console.log('Fetched documents:', data)
        this.documents = (data.documents || []).map((doc: ApiDocument) => ({
          ref_no: doc.ref_no.split('/').pop() || '',
          fullRef: doc.ref_no.substring(0, doc.ref_no.lastIndexOf('/')) || '',
          title: doc.title,
          created_by: doc.created_by,
          created_date: doc.created_date, // Ensure date format matches frontend (e.g., DD/MM/YYYY)
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
