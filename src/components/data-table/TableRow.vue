<template>
  <!-- Document Details Modal -->
  <DocumentDetailsModal
    :isOpen="isDetailsModalOpen"
    :document="selectedDocument"
    :canEdit="username === selectedDocument?.created_by || userStore.userData?.isAdmin"
    @close="closeDetailsModal"
    @edit="openEditFromDetails"
    @download="downloadDocument"
  />

  <!-- Edit Modal -->
  <ConfirmDialog
    title="Delete Document"
    message="Are you sure you want to delete this document?"
    confirmText="Delete"
    cancelText="Cancel"
    v-if="isDeleteModalOpen"
    @confirm="deleteDocument(selectedDocument)"
    @cancel="() => (isDeleteModalOpen = false)"
  />
  <EditAdminDocumentForm
    v-if="userStore.userData?.isAdmin && isEditModalOpen"
    :isModalOpen="isEditModalOpen"
    :document="selectedDocument"
    @close="closeEditModal"
    @save="handleDocumentUpdate"
  />
  <EditDocumentModal
    v-else-if="isEditModalOpen"
    :document="selectedDocument"
    @close="closeEditModal"
    @update="handleDocumentUpdate"
  />

  <tr
    v-for="(doc, index) in documents"
    :key="doc.id"
    :class="[
      ' border-b border-b-gray-300 transition-all duration-500 hover:bg-gray-50 xl:text-sm 2xl:text-base cursor-pointer',
      documentStore.getDocumentRowClass(doc.id || ''),
      documentStore.recentlyAddedDocuments.has(doc.id || '') ? 'animate-highlight' : '',
      { 'bg-blue-50': documentStore.isSelected(doc.id || '') },
    ]"
    @click="openDetailsModal(doc)"
  >
    <!-- Selection Checkbox -->
    <td class="py-3 px-4" @click.stop>
      <div v-if="userStore.userData?.isAdmin" class="flex items-center">
        <input
          type="checkbox"
          :checked="documentStore.isSelected(doc.id || '')"
          @change="documentStore.toggleSelect(doc.id || '')"
          :disabled="documentStore.isLoading"
          class="w-4 h-4 rounded border-gray-300 text-[#A41F36] focus:ring-[#A41F36] disabled:opacity-50 accent-[#A41F36]"
        />
      </div>
    </td>

    <td class="group py-3 px-4 ">
      <div class="flex items-center gap-3">
        <!-- Status indicator with better positioning -->
        <div
          :class="[
            'w-2.5 h-2.5 rounded-full flex-shrink-0',
            getStatusColor(doc.status)
          ]"
          :title="doc.status"
        ></div>

        <!-- Reference number and status in a cleaner layout -->
        <div class="flex flex-col">
          <span class="font-medium text-gray-900">{{ doc.ref_no }}</span>
          <DataStatus :status="doc.status" :isLoading="documentStore.isLoading"/>
        </div>

        <!-- Info icon to indicate clickable -->
        <InfoIcon class="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </td>

    <!-- Enhanced Editable title -->
    <td class="py-3 px-4" @click.stop>
      <div
        :class="[
          'relative cursor-pointer p-3 rounded-md transition-all duration-200 min-h-10 flex items-center group',
          isEditing(doc.id ?? '', 'title') ? 'bg-transparent p-0' : '',
          userStore.userData?.isAdmin ? 'hover:bg-gray-100 hover:shadow-sm group' : ''
        ]"
        @dblclick="userStore.userData?.isAdmin && startEditing(doc.id ?? '', 'title')"
      >
        <textarea
          v-if="doc.id && editingValues[doc.id]"
          v-model="editingValues[doc.id].title"
          @keyup.enter="saveEdit(doc.id)"
          @blur="cancelEdit(doc.id)"
          @keyup.escape="cancelEdit(doc.id)"
          :class="[
            'w-full border-2 border-blue-500 rounded-lg px-3 py-2 text-sm',
            'bg-white text-gray-900 shadow-lg transition-all duration-200',
            'focus:border-[#A41F36] focus:ring-4 focus:ring-[#A41F36]/10 focus:outline-none',
            'hover:border-indigo-400 hover:shadow-xl',
            'placeholder-gray-400 placeholder:italic',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            isSaving ? 'border-green-500 bg-green-50' : '',
            hasError ? 'border-red-500 bg-red-50' : ''
          ]"
          :ref="el => setEditInput(el as HTMLElement, doc.id ?? '', 'title')"
          @click.stop
          placeholder="Enter document title..."
        />
        <div v-else class="flex items-center justify-between w-full">
          <span class="block">{{ doc.title }}</span>
          <span v-if="userStore.userData?.isAdmin" class="opacity-0 group-hover:opacity-60 text-xs transition-opacity duration-200">✏️</span>
        </div>

        <!-- Tooltip -->
        <div
          v-if="isEditing(doc.id, 'title')"
          class="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full
                 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap
                 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200
                 pointer-events-none z-20 mb-1
                 after:content-[''] after:absolute after:top-full after:left-1/2
                 after:transform after:-translate-x-1/2 after:border-4 after:border-transparent
                 after:border-t-gray-900"
        >
          Double-click to edit • Enter to save • Esc to cancel
        </div>
      </div>
    </td>
    <!-- Enhanced Editable created_by -->
    <td v-if="userStore.userData?.isAdmin" class="py-3 px-0" @click.stop>
      <div
        :class="[
          'relative cursor-pointer p-3 rounded-md transition-all duration-200 min-h-10 flex items-center group',
           userStore.userData?.isAdmin ? 'hover:bg-gray-100 hover:shadow-sm group' : '',
          isEditing(doc.id, 'created_date') ? 'bg-transparent p-0' : ''
        ]"
        @dblclick="userStore.userData?.isAdmin &&  startEditing(doc.id, 'created_by')"
      >
         <textarea
           v-if="isEditing(doc.id, 'created_by') "
           v-model.trim="editingValues[doc.id ?? '']?.created_by"
           @keyup.enter="saveEdit(doc.id)"
           @blur="cancelEdit(doc.id)"
           @keyup.escape="cancelEdit(doc.id)"
           :class="[
            'w-full border-2 border-blue-500 rounded-lg px-3 py-2 text-sm',
            'bg-white text-gray-900 shadow-lg transition-all duration-200',
            'focus:border-[#A41F36] focus:ring-4 focus:ring-[#A41F36]/10 focus:outline-none',
            'hover:border-indigo-400 hover:shadow-xl',
            'placeholder-gray-400 placeholder:italic',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            isSaving ? 'border-green-500 bg-green-50' : '',
            hasError ? 'border-red-500 bg-red-50' : ''
          ]"
           :ref="el => setEditInput(el, doc.id, 'created_by')"
           @click.stop
           placeholder="Enter creator..."
         />
        <div v-else class="flex items-center justify-between w-full">
          <span class="block">{{ doc.created_by }}</span>
          <span  v-if="userStore.userData?.isAdmin" class="opacity-0 group-hover:opacity-60 text-xs transition-opacity duration-200">✏️</span>
        </div>

        <!-- Tooltip -->
        <div
          v-if="isEditing(doc.id, 'created_by')"
          class="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full
                 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap
                 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200
                 pointer-events-none z-20 mb-1
                 after:content-[''] after:absolute after:top-full after:left-1/2
                 after:transform after:-translate-x-1/2 after:border-4 after:border-transparent
                 after:border-t-gray-900"
        >
          Double-click to edit • Enter to save • Esc to cancel
        </div>
      </div>
    </td>
    <!-- Enhanced Editable created_date -->
    <td v-if="userStore.userData?.isAdmin" class="py-3 px-0" @click.stop>
      <div
        :class="[
          'relative cursor-pointer p-3 rounded-md transition-all duration-200 min-h-10 flex items-center group',
           userStore.userData?.isAdmin ? 'hover:bg-gray-100 hover:shadow-sm group' : '',
          isEditing(doc.id, 'created_date') ? 'bg-transparent p-0' : ''
        ]"
        @dblclick="userStore.userData?.isAdmin &&  startEditing(doc.id, 'created_date')"
      >
        <input
          v-if="isEditing(doc.id, 'created_date')"
          v-model="editingValues[doc.id].created_date"

          @keyup.enter="saveEdit(doc.id)"
          @keyup.escape="cancelEdit(doc.id)"
          :class="[
            'w-full border-2 border-blue-500 rounded-lg px-3 py-2 text-sm pr-10',
            'bg-white text-gray-900 shadow-lg transition-all duration-200',
            'focus:border-[#A41F36] focus:ring-4 focus:ring-[#A41F36]/10 focus:outline-none',
            'hover:border-indigo-400 hover:shadow-xl cursor-pointer',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            isSaving ? 'border-green-500 bg-green-50' : '',
            hasError ? 'border-red-500 bg-red-50' : ''
          ]"
          type="date"
          :ref="el => setEditInput(el, doc.id, 'created_date')"
          @click.stop
        />
        <div v-else class="flex items-center justify-between w-full">
          <span class="block">{{ formatForDateTimeLocal(doc.created_date) }}</span>
          <span  v-if="userStore.userData?.isAdmin" class="opacity-0 group-hover:opacity-60 text-xs transition-opacity duration-200">✏️</span>
        </div>

        <!-- Tooltip -->
        <div
          v-if="isEditing(doc.id, 'created_date')"
          class="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full
                 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap
                 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200
                 pointer-events-none z-20 mb-1
                 after:content-[''] after:absolute after:top-full after:left-1/2
                 after:transform after:-translate-x-1/2 after:border-4 after:border-transparent
                 after:border-t-gray-900"
        >
          Double-click to edit • Enter to save • Esc to cancel
        </div>
      </div>
    </td>

    <!-- Enhanced Editable filed_date -->
    <td class="py-3 px-4" @click.stop>
      <div
        :class="[
              'relative cursor-pointer p-3 rounded-md transition-all duration-200 min-h-10 flex items-center group',
               userStore.userData?.isAdmin && doc.status !== 'Not Filed' ? 'hover:bg-gray-100 hover:shadow-sm group' : '',
              isEditing(doc.id, 'filed_date') ? 'bg-transparent p-0' : ''
            ]"
        @dblclick="userStore.userData?.isAdmin &&  startEditing(doc.id, 'filed_date')"
      >
        <input
          v-if="isEditing(doc.id, 'filed_date') && doc.status !== 'Not Filed'"
          v-model="editingValues[doc.id].filed_date"
          @blur="cancelEdit(doc.id)"
          @keyup.enter="saveEdit(doc.id)"
          @keyup.escape="cancelEdit(doc.id)"

          :class="[
                'w-full border-2 border-blue-500 rounded-lg px-3 py-2 text-sm pr-10',
                'bg-white text-gray-900 shadow-lg transition-all duration-200',
                'focus:border-[#A41F36] focus:ring-4 focus:ring-[#A41F36]/10 focus:outline-none',
                'hover:border-indigo-400 hover:shadow-xl cursor-pointer',
                'animate-in fade-in-0 zoom-in-95 duration-150',
                isSaving ? 'border-green-500 bg-green-50' : '',
                hasError ? 'border-red-500 bg-red-50' : ''
              ]"
          type="date"
          :ref="el => setEditInput(el, doc.id, 'filed_date')"
          @click.stop
        />
        <div v-else class="flex items-center justify-between w-full">
          <span class="block">{{ formatForDateTimeLocal(doc.filed_date) }}</span>
          <span  v-if="userStore.userData?.isAdmin && doc.status !== 'Not Filed'" class="opacity-0 group-hover:opacity-60 text-xs transition-opacity duration-200">✏️</span>
        </div>

        <!-- Tooltip -->
        <div
          v-if="isEditing(doc.id, 'filed_date') && doc.status !== 'Not Filed'"
          class="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full
                     bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap
                     opacity-0 group-focus-within:opacity-100 transition-opacity duration-200
                     pointer-events-none z-20 mb-1
                     after:content-[''] after:absolute after:top-full after:left-1/2
                     after:transform after:-translate-x-1/2 after:border-4 after:border-transparent
                     after:border-t-gray-900"
        >
          Double-click to edit • Enter to save • Esc to cancel
        </div>
      </div>
    </td>

    <td class="py-3 px-4 text-right " @click.stop>
      <button
        v-if="username === doc.created_by || userStore.userData?.isAdmin"
        :disabled="documentStore.isLoading"
        @click="toggleDropdown(index)"
        class="relative text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1 rounded hover:bg-gray-100"
      >
        <MoreVerticalIcon class="h-4 w-4" />
      </button>
      <div
        v-if="activeDropdown === index"
        :class="[
          'absolute bg-white border border-[#eaecf0] rounded-lg shadow-lg py-1 z-100 min-w-[160px] right-3',
          shouldDropdownOpenUpward(index) ? 'bottom-2 mb-1' : 'top-[-5] mt-1',
        ]"
      >
        <button
          @click="openEditModal(doc)"
          class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm cursor-pointer"
        >
          <EditIcon class="w-4 h-4" />
          Edit
        </button>
        <button
          @click="downloadDocument(doc)"
          v-if="doc.file_path"
          class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm cursor-pointer"
        >
          <EyeIcon class="w-4 h-4" />
          Download attachment
        </button>
        <button
          @click="openDetailsModal(doc)"
          class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm cursor-pointer">
          <InfoIcon class="w-4 h-4" />View  Details</button>
        <button
          @click="openDeleteModal(doc)"
          v-if="canDeleteDocument(doc)"
          :class="[
            'w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm cursor-pointer',
            canDeleteDocument(doc) ? 'text-red-600' : 'text-gray-400 cursor-not-allowed'
          ]"
          :disabled="!canDeleteDocument(doc)"
          :title="!canDeleteDocument(doc) ? 'Only the latest document can be deleted' : ''"
        >
          <TrashIcon class="w-4 h-4" />
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { MoreVertical as MoreVerticalIcon, Edit as EditIcon, Eye as EyeIcon, Trash as TrashIcon, Info as InfoIcon } from 'lucide-vue-next'
import EditDocumentModal from '@/components/form/Dialog/EditDocumentForm.vue'
import EditAdminDocumentForm from '@/components/form/Dialog/EditAdminDocumentForm.vue'
import ConfirmDialog from '../form/Dialog/ConfirmDialog.vue'
import DocumentDetailsModal from '@/components/form/DocumentDetailsModal.vue'
import { useDocumentStore } from '@/stores/documentStore'
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { ApiDocument, UpdateDocument } from '@/types/documentTypes'
import DataStatus from '@/components/data-table/DataStatus.vue'
import { useToast } from '@/composables/useToast.ts'

