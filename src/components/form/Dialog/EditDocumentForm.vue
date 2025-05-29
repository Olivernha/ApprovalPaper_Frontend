<template>
  <div class="fixed inset-0 bg-[#19141461] bg-opacity-90 flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" @click.stop>
      <div class="flex items-center justify-between p-6 border-b border-[#eaecf0]">
        <h3 class="text-xl font-semibold text-[#101828]">Edit Document</h3>
        <button @click="closeModal" class="text-[#667085] hover:text-[#344054]">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-6">

        <div>
          <label class="block text-sm font-medium text-[#344054] mb-1">Title</label>
          <input v-model="editTitle" placeholder="Enter document title"
            class="w-full border border-[#d0d5dd] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-[#344054] mb-1">Attachment</label>
          <div class="border-2 border-dashed border-[#d0d5dd] rounded-lg p-8 text-center">
            <Upload class="w-8 h-8 text-[#667085] mx-auto mb-2" />
            <p class="text-sm text-[#667085]">
              Drop here to attach or <span @click="fileInputRef()?.click()"
                class="text-[#0070ff] cursor-pointer">upload</span>
            </p>
            <p class="text-xs text-[#919eab] mt-1">Max size: 5GB</p>
            <input type="file" ref="fileInput" @change="handleFileChange" class="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" />
          </div>
          <div v-if="selectedFile" class="mt-2 text-sm text-[#344054]">
            Selected: {{ selectedFile.name }}
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button @click="closeModal" :disabled="isLoading"
            class="flex-1 border border-[#d0d5dd] text-[#344054] py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button @click="applyChanges" :disabled="isLoading || !editTitle.trim()"
            class="flex-1 bg-[#697b9d] hover:bg-[#5a6b8a] text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Saving...' : 'Apply' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Upload } from 'lucide-vue-next'



interface Props {
  document: Document | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  update: [data: { title: string; file?: File }]
}>()

const editTitle = ref('')
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const fileInputRef = () => fileInput.value as HTMLInputElement | null
const isLoading = ref(false)

// Watch for document changes to populate form
watch(
  () => props.document,
  (newDoc) => {
    if (newDoc) {
      editTitle.value = newDoc.title || ''
      selectedFile.value = null
    }
  },
  { immediate: true }
)

function closeModal() {
  // Reset form
  editTitle.value = ''
  selectedFile.value = null
  emit('close')
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

async function applyChanges() {
  if (editTitle.value.trim() === '') {
    alert('Title cannot be empty')
    return
  }

  isLoading.value = true

  try {
    const updateData: { title: string; file?: File } = {
      title: editTitle.value.trim()
    }

    if (selectedFile.value) {
      updateData.file = selectedFile.value
    }
    console.log('Applying changes:', updateData)
    emit('update', updateData)
  } catch (error) {
    console.error('Error applying changes:', error)
    alert('Failed to update document')
  } finally {
    isLoading.value = false
  }
}
</script>
