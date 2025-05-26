export interface Document {
  ref_no: string
  full_ref: string
  title: string
  created_by: string
  created_date: string
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
export type ApiDocumentType = {
  _id: string
  name: string
  prefix: string
  padding: number
  created_date: string
}
export type DocumentType = {
  id: string
  name: string
  prefix: string
  padding: number
  created_date: string
}
