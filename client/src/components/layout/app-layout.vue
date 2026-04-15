<script setup lang="ts">
import AppNav from "./app-nav.vue";
import AppFooter from "./app-footer.vue";
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
