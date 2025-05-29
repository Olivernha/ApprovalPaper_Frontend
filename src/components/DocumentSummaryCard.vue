<template>
  <div class="bg-white rounded-lg shadow-sm p-6 relative">
    <h3 class="text-lg text-[#101828] font-medium mb-4">Document Summary</h3>

    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Star class="w-4 h-4 text-[#a41f36]" />
          <span class="text-sm text-[#344054]">Unfiled</span>
        </div>
        <div v-if="isLoading" class="animate-pulse">
          <div class="h-4 w-6 bg-gray-200 rounded"></div>
        </div>
        <span v-else class="text-sm font-medium text-[#344054]">{{ unfiledCount }}</span>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Star class="w-4 h-4 text-[#14ba6d]" />
          <span class="text-sm text-[#344054]">Filed</span>
        </div>
        <div v-if="isLoading" class="animate-pulse">
          <div class="h-4 w-6 bg-gray-200 rounded"></div>
        </div>
        <span v-else class="text-sm font-medium text-[#344054]">{{ filedCount }}</span>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Star class="w-4 h-4 text-[#667085]" />
          <span class="text-sm text-[#344054]">Suspended</span>
        </div>
        <div v-if="isLoading" class="animate-pulse">
          <div class="h-4 w-6 bg-gray-200 rounded"></div>
        </div>
        <span v-else class="text-sm font-medium text-[#344054]">{{ suspendedCount }}</span>
      </div>
    </div>

    <!-- Loading overlay for entire section -->
    <div v-if="isLoading" class="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
      <div class="flex items-center gap-2 text-[#667085]">
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-[#667085] border-t-transparent"></div>
        <span class="text-sm">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documentStore'

const store = useDocumentStore()
const isLoading = computed(() => store.isLoading)

const unfiledCount = computed(() => {
  return store.getUnfiledDocumentsCount
})

const filedCount = computed(() => {
  return store.getFiledDocuments.length
})

const suspendedCount = computed(() => {
  return store.getSuspendedDocuments.length
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
