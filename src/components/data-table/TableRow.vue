<!-- Vue Template with Tailwind CSS Classes -->
<template>
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
    @delete="deleteDocument"
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
      'border-b border-b-gray-300 transition-all duration-500 hover:bg-gray-50 xl:text-sm 2xl:text-base',
      documentStore.getDocumentRowClass(doc.id || ''),
      documentStore.recentlyAddedDocuments.has(doc.id || '') ? 'animate-highlight' : '',
      { 'bg-blue-50': documentStore.isSelected(doc.id || '') },
    ]"
  >
    <!-- Selection Checkbox -->
    <td class="py-3 px-4">
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

    <td class="py-3 px-4">{{ doc.ref_no }}</td>

    <!-- Enhanced Editable title -->
    <td class="py-3 px-0">
      <div
        :class="[
          'relative cursor-pointer p-3 rounded-md transition-all duration-200 min-h-10 flex items-center group',
          isEditing(doc.id, 'title') ? 'bg-transparent p-0' : '',
          userStore.userData?.isAdmin ? 'hover:bg-gray-100 hover:shadow-sm group' : ''
        ]"
        @dblclick="userStore.userData?.isAdmin && startEditing(doc.id, 'title')"
      >
        <textarea
          v-if="isEditing(doc.id, 'title') "
          v-model="editingValues[doc.id].title"
          @blur="saveEdit(doc.id)"
          @keyup.enter="saveEdit(doc.id)"
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
          :ref="el => setEditInput(el, doc.id, 'title')"
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

    <!-- Enhanced Editable filed_by -->
    <td class="py-3 px-0">
      <div
        :class="[
          'relative cursor-pointer p-3 rounded-md transition-all duration-200 min-h-10 flex items-center group',
          userStore.userData?.isAdmin ? 'hover:bg-gray-100 hover:shadow-sm group' : '',
          isEditing(doc.id, 'filed_by') ? 'bg-transparent p-0' : ''
        ]"
        @dblclick="userStore.userData?.isAdmin && startEditing(doc.id, 'filed_by')"
      >
        <input
          v-if="isEditing(doc.id, 'filed_by') && doc.status === 'Filed'"
          v-model="editingValues[doc.id].filed_by"
          @blur="saveEdit(doc.id)"
          @keyup.enter="saveEdit(doc.id)"
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
          type="text"
          :ref="el => setEditInput(el, doc.id, 'filed_by')"
          @click.stop
          placeholder="Enter filed by..."
        />
        <div v-else class="flex items-center justify-between w-full">
          <span class="block">{{ doc.filed_by }}</span>
          <span v-if="userStore.userData?.isAdmin" class="opacity-0 group-hover:opacity-60 text-xs transition-opacity duration-200">✏️</span>
        </div>

        <!-- Tooltip -->
        <div
          v-if="isEditing(doc.id, 'filed_by') && doc.status === 'Filed'"
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
    <td class="py-3 px-0">
      <div
        :class="[
          'relative cursor-pointer p-3 rounded-md transition-all duration-200 min-h-10 flex items-center group',
          userStore.userData?.isAdmin ? 'hover:bg-gray-100 hover:shadow-sm group' : '',
          isEditing(doc.id, 'filed_date') ? 'bg-transparent p-0' : ''
        ]"
        @dblclick="userStore.userData?.isAdmin && startEditing(doc.id, 'filed_date')"
      >
        <input
          v-if="isEditing(doc.id, 'filed_date') && doc.status === 'Filed'"
          v-model="editingValues[doc.id].filed_date"
          @blur="saveEdit(doc.id)"
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
          ref="el => setEditInput(el, doc.id, 'filed_date')"
          @click.stop
        />
        <div v-else class="flex items-center justify-between w-full">
          <span class="block">{{ formatForDateTimeLocal(doc.filed_date) }}</span>
          <span v-if="userStore.userData?.isAdmin" class="opacity-0 group-hover:opacity-60 text-xs transition-opacity duration-200">✏️</span>
        </div>

        <!-- Tooltip -->
        <div
          v-if="isEditing(doc.id, 'filed_date') && doc.status === 'Filed'"
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
    <td class="py-3 px-0">
      <div
        :class="[
          'relative cursor-pointer p-3 rounded-md transition-all duration-200 min-h-10 flex items-center group',
          userStore.userData?.isAdmin ? 'hover:bg-gray-100 hover:shadow-sm group' : '',
          isEditing(doc.id, 'created_by') ? 'bg-transparent p-0' : ''
        ]"
        @dblclick="userStore.userData?.isAdmin && startEditing(doc.id, 'created_by')"
      >
        <input
          v-if="isEditing(doc.id, 'created_by')"
          v-model="editingValues[doc.id].created_by"
          @blur="saveEdit(doc.id)"
          @keyup.enter="saveEdit(doc.id)"
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
          type="text"
          :ref="el => setEditInput(el, doc.id, 'created_by')"
          @click.stop
          placeholder="Enter created by..."
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
    <td class="py-3 px-0">
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
          @blur="saveEdit(doc.id)"
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

    <td class="py-3">
      <DocumentStatus :status="doc.status" :isLoading="documentStore.isLoading" />
    </td>

    <td class="py-3 px-4 text-right relative">
      <button
        v-if="username === doc.created_by || userStore.userData?.isAdmin"
        :disabled="documentStore.isLoading"
        @click="toggleDropdown(index)"
        class="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1 rounded hover:bg-gray-100"
      >
        <MoreVerticalIcon class="h-4 w-4" />
      </button>
      <div
        v-if="activeDropdown === index"
        :class="[
          'absolute bg-white border border-[#eaecf0] rounded-lg shadow-lg py-1 z-10 min-w-[160px] right-0',
          shouldDropdownOpenUpward(index) ? 'bottom-full mb-1' : 'top-full mt-1',
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
          v-if="doc.file_id"
          class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm cursor-pointer"
        >
          <EyeIcon class="w-4 h-4" />
          Download attachment
        </button>
        <button
          @click="openDeleteModal(doc)"
          v-if="userStore.userData?.isAdmin || username === doc.created_by"
          class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600 cursor-pointer"
        >
          <TrashIcon class="w-4 h-4" />
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { MoreVertical as MoreVerticalIcon, Edit as EditIcon, Eye as EyeIcon, Trash as TrashIcon } from 'lucide-vue-next'
import DocumentStatus from './DataStatus.vue'
import EditDocumentModal from '@/components/form/Dialog/EditDocumentForm.vue'
import EditAdminDocumentForm from '@/components/form/Dialog/EditAdminDocumentForm.vue'
import ConfirmDialog from '../form/Dialog/ConfirmDialog.vue'
import { useDocumentStore } from '@/stores/documentStore'
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { ApiDocument } from '@/types/documentTypes'

