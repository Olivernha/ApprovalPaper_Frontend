export interface Document {
  ref_no: string
  full_ref: string
  title: string
  created_by: string
  created_date: string
  status: string
  id?: string
  document_type_id?: string
  department_id?: string
  file_path?: string
  file?: File
  attachment?: File
  filed_by?: string
  filed_date?: string
}

export interface DocumentState {
  exportDocuments: Document[]
  documents: Document[]
  searchQuery: string
  searchGlobalQuery: string
  selectedDocumentType: string
  statusFilter: string
  departmentId: string
  departmentName: string
  documentTypeName: string
  rowsPerPage: number
  currentPage: number
  sortField: string
  sortDirection: 'asc' | 'desc'
  totalDocuments: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  isLoading: boolean
  selectedItems: string[]
  countStatus: { [key: string]: number }
  recentlyAddedDocuments: Set<string>
  newDocumentColor: string
}
export type ApiDocument = {
  ref_no: string
  title: string
  created_by: string
  created_date: string
  file?: File
  status?: string
  _id?: string
  document_type_id?: string
  department_id?: string
  file_path?: string
  filed_by?: string
  filed_date?: string,
  department_name?: string
  document_type_name?: string
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
export interface NewDocument {
  department_id: string
  document_type_id: string
  title: string
  created_date?: string
}

export interface UpdateDocument {
  file_id: string
  created_by: string
  created_date: string
  id: string
  department_id: string
  document_type_id: string
  title: string
  file: File
  status?: string
  filed_by?: string
  filed_date?: string
  filed_path?: string
}
