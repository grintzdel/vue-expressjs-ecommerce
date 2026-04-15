<script setup lang="ts">
import { type HTMLAttributes, useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: HTMLAttributes['class']
  modelValue?: string | number
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
</script>

<template>
  <select
    v-bind="attrs"
    :value="modelValue"
    :class="cn('flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm font-body shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', props.class)"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>
