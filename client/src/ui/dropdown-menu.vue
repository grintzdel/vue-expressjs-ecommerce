<script setup lang="ts">
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem } from 'radix-vue'
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  open?: boolean
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <DropdownMenuRoot :open="open" @update:open="emit('update:open', $event)">
    <slot />
  </DropdownMenuRoot>
</template>