const documentStore = useDocumentStore()
const userStore = useUserStore()
const documents = computed(() => documentStore.getDocuments)
const username = computed(() => userStore.userData?.full_name || '')
const activeDropdown = ref<number | null>(null)
const isEditModalOpen = ref(false)
const isDetailsModalOpen = ref(false)
const selectedDocument = ref<any | null>(null)

const editingCell = ref<{ id: string; field: string } | null>(null)
const editingValues = ref<{ [key: string]: Partial<ApiDocument> }>({})
const editInputs = ref<{ [key: string]: HTMLInputElement | HTMLTextAreaElement | null }>({})
const isDeleteModalOpen = ref(false)

const isSaving = ref(false)
const hasError = ref(false)
const { success, error} = useToast()

// New computed property to determine if a document can be deleted
const canDeleteDocument = (doc: ApiDocument) => {
  // Admin can delete any document

  if (doc.status !== 'Not Filed') return false;
  // For regular users, only allow deletion if:
  // 1. They are the creator of the document
  // 2. AND it's their latest document
  if (username.value === doc.created_by) {
    return isLatestDocumentByUser(doc)
  }

  return false
}

// Helper function to check if the document is the latest by the user
const isLatestDocumentByUser = (doc: ApiDocument) => {
  // Get all documents created by the same user
  const userDocuments = documents.value.filter(d => d.created_by === doc.created_by)

  // If no documents found, return false
  if (userDocuments.length === 0) {
    return false
  }

  // Sort by creation date (most recent first)
  // Assuming created_date is either a Date object or a string that can be parsed
  const sortedDocs = userDocuments.sort((a, b) => {
    const dateA = new Date(a.created_date || 0)
    const dateB = new Date(b.created_date || 0)
    return dateB.getTime() - dateA.getTime()
  })

  // Check if the current document is the latest (first in sorted array)
  return sortedDocs[0].id === doc.id
}

