<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] space-y-2">
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border max-w-sm transform transition-all duration-300',
            getToastClasses(toast.type)
          ]"
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <CheckCircleIcon v-if="toast.type === 'success'" class="w-5 h-5" />
            <XCircleIcon v-else-if="toast.type === 'error'" class="w-5 h-5" />
            <AlertCircleIcon v-else-if="toast.type === 'warning'" class="w-5 h-5" />
            <InfoIcon v-else class="w-5 h-5" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium" :class="getTextClasses(toast.type)">
              {{ toast.title }}
            </p>
            <p v-if="toast.message" class="text-sm opacity-90" :class="getTextClasses(toast.type)">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close button -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <XIcon class="w-4 h-4" :class="getTextClasses(toast.type)" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import {
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  X as XIcon
} from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const getToastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200'
    case 'error':
      return 'bg-red-50 border-red-200'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200'
    default:
      return 'bg-blue-50 border-blue-200'
  }
}

const getTextClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-800'
    case 'error':
      return 'text-red-800'
    case 'warning':
      return 'text-yellow-800'
    default:
      return 'text-blue-800'
  }
}

// Auto-remove toasts after their duration
onMounted(() => {
  const intervalId = setInterval(() => {
    toasts.value.forEach(toast => {
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          removeToast(toast.id)
        }, toast.duration)
      }
    })
  }, 100)

  // Clear the interval when the component is unmounted
  onUnmounted(() => clearInterval(intervalId))
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
