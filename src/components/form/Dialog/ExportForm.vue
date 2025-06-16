<script setup lang="ts">
import { computed,  reactive, ref } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'
import { useRoute } from 'vue-router'
import { useDepartmentStore } from '@/stores/departmentStore'
import type { ApiDocument } from '@/types/documentTypes';

defineProps<{
  showExportModal: boolean
}>()
const emit = defineEmits(['close'])

const documentStore = useDocumentStore()

const exportOptions = reactive({
  includeHeaders: true,
  selectedOnly: false,
  includeTimestamp: true,
})
const exportFormat = ref('csv')
const isExporting = ref(false)
const exportProgress = ref('')

const route = useRoute()
const departmentStore = useDepartmentStore()

const departmentName = computed(() => {
  if (route.params.id && typeof route.params.id === 'string') {
    const department = departmentStore.departments.find((dept) => dept._id === route.params.id)
    return department?.name || 'Unknown Department'
  }
  return ''
})

const computeBtnDisabled = computed(() => {
  return !exportFormat.value || (exportOptions.selectedOnly && documentStore.selectedCount === 0) || isExporting.value
})

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
  if (includeHeaders) csv += headers.join(',') + '\n'

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
  const title = departmentName.value
    ? `${departmentName.value} Documents Export`
    : 'Documents Export'

  let html = `
    <html>
      <head>
        <title>${title}</title>
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
        <h1>${title}</h1>
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

async function handleExport() {
  isExporting.value = true
  exportProgress.value = 'Preparing export...'

  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')

    exportProgress.value = 'Fetching documents...'
    await documentStore.fetchAllDocuments(route.params.id as string)
    console.log(documentStore.exportDocuments)

    exportProgress.value = 'Processing documents...'
    const dataToExport = exportOptions.selectedOnly
      ? documentStore.selectedCount > 0
        ? documentStore.exportDocuments.filter((doc: ApiDocument) =>
            documentStore.isSelected(doc._id || '')
          )
        : []
      : documentStore.exportDocuments

    if (dataToExport.length === 0) {
      exportProgress.value = 'No documents to export!'
      setTimeout(() => {
        isExporting.value = false
        exportProgress.value = ''
      }, 2000)
      return
    }

    exportProgress.value = 'Generating export file...'
    let filename: string, content: string, mimeType: string

    switch (exportFormat.value) {
      case 'csv':
        filename = `${departmentName.value}-documents-${timestamp}.csv`
        content = convertToCSV(dataToExport, exportOptions.includeHeaders)
        mimeType = 'text/csv'
        break
      case 'excel':
        filename = `${departmentName.value}-documents-${timestamp}.csv`
        content = convertToCSV(dataToExport, exportOptions.includeHeaders)
        mimeType = 'text/csv'
        break
      case 'json':
        filename = `${departmentName.value}-documents-${timestamp}.json`
        content = convertToJSON(dataToExport, exportOptions.includeTimestamp)
        mimeType = 'application/json'
        break
      case 'pdf':
        filename = `${departmentName.value}-documents-${timestamp}.html`
        content = generatePDFContent(dataToExport)
        mimeType = 'text/html'
        break
      default:
        console.error('Unsupported export format')
        return
    }

    exportProgress.value = 'Downloading file...'
    downloadFile(content, filename, mimeType)

    exportProgress.value = 'Export completed!'
    setTimeout(() => {
      emit('close')
    }, 1000)

  } catch (error) {
    console.error('Export error:', error)
    exportProgress.value = 'Export failed. Please try again.'
    setTimeout(() => {
      isExporting.value = false
      exportProgress.value = ''
    }, 3000)
  } finally {
    isExporting.value = false
    exportProgress.value = ''
  }
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
        <button
          @click="emit('close')"
          class="text-[#667085] hover:text-[#344054]"
          :disabled="isExporting"
        >
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
        <!-- Loading Overlay -->
        <div v-if="isExporting" class="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10 rounded-lg">
          <div class="text-center">
            <div class="flex items-center justify-center mb-4">
              <svg class="animate-spin h-8 w-8 text-[#697b9d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-[#344054] font-medium">Exporting Documents...</p>
            <p class="text-[#667085] text-sm mt-2">{{ exportProgress }}</p>
            <div class="mt-4 w-full bg-[#f2f4f7] rounded-full h-2">
              <div class="bg-[#697b9d] h-2 rounded-full animate-pulse" style="width: 100%"></div>
            </div>
          </div>
        </div>

        <div class="space-y-4" :class="{ 'opacity-50': isExporting }">
          <div>
            <label class="text-sm font-medium text-[#344054] mb-2 block">Export Format</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="exportFormat"
                  value="csv"
                  class="text-[#697b9d]"
                  :disabled="isExporting"
                />
                <span class="text-[#344054]">CSV (Comma Separated Values)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="exportFormat"
                  value="excel"
                  class="text-[#697b9d]"
                  :disabled="isExporting"
                />
                <span class="text-[#344054]">Excel (.csv format)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="exportFormat"
                  value="pdf"
                  class="text-[#697b9d]"
                  :disabled="isExporting"
                />
                <span class="text-[#344054]">PDF Document (.html format)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="exportFormat"
                  value="json"
                  class="text-[#697b9d]"
                  :disabled="isExporting"
                />
                <span class="text-[#344054]">JSON Data</span>
              </label>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-[#344054] mb-2 block">Export Options</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="exportOptions.includeHeaders"
                  class="rounded"
                  :disabled="isExporting"
                />
                <span class="text-[#344054]">Include column headers</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="exportOptions.selectedOnly"
                  class="rounded"
                  :disabled="isExporting"
                />
                <span class="text-[#344054]"
                  >Export selected rows only ({{ documentStore.selectedCount }} selected)</span
                >
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="exportOptions.includeTimestamp"
                  class="rounded"
                  :disabled="isExporting"
                />
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
            class="flex-1 border border-[#d0d5dd] text-[#344054] h-10 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isExporting"
          >
            Cancel
          </button>
          <button
            @click="handleExport"
            :disabled="computeBtnDisabled"
            class="flex-1 bg-[#697b9d] hover:bg-[#5a6b8a] text-white h-10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              v-if="isExporting"
              class="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isExporting ? 'Exporting...' : 'Export' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