const getStatusColor = (status : string) => {
  switch (status?.toLowerCase()) {
    case 'filed':
      return 'bg-green-500'
    case 'suspended':
      return 'bg-gray-400'
    default:
      return 'bg-red-500'
  }
}

const shouldDropdownOpenUpward = (index: number) => {
  return index >= documents.value.length - 2
}

const formatForDateTimeLocal = (date: Date | string | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB')
}

// Details Modal Functions
const openDetailsModal = (doc: ApiDocument) => {
  activeDropdown.value = null
  selectedDocument.value = doc
  isDetailsModalOpen.value = true
}

const closeDetailsModal = () => {
  isDetailsModalOpen.value = false
  selectedDocument.value = null
}

const openEditFromDetails = (doc: ApiDocument) => {
  closeDetailsModal()
  openEditModal(doc)
}

// Set the ref for the input/textarea
const setEditInput = (el: Element | null, id: string, field: string) => {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    editInputs.value[`${id}_${field}`] = el
  } else {
    editInputs.value[`${id}_${field}`] = null
  }
}

// Check if a cell is being edited
const isEditing = (id: string, field: string) => {
  return editingCell.value?.id === id && editingCell.value?.field === field
}

// Start editing a cell
const startEditing = (id: string, field: string) => {
  const doc = documents.value.find((d) => d.id === id)
  if (!doc || (username.value !== doc.created_by && !userStore.userData?.isAdmin)) {
    return
  }

  editingCell.value = { id, field }
  if (!editingValues.value[id]) {
    editingValues.value[id] = {}
  }
  const document = documents.value.find((d) => d.id === id)
  if (document) {
    editingValues.value[id] = {
      ref_no: document.ref_no,
      title: document.title,
      created_by: document.created_by,
      filed_by: document.filed_by,
      attachment: document?.attachment,
      file_id: document?.file_id,
      status: document.status,
      department_id: document.department_id,
      document_type_id: document.document_type_id,
      created_date: document.created_date,
      filed_date: document.filed_date
    }
  }
  nextTick(() => {
    const input = editInputs.value[`${id}_${field}`]
    if (input) {
      input.focus()
    }
  })
}

