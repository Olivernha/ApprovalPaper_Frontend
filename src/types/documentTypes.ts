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
  isLoading: boolean
}
export type ApiDocument = {
  ref_no: string
  full_ref?: string
  title: string
  created_by: string
  created_date: string
  file?: File
  status?: string
  _id?: string
  document_type_id?: string
  department_id?: string
  file_id?: string
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
  department_id:string
  document_type_id: string;
  title: string;
}

export interface UpdateDocument {
  id: string;
  department_id: string;
  document_type_id: string;
  title: string;
  attachment : File
  status?: string;
}

