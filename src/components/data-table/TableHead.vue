<template>
  <thead>
    <tr class="border-b border-b-gray-300 text-left text-sm text-gray-500">
      <th class="py-3 px-4 font-medium">
        <div class="flex items-center gap-1 cursor-pointer">
          RefNo
          <ArrowDownIcon class="h-4 w-4" />
        </div>
      </th>
      <th class="py-3 px-4 font-medium">
        <div class="flex items-center gap-1 cursor-pointer">
          Full Reference
          <ArrowDownIcon class="h-4 w-4" />
        </div>
      </th>
      <th class="py-3 px-4 font-medium">
        <div class="flex items-center gap-1 cursor-pointer">
          Title
          <ArrowDownIcon class="h-4 w-4" />
        </div>
      </th>
      <th class="py-3 px-4 font-medium">
        <div class="flex items-center gap-1 cursor-pointer">
          Created By
          <ArrowDownIcon class="h-4 w-4" />
        </div>
      </th>
      <th class="py-3 px-4 font-medium">
        <div class="flex items-center gap-1 cursor-pointer" @click="handleSort('date')">
          Date
          <ArrowDownIcon class="h-4 w-4" />
        </div>
      </th>
      <th class="py-3 px-4 font-medium">
        <div class="flex items-center gap-1 cursor-pointer" @click="handleSort('status')">
          Status
          <ArrowDownIcon class="h-4 w-4" />
        </div>
      </th>
      <th class="py-3 px-4 font-medium"></th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import { ArrowDown as ArrowDownIcon } from 'lucide-vue-next'

</script>

<style scoped>
/* Component-specific styles */
</style>
