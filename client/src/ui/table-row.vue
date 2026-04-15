<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('flex items-center gap-3 h-12 px-5 border-b last:border-0 hover:bg-accent/50 transition-colors', props.class)">
    <slot />
  </div>
</template>
