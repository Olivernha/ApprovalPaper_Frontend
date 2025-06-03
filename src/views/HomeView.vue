<script setup lang="ts">
import { computed, ref, reactive, onMounted, watch } from 'vue'
import { useDepartmentStore } from '@/stores/departmentStore'
import { useDocumentStore } from '@/stores/documentStore'
import { Search, Folder, Building, SearchX, Star, FileText } from 'lucide-vue-next'

const departmentStore = useDepartmentStore()
const documentStore = useDocumentStore()
const departments = computed(() => departmentStore.departments)
const searchQuery = ref('')

const isLoading = computed(() => departmentStore.isLoading)

// Store document counts for each department
const departmentCounts = reactive<Record<string, {
  unfiled: number,
  filed: number,
  suspended: number,
  total: number
}>>({})

const filteredDepartments = computed(() => {
  if (!searchQuery.value) return departments.value

  const query = searchQuery.value.toLowerCase()
  return departments.value.filter((dept) => dept.name.toLowerCase().includes(query))
})

// Helper function to get document counts for a specific department
const getDepartmentDocumentCounts = (departmentId: string) => {
  return departmentCounts[departmentId] || {
    unfiled: 0,
    filed: 0,
    suspended: 0,
    total: 0
  }
}

// Function to fetch document counts for all departments
const fetchAllDepartmentCounts = async () => {
  for (const department of departments.value) {
    try {
      await documentStore.fetchDocCount(department._id)
      const counts = documentStore.countStatus

      departmentCounts[department._id] = {
        unfiled: counts['Not Filed'] || 0,
        filed: counts['Filed'] || 0,
        suspended: counts['Suspended'] || 0,
        total: (counts['Not Filed'] || 0) + (counts['Filed'] || 0) + (counts['Suspended'] || 0)
      }
    } catch (error) {
      console.error(`Error fetching counts for department ${department._id}:`, error)
      departmentCounts[department._id] = {
        unfiled: 0,
        filed: 0,
        suspended: 0,
        total: 0
      }
    }
  }
}

// Fetch counts when departments change
const loadDepartmentCounts = async () => {
  if (departments.value.length > 0) {
    await fetchAllDepartmentCounts()
  }
}

// Watch for departments to be loaded
watch(departments, () => {
  loadDepartmentCounts()
}, { immediate: true })

onMounted(() => {
  loadDepartmentCounts()
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-[#a41f36] rounded-full flex items-center justify-center text-white"
        >
          <Building class="w-5 h-5" />
        </div>
        <div>
          <h1 class="text-2xl font-semibold text-[#344054]">Departments</h1>
          <p class="text-[#667085]">Browse and access department documents</p>
        </div>
      </div>

      <div class="relative">
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]">
          <Search class="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search departments"
          v-model="searchQuery"
          class="pl-10 pr-4 py-2 w-64 bg-white border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a41f36] focus:border-transparent"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#697b9d]"></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredDepartments.length === 0"
      class="bg-white rounded-lg border border-[#eaecf0] p-8 text-center"
    >
      <div
        class="w-16 h-16 bg-[#f9fafb] rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <SearchX class="w-6 h-6 text-[#667085]" />
      </div>
      <h3 class="text-lg font-medium text-[#344054] mb-2">No departments found</h3>
      <p class="text-[#667085] mb-6">
        {{ searchQuery ? 'Try adjusting your search terms' : 'No departments available' }}
      </p>
    </div>

    <!-- Department Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="department in filteredDepartments"
        :key="department._id"
        class="bg-white rounded-lg border border-[#eaecf0] overflow-hidden hover:shadow-md transition-shadow duration-200"
      >
        <!-- Department Header -->
        <div class="p-5 border-b border-[#eaecf0]">
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 bg-[#f9fafb] rounded-full flex items-center justify-center text-[#697b9d]"
            >
              <Folder class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-medium text-[#344054]">{{ department.name }}</h3>
          </div>

          <!-- File Status Summary -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <FileText class="w-3 h-3 text-[#667085]" />
                <span class="text-[#667085]">Total Documents</span>
              </div>
              <span class="font-medium text-[#344054]">
                {{ getDepartmentDocumentCounts(department._id).total }}
              </span>
            </div>

            <!-- Status breakdown -->
            <div class="grid grid-cols-3 gap-2 mt-3">
              <div class="text-center p-2 bg-[#fef7f0] rounded-md">
                <div class="flex items-center justify-center gap-1 mb-1">
                  <Star class="w-3 h-3 text-[#a41f36]" />
                </div>
                <div class="text-xs text-[#667085]">Unfiled</div>
                <div class="text-sm font-medium text-[#344054]">
                  {{ getDepartmentDocumentCounts(department._id).unfiled }}
                </div>
              </div>

              <div class="text-center p-2 bg-[#f0fdf4] rounded-md">
                <div class="flex items-center justify-center gap-1 mb-1">
                  <Star class="w-3 h-3 text-[#14ba6d]" />
                </div>
                <div class="text-xs text-[#667085]">Filed</div>
                <div class="text-sm font-medium text-[#344054]">
                  {{ getDepartmentDocumentCounts(department._id).filed }}
                </div>
              </div>

              <div class="text-center p-2 bg-[#f9fafb] rounded-md">
                <div class="flex items-center justify-center gap-1 mb-1">
                  <Star class="w-3 h-3 text-[#667085]" />
                </div>
                <div class="text-xs text-[#667085]">Suspended</div>
                <div class="text-sm font-medium text-[#344054]">
                  {{ getDepartmentDocumentCounts(department._id).suspended }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="p-5">
          <router-link
            :to="{ name: 'Department', params: { id: department._id } }"
            class="block w-full bg-[#697b9d] hover:bg-[#5a6b8a] text-white text-center py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#697b9d] focus:ring-offset-2"
          >
            View Documents
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
