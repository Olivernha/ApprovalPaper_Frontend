import { ref } from "vue"

interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now().toString()
    const newToast = { ...toast, id }
    toasts.value.push(newToast)
    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title: string, message?: string, duration = 4000) => {
    return addToast({ type: "success", title, message, duration })
  }

  const error = (title: string, message?: string, duration = 5000) => {
    return addToast({ type: "error", title, message, duration })
  }

  const warning = (title: string, message?: string, duration = 4000) => {
    return addToast({ type: "warning", title, message, duration })
  }

  const info = (title: string, message?: string, duration = 4000) => {
    return addToast({ type: "info", title, message, duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
