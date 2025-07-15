<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDepartmentStore } from '@/stores/departmentStore'
import AppFooter from './components/layout/AppFooter.vue'
import AppHeader from './components/layout/AppHeader.vue'
import LoadingBar from './components/LoadingBar.vue'
import { useRoute } from 'vue-router'
import NavigationBreadcrumb from './components/NavigationBreadcrumb.vue'
import ToastContainer from '@/components/ui/toastContainer.vue'
import { useUserStore } from './stores/userStore'

const departmentStore = useDepartmentStore()
const userStore = useUserStore()
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  try {
    await departmentStore.fetchDepartments()
    await userStore.fetchUserData()

  } finally {
    isLoading.value = false
  }
})

const route = useRoute()
const departmentName = computed(() => {
  if (route.params.id && typeof route.params.id === 'string') {
    const department = departmentStore.departments.find((dept) => dept._id === route.params.id)
    return department?.name || 'Unknown Department'
  }
  return ''
})

// Breadcrumb logic
const showBreadcrumb = computed(() => route.name !== 'Home')

const breadcrumbItems = computed(() => {
  const items = []

  switch (route.name) {
    case 'SearchResults':
      items.push({
        name: 'Search Results',
        path: undefined,
      })
      break
    case 'Department':
      items.push({
        name: 'Departments',
        path: '/',
      })
      if (departmentName.value) {
        items.push({
          name: departmentName.value,
          path: undefined,
        })
      }
      break
    case 'NotFound':
      items.push({
        name: '404 Error',
        path: undefined,
      })
      break
  }

  return items
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <LoadingBar />
    <AppHeader />

    <NavigationBreadcrumb
      v-if="showBreadcrumb"
      :breadcrumbItems="breadcrumbItems"
      aria-label="Breadcrumb"
    />

    <router-view />
    <!-- Toast Container -->
    <ToastContainer />
    <AppFooter />
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-[#5a6b8a];
}

/* Custom breadcrumb animations */
nav[aria-label="Breadcrumb"] ol li {
  animation: breadcrumbFadeIn 0.3s ease-in-out;
}

@keyframes breadcrumbFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects for better UX */
.breadcrumb-separator {
  transition: color 0.2s ease-in-out;
}

/* nav[aria-label="Breadcrumb"]:hover .breadcrumb-separator {
  @apply text-gray-500;
} */
</style>
