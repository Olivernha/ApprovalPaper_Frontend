<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDepartmentStore } from '@/stores/departmentStore'
import AppFooter from './components/layout/AppFooter.vue'
import AppHeader from './components/layout/AppHeader.vue'
// import axios from 'axios'


const departmentStore = useDepartmentStore()


const isLoading = ref(true)

onMounted(async () => {
  // const response = await axios.get(`http://tuasapp02/AuthBounce?host=${import.meta.env.VITE_FRONTEND_API_URL}`, {
  //   withCredentials: true,
  // })
  // const data = response.data.substring(8)
  // userStore.setUsername(data)
  // userStore.setUsername('anichols')

  try {
    await departmentStore.fetchDepartments()
    // await documentTypeStore.fetchDocumentTypes()
    // await documentStore.fetchDocuments()
    // await userStore.checkIsAdmin()
  } finally {
    isLoading.value = false
  }
})
</script>
<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <AppHeader />
    <router-view />
    <AppFooter />
  </div>
</template>

<style scoped>
/* Additional custom styles */
.router-link-active {
  @apply bg-[#5a6b8a];
}
</style>
