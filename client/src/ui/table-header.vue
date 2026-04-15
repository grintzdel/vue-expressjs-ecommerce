<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('flex items-center gap-3 h-9 px-5 text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-muted-foreground', props.class)">
    <slot />
  </div>
</template>
