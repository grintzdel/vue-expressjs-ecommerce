<script setup lang="ts">
import AppNav from "./AppNav.vue";
import AppFooter from "./AppFooter.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppNav />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
