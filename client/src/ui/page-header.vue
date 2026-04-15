<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  title: string
  description: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('flex items-center justify-between mb-6', props.class)">
    <div>
      <h1 class="font-heading text-[28px] font-bold text-foreground">{{ title }}</h1>
      <p class="text-sm font-body text-muted-foreground mt-1">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
