<template>
  <header class="bg-slate-500 text-white p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
    

        <!-- Dynamic Title -->
        <div>
          <h1 class="text-2xl font-medium">{{ dynamicTitle }}</h1>
          <p v-if="subtitle" class="text-sm text-slate-200 mt-1">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Actions/Navigation -->
      <div class="flex items-center gap-4">
        <!-- Breadcrumb Navigation -->
        <nav v-if="showBreadcrumb" class="hidden md:block">
          <ol class="flex items-center space-x-2 text-sm">
            <li>
              <router-link to="/" class="text-slate-200 hover:text-white transition-colors flex items-center gap-1">
                <Home class="w-4 h-4" />
                Home
              </router-link>
            </li>
            <li v-if="breadcrumbItems.length > 0" class="text-slate-300">/</li>
            <li v-for="(item, index) in breadcrumbItems" :key="index" class="flex items-center">
              <router-link
                v-if="item.path && index < breadcrumbItems.length - 1"
                :to="item.path"
                class="text-slate-200 hover:text-white transition-colors"
              >
                {{ item.name }}
              </router-link>
              <span v-else class="text-white font-medium">{{ item.name }}</span>
              <span v-if="index < breadcrumbItems.length - 1" class="text-slate-300 ml-2">/</span>
            </li>
          </ol>
        </nav>

      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDepartmentStore } from '@/stores/departmentStore'
import { Home } from 'lucide-vue-next'

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



// Breadcrumb logic
const showBreadcrumb = computed(() => route.name !== 'Home')

const breadcrumbItems = computed(() => {
  const items = []

  switch (route.name) {
    case 'Department':
      items.push({
        name: 'Departments',
        path: '/'
      })
      if (departmentName.value) {
        items.push({
          name: departmentName.value,
          path: null // Current page, no link
        })
      }
      break
    case 'NotFound':
      items.push({
        name: '404 Error',
        path: null
      })
      break
  }

  return items
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
