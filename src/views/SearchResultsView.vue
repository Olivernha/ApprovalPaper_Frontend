<template>
  <div class="flex-1 w-full p-4 ">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-[#a41f36] rounded-full flex items-center justify-center text-white"
        >
          <FileText class="w-5 h-5" />
        </div>
        <div>
          <h1 class="text-2xl font-semibold text-[#344054]">
            Search Results for "{{ searchQuery.search }}"
          </h1>
          <p class="text-[#667085]">Documents matching your query across all departments</p>
        </div>
      </div>
    </div>
    <div class="bg-white  rounded-md shadow-sm p-4 relative">
      <!-- Loading Overlay -->
      <div
        v-if="isInitialLoading"
        class="absolute h-64 inset-0 bg-white bg-opacity-90 rounded-md flex items-center justify-center z-10"
      >
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto mb-4"
          ></div>
          <p class="text-lg font-medium text-gray-700">Loading Documents...</p>
          <p class="text-sm text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
      <BulkActionsBar />
      <!--Table-->
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse table-auto">
          <TableHead />

          <tbody>
            <!-- Loading Skeleton Rows -->
            <template v-if="documentStore.isLoading && !isInitialLoading">
              <tr
                v-for="n in documentStore.rowsPerPage"
                :key="`skeleton-${n}`"
                class="border-b border-b-gray-300"
              >
                <td class="py-3 px-4">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </td>
                <td class="py-3 px-4">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </td>
                <td class="py-3 px-4">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                </td>
                <td class="py-3 px-4">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                </td>
                <td class="py-3 px-4">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </td>
                <td class="py-3 px-4">
                  <div class="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                </td>
                <td class="py-3 px-4">
                  <div class="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
              </tr>
            </template>

            <!-- Actual Data -->
            <TableRow v-else  />

            <!-- Empty State -->
            <tr v-if="!documentStore.isLoading && documentStore.documents.length === 0">
              <td colspan="7" class="py-12 px-4 text-center text-gray-500">
                <div class="flex flex-col items-center gap-3">
                  <svg
                    class="w-16 h-16 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <div>
                    <p class="text-lg font-medium text-gray-900">No documents found</p>
                    <p class="text-sm text-gray-500 mt-1">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                  <button
                    @click="refreshDocuments"
                    class="mt-2 px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

import TableHead from '@/components/data-table/TableHead.vue'
import TableRow from '@/components/data-table/TableRow.vue'

import { useDocumentStore } from '@/stores/documentStore'

import { FileText} from 'lucide-vue-next'
import BulkActionsBar from '@/components/data-table/BulkActionsBar.vue'
import TableHeader from '@/components/data-table/TableHeader.vue'

const documentStore = useDocumentStore()
const route = useRoute()
const isInitialLoading = ref(true)
const searchQuery = ref('')
const refreshDocuments = async () => {
  isInitialLoading.value = true
  await documentStore.fetchDocuments()
  isInitialLoading.value = false
}

onMounted(async () => {

  try {
    // router.push({
    //   name: 'SearchResults',
    //   query: {
    //     ...router.currentRoute.value.query,
    //     query: documentSearchQuery.value,
    //     status: searchQuery.value,
    //   },
    // });
    searchQuery.value = {
      search: route.query.query || '',
      status: route.query.status || '',
    }
    console.log(searchQuery.value)
    documentStore.searchGlobalQuery = searchQuery.value
    await documentStore.fetchSearchResults(searchQuery.value)
  } finally {
    isInitialLoading.value = false
  }
})
onBeforeUnmount(() => {
  documentStore.resetState()
})
</script>

<style scoped>
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

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>

<style scoped></style>
