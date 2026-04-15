<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  for?: string
}>()
</script>

<template>
  <label
    :for="props.for"
    :class="cn('text-[11px] font-semibold tracking-[0.5px] uppercase font-body text-muted-foreground', props.class)"
  >
    <slot />
  </label>
</template>