const documentStore = useDocumentStore()
const userStore = useUserStore()
const documents = computed(() => documentStore.documents)
const username = computed(() => userStore.userData?.full_name || '')
const activeDropdown = ref<number | null>(null)
const isEditModalOpen = ref(false)
const selectedDocument = ref<any | null>(null)

const editingCell = ref<{ id: string; field: string } | null>(null)
const editingValues = ref<{ [key: string]: Partial<ApiDocument> }>({})
const editInputs = ref<{ [key: string]: HTMLInputElement | HTMLTextAreaElement | null }>({}) // Store refs by id and field
const isDeleteModalOpen = ref(false)

const isSaving = ref(false)
const hasError = ref(false)

const shouldDropdownOpenUpward = (index: number) => {
  return index >= documents.value.length - 2
}

const formatForDateTimeLocal = (date: Date | string | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB')
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
      created_date: document.created_date
        ? new Date(document.created_date).toISOString().split('T')[0]
        : '',
      filed_date: document.filed_date
        ? new Date(document.filed_date).toISOString().split('T')[0]
        : '',
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
    const updatedData = {
      id,
      ...editingValues.value[id],
    }
    await documentStore.updateDocument(updatedData)
    editingCell.value = null
    isSaving.value = false
  } catch (error) {
    console.error('Failed to update document:', error)
    hasError.value = true
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
    console.log('Updating document:', updatedDocument)
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
  } catch (error) {
    console.error('Failed to delete document:', error)
  }
  activeDropdown.value = null
}

const downloadDocument = async (doc: any) => {
  if (doc.file_id) {
    await documentStore.downloadAttachment(doc.id)
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

.animate-pulse-once {
  animation: pulse 1s ease-in-out 1;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
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

/* Tooltip arrow - Tailwind doesn't support pseudo-element content */
.tooltip-arrow::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #1f2937;
}

/* Input focus ring with brand color */
.focus-ring-brand:focus {
  --tw-ring-color: rgba(164, 31, 54, 0.1);
}

/* Smooth transitions for all interactive elements */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

/* Animation for input appearing */
@keyframes fadeInZoom {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-zoom {
  animation: fadeInZoom 0.15s ease-out;
}

/* Success save animation */
@keyframes saveSuccess {
  0% {
    background-color: rgba(34, 197, 94, 0.1);
    border-color: #22c55e;
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    background-color: rgba(255, 255, 255, 1);
    border-color: #d1d5db;
    transform: scale(1);
  }
}

.animate-save-success {
  animation: saveSuccess 0.6s ease-out;
}

/* Loading shimmer animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Pulse animation for loading state */
.animate-pulse-once {
  animation: pulse 1s ease-in-out 1;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .mobile-input-size {
    font-size: 16px !important; /* Prevents zoom on iOS */
  }
}

/* Custom selection color */
::selection {
  background-color: rgba(164, 31, 54, 0.2);
  color: inherit;
}

/* Custom scrollbar styles */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
