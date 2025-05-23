<template>
  <div class="flex items-center gap-4 mb-4 flex-wrap md:flex-nowarp">
    <div class="flex items-center justify-center gap-2">
      <img src="@/assets/img/tuaslogo.png" alt="Logo" class="h-8 w-8">
      <div class="text-xl font-medium">Documents</div>
    </div>
    <div class="relative flex-1 min-w-[200px]">
      <input type="text" placeholder="Search..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
      <button>
        <XIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { XIcon } from 'lucide-vue-next';
</script>
