<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useDocumentStore } from '@/stores/documentStore' // Add this import

defineProps<{
  showExportModal: boolean
}>()
const emit = defineEmits(['close'])

// Add store reference
const documentStore = useDocumentStore()

const exportOptions = reactive({
  includeHeaders: true,
  selectedOnly: false,
  includeTimestamp: true,
})
const exportFormat = ref('csv')

function convertToCSV(data: any[], includeHeaders = true) {
  const headers = [
    'RefNo',
    'Full Reference',
    'Title',
    'Filed By',
    'Filed Date',
    'Created By',
    'Date',
    'Status',
  ]

  let csv = ''

  if (includeHeaders) {
    csv += headers.join(',') + '\n'
  }

  data.forEach((row) => {
    const values = [
      row.ref_no || row.refNo || '',
      row.full_ref || row.fullRef || '',
      `"${row.title || ''}"`,
      `"${row.filed_by || row.filedBy || ''}"`,
      row.filed_date || row.filedDate || '',
      `"${row.created_by || row.createdBy || ''}"`,
      row.created_date || row.date || '',
      row.status || '',
    ]
    csv += values.join(',') + '\n'
  })

  return csv
}

function convertToJSON(data: any[], includeTimestamp = true) {
  const exportData = {
    ...(includeTimestamp && { exportedAt: new Date().toISOString() }),
    totalRecords: data.length,
    documents: data,
  }

  return JSON.stringify(exportData, null, 2)
}

function generatePDFContent(data: any[]) {
  let html = `
    <html>
      <head>
        <title>TPG Documents Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #697b9d; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f9fafb; }
          .status-not-filed { color: #a41f36; }
          .status-filed { color: #14ba6d; }
          .status-suspended { color: #667085; }
        </style>
      </head>
      <body>
        <h1>TPG Approval Registration System - Documents Export</h1>
        <p>Export Date: ${new Date().toLocaleDateString()}</p>
        <p>Total Documents: ${data.length}</p>

        <table>
          <thead>
            <tr>
              <th>RefNo</th>
              <th>Full Reference</th>
              <th>Title</th>
              <th>Filed By</th>
              <th>Filed Date</th>
              <th>Created By</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
  `

  data.forEach((doc) => {
    const refNo = doc.ref_no || doc.refNo || ''
    const fullRef = doc.full_ref || doc.fullRef || ''
    const title = doc.title || ''
    const filedBy = doc.filed_by || doc.filedBy || ''
    const filedDate = doc.filed_date || doc.filedDate || ''
    const createdBy = doc.created_by || doc.createdBy || ''
    const date = doc.created_date || doc.date || ''
    const status = doc.status || ''

    html += `
      <tr>
        <td>${refNo}</td>
        <td>${fullRef}</td>
        <td>${title}</td>
        <td>${filedBy}</td>
        <td>${filedDate}</td>
        <td>${createdBy}</td>
        <td>${date}</td>
        <td class="status-${status.toLowerCase().replace(' ', '-')}">${status}</td>
      </tr>
    `
  })

  html += `
          </tbody>
        </table>
      </body>
    </html>
  `

  return html
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function handleExport() {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')

  // Get data from store instead of undefined 'documents' variable
  const dataToExport = exportOptions.selectedOnly
    ? documentStore.documents.filter((doc) => documentStore.isSelected(doc.id))
    : documentStore.documents

  if (dataToExport.length === 0) {
    alert('No documents to export!')
    return
  }

  let filename: string, content: string, mimeType: string

  switch (exportFormat.value) {
    case 'csv':
      filename = `tpg-documents-${timestamp}.csv`
      content = convertToCSV(dataToExport, exportOptions.includeHeaders)
      mimeType = 'text/csv'
      break

    case 'excel':
      filename = `tpg-documents-${timestamp}.csv` // Changed to .csv since we're not creating real Excel
      content = convertToCSV(dataToExport, exportOptions.includeHeaders)
      mimeType = 'text/csv' // Changed to proper CSV MIME type
      break

    case 'json':
      filename = `tpg-documents-${timestamp}.json`
      content = convertToJSON(dataToExport, exportOptions.includeTimestamp)
      mimeType = 'application/json'
      break

    case 'pdf':
      filename = `tpg-documents-${timestamp}.html`
      content = generatePDFContent(dataToExport)
      mimeType = 'text/html'
      break

    default:
      console.error('Unsupported export format')
      return
  }

  downloadFile(content, filename, mimeType)

  alert(
    `${dataToExport.length} documents exported successfully as ${exportFormat.value.toUpperCase()}!`,
  )

  emit('close')
}
</script>

<template>
  <div
    v-if="showExportModal"
    class="fixed inset-0 bg-[#19141461] bg-opacity-90 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg w-full max-w-md">
      <div class="p-4 border-b border-[#eaecf0] flex justify-between items-center">
        <h3 class="text-[#344054] font-medium text-lg">Export Documents</h3>
        <button @click="emit('close')" class="text-[#667085] hover:text-[#344054]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      <div class="p-4">
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-[#344054] mb-2 block">Export Format</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="radio" v-model="exportFormat" value="csv" class="text-[#697b9d]" />
                <span class="text-[#344054]">CSV (Comma Separated Values)</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" v-model="exportFormat" value="excel" class="text-[#697b9d]" />
                <span class="text-[#344054]">Excel (.csv format)</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" v-model="exportFormat" value="pdf" class="text-[#697b9d]" />
                <span class="text-[#344054]">PDF Document (.html format)</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" v-model="exportFormat" value="json" class="text-[#697b9d]" />
                <span class="text-[#344054]">JSON Data</span>
              </label>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-[#344054] mb-2 block">Export Options</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="exportOptions.includeHeaders" class="rounded" />
                <span class="text-[#344054]">Include column headers</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="exportOptions.selectedOnly" class="rounded" />
                <span class="text-[#344054]"
                  >Export selected rows only ({{ documentStore.selectedCount }} selected)</span
                >
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="exportOptions.includeTimestamp" class="rounded" />
                <span class="text-[#344054]">Include export timestamp</span>
              </label>
            </div>
          </div>

          <div class="bg-[#f9fafb] p-3 rounded-md">
            <p class="text-sm text-[#667085]">
              {{
                exportOptions.selectedOnly
                  ? `${documentStore.selectedCount} selected document${documentStore.selectedCount !== 1 ? 's' : ''} will be exported`
                  : `${documentStore.totalDocuments} total document${documentStore.totalDocuments !== 1 ? 's' : ''} will be exported`
              }}
            </p>
          </div>
        </div>

        <div class="flex gap-3 pt-6">
          <button
            @click="emit('close')"
            class="flex-1 border border-[#d0d5dd] text-[#344054] h-10 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleExport"
            :disabled="!exportFormat"
            class="flex-1 bg-[#697b9d] hover:bg-[#5a6b8a] text-white h-10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
