<script setup lang="ts">
import TableData from '@/components/data-table/TableData.vue'
import AddDocumentForm from '@/components/form/AddDocumentForm.vue'
import DocumentSummaryCard from '@/components/DocumentSummaryCard.vue'
import { onMounted } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'
import { useDocumentTypeStore } from '@/stores/documentTypeStore'
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'
const documentStore = useDocumentStore()
const documentTypeStore = useDocumentTypeStore()
const userStore = useUserStore()
const props = defineProps<{
  id: string
}>()

onMounted(async () => {
  const response = await axios.get(
    `http://tuasapp02/AuthBounce?host=${import.meta.env.VITE_FRONTEND_API_URL}`,
    {
      withCredentials: true,
    },
  )
  const data = response.data.substring(8)
  userStore.setUsername(data)
  documentStore.departmentId = props.id
  await documentTypeStore.fetchDocumentTypes(props.id)
  await documentStore.fetchDocuments()
  await userStore.checkIsAdmin()
})
</script>

<template>
  <main class="flex-1 p-8 bg-[#f5f5f5]">
    <div class="flex flex-col lg:flex-row gap-6">
      <TableData />
      <div class="flex flex-col gap-6">
        <AddDocumentForm :id="props.id" />
        <DocumentSummaryCard v-if="userStore.isAdmin" />
      </div>
    </div>
  </main>
</template>

<style scoped></style>
