<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { X, Upload, CheckIcon } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'
import { useToast } from '@/composables/useToast'

interface EditAdminDocumentFormProps {
  document: {
    title: string
    created_by: string
    filed_by: string
    created_date: string | Date
    filed_date: string | Date
    attachment?: File | null
    status?: string
    id?: string
  }
}

const props = defineProps<EditAdminDocumentFormProps>()
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'save', document: EditAdminDocumentFormProps['document']): void
  (event: 'delete', document: EditAdminDocumentFormProps['document']): void
}>()

const { success, error, warning } = useToast()

const formatForDateTimeLocal = (date: Date | string | undefined): string => {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0] // returns "YYYY-MM-DD"
}

const formatToDate = (dateString: string): Date | null => {
  if (!dateString) return null
  return new Date(dateString + 'T00:00:00.000Z')
}

// Store the original created_date to use if not modified
const originalCreatedDate = ref(props.document.created_date)

const createdDateForInput = ref(formatForDateTimeLocal(props.document.created_date))
const filedDateForInput = ref(formatForDateTimeLocal(props.document.filed_date))
const isLoading = ref(false)

const editForm = reactive({
  title: props.document.title,
  created_by: props.document.created_by,
  filed_by: props.document?.filed_by || '',
  created_date: props.document.created_date, // Initialize with original value
  filed_date: props.document.filed_date,
  attachment: props.document.attachment,
})

const selectedAction = ref(props.document.status)
const fileInput = ref<HTMLInputElement>()
const useStore = useUserStore()

const closeModal = () => {
  emit('close')
}

watch(
  () => selectedAction.value,
  (newAction) => {
    if (newAction === 'Filed') {
      const now = new Date()
      filedDateForInput.value = formatForDateTimeLocal(now)
      editForm.filed_date = now
      editForm.filed_by = useStore.userData?.full_name
    }
    if (newAction === 'Not Filed') {
      filedDateForInput.value = ''
      editForm.filed_date = null
      editForm.filed_by = ''
    }
    if (newAction === 'Suspended') {
      editForm.filed_by = useStore.userData?.full_name
    }
  },
  { immediate: true }
)

watch(
  () => createdDateForInput.value,
  (newDate) => {
    // Only update created_date if the input is explicitly changed to a valid date
    if (newDate && newDate !== formatForDateTimeLocal(originalCreatedDate.value)) {
      editForm.created_date = formatToDate(newDate)
    } else {
      editForm.created_date = originalCreatedDate.value
    }
  }
)

watch(
  () => filedDateForInput.value,
  (newDate, oldDate) => {
    if (newDate === oldDate) return
    editForm.filed_date = newDate ? formatToDate(newDate) : null
  },
  { immediate: true }
)

