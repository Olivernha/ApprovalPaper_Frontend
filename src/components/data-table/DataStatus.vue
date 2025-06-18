<template>
  <span :class="['text-xs font-medium px-2 py-0.5 rounded-full inline-block w-fit', statusColor, textColor]">

    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  status: string;
}>();

type StatusType = 'Filed' | 'Not filed' | 'Suspended';

const statusColor = computed((): string => {
  const colors: Record<StatusType, string> = {
    Filed: 'bg-[#ECFDF3]',
    'Not filed': 'bg-[#F2C8C8]',
    Suspended: 'bg-[#F2F4F7]',
  };
  return colors[props.status as StatusType] || colors['Not filed'];
});

const dotColor = computed((): string => {
  const colors: Record<StatusType, string> = {
    Filed: 'bg-[#14BA6D]',
    'Not filed': 'bg-[#A41F36]',
    Suspended: 'bg-[#6C778B]',
  };
  return colors[props.status as StatusType] || colors['Not filed'];
});

const textColor = computed((): string => {
  const colors: Record<StatusType, string> = {
    Filed: 'text-[#14BA6D]',
    'Not filed': 'text-[#A41F36]',
    Suspended: 'text-[#6C778B]',
  };
  return colors[props.status as StatusType] || colors['Not filed'];
});
</script>

