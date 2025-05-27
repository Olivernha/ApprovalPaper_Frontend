<template>
  <tr v-for="doc in documents" :key="doc.ref_no" class="border-b border-b-gray-300 hover:bg-gray-50 transition-colors">
    <td class="py-3 px-4">{{ doc.ref_no }}</td>
    <td class="py-3 px-4">{{ doc.full_ref }}</td>
    <td class="py-3 px-4">{{ doc.title }}</td>
    <td class="py-3 px-4">{{ doc.created_by }}</td>
    <td class="py-3 px-4">{{ doc.created_date.slice(0, 10) }}</td>
    <td class="py-3 ">
      <DocumentStatus :status="doc.status" :isLoading="documentStore.isLoading" />
    </td>
    <td class="py-3 px-4 text-right">
      <button
        :disabled="documentStore.isLoading"
        class="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1 rounded hover:bg-gray-100"
      >
        <MoreVerticalIcon class="h-4 w-4" />
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { MoreVertical as MoreVerticalIcon } from 'lucide-vue-next'
import DocumentStatus from './DataStatus.vue'
import { useDocumentStore } from '@/stores/documentStore';
import { computed } from 'vue';

const documentStore = useDocumentStore();
const documents = computed(() => documentStore.documents);
</script>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
