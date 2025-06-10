<template>
      <!-- Breadcrumb Navigation -->
      <div  class=" bg-white border-b border-gray-200 shadow-sm">
      <div class=" px-4 sm:px-6 lg:px-8">
        <nav class="py-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2 text-sm">
            <!-- Home Link -->
            <li class="flex items-center">
              <router-link
                to="/"
                class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 group"
              >
                <Home class="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span class="font-medium">Home</span>
              </router-link>
            </li>

            <!-- Separator if we have breadcrumb items -->
            <li v-if="breadcrumbItems.length > 0" class="flex items-center">
              <ChevronRight class="w-4 h-4 text-gray-400" />
            </li>

            <!-- Dynamic Breadcrumb Items -->
            <li
              v-for="(item, index) in breadcrumbItems"
              :key="index"
              class="flex items-center"
            >
              <!-- Clickable breadcrumb item -->
              <router-link
                v-if="item.path && index < breadcrumbItems.length - 1"
                :to="item.path"
                class="text-gray-500 hover:text-blue-600 transition-colors duration-200 font-medium px-2 py-1 rounded-md hover:bg-blue-50"
              >
                {{ item.name }}
              </router-link>

              <!-- Current/Non-clickable breadcrumb item -->
              <span
                v-else
                class="text-gray-900 font-semibold px-2 py-1 bg-blue-50 rounded-md border border-blue-100"
              >
                {{ item.name }}
              </span>

              <!-- Separator (except for last item) -->
              <ChevronRight
                v-if="index < breadcrumbItems.length - 1"
                class="w-4 h-4 text-gray-400 ml-2"
              />
            </li>
          </ol>
        </nav>
      </div>
    </div>
</template>
<script setup lang="ts">
import { ChevronRight, Home } from 'lucide-vue-next';
defineProps<{
  breadcrumbItems: Array<{ name: string; path?: string }>;
}>();
</script>
