<template>
  <div class="flex items-center justify-between mt-4 text-sm">
    <div class="flex items-center gap-2">
      <span>Rows Per page</span>
      <div class="relative">
        <select
          class="w-16 h-8 border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <ChevronDownIcon class="h-4 w-4 mr-1 absolute right-2 top-1/2 transform -translate-y-1/2" />
      </div>
    </div>
    <div class="flex items-center gap-4">
      <div>Page</div>
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
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/documentStore'
const documentStore = storeToRefs(useDocumentStore())
const rowsPerPageOptions = [10, 50, 100]
const { totalPages } = documentStore;
console.log(totalPages, rowsPerPageOptions);

</script>
