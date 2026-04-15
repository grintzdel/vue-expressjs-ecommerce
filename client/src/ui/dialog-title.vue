<script setup lang="ts">
import { DialogTitle } from 'radix-vue'
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <DialogTitle :class="cn('font-heading text-xl font-bold leading-none tracking-tight', props.class)">
    <slot />
  </DialogTitle>
</template>
