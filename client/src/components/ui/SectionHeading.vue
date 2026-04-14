<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  size?: "hero" | "section" | "subsection";
  light?: boolean;
}>();
</script>

<template>
  <div>
    <h2
      :class="[
        'font-heading',
        size === 'hero' ? 'text-hero' : size === 'subsection' ? 'text-subsection' : 'text-section',
        light ? 'text-font-light' : 'text-font-primary'
      ]"
    >
      {{ title }}
    </h2>
    <p v-if="subtitle" :class="['mt-sm text-body-lg', light ? 'text-border-light' : 'text-font-secondary']">
      {{ subtitle }}
    </p>
  </div>
</template>
