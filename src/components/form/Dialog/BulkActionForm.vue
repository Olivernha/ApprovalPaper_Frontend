<template>
  <div v-if="showChooseFromModal"
    class="fixed inset-0 bg-[#19141461] bg-opacity-90 flex items-center justify-center z-50" @click.self="closeModal">
    <div class="bg-white rounded-lg w-full max-w-md">
      <div class="p-4 border-b border-[#eaecf0] flex justify-between items-center">
        <h3 class="text-[#344054] font-medium">Choose From</h3>
        <button @click="resetSelection" class="text-[#667085] hover:text-[#344054]">
          Reset
        </button>
      </div>

      <div class="p-4">
        <div class="flex gap-3 py-4">
          <button @click="selectedAction = 'Not Filed'"
            class="flex-1 border border-[#d0d5dd] text-[#344054] p-3 rounded-md"
            :class="{ 'bg-gray-100': selectedAction === 'Not Filed' }">
            <span class="flex items-center justify-center gap-2">
              <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Not Filed'" />
              Unfile
            </span>
          </button>

          <button @click="selectedAction = 'Filed'" class="flex-1 border border-[#d0d5dd] text-[#344054] p-3 rounded-md"
            :class="{ 'bg-gray-100': selectedAction === 'Filed' }">
            <span class="flex items-center justify-center gap-2">
              <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Filed'" />
              File
            </span>
          </button>
          <button @click="selectedAction = 'Suspended'"
            class="flex-1 border border-[#d0d5dd] text-[#344054] p-3 rounded-md"
            :class="{ 'bg-gray-100': selectedAction === 'Suspended' }">
            <span class="flex items-center justify-center gap-2">
              <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Suspended'" />
              Suspend
            </span>
          </button>
          <button @click="selectedAction = 'Delete'"
            class="flex-1 border border-[#fc0000] text-[#e81a1a] p-3 rounded-md"
            :class="{ 'bg-gray-100': selectedAction === 'Delete' }">
            <span class="flex items-center justify-center gap-2">
              <CheckIcon class="w-4 h-4" v-if="selectedAction === 'Delete'" />
              Delete
            </span>
          </button>
        </div>

        <div class="flex gap-3 pt-4">
          <button @click="closeModal" class="flex-1 bg-[#919eab] text-white border-[#919eab] h-10 rounded-md">
            Cancel
          </button>
          <button @click="applyAction" class="flex-1 bg-[#697b9d] hover:bg-[#5a6b8a] text-white h-10 rounded-md">
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showChooseFromModal: boolean;
}>();
const emit = defineEmits<{
  resetSelection: [];
  applyAction: [action: string];
}>();
import { CheckIcon } from 'lucide-vue-next';
import { ref } from 'vue';
const selectedAction = ref<string>('Not Filed');
const closeModal = () => emit('resetSelection');
const resetSelection = () => {
  selectedAction.value = 'Not Filed'; // Reset to default action
  emit('resetSelection');
};
const applyAction = () => {
  emit('applyAction', selectedAction.value);
  selectedAction.value = 'Not Filed'; // Reset after applying
  closeModal(); 
};

</script>
