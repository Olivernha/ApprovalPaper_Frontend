<script setup lang="ts">
import TableData from '@/components/data-table/TableData.vue'
import AddDocumentForm from '@/components/form/AddDocumentForm.vue'
import DocumentSummaryCard from '@/components/DocumentSummaryCard.vue'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { PlusIcon, XIcon } from 'lucide-vue-next' // Import PlusIcon and XIcon

const userStore = useUserStore()
const props = defineProps<{
  id: string
}>()

// Controls the visibility of the AddDocumentForm for admins
const isAddDocumentFormCollapsed = ref(true)
const isUserDataLoaded = ref(false)
onMounted(async () => {
  console.log('Mounted For ApprovalPaper View')
  await userStore.fetchUserData()
  isUserDataLoaded.value = true
})
</script>

<template>
  <main class="flex-1 py-8 px-6 bg-[#f5f5f5] relative">
    <template v-if="isUserDataLoaded">
      <div class="flex flex-col lg:flex-row gap-2">
        <TableData :dept_id="props.id" />
        <div class="flex flex-col gap-6">
          <AddDocumentForm v-if="!userStore.userData?.isAdmin" :id="props.id" />
          <template v-if="userStore.userData?.isAdmin && !isAddDocumentFormCollapsed">
            <AddDocumentForm :id="props.id" />
            <DocumentSummaryCard :id="props.id" />
          </template>
        </div>
      </div>

      <!-- FAB for admins -->
      <button
        v-if="userStore.userData?.isAdmin"
        @click="isAddDocumentFormCollapsed = !isAddDocumentFormCollapsed"
        class="fixed bottom-6 right-6 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 z-50 transition-all duration-300 ease-in-out"
        aria-label="Toggle Add Document Form"
      >
        <PlusIcon v-if="isAddDocumentFormCollapsed" class="h-6 w-6" />
        <XIcon v-else class="h-6 w-6" />
        <span class="sr-only">{{ isAddDocumentFormCollapsed ? 'Open Add Document Form' : 'Close Add Document Form' }}</span>
      </button>
    </template>
  </main>
</template>


<style scoped></style>
