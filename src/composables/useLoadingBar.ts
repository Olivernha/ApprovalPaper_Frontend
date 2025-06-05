import { readonly, ref } from 'vue'

const isLoading = ref(false)
const progress = ref(0)

export const useLoadingBar = () => {
  let progressInterval: number | null = null

  const start = () => {
    isLoading.value = true
    progress.value = 0

    // Simulate progress with intervals
    progressInterval = window.setInterval(() => {
      if (progress.value < 90) {
        progress.value += Math.random() * 10
      }
    }, 200)
  }

  const finish = () => {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }

    progress.value = 100

    // Hide the bar after animation completes
    setTimeout(() => {
      isLoading.value = false
      progress.value = 0
    }, 300)
  }

  const fail = () => {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }

    progress.value = 100
    isLoading.value = false

    setTimeout(() => {
      progress.value = 0
    }, 300)
  }

  return {
    isLoading: readonly(isLoading),
    progress: readonly(progress),
    start,
    finish,
    fail
  }
}
