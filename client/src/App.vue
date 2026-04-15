<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './components/layout/app-layout.vue'
import AdminLayout from './components/layout/admin-layout.vue'
import CartDrawer from './components/cart-drawer.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <AdminLayout v-if="isAdmin">
    <router-view :key="route.fullPath" />
  </AdminLayout>
  <AppLayout v-else>
    <router-view :key="route.fullPath" />
  </AppLayout>
  <CartDrawer />
</template>
