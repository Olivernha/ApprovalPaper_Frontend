<template>
  <tr v-for="doc in documents" :key="doc._id" class="border-b border-b-gray-300 hover:bg-gray-50">
    <td class="py-3 px-4">{{ doc.ref_no }}</td>
    <td class="py-3 px-4">{{ doc.fullRef }}</td>
    <td class="py-3 px-4">{{ doc.title }}</td>
    <td class="py-3 px-4">{{ doc.created_by }}</td>
    <td class="py-3 px-4">{{ doc.created_date.slice(0, 10) }}</td>
    <td class="py-3 px-4">
      <DocumentStatus :status="doc.status" />
    </td>
    <td class="py-3 px-4 text-right">
      <button class="text-gray-500">
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

<style scoped></style>
