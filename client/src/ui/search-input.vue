<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  class?: HTMLAttributes['class']
  modelValue?: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div :class="cn('flex items-center gap-2 border border-input rounded-md h-9 px-3 w-[300px] bg-transparent', props.class)">
    <Search class="h-4 w-4 text-muted-foreground shrink-0" />
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder ?? 'Rechercher...'"
      class="bg-transparent border-none outline-none text-sm font-body text-foreground w-full placeholder:text-muted-foreground"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
