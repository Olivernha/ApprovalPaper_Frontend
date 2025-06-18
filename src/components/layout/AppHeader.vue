<template>
  <header class="bg-slate-500 text-white px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">


        <!-- Dynamic Title -->
        <div>
          <h1 class="text-2xl font-medium">{{ dynamicTitle }}</h1>
          <p v-if="subtitle" class="text-sm text-slate-200 mt-1">{{ subtitle }}</p>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDepartmentStore } from '@/stores/departmentStore'


const route = useRoute()
const departmentStore = useDepartmentStore()

// Get department name from store
const departmentName = computed(() => {
  if (route.params.id && typeof route.params.id === 'string') {
    const department = departmentStore.departments.find(dept => dept._id === route.params.id)
    return department?.name || 'Unknown Department'
  }
  return ''
})

// Dynamic title based on current route
const dynamicTitle = computed(() => {
  switch (route.name) {
    case 'Home':
      return 'Tuas Power - Approval Registration System'
    case 'Department':
      return `${departmentName.value} - Documents`
    case 'NotFound':
      return 'Page Not Found'
    default:
      return 'Approval Registration System'
  }
})


const subtitle = computed(() => {
  switch (route.name) {
    case 'Home':
      return 'Browse departments and manage documents'
    case 'Department':
      return 'Manage department documents and approvals'
    case 'NotFound':
      return 'The requested page could not be found'
    default:
      return null
  }
})



</script>

<style scoped>
/* Smooth transitions */
header {
  transition: all 0.3s ease;
}

/* Hover effects */
button:hover {
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .text-2xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  header {
    padding: 1rem;
  }

  .flex-items-center {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 640px) {
  .hidden {
    display: none !important;
  }
}
</style>
