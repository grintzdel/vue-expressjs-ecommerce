<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold font-body transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/15 text-primary',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive/15 text-destructive',
        outline: 'border text-foreground',
        success: 'bg-[#E8F0E0] text-[#4A5E3A]',
        warning: 'bg-[#FFF8E1] text-[#E8A830]',
        info: 'bg-[#E0E8F0] text-[#4A6FA5]',
        inactive: 'bg-[#F0F0F0] text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeVariants = VariantProps<typeof badgeVariants>

const props = defineProps<{
  variant?: NonNullable<BadgeVariants['variant']>
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </span>
</template>
