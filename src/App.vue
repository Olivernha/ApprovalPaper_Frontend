<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue';
import TableData from './components/data-table/TableData.vue';
import AddDocumentForm from './components/form/AddDocumentForm.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <AppHeader />
    <!-- Main content area -->
    <main class="flex-1 p-8 bg-[#f5f5f5">
      <div class="flex flex-col lg:flex-row gap-6">
        <TableData />

        <!-- Add Document Form -->
        <AddDocumentForm />
      </div>
    </main>
  </div>
</template>

<style scoped></style>
