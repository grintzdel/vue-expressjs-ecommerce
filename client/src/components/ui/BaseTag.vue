<script setup lang="ts">
defineProps<{
  active?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    :class="active ? 'tag-active' : 'tag-filter'"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
