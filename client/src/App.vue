<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'
import AdminLayout from './components/layout/AdminLayout.vue'
import CartDrawer from './components/CartDrawer.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <AdminLayout v-if="isAdmin">
    <router-view />
  </AdminLayout>
  <AppLayout v-else>
    <router-view />
  </AppLayout>
  <CartDrawer />
</template>
