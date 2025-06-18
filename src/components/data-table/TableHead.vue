<template>
  <thead>
    <tr class="border-b border-b-gray-300 text-left text-sm text-gray-500">
      <!-- Bulk Selection Checkbox -->
      <th class="py-3 px-4 font-medium">
        <div v-if="userStore.userData?.isAdmin" class="flex items-center">
          <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll"
            :disabled="isLoading"
            class="w-4 h-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500 disabled:opacity-50 accent-[#A41F36]" />
        </div>
      </th>

      <th class="py-3 px-4 font-medium">
        <div class="flex items-center gap-1 cursor-pointer" @click="handleSort('ref_no')">
          Full Reference
          <component :is="getSortIcon('ref_no')" class="h-4 w-4 transition-transform duration-200"
            :class="{ 'opacity-50': isLoading }" />
        </div>
      </th>
      <th class="py-3 px-4 font-medium">
        <div class="flex items-center gap-1 cursor-pointer" @click="handleSort('title')">
          Title
          <component :is="getSortIcon('title')" class="h-4 w-4 transition-transform duration-200"
            :class="{ 'opacity-50': isLoading }" />
        </div>
      </th>
<!--      <th class="py-3 px-4 font-medium">-->
<!--        <div class="flex items-center gap-1 cursor-pointer" @click="handleSort('filed_by')">-->
<!--          Filed By-->
<!--          <component :is="getSortIcon('file_by')" class="h-4 w-4 transition-transform duration-200"-->
<!--            :class="{ 'opacity-50': isLoading }" />-->
<!--        </div>-->
<!--      </th>-->
      <th class="py-3 px-4 font-medium">
        <div class="flex items-center gap-1 cursor-pointer" @click="handleSort('filed_date')">
          Filed Date
          <component :is="getSortIcon('filed_date')" class="h-4 w-4 transition-transform duration-200"
            :class="{ 'opacity-50': isLoading }" />
        </div>
      </th>
<!--      <th class="py-3 px-4 font-medium">-->
<!--        <div class="flex items-center gap-1 cursor-pointer" @click="handleSort('created_by')">-->
<!--          Created By-->
<!--          <component :is="getSortIcon('created_by')" class="h-4 w-4 transition-transform duration-200"-->
<!--            :class="{ 'opacity-50': isLoading }" />-->
<!--        </div>-->
<!--      </th>-->
<!--      <th class="py-3 px-4 font-medium">-->
<!--        <div class="flex items-center gap-1 cursor-pointer" @click="handleSort('created_date')">-->
<!--          Date-->
<!--          <component :is="getSortIcon('created_date')" class="h-4 w-4 transition-transform duration-200"-->
<!--            :class="{ 'opacity-50': isLoading }" />-->
<!--        </div>-->
<!--      </th>-->

      <th class="py-3 px-4 font-medium"></th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import { ArrowDown as ArrowDownIcon, ArrowUp as ArrowUpIcon } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documentStore'
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue'

const documentStore = useDocumentStore()
const userStore = useUserStore()

const isLoading = computed(() => documentStore.isLoading)
const isAllSelected = computed(() => documentStore.isAllSelected)
const isIndeterminate = computed(() => documentStore.isIndeterminate)

const handleSort = async (field: string) => {
  if (isLoading.value) return

  documentStore.sortBy(field)
  await documentStore.fetchDocuments()
}

const getSortIcon = (field: string) => {
  if (documentStore.sortField === field) {
    return documentStore.sortDirection === 'asc' ? ArrowUpIcon : ArrowDownIcon
  }
  return ArrowDownIcon
}

const toggleSelectAll = () => {
  documentStore.toggleSelectAll()
}
</script>

<style scoped>
.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
