<template>
  <div class="w-full lg:w-96 bg-white rounded-lg p-6">
    <h2 class="text-xl font-medium mb-2">Add a new document</h2>
    <p class="text-gray-600 text-sm mb-6">
      Fill in the fields below and press add to generate a reference number
    </p>

    <form class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium">Document Type</label>
        <div class="relative">
          <select class="w-full px-4 py-2 border border-gray-200 rounded-md appearance-none bg-gray-100 pr-10" required>
            <option value="">Select</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="ENG">ENG</option>
            <option value="OP">OP</option>
            <option value="MKT">MKT</option>
            <option value="RND">RND</option>
            <option value="ADM">ADM</option>
          </select>
          <ChevronDownIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Title</label>
        <input type="text" placeholder="Value" class="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-100"
          required />
      </div>

      <button type="submit"
        class="w-full py-3 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors mt-4">
        Add Document
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown as ChevronDownIcon } from 'lucide-vue-next'


</script>

<style scoped>
/* Component-specific styles */
</style>
