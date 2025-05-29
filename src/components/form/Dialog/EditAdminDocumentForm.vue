<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { X, Upload, Calendar, CheckIcon } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'

interface EditAdminDocumentFormProps {
  document: {
    title: string
    created_by: string
    filed_by: string
    created_date: string
    filed_date: string
    attachment?: File | null
    status?: string
  }
}

const props = defineProps<EditAdminDocumentFormProps>()
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'save', document: EditAdminDocumentFormProps['document']): void
}>()
const formatForDateTimeLocal = (date: Date | string | undefined): string => {
  return date ? new Date(date).toISOString().slice(0, 10) : ''
}

const createdDateForInput = ref(formatForDateTimeLocal(props.document.created_date))
const filedDateForInput = ref(formatForDateTimeLocal(props.document.filed_date))

const editForm = reactive({
  title: props.document.title,
  created_by: props.document.created_by,
  filed_by: props.document?.filed_by || '', // Optional chaining for backward compatibility
  created_date: props.document.created_date,
  filed_date: props.document.filed_date,
  attachment: props.document.attachment,
})

const selectedAction = ref(props.document.status)
const fileInput = ref<HTMLInputElement>()
const useStore = useUserStore();

const closeModal = () => {
  emit('close')
}


watch(() => selectedAction.value, (newAction) => {
  if (newAction === 'Filed') {

    filedDateForInput.value = formatForDateTimeLocal(new Date())
    editForm.filed_by = useStore.username
  }
  if (newAction === 'Not Filed') {

    filedDateForInput.value = '';
    editForm.filed_by = '';
  }
  if (newAction === 'Suspended') {

    editForm.filed_by = useStore.username
  }
})

watch(() => createdDateForInput.value, (newDate, oldDate) => {
  if (newDate === oldDate) return
  editForm.created_date = newDate ?? new Date(newDate).toISOString()
})

watch(() => filedDateForInput.value, (newDate, oldDate) => {
  if (newDate === oldDate) return
  editForm.filed_date = newDate ?? new Date(newDate).toISOString()
})

const applyChanges = () => {
  const updatedDocument: EditAdminDocumentFormProps['document'] = {
    ...editForm,
    status: selectedAction.value
  }
  emit('save', updatedDocument)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    editForm.attachment = file
  }
}

const handleFileDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    editForm.attachment = file
  }
}


</script>

<template>
  <div class="fixed inset-0 bg-[#19141461] bg-opacity-90  flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
      <div class="flex items-center justify-between p-6 border-b border-[#eaecf0]">
        <h2 class="text-xl font-medium text-[#101828]">Edit Filed Document</h2>
        <button @click="closeModal" class="p-1 hover:bg-gray-100 rounded">
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-[#344054] mb-1">Title</label>
          <input v-model="editForm.title" type="text" placeholder="title"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#697b9d] focus:border-transparent" />
        </div>

        <!-- Created By and Filed By -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#344054] mb-1">Created By</label>
            <input v-model="editForm.created_by" type="text" placeholder="title"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#697b9d] focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#344054] mb-1">Filed By</label>
            <input v-model="editForm.filed_by" type="text" placeholder="title"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#697b9d] focus:border-transparent" />
          </div>
        </div>

        <!-- Attachment -->
        <div>
          <label class="block text-sm font-medium text-[#344054] mb-1">Attachment</label>
          <div
            class="border-2 border-dashed border-[#d0d5dd] rounded-lg p-8 text-center hover:border-[#697b9d] transition-colors cursor-pointer"
            @dragover.prevent @drop.prevent="handleFileDrop" @click="triggerFileInput">
            <Upload class="w-8 h-8 text-[#667085] mx-auto mb-2" />
            <p class="text-sm text-[#667085]">
              Drop here to attach or
              <button class="text-[#0070ff] underline">upload</button>
            </p>
            <p class="text-xs text-[#667085] mt-1">Max size: 5GB</p>
            <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />
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
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input datepicker v-model="createdDateForInput" id="default-datepicker" type="date"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Select date">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#344054] mb-1">Filed Date</label>
            <div class="relative max-w-sm">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input v-model="filedDateForInput" id="default-datepicker" type="date"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Select date">
            </div>
          </div>
        </div>

        <!-- Action -->
        <div>
          <label class="block text-sm font-medium text-[#344054] mb-2">Action</label>
          <div class="flex gap-3 py-4">
            <button @click="selectedAction = 'Not Filed'"
              class="flex-1 border border-[#d0d5dd] text-[#344054] p-3 rounded-md"
              :class="{ 'bg-gray-100': selectedAction === 'Not Filed' }">
              <span class="flex items-center justify-center gap-2">
                <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Not Filed'" />
                Unfile
              </span>
            </button>

            <button @click="selectedAction = 'Filed'"
              class="flex-1 border border-[#d0d5dd] text-[#344054] p-3 rounded-md"
              :class="{ 'bg-gray-100': selectedAction === 'Filed' }">
              <span class="flex items-center justify-center gap-2">
                <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Filed'" />
                File
              </span>
            </button>
            <button @click="selectedAction = 'Suspended'"
              class="flex-1 border border-[#d0d5dd] text-[#344054] p-3 rounded-md"
              :class="{ 'bg-gray-100': selectedAction === 'Suspended' }">
              <span class="flex items-center justify-center gap-2">
                <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Suspended'" />
                Suspend
              </span>
            </button>
            <button @click="selectedAction = 'Delete'"
              class="flex-1 border border-[#fc0000] text-[#e81a1a] p-3 rounded-md"
              :class="{ 'bg-gray-100': selectedAction === 'Delete' }">
              <span class="flex items-center justify-center gap-2">
                <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Delete'" />
                Delete
              </span>
            </button>
          </div>

        </div>

        <!-- Footer Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button @click="closeModal"
            class="px-6 py-2 border border-[#d0d5dd] text-[#344054] rounded-md hover:bg-[#f9fafb] transition-colors">
            Cancel
          </button>
          <button @click="applyChanges"
            class="px-6 py-2 bg-[#697b9d] hover:bg-[#5a6a8a] text-white rounded-md transition-colors">
            Apply
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
