<template>
  <header class="bg-slate-500 text-white p-6">
    <h1 class="text-2xl font-medium">
      <span v-if="isLoading" class="flex items-center">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        Loading...
      </span>
      <span v-else-if="!departmentName">Approval Registration System</span>
      <span v-else>{{ departmentName }} - Approval Registration System</span>
    </h1>
  </header>
</template>

<script setup lang="ts">
import { useDepartmentStore } from '@/stores/departmentStore'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const departmentStore = useDepartmentStore()


const isLoading = computed(() => departmentStore.isLoading)

// Get department name from store
const departmentName = computed(() => {
  if (route.params.id && typeof route.params.id === 'string') {
    const department = departmentStore.departments.find((dept) => dept._id === route.params.id)
    return department?.name || 'Unknown Department'
  }
  return ''
})
</script>

<style scoped></style>
