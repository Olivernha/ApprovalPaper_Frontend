<template>
  <div class="flex items-center mb-4 flex-wrap md:flex-nowarp">
    <div class="flex items-center gap-2">
      <img src="@/assets/img/tuaslogo.png" alt="Logo" class="h-8 w-8">
      <div class="text-2xl font-medium">Documents</div>
    </div>
    <div class="ml-auto flex items-center gap-2">
      <div class="relative">
        <input v-model="store.searchQuery" type="text" placeholder="Search..."
          class="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-md focus:outline-none">
        <button v-if="store.searchQuery" @click="clearSearch"
          class="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-700">
          <XIcon class="h-4 w-4" />
        </button>
      </div>

      <div class="relative w-64">
        <select
          class="w-full px-4 text-gray-700 py-2 border border-gray-300 rounded-md appearance-none pr-10 focus:outline-none">
          <option value="">Document Type</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="ENG">ENG</option>
          <option value="OP">OP</option>
          <option value="MKT">MKT</option>
          <option value="RND">RND</option>
          <option value="ADM">ADM</option>
        </select>
        <ChevronDownIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-700" />
      </div>
      <button
        class="flex items-center text-gray-700  gap-1 px-4 py-2 border border-gray-300 rounded-md bg-white whitespace-nowrap">
        <DownloadIcon class="h-4 w-4 mr-2" />
        Export
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ChevronDown as ChevronDownIcon, Download as DownloadIcon, X as XIcon } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documentStore'
import { watch } from 'vue';
const store = useDocumentStore();

watch(() => store.searchQuery, async (oldQuery, newQuery) => {
  if (oldQuery !== newQuery) {
    await store.fetchDocuments();
  }
}, { immediate: true });
const clearSearch = async () => {
  store.searchQuery = '';
};
</script>