// Save edited cell
const saveEdit = async (id: string) => {
  if (!editingCell.value) return
  isSaving.value = true
  hasError.value = false
  try {
    const updatedData : UpdateDocument= {
      id,
      ...editingValues.value[id],
    }
    await documentStore.updateDocument(updatedData)
    // add toast or notification for success
    success('Document Updated', 'The document has been successfully updated')
    documentStore.recentlyAddedDocuments.add(id)
    editingCell.value = null
  } catch (error) {
    console.error('Failed to update document:', error)
    hasError.value = true
  } finally {
    isSaving.value = false
  }
}

// Cancel editing
const cancelEdit = (id: string) => {
  editingCell.value = null
  delete editingValues.value[id]
}

const toggleDropdown = (index: number) => {
  if (activeDropdown.value === index) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = index
  }
}

const openEditModal = (doc: ApiDocument) => {
  selectedDocument.value = doc
  isEditModalOpen.value = true
  activeDropdown.value = null
}

const openDeleteModal = (doc: ApiDocument) => {
  // Check if deletion is allowed before opening modal
  if (!canDeleteDocument(doc)) {
    error('Delete Not Allowed', 'Only the latest document can be deleted')
    activeDropdown.value = null
    return
  }

  selectedDocument.value = doc
  isDeleteModalOpen.value = true
  activeDropdown.value = null
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedDocument.value = null
}

