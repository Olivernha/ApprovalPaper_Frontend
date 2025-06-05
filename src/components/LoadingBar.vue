<template>
  <Transition name="loading-bar">
    <div
      v-if="isLoading"
      class="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200"
    >
      <div
        class="h-full bg-gradient-to-r from-[#a41f36] to-[#697b9d] transition-all duration-300 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useLoadingBar } from '@/composables/useLoadingBar'

const { isLoading, progress } = useLoadingBar()
</script>

<style scoped>
.loading-bar-enter-active,
.loading-bar-leave-active {
  transition: opacity 0.3s ease;
}

.loading-bar-enter-from,
.loading-bar-leave-to {
  opacity: 0;
}
</style>
