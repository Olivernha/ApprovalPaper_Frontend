// stores/documentStore.ts
import { defineStore } from 'pinia'

export interface Document {
  _id: string;
  ref_no: string;
  title: string;
  status: 'Not Filed' | 'Filed' | 'Suspended';
  created_by: string;
  created_date: string;
  department_id: string;
  document_type_id: string;
  file_id: string | null;
  filed_by: string | null;
  filed_date: string | null;
}

export const useDocumentStore = defineStore('documentStore', {
  state: () => ({
    documents: [] as Document[],
  }),
  actions: {
    async fetchDocuments() {
      const res = await fetch('http://127.0.0.1:8000/api/v1/document/');
      this.documents = await res.json();
    }
  }
});
