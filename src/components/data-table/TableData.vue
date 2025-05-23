<template>
  <div class="flex-1">
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
</template>
<script setup lang="ts">
import TableHeader from './TableHeader.vue';
import TableHead from './TableHead.vue';
import TableRow from './TableRow.vue';
import TablePagination from './TablePagination.vue';
</script>
