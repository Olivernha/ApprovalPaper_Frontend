<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed top-4 right-4 z-[9999] transform transition-all duration-300 ease-in-out"
      :class="[
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      ]"
    >
      <div
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border max-w-sm',
          toastClasses
        ]"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <CheckCircleIcon v-if="type === 'success'" class="w-5 h-5" />
          <XCircleIcon v-else-if="type === 'error'" class="w-5 h-5" />
          <AlertCircleIcon v-else-if="type === 'warning'" class="w-5 h-5" />
          <InfoIcon v-else class="w-5 h-5" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium" :class="textClasses">
            {{ title }}
          </p>
          <p v-if="message" class="text-sm opacity-90" :class="textClasses">
            {{ message }}
          </p>
        </div>

        <!-- Close button -->
        <button
          @click="close"
          class="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <XIcon class="w-4 h-4" :class="textClasses" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  X as XIcon
} from 'lucide-vue-next'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 4000,
  visible: false
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = ref(props.visible)

const toastClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800'
  }
})

const textClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-800'
    case 'error':
      return 'text-red-800'
    case 'warning':
      return 'text-yellow-800'
    default:
      return 'text-blue-800'
  }
})

const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

onMounted(() => {
  visible.value = true

  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>
