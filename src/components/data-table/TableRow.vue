<template>
  <!-- Edit Modal -->
  <EditAdminDocumentForm v-if="userStore.isAdmin && isEditModalOpen" :isModalOpen="isEditModalOpen" @delete="deleteDocument"
    :document="selectedDocument" @close="closeEditModal" @save="handleDocumentUpdate" />
  <EditDocumentModal v-else-if="isEditModalOpen" :document="selectedDocument" @close="closeEditModal"
    @update="handleDocumentUpdate" />

  <tr v-for="(doc, index) in documents" :key="doc.ref_no"
    class="border-b border-b-gray-300 hover:bg-gray-50 transition-colors"
    :class="{ 'bg-blue-50': documentStore.isSelected(doc.id) }">
    <!-- Selection Checkbox -->
    <td class="py-3 px-4">
      <div class="flex items-center">
        <input type="checkbox" :checked="documentStore.isSelected(doc.id)" @change="documentStore.toggleSelect(doc.id)"
          :disabled="documentStore.isLoading"
          class="w-4 h-4 rounded border-gray-300 text-[#A41F36] focus:ring-[#A41F36] disabled:opacity-50 accent-[#A41F36]" />
      </div>
    </td>
    <td class="py-3 px-4">{{ doc.ref_no }}</td>
    <td class="py-3 px-4">{{ doc.full_ref }}</td>
    <td class="py-3 px-4">{{ doc.title }}</td>
    <td class="py-3 px-4">{{ doc.created_by }}</td>
    <td class="py-3 px-4">{{ doc.created_date.slice(0, 10) }}</td>
    <td class="py-3">
      <DocumentStatus :status="doc.status" :isLoading="documentStore.isLoading" />
    </td>
    <td class="py-3 px-4 text-right relative">
      <button v-if="username === doc.created_by || userStore.isAdmin" :disabled="documentStore.isLoading"
        @click="toggleDropdown(index)"
        class="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1 rounded hover:bg-gray-100">
        <MoreVerticalIcon class="h-4 w-4" />
      </button>
      <div v-if="activeDropdown === index" :class="[
        'absolute bg-white border border-[#eaecf0] rounded-lg shadow-lg py-1 z-10 min-w-[160px] right-0',
        shouldDropdownOpenUpward(index) ? 'bottom-full mb-1' : 'top-full mt-1'
      ]">
        <button @click="openEditModal(doc)"
          class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm cursor-pointer">
          <EditIcon class="w-4 h-4" />
          Edit
        </button>
        <button @click="downloadDocument(doc)" v-if="doc.file_id"
          class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm cursor-pointer">
          <EyeIcon class="w-4 h-4" />
          Download attachment
        </button>
        <button @click="deleteDocument(doc)" v-if="userStore.isAdmin"
          class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600 cursor-pointer">
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
import { useDocumentStore } from '@/stores/documentStore'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { ApiDocument } from '@/types/documentTypes'

const documentStore = useDocumentStore()
const userStore = useUserStore()
const documents = computed(() => documentStore.documents)
const username = computed(() => userStore.username)
const activeDropdown = ref<number | null>(null)
const isEditModalOpen = ref(false)
const selectedDocument = ref<any | null>(null) // Temporarily use 'any' if the type mismatch persists
const shouldDropdownOpenUpward = (index: number) => {
  return index >= documents.value.length - 2
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
  activeDropdown.value = null // Close dropdown
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedDocument.value = null
}

const handleDocumentUpdate = async (updatedData: any) => {
  try {
    const updatedDocument = {
      ...selectedDocument.value,
      ...updatedData // Keep existing file if not updated
    }

    await documentStore.updateDocument(updatedDocument)
    closeEditModal()
  } catch (error) {
    console.error('Failed to update document:', error)
    // Handle error (show toast, etc.)
  }
}

const deleteDocument = async (doc: any) => {
  if (confirm('Are you sure you want to delete this document?')) {
    try {
      await documentStore.deleteDocument(doc.id)
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }
  activeDropdown.value = null
}

const handleClickOutside = (event: MouseEvent) => {
  if (event.target instanceof Element && !event.target.closest('.relative')) {
    activeDropdown.value = null
  }
}
const downloadDocument = async (doc: any) => {
  if (doc.file_id) {
    await documentStore.downloadAttachment(doc.id)
  } else {
    alert('No attachment available for this document.')
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
</style>
