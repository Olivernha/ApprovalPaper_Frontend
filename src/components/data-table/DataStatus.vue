<template>
  <div class="flex items-center gap-2">
    <span class="h-2 w-2 rounded-full" :class="statusClasses.dot"></span>
    <span :class="statusClasses.text">
      {{ status }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusClasses = computed(() => {
  switch (props.status) {
    case 'Unfiled':
      return {
        dot: 'bg-red-500',
        text: 'text-red-500'
      }
    case 'Filed':
      return {
        dot: 'bg-green-500',
        text: 'text-green-500'
      }
    case 'Suspended':
      return {
        dot: 'bg-blue-500',
        text: 'text-blue-500'
      }
    default:
      return {
        dot: 'bg-gray-500',
        text: 'text-gray-500'
      }
  }
})
</script>

<style scoped>
/* Component-specific styles */
</style>
