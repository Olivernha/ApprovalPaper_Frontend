<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDepartmentStore } from '@/stores/departmentStore'
import AppFooter from './components/layout/AppFooter.vue'
import AppHeader from './components/layout/AppHeader.vue'
import LoadingBar from './components/LoadingBar.vue'

const departmentStore = useDepartmentStore()
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  try {
    await departmentStore.fetchDepartments()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <LoadingBar />
    <AppHeader />
    <router-view />
    <AppFooter />
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-[#5a6b8a];
}
</style>
