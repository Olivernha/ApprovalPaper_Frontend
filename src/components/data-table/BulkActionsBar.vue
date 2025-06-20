<template>
  <div v-if="selectedCount > 0" class="flex items-center justify-between px-6 py-3 bg-blue-50 border-b border-blue-200">
    <div class="flex items-center gap-3">
      <span class="text-sm font-medium text-gray-900">
        {{ selectedCount }} {{ selectedCount === 1 ? 'document' : 'documents' }} selected
      </span>
      <button @click="clearSelection" class="text-sm text-gray-600 hover:text-gray-800 underline">
        Clear selection
      </button>
    </div>

    <div class="flex items-center gap-2">


      <!-- Bulk Button -->
      <button @click="openChooseFromModal" :disabled="isLoading"
        class="flex items-center gap-2 px-3 py-2 bg-[#697b9d] text-white rounded-md hover:bg-slate-500 disabled:opacity-50 text-sm cursor-pointer">
        <SettingsIcon class="w-4 h-4" />
        Bulk Action
      </button>
    </div>
  </div>
  <Teleport to="body">
    <BulkActionForm :show-choose-from-modal="showChooseFromModal" @apply-action="applyAction"
      @reset-selection="showChooseFromModal = false" />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'
import { Settings as SettingsIcon } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documentStore'
import BulkActionForm from '../form/Dialog/BulkActionForm.vue'

import { useToast } from '@/composables/useToast.ts'
const documentStore = useDocumentStore()
const showChooseFromModal = ref(false);

const selectedCount = computed(() => documentStore.selectedCount)
const isLoading = computed(() => documentStore.isLoading)
const { success, error } = useToast()


const clearSelection = () => {
  documentStore.clearSelection()
}

const openChooseFromModal = () => {
  showChooseFromModal.value = true
}

const applyAction = (action: string) => {
  if (!action) {
    alert('Please select an action to apply.')
    return;
  }
  documentStore.applyBulkAction(action)
  showChooseFromModal.value = false
  documentStore.clearSelection()
  success(`Bulk action "${action}" applied successfully!`)

}
</script>