const applyChanges = async () => {
  if (!editForm.title.trim()) {
    error('Validation Error', 'Document title is required')
    return
  }

  if (!editForm.created_by.trim()) {
    error('Validation Error', 'Created by field is required')
    return
  }

  isLoading.value = true

  try {
    if (selectedAction.value === 'Delete') {
      emit('delete', props.document)
      success('Document Deleted', 'The document has been successfully deleted')
      return
    }

    const updatedDocument: EditAdminDocumentFormProps['document'] = {
      ...editForm,
      // Use original created_date if editForm.created_date matches original
      created_date:
        editForm.created_date === originalCreatedDate.value
          ? originalCreatedDate.value
          : editForm.created_date
            ? new Date(editForm.created_date).toISOString()
            : '',
      filed_date: editForm.filed_date ? new Date(editForm.filed_date).toISOString() : '',
      status: selectedAction.value,
    }

    emit('save', updatedDocument)

    switch (selectedAction.value) {
      case 'Filed':
        success('Document Filed', 'The document has been successfully filed')
        break
      case 'Not Filed':
        success('Document Unfiled', 'The document status has been updated to unfiled')
        break
      case 'Suspended':
        warning('Document Suspended', 'The document has been suspended')
        break
      default:
        success('Document Updated', 'The document has been successfully updated')
    }

    setTimeout(() => {
      closeModal()
    }, 500)
  } catch (err) {
    console.error('Error updating document:', err)
    error('Update Failed', 'Failed to update the document. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const maxSize = 5 * 1024 * 1024 * 1024
    if (file.size > maxSize) {
      error('File Too Large', 'File size must be less than 5GB')
      return
    }

    editForm.attachment = file
    success('File Selected', `Selected: ${file.name}`)
  }
}

const handleFileDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    const maxSize = 5 * 1024 * 1024 * 1024
    if (file.size > maxSize) {
      error('File Too Large', 'File size must be less than 5GB')
      return
    }

    editForm.attachment = file
    success('File Attached', `Attached: ${file.name}`)
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-[#19141461] bg-opacity-90 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <div class="flex items-center justify-between p-6 border-b border-[#eaecf0]">
        <h2 class="text-xl font-medium text-[#101828]">Edit {{ props.document.status }} Document</h2>
        <button @click="closeModal" class="p-1 hover:bg-gray-100 rounded">
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-[#344054] mb-1">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="editForm.title"
            type="text"
            placeholder="Enter document title"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#697b9d] focus:border-transparent"
            :class="{ 'border-red-300': !editForm.title.trim() }"
          />
        </div>

        <!-- Created By and Filed By -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#344054] mb-1">
              Created By <span class="text-red-500">*</span>
            </label>
            <input
              v-model="editForm.created_by"
              type="text"
              placeholder="Enter creator name"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#697b9d] focus:border-transparent"
              :class="{ 'border-red-300': !editForm.created_by.trim() }"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#344054] mb-1">Filed By</label>
            <input
              v-model="editForm.filed_by"
              type="text"
              placeholder="Enter filer name"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#697b9d] focus:border-transparent"
            />
          </div>
        </div>

        <!-- Attachment -->
        <div>
          <label class="block text-sm font-medium text-[#344054] mb-1">Attachment</label>
          <div
            class="border-2 border-dashed border-[#d0d5dd] rounded-lg p-8 text-center hover:border-[#697b9d] transition-colors cursor-pointer"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
            @click="triggerFileInput"
          >
            <Upload class="w-8 h-8 text-[#667085] mx-auto mb-2" />
            <p class="text-sm text-[#667085]">
              Drop here to attach or
              <button class="text-[#0070ff] underline">upload</button>
            </p>
            <p class="text-xs text-[#667085] mt-1">Max size: 5GB</p>
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              @change="handleFileSelect"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
          </div>
          <div v-if="editForm.attachment" class="mt-2 text-sm text-[#344054]">
            Selected: {{ editForm.attachment.name }}
          </div>
        </div>

        <!-- Created Date and Filed Date -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#344054] mb-1">Created Date</label>
            <div class="relative max-w-sm">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                  />
                </svg>
              </div>
              <input
                v-model="createdDateForInput"
                type="date"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                placeholder="Select date"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#344054] mb-1">Filed Date</label>
            <div class="relative max-w-sm">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                  />
                </svg>
              </div>
              <input
                v-model="filedDateForInput"
                type="date"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                placeholder="Select date"
              />
            </div>
          </div>
        </div>

        <!-- Action -->
        <div>
          <label class="block text-sm font-medium text-[#344054] mb-2">Action</label>
          <div class="flex gap-3 py-4">
            <button
              @click="selectedAction = 'Not Filed'"
              class="flex-1 border border-[#d0d5dd] text-[#344054] p-3 rounded-md transition-colors hover:bg-gray-50"
              :class="{ 'bg-gray-100 border-gray-400': selectedAction === 'Not Filed' }"
            >
              <span class="flex items-center justify-center gap-2">
                <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Not Filed'" />
                Unfile
              </span>
            </button>

            <button
              @click="selectedAction = 'Filed'"
              class="flex-1 border border-[#d0d5dd] text-[#344054] p-3 rounded-md transition-colors hover:bg-gray-50"
              :class="{ 'bg-gray-100 border-gray-400': selectedAction === 'Filed' }"
            >
              <span class="flex items-center justify-center gap-2">
                <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Filed'" />
                File
              </span>
            </button>

            <button
              @click="selectedAction = 'Suspended'"
              class="flex-1 border border-[#d0d5dd] text-[#344054] p-3 rounded-md transition-colors hover:bg-gray-50"
              :class="{ 'bg-gray-100 border-gray-400': selectedAction === 'Suspended' }"
            >
              <span class="flex items-center justify-center gap-2">
                <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Suspended'" />
                Suspend
              </span>
            </button>

            <button
              @click="selectedAction = 'Delete'"
              class="flex-1 border border-[#fc0000] text-[#e81a1a] p-3 rounded-md transition-colors hover:bg-red-50"
              :class="{ 'bg-red-100 border-red-600': selectedAction === 'Delete' }"
            >
              <span class="flex items-center justify-center gap-2">
                <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Delete'" />
                Delete
              </span>
            </button>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="closeModal"
            class="px-6 py-2 border border-[#d0d5dd] text-[#344054] rounded-md hover:bg-[#f9fafb] transition-colors"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            @click="applyChanges"
            class="px-6 py-2 bg-[#697b9d] hover:bg-[#5a6a8a] text-white rounded-md transition-colors flex items-center gap-2"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ isLoading ? 'Updating...' : 'Apply' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}
</style>
