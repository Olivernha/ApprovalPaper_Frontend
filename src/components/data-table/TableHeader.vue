<template>
  <ExportForm :showExportModal="showExportModal" @close="showExportModal = false" />
  <div class="flex items-center mb-4 flex-wrap md:flex-nowrap">
    <div class="flex items-center gap-2">
      <img src="@/assets/img/tuaslogo.png" alt="Logo" class="h-8 w-8" />
      <div class="text-2xl font-medium">Documents</div>
    </div>
    <div class="ml-auto flex items-center gap-2">
      <div class="relative">
        <input
          v-model.lazy="documentStore.searchQuery"
          type="text"
          placeholder="Search..."
          :disabled="documentStore.isLoading"
          class="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-md focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        />
        <button
          v-if="documentStore.searchQuery && !documentStore.isLoading"
          @click="clearSearch"
          class="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <XIcon class="h-4 w-4" />
        </button>

        <!-- Loading spinner in search -->
        <div
          v-if="documentStore.isLoading && documentStore.searchQuery"
          class="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
        </div>
      </div>

      <div class="relative w-64">
        <!-- Loading skeleton for select -->
        <div
          v-if="documentTypeStore.isLoading"
          class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
        >
          <div class="h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <!-- Actual select -->
        <select
          v-else
          class="w-full px-4 text-gray-700 py-2 border border-gray-300 rounded-md appearance-none pr-10 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          v-model="documentStore.selectedDocumentType"
          :disabled="documentStore.isLoading"
        >
          <option value="" disabled selected>Document Type</option>
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

      <button
        :disabled="documentStore.isLoading || isExporting"
        @click="showExportModal = true"
        class="flex items-center text-gray-700 gap-1 px-4 py-2 border border-gray-300 rounded-md bg-white whitespace-nowrap hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      >
        <div
          v-if="isExporting"
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"
        ></div>
        <DownloadIcon v-else class="h-4 w-4 mr-2" />
        {{ isExporting ? 'Exporting...' : 'Export' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronDown as ChevronDownIcon,
  Download as DownloadIcon,
  X as XIcon,
} from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documentStore'
import { useDocumentTypeStore } from '@/stores/documentTypeStore'
import { watch, ref} from 'vue'
import ExportForm from '../form/Dialog/ExportForm.vue'

const documentStore = useDocumentStore()
const documentTypeStore = useDocumentTypeStore()
const isExporting = ref(false)
const showExportModal = ref(false)

// Debounced search functionality
let searchTimeout: ReturnType<typeof setTimeout>

const fetchDocumentsDebounced = async () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(async () => {
    await documentStore.fetchDocuments()
  }, 300)
}

watch(
  () => [documentStore.searchQuery, documentStore.selectedDocumentType],
  async (newValues, oldValues) => {
    const [newSearchQuery, newDocumentType] = newValues
    const [oldSearchQuery, oldDocumentType] = oldValues || []

    if (oldSearchQuery !== newSearchQuery || oldDocumentType !== newDocumentType) {
      if (newSearchQuery !== oldSearchQuery) {
        await fetchDocumentsDebounced()
      } else {
        await documentStore.fetchDocuments()
      }
    }
  },
)

const clearSearch = async () => {
  documentStore.searchQuery = ''
}

</script>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