const handleDocumentUpdate = async (updatedData: any) => {
  try {
    const updatedDocument = {
      ...selectedDocument.value,
      ...updatedData,
    }
    await documentStore.updateDocument(updatedDocument)
    closeEditModal()
  } catch (error) {
    console.error('Failed to update document:', error)
  }
}

const deleteDocument = async (doc: any) => {
  console.log(doc)
  try {
    await documentStore.deleteDocument(doc.id)
    success('Document Deleted', 'The document has been successfully deleted')
  } catch (error) {
    console.error('Failed to delete document:', error)
    error('Delete Failed', 'Failed to delete the document')
  }
  activeDropdown.value = null
  isDeleteModalOpen.value = false
}

const downloadDocument = async (doc: any) => {
  if (doc.file_path) {
    success('Download started', 'Your document is being downloaded.')
    await documentStore.downloadAttachment(doc.id)
    success('Download complete', 'Your document has been downloaded successfully.')
  } else {
    alert('No attachment available for this document.')
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (event.target instanceof Element) {
    if (!event.target.closest('.relative') && !event.target.closest('input') && !event.target.closest('textarea')) {
      activeDropdown.value = null
      if (editingCell.value) {
        saveEdit(editingCell.value.id)
      }
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Same styles as before */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

@keyframes highlight {
  0% {
    background-color: rgba(34, 197, 94, 0.1);
    transform: scale(1);
  }
  50% {
    background-color: rgba(34, 197, 94, 0.2);
    transform: scale(1.01);
  }
  100% {
    background-color: rgba(34, 197, 94, 0.05);
    transform: scale(1);
  }
}

.animate-highlight {
  animation: highlight 2s ease-in-out;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
