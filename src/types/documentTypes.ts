export interface Document {
  refNo: string
  fullRef: string
  title: string
  createdBy: string
  date: string
  status: string
}

export interface DocumentState {
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
export type ApiDocument = {
  ref_no: string
  full_ref: string
  title: string
  created_by: string
  created_date: string
  status: string
}
