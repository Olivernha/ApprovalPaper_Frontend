<template>
  <tr class="border-b border-b-gray-300 hover:bg-gray-50">
    <td class="py-3 px-4">1</td>
    <td class="py-3 px-4">DOC-001</td>
    <td class="py-3 px-4">Project Proposal</td>
    <td class="py-3 px-4">Alice</td>
    <td class="py-3 px-4">2024-06-01</td>
    <td class="py-3 px-4">
      <DocumentStatus :status="'Filed'" />
    </td>
    <td class="py-3 px-4 text-right">
      <button class="text-gray-500">
        <MoreVerticalIcon class="h-4 w-4" />
      </button>
    </td>
  </tr>
  <tr class="border-b border-b-gray-300 hover:bg-gray-50">
    <td class="py-3 px-4">1</td>
    <td class="py-3 px-4">DOC-001</td>
    <td class="py-3 px-4">Project Proposal</td>
    <td class="py-3 px-4">Alice</td>
    <td class="py-3 px-4">2024-06-01</td>
    <td class="py-3 px-4">
      <DocumentStatus :status="'Filed'" />
    </td>
    <td class="py-3 px-4 text-right">
      <button class="text-gray-500">
        <MoreVerticalIcon class="h-4 w-4" />
      </button>
    </td>
  </tr>
  <tr class="border-b border-b-gray-300 hover:bg-gray-50">
    <td class="py-3 px-4">1</td>
    <td class="py-3 px-4">DOC-001</td>
    <td class="py-3 px-4">Project Proposal</td>
    <td class="py-3 px-4">Alice</td>
    <td class="py-3 px-4">2024-06-01</td>
    <td class="py-3 px-4">
      <DocumentStatus :status="'Filed'" />
    </td>
    <td class="py-3 px-4 text-right">
      <button class="text-gray-500">
        <MoreVerticalIcon class="h-4 w-4" />
      </button>
    </td>
  </tr>
  <tr class="border-b border-b-gray-300 hover:bg-gray-50">
    <td class="py-3 px-4">1</td>
    <td class="py-3 px-4">DOC-001</td>
    <td class="py-3 px-4">Project Proposal</td>
    <td class="py-3 px-4">Alice</td>
    <td class="py-3 px-4">2024-06-01</td>
    <td class="py-3 px-4">
      <DocumentStatus :status="'Filed'" />
    </td>
    <td class="py-3 px-4 text-right">
      <button class="text-gray-500">
        <MoreVerticalIcon class="h-4 w-4" />
      </button>
    </td>
  </tr>
  <tr class="border-b border-b-gray-300 hover:bg-gray-50">
    <td class="py-3 px-4">1</td>
    <td class="py-3 px-4">DOC-001</td>
    <td class="py-3 px-4">Project Proposal</td>
    <td class="py-3 px-4">Alice</td>
    <td class="py-3 px-4">2024-06-01</td>
    <td class="py-3 px-4">
      <DocumentStatus :status="'Filed'" />
    </td>
    <td class="py-3 px-4 text-right">
      <button class="text-gray-500">
        <MoreVerticalIcon class="h-4 w-4" />
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { MoreVertical as MoreVerticalIcon } from 'lucide-vue-next'
import DocumentStatus from './DataStatus.vue'
</script>

<style scoped></style>
