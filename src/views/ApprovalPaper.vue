<script setup lang="ts">
import TableData from '@/components/data-table/TableData.vue'
import AddDocumentForm from '@/components/form/AddDocumentForm.vue'
import DocumentSummaryCard from '@/components/DocumentSummaryCard.vue'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { PlusIcon, XIcon } from 'lucide-vue-next'
import { useDocumentTypeStore } from '@/stores/documentTypeStore.ts' // Import PlusIcon and XIcon

const userStore = useUserStore()
const documentTypeStore = useDocumentTypeStore();
const props = defineProps<{
  id: string // deparmentID
}>()

// Controls the visibility of the AddDocumentForm for admins
const isAddDocumentFormCollapsed = ref(true)
const isUserDataLoaded = ref(false)
const hasBeenClicked = ref(false)
const hasBeenHovered = ref(false)

onMounted(async () => {
  console.log('Mounted For ApprovalPaper View')
  await documentTypeStore.fetchDocumentTypes(props.id)
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
            <AddDocumentForm :id="props.id" :isAdmin="userStore.userData?.isAdmin"/>
            <DocumentSummaryCard :id="props.id" />
          </template>
        </div>
      </div>

      <!-- FAB for admins with blinking tooltip -->
      <div v-if="userStore.userData?.isAdmin" class="fixed bottom-6 right-6 z-50">
        <!-- Mind-blowing Tooltip -->
        <div
          v-if="isAddDocumentFormCollapsed && !hasBeenClicked && !hasBeenHovered"
          class="absolute bottom-full right-5 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-2xl whitespace-nowrap animate-mind-blow"
        >
          Generate a new reference
          <!-- Tooltip arrow -->
          <div class="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>

        <button
          @click="() => { isAddDocumentFormCollapsed = !isAddDocumentFormCollapsed; hasBeenClicked = true }"
          @mouseenter="hasBeenHovered = true"
          class="bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 ease-in-out"
          aria-label="Toggle Add Document Form"
        >
          <PlusIcon v-if="isAddDocumentFormCollapsed" class="h-6 w-6" />
          <XIcon v-else class="h-6 w-6" />
          <span class="sr-only">{{ isAddDocumentFormCollapsed ? 'Open Add Document Form' : 'Close Add Document Form' }}</span>
        </button>
      </div>
    </template>
  </main>
</template>

<style scoped>
.animate-mind-blow {
  animation: mindBlow 2.5s ease-in-out infinite;
}

@keyframes mindBlow {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.5) rotateX(90deg);
    filter: blur(5px);
  }

  20% {
    opacity: 1;
    transform: translateY(-5px) scale(1.1) rotateX(0deg);
    filter: blur(0px);
  }

  40% {
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: blur(0px);
  }

  60% {
    transform: translateY(-2px) scale(1.05) rotateX(5deg);
    filter: blur(0px);
  }

  80% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: blur(0px);
  }

  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.8) rotateX(-90deg);
    filter: blur(3px);
  }
}
</style>
