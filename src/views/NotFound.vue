<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Home, ArrowLeft, FileQuestion } from 'lucide-vue-next'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'Home' })
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- 404 Icon -->
      <div
        class="w-24 h-24 bg-[#f9fafb] rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <FileQuestion class="w-12 h-12 text-[#667085]" />
      </div>

      <!-- 404 Text -->
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-[#a41f36] mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-[#344054] mb-4">Page Not Found</h2>
        <p class="text-[#667085] text-lg leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Please check the URL or
          navigate back to a safe place.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goHome"
          class="flex items-center justify-center gap-2 bg-[#697b9d] hover:bg-[#5a6b8a] text-white px-6 py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#697b9d] focus:ring-offset-2"
        >
          <Home class="w-4 h-4" />
          Go to Home
        </button>

        <button
          @click="goBack"
          class="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#344054] border border-[#d0d5dd] px-6 py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#697b9d] focus:ring-offset-2"
        >
          <ArrowLeft class="w-4 h-4" />
          Go Back
        </button>
      </div>

      <!-- Additional Help -->
      <div class="mt-12 p-4 bg-white rounded-lg border border-[#eaecf0]">
        <h3 class="text-sm font-medium text-[#344054] mb-2">Need Help?</h3>
        <p class="text-sm text-[#667085]">
          If you believe this is an error, please contact the system administrator or try refreshing
          the page.
        </p>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute top-20 left-10 w-16 h-16 bg-[#a41f36] opacity-10 rounded-full"></div>
    <div class="absolute bottom-20 right-10 w-12 h-12 bg-[#697b9d] opacity-10 rounded-full"></div>
    <div class="absolute top-1/3 right-20 w-8 h-8 bg-[#a41f36] opacity-10 rounded-full"></div>
  </div>
</template>

<style scoped>
/* Add subtle animation to decorative elements */
.absolute {
  animation: float 6s ease-in-out infinite;
}

.absolute:nth-child(2) {
  animation-delay: -2s;
}

.absolute:nth-child(3) {
  animation-delay: -4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  h1 {
    font-size: 4rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>
