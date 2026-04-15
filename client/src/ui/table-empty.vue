<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('px-5 py-10 text-center font-body text-sm text-muted-foreground', props.class)">
    <slot />
  </div>
</template>
