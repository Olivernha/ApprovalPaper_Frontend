<template>
  <div class="flex-1">
    <div class="bg-white rounded-md shadow-sm p-4">
      <TableHeader />
      <!--Table-->
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse">
          <TableHead />
          <tbody>
            <TableRow />
          </tbody>
        </table>
      </div>
      <TablePagination />
    </div>
  </div>
</template>
<script setup lang="ts">
import TableHeader from './TableHeader.vue';
import TableHead from './TableHead.vue';
import TableRow from './TableRow.vue';
import TablePagination from './TablePagination.vue';
</script>
