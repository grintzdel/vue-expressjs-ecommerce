<script setup lang="ts">
import { DropdownMenuItem } from 'radix-vue'
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  destructive?: boolean
}>()
</script>

<template>
  <DropdownMenuItem
    :class="cn('relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm font-body outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', destructive && 'text-destructive focus:text-destructive', props.class)"
  >
    <slot />
  </DropdownMenuItem>
</template>
