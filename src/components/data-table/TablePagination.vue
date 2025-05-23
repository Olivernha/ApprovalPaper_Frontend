<template>
  <div class="flex justify-between items-center mt-4 text-sm">
    <div>Rows Per page</div>
    <div class="flex items-center gap-2">
      <div class="flex items-center border border-gray-300 rounded-md">
        <span class="px-3 py-1">1</span>
        <ChevronDownIcon class="h-4 w-4 mr-1" />
      </div>
      <span>1-5 of 50</span>
      <div class="flex">
        <button class="p-1 border border-gray-300 rounded-l-md bg-gray-100 disabled:opacity-50">
          <ChevronLeftIcon class="h-4 w-4" />
        </button>
        <button class="p-1 border border-gray-300 rounded-r-md border-l-0 disabled:opacity-50">
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
</script>
