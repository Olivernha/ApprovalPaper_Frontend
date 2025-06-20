<script setup lang="ts">
import { computed, ref, reactive, onMounted, watch, onUnmounted } from 'vue'
import { useDepartmentStore } from '@/stores/departmentStore'
import { useDocumentStore } from '@/stores/documentStore'
import { Search, Folder, Building, SearchX, Star, FileText, AlertTriangle } from 'lucide-vue-next'
import { useLoadingBar } from '@/composables/useLoadingBar'

const departmentStore = useDepartmentStore()
const documentStore = useDocumentStore()
const departments = computed(() => departmentStore.departments)
const searchQuery = ref('')

const isLoading = computed(() => departmentStore.isLoading)
const { start: startLoading, finish: finishLoading } = useLoadingBar()

// Store document counts for each department
const departmentCounts = reactive<
  Record<
    string,
    {
      unfiled: number
      filed: number
      suspended: number
      total: number
    }
  >
>({})

const filteredDepartments = computed(() => {
  if (!searchQuery.value) return departments.value

  const query = searchQuery.value.toLowerCase()
  return departments.value.filter((dept) => dept.name.toLowerCase().includes(query))
})

// Helper function to get document counts for a specific department
const getDepartmentDocumentCounts = (departmentId: string) => {
  return (
    departmentCounts[departmentId] || {
      unfiled: 0,
      filed: 0,
      suspended: 0,
      total: 0,
    }
  )
}

// Function to fetch document counts for all departments
const fetchAllDepartmentCounts = async () => {
  const tempCounts = {};

  try {
    const fetchPromises = departments.value.map(async (department) => {
      try {
        await documentStore.fetchDocCount(department._id);
        const counts = documentStore.countStatus;
        tempCounts[department._id] = {
          unfiled: counts['Not Filed'] || 0,
          filed: counts['Filed'] || 0,
          suspended: counts['Suspended'] || 0,
          total: (counts['Not Filed'] || 0) + (counts['Filed'] || 0) + (counts['Suspended'] || 0),
        };
      } catch (error) {
        console.error(`Error fetching counts for department ${department._id}:`, error);
        tempCounts[department._id] = { unfiled: 0, filed: 0, suspended: 0, total: 0 };
      }
    });

    await Promise.all(fetchPromises);

    // Update reactive object once
    Object.assign(departmentCounts, tempCounts);
  } catch (error) {
    console.error('Error fetching all department counts:', error);
  }
};

// Fetch counts when departments change
const loadDepartmentCounts = async () => {
  if (departments.value.length > 0) {
    startLoading()
    try {
      await fetchAllDepartmentCounts()
    } finally {
      finishLoading()
    }
  }
}

// Watch for departments to be loaded
watch(
  departments,
  () => {
    loadDepartmentCounts()
  },
  { immediate: true },
)

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
          <!-- Department Name with Total Count -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-[#f9fafb] rounded-full flex items-center justify-center text-[#697b9d]"
              >
                <Folder class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-medium text-[#344054]">{{ department.name }}</h3>
            </div>

            <!-- Total Document Count Badge -->
            <div class="flex items-center gap-2 bg-[#f9fafb] px-3 py-1.5 rounded-full border border-[#eaecf0]">
              <FileText class="w-4 h-4 text-[#667085]" />
              <span class="text-sm font-semibold text-[#344054]">
                {{ getDepartmentDocumentCounts(department._id).total }}
              </span>
              <span class="text-xs text-[#667085]">docs</span>
            </div>
          </div>

          <!-- Status breakdown -->
          <div class="grid grid-cols-3 gap-3">
            <!-- Enhanced Unfiled Section -->
            <router-link
              :to="{ name: 'Department', params: { id: department._id }, query: { status: 'Not Filed' } }"
              class="text-center p-3 bg-gradient-to-br from-[#fef2f2] to-[#fee2e2] rounded-lg border-2 border-[#fca5a5] shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex items-center justify-center gap-1 mb-2">
                <AlertTriangle class="w-4 h-4 text-[#dc2626]" />
              </div>
              <div class="text-xs font-semibold text-[#991b1b] uppercase tracking-wide mb-1">
                Unfiled
              </div>
              <div class="text-lg font-bold text-[#dc2626] bg-white rounded-md py-1 px-2 shadow-sm">
                {{ getDepartmentDocumentCounts(department._id).unfiled }}
              </div>
              <!-- Attention indicator for unfiled documents -->
              <div
                v-if="getDepartmentDocumentCounts(department._id).unfiled > 0"
                class="w-2 h-2 bg-[#dc2626] rounded-full mx-auto mt-2 animate-pulse"
              ></div>
            </router-link>

            <!-- Filed Section -->
            <router-link
              :to="{ name: 'Department', params: { id: department._id }, query: { status: 'Filed' } }"
              class="text-center p-3 bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0] rounded-lg border border-[#6ee7b7] hover:shadow-sm transition-shadow duration-200"
            >
              <div class="flex items-center justify-center gap-1 mb-2">
                <Star class="w-4 h-4 text-[#059669]" />
              </div>
              <div class="text-xs font-medium text-[#065f46] uppercase tracking-wide mb-1">
                Filed
              </div>
              <div class="text-lg font-bold text-[#059669]">
                {{ getDepartmentDocumentCounts(department._id).filed }}
              </div>
            </router-link>

            <!-- Suspended Section -->
            <router-link
              :to="{ name: 'Department', params: { id: department._id }, query: { status: 'Suspended' } }"
              class="text-center p-3 bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe] rounded-lg border border-[#a5b4fc] hover:shadow-sm transition-shadow duration-200"
            >
              <div class="flex items-center justify-center gap-1 mb-2">
                <Star class="w-4 h-4 text-[#4f46e5]" />
              </div>
              <div class="text-xs font-medium text-[#3730a3] uppercase tracking-wide mb-1">
                Suspended
              </div>
              <div class="text-lg font-bold text-[#4f46e5]">
                {{ getDepartmentDocumentCounts(department._id).suspended }}
              </div>
            </router-link>
          </div>
        </div>

        <!-- Action Button -->
        <div class="p-5">
          <router-link
            :to="{ name: 'Department', params: { id: department._id } }"
            class="block w-full bg-[#697b9d] hover:bg-[#5a6b8a] text-white text-center py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#697b9d] focus:ring-offset-2"
          >
            View All Documents
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
