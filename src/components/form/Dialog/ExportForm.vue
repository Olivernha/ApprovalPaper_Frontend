<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'
import { useRoute } from 'vue-router'
import { useDepartmentStore } from '@/stores/departmentStore'
import type { ApiDocument } from '@/types/documentTypes'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

defineProps<{
  showExportModal: boolean
}>()
const emit = defineEmits(['close'])

const documentStore = useDocumentStore()
const route = useRoute()
const departmentStore = useDepartmentStore()

const exportOptions = reactive({
  includeHeaders: true,
  selectedOnly: false,
  includeTimestamp: true,
})
const exportFormat = ref('')
const isExporting = ref(false)
const exportProgress = ref('')

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
    const escapeCSV = (str: string) => {
      const sanitized = (str || '').replace(/"/g, '""').replace(/[\n\r]/g, ' ') // Remove newlines
      return `"${sanitized.slice(0, 1000)}"` // Limit to 1000 chars to prevent issues
    }
    const values = [
      escapeCSV(row.ref_no || row.refNo || ''),
      escapeCSV(row.title || ''),
      escapeCSV(row.filed_by || row.filedBy || ''),
      escapeCSV(row.filed_date || row.filedDate || ''),
      escapeCSV(row.created_by || row.createdBy || ''),
      escapeCSV(row.created_date || row.date || ''),
      escapeCSV(row.status || ''),
    ]
    csv += values.join(',') + '\n'
  })

  return csv
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
    console.log('Fetched documents:', documentStore.exportDocuments)

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

    console.log('dataToExport:', dataToExport)

    // Limit PDF export to 500 records
    if (exportFormat.value === 'pdf' && dataToExport.length > 500) {
      exportProgress.value = 'Too many documents for PDF export (max 500). Use CSV for larger datasets.'
      setTimeout(() => {
        isExporting.value = false
        exportProgress.value = ''
      }, 3000)
      return
    }

    exportProgress.value = 'Generating export file...'
    let filename: string, content: string, mimeType: string

    switch (exportFormat.value) {
      case 'excel':
        filename = `${departmentName.value}-documents-${timestamp}.csv`
        content = convertToCSV(dataToExport, exportOptions.includeHeaders)
        mimeType = 'text/csv'
        downloadFile(content, filename, mimeType)
        break
      case 'pdf':
        filename = `${departmentName.value}-documents-${timestamp}.pdf`
        exportProgress.value = 'Generating PDF...'

        const pdf = new jsPDF('p', 'mm', 'a4')
        pdf.setFont('helvetica')
        pdf.setFontSize(16)
        pdf.text(`${departmentName.value || 'Documents'} Export`, 10, 10)
        pdf.setFontSize(12)
        pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, 10, 20)
        pdf.text(`Total Documents: ${dataToExport.length}`, 10, 30)

        const columns = [
          { header: 'RefNo', dataKey: 'refNo' },
          { header: 'Title', dataKey: 'title' },
          { header: 'Filed By', dataKey: 'filedBy' },
          { header: 'Filed Date', dataKey: 'filedDate' },
          { header: 'Created By', dataKey: 'createdBy' },
          { header: 'Date', dataKey: 'date' },
          { header: 'Status', dataKey: 'status' },
        ]

        const tableData = dataToExport.map(doc => ({
          refNo: (doc.ref_no || doc.refNo || '').slice(0, 50), // Limit lengths
          title: (doc.title || '').slice(0, 200), // Limit title to 200 chars
          filedBy: (doc.filed_by || doc.filedBy || '').slice(0, 50),
          filedDate: (doc.filed_date || doc.filedDate || '').slice(0, 50),
          createdBy: (doc.created_by || doc.createdBy || '').slice(0, 50),
          date: (doc.created_date || doc.date || '').slice(0, 10),
          status: (doc.status || '').slice(0, 50),
        }))

        autoTable(pdf, {
          columns,
          body: tableData,
          startY: 40,
          styles: {
            fontSize: 10,
            cellPadding: 2,
            textColor: [51, 51, 51],
            overflow: 'linebreak', // Enable word wrapping
          },
          headStyles: {
            fillColor: [240, 240, 240],
            textColor: [51, 51, 51],
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251],
          },
          columnStyles: {
            title: {
              cellWidth: 60, // Fixed width for title column (in mm)
              overflow: 'linebreak', // Wrap long titles
            },
            refNo: { cellWidth: 20 },
            filedBy: { cellWidth: 25 },
            filedDate: { cellWidth: 25 },
            createdBy: { cellWidth: 25 },
            date: { cellWidth: 25 },
            status: { cellWidth: 20 },
            textColor: (row: number) => {
              const status = tableData[row]?.status?.toLowerCase()
              if (status === 'not filed') return [164, 31, 54]
              if (status === 'filed') return [20, 186, 109]
              if (status === 'suspended') return [102, 112, 133]
              return [51, 51, 51]
            },
          },
          margin: { left: 10, right: 10 },
          didParseCell: (data) => {
            if (data.column.dataKey === 'title' && data.cell.text.length > 0) {
              data.cell.text = data.cell.text.map(text =>
                text.length > 100 ? text.slice(0, 100) + '...' : text
              ) // Truncate in display if needed
            }
          },
        })

        pdf.save(filename)
        break
      default:
        throw new Error('Unsupported export format')
    }

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
        <div
          v-if="isExporting"
          class="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10 rounded-lg"
        >
          <div class="text-center">
            <div class="flex items-center justify-center mb-4">
              <svg
                class="animate-spin h-8 w-8 text-[#697b9d]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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
                  value="pdf"
                  class="text-[#697b9d]"
                  :disabled="isExporting"
                />
                <span class="text-[#344054]">PDF Document (.pdf format)</span>
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
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isExporting ? 'Exporting...' : 'Export' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
