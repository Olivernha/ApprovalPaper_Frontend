<template>
  <div class="flex items-center justify-between mt-4 text-sm">
    <div class="flex items-center gap-2">
      <span>Rows Per page</span>
      <div class="relative">
        <select
          v-model="rowsPerPage"
          :disabled="store.isLoading"
          class="w-16 h-8 border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <ChevronDownIcon class="h-4 w-4 mr-1 absolute right-2 top-1/2 transform -translate-y-1/2" />
      </div>
    </div>
    <div class="flex items-center gap-4">
      <!-- Loading skeleton for pagination text -->
      <div v-if="store.isLoading" class="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
      <div v-else>{{ paginationText }}</div>

      <div class="flex">
        <button
          @click="previousPage"
          :disabled="!store.hasPrev || store.isLoading"
          class="h-8 w-8 cursor-pointer flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeftIcon class="h-4 w-4" />
        </button>
        <button
          @click="nextPage"
          :disabled="!store.hasNext || store.isLoading"
          class="h-8 w-8 cursor-pointer flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRightIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'

const store = useDocumentStore()

const rowsPerPage = ref(store.rowsPerPage)
const paginationText = ref(store.paginationText)

watch(rowsPerPage, async (newVal) => {
  if (store.isLoading) return

  store.rowsPerPage = parseInt(newVal as unknown as string, 10)
  store.currentPage = 1 // Reset to first page
  await store.fetchDocuments()
})

watch(() => store.documents, () => {
  paginationText.value = store.paginationText
}, { immediate: true })

const previousPage = async () => {
  if (store.hasPrev && !store.isLoading) {
    store.currentPage--
    await store.fetchDocuments()
  }
}

const nextPage = async () => {
  if (store.hasNext && !store.isLoading) {
    store.currentPage++
    await store.fetchDocuments()
  }
}
</script>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
