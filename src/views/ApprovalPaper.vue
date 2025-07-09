<script setup lang="ts">
import TableData from '@/components/data-table/TableData.vue'
import AddDocumentForm from '@/components/form/AddDocumentForm.vue'
import DocumentSummaryCard from '@/components/DocumentSummaryCard.vue'
import { onMounted } from 'vue'


import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const props = defineProps<{
  id: string
}>()

onMounted(async () => {
  console.log('Mounted For ApprovalPaper View')

  await userStore.fetchUserData()

})
</script>

<template>
  <main class="flex-1 py-8 px-6 bg-[#f5f5f5]">
    <div class="flex flex-col lg:flex-row gap-2">
      <TableData :dept_id="props.id"/>
      <div class="flex flex-col gap-6">
        <AddDocumentForm v-if="!userStore.userData?.isAdmin" :id="props.id"/>
        <!-- <DocumentSummaryCard v-if="userStore.userData?.isAdmin"  :id="props.id"/> -->
      </div>
    </div>
  </main>
</template>

<style scoped></style>
