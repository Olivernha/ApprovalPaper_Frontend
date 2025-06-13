<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-[#19141461] bg-opacity-90"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">{{ title }}</h2>
        <button @click="cancelModal" class="text-gray-500 hover:text-gray-700 focus:outline-none">
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body -->
      <p class="text-sm text-gray-600 mb-6">{{ message }}</p>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-3">
        <button
          @click="cancelModal"
          class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {{ cancelText }}
        </button>
        <button
          @click="confirmModal"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X as XIcon } from 'lucide-vue-next'

defineProps<{
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits(['confirm', 'cancel'])

const confirmModal = () => {
  try {
    emit('confirm')
  } catch (error) {
    console.error('Error emitting confirm event:', error)
  }
}

const cancelModal = () => {
  try {
    emit('cancel')
  } catch (error) {
    console.error('Error emitting cancel event:', error)
  }
}
</script>

<style scoped>
.fixed {
  transition: opacity 0.3s ease;
}
</style>
