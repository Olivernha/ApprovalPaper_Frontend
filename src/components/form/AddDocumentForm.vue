
<template>
  <div class="relative w-full h-full xl:h-96 xl:w-72 2xl:w-96 bg-white rounded-lg p-6">
    <h2 class="text-2xl font-medium mb-2">Add a new document</h2>
    <p class="text-gray-600 text-sm mb-6">
      Fill in the fields below and press add to generate a reference number
    </p>

    <form class="space-y-4" @submit.prevent="addDocument">
      <div>
        <label class="block mb-1 text-sm font-medium">Document Type</label>
        <div class="relative">
          <!-- Loading skeleton for select -->
          <div
            v-if="documentTypeStore.isLoading"
            class="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-100"
          >
            <div class="h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <!-- Actual select -->
          <select
            v-else
            v-model="newDocument.document_type_id"
            class="w-full px-4 text-gray-700 py-2 border border-gray-200 rounded-md appearance-none bg-gray-100 pr-10 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting || documentTypeStore.isLoading"
            required
          >
            <option value="" disabled selected>
              {{
                documentTypeStore.documentTypes.length === 0
                  ? 'Error loading types'
                  : 'Select Document Type'
              }}
            </option>
            <option v-for="type in documentTypeStore.documentTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>

          <!-- Loading spinner for select -->
          <div
            v-if="documentTypeStore.isLoading"
            class="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
          </div>

          <!-- Chevron icon -->
          <ChevronDownIcon
            v-else
            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-700"
          />
        </div>

        <!-- Error message for document types -->
        <p
          v-if="documentTypeStore.documentTypes.length === 0"
          class="mt-1 text-sm text-red-600 flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Failed to load document types
          <button
            @click="retryLoadDocumentTypes"
            class="underline hover:no-underline text-red-700 cursor-pointer"
            type="button"
          >
            Retry
          </button>
        </p>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Title</label>
        <input
          v-model="newDocument.title"
          type="text"
          placeholder="Value"
          class="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-500"
          :disabled="isSubmitting"
          required
        />
      </div>


      <button
        type="submit"
        :disabled="
          isSubmitting ||
          documentTypeStore.isLoading ||
          !newDocument.document_type_id ||
          !newDocument.title
        "
        class="w-full py-3 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <!-- Loading spinner -->
        <div
          v-if="isSubmitting"
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
        ></div>

        <!-- Button text -->
        <span>{{ isSubmitting ? 'Adding Document...' : 'Add Document' }}</span>
      </button>
    </form>

    <!-- Loading overlay for entire form -->
    <div
      v-if="isInitialLoading"
      class="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mx-auto mb-2"
        ></div>
        <p class="text-sm text-gray-600">Loading form...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocumentStore } from '@/stores/documentStore'
import { ChevronDown as ChevronDownIcon } from 'lucide-vue-next'
import { ref, onMounted, watch } from 'vue'
import { useDocumentTypeStore } from '@/stores/documentTypeStore'
import type { NewDocument } from '@/types/documentTypes'
import { useToast } from '@/composables/useToast.ts'

const { success, error } = useToast()
const documentTypeStore = useDocumentTypeStore()
const store = useDocumentStore()

const props = defineProps<{
  id: string
}>()

// Loading states
const isSubmitting = ref(false)
const isInitialLoading = ref(true)

const newDocument = ref<NewDocument>({
  department_id: props.id,
  document_type_id: '',
  title: '',
  created_date: '', // Optional field
})

// Initialize component
onMounted(async () => {
  try {
    await documentTypeStore.fetchDocumentTypes(props.id)
  } catch (err) {
    error('Failed to load document types. Please try again.')
    console.error('Error initializing form:', err)
  } finally {
    isInitialLoading.value = false
  }
})

const addDocument = async () => {
  // Validate required fields
  if (!newDocument.value.document_type_id || !newDocument.value.title || !newDocument.value.department_id) {
    error('Please fill in all required fields.')
    return
  }

  // Validate created_date if provided
  let formattedDate: string | undefined
  if (newDocument.value.created_date) {
    const date = new Date(newDocument.value.created_date)
    if (isNaN(date.getTime())) {
      error('Invalid date format for created date.')
      return
    }
    formattedDate = date.toISOString().split('T')[0]
  }

  isSubmitting.value = true

  try {
    await store.addDocument({
      document_type_id: newDocument.value.document_type_id,
      title: newDocument.value.title,
      department_id: newDocument.value.department_id,
      created_date: formattedDate,
    })

    success('Document added successfully!')

    // Reset form
    newDocument.value = {
      document_type_id: '',
      title: '',
      department_id: props.id,
      created_date: '',
    }
  } catch (err) {
    const errorMsg = (err as { message?: string }).message || 'Failed to add document.'
    error(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

const retryLoadDocumentTypes = async () => {
  try {
    await documentTypeStore.fetchDocumentTypes(props.id)
    success('Document types loaded successfully!')
  } catch (err) {
    error('Failed to reload document types. Please try again.')
    console.error('Error retrying document types:', err)
  }
}

watch(
  () => documentTypeStore.isLoading,
  (newValue) => {
    if (!newValue && isInitialLoading.value) {
      isInitialLoading.value = false
    }
  }
)
</script>

<style scoped>
form {
  min-height: 400px; /* adjust as needed */
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(100 116 139); /* slate-500 */
}

/* Disabled state improvements */
input:disabled,
select:disabled,
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Loading overlay positioning */
.relative {
  position: relative;
}
</style>
