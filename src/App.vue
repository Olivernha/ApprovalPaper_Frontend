<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue'
import TableData from './components/data-table/TableData.vue'
import AddDocumentForm from './components/form/AddDocumentForm.vue'
import { onMounted } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'
import { useDocumentTypeStore } from './stores/documentTypeStore'
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'
const userStore = useUserStore()
const documentStore = useDocumentStore()
const documentTypeStore = useDocumentTypeStore()
onMounted(async () => {
  // const response = await axios.get(`http://tuasapp02/AuthBounce?host=${import.meta.env.VITE_FRONTEND_API_URL}`, {
  //   withCredentials: true,
  // })
  // const data = response.data.substring(8)
  // userStore.setUsername(data)
  userStore.setUsername('kevinparker')
  await documentTypeStore.fetchDocumentTypes()
  await documentStore.fetchDocuments()
  await userStore.checkIsAdmin()
})

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <AppHeader />
    <main class="flex-1 p-8 bg-[#f5f5f5]">
      <div class="flex flex-col lg:flex-row gap-6">
        <TableData />
        <AddDocumentForm />
      </div>
    </main>
  </div>
</template>

<style scoped></style>
