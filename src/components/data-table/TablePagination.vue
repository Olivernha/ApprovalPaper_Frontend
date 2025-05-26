<template>
  <div class="flex items-center justify-between mt-4 text-sm">
    <div class="flex items-center gap-2">
      <span>Rows Per page</span>
      <div class="relative">
        <select v-model="rowsPerPage"
          class="w-16 h-8 border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <ChevronDownIcon class="h-4 w-4 mr-1 absolute right-2 top-1/2 transform -translate-y-1/2" />
      </div>
    </div>
    <div class="flex items-center gap-4">
      <div>{{ paginationText }}</div>
      <div class="flex">
        <button
          class="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronLeftIcon class="h-4 w-4" />
        </button>
        <button
          class="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed">
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

// Watch rowsPerPage and fetch documents when it changes
watch(rowsPerPage, (newVal) => {
  store.rowsPerPage = parseInt(newVal as number, 10)
  store.fetchDocuments()
})

// Watch paginationText and update it when documents change
watch(() => store.documents, () => {
  paginationText.value = store.paginationText
}, { immediate: true })

</script>
