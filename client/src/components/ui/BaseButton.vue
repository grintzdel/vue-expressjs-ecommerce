<script setup lang="ts">
defineProps<{
  variant?: "primary" | "outline" | "secondary";
  href?: string;
}>();
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :class="[
      variant === 'outline' ? 'btn-outline' :
      variant === 'secondary' ? 'btn-secondary' :
      'btn-primary'
    ]"
  >
    <slot />
  </component>
</template>
