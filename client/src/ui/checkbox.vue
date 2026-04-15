<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from 'radix-vue'
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-vue-next'

const props = defineProps<{
  class?: HTMLAttributes['class']
  checked?: boolean
  modelValue?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <CheckboxRoot
    :checked="modelValue ?? checked"
    :class="cn('peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground', props.class)"
    @update:checked="emit('update:modelValue', $event as boolean)"
  >
    <CheckboxIndicator class="flex items-center justify-center text-current">
      <Check class="h-3.5 w-3.5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
