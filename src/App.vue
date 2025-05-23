<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue';
import TableData from './components/data-table/TableData.vue';
</script>

<template>
    <div class="min-h-screen flex flex-col">
      <AppHeader />
      <!-- Main content area -->
       <main class="flex-1 p-8">
        <div class="flex flex-col lg:flex-row gap-6">
          <TableData />
          
        </div>
       </main>
    </div>
</template>

<style scoped>

</style>
