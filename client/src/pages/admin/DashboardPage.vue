<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { RouterLink } from 'vue-router'

const api = useApi()

const stats = ref([
  { label: 'Products', count: 0, icon: '🧴', to: '/admin/products' },
  { label: 'Categories', count: 0, icon: '📁', to: '/admin/categories' },
  { label: 'Blog Posts', count: 0, icon: '✏️', to: '/admin/blog-posts' },
  { label: 'Users', count: 0, icon: '👤', to: '/admin/users' },
])

onMounted(async () => {
  try {
    const [products, categories, blogPosts, users] = await Promise.all([
      api.get<any[]>('/products'),
      api.get<any[]>('/categories'),
      api.get<any[]>('/blog-posts'),
      api.get<any[]>('/users'),
    ])
    stats.value[0].count = products.length
    stats.value[1].count = categories.length
    stats.value[2].count = blogPosts.length
    stats.value[3].count = users.length
  } catch {}
})

const quickActions = [
  { label: 'New Product', to: '/admin/products', description: 'Add a product to the catalog' },
  { label: 'New Category', to: '/admin/categories', description: 'Organize your products' },
  { label: 'New Blog Post', to: '/admin/blog-posts', description: 'Publish content' },
  { label: 'Manage Users', to: '/admin/users', description: 'View and manage users' },
]
</script>

<template>
  <div class="p-2xl space-y-2xl">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-heading text-section text-font-primary">Dashboard</h1>
        <p class="font-body text-sm text-font-secondary mt-xs">Welcome back. Here's what's happening.</p>
      </div>
      <a href="/" target="_blank" class="btn-outline !py-sm !px-lg">View Site</a>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-lg">
      <RouterLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to"
        class="bg-white rounded-lg p-lg border border-border-light shadow-sm hover:shadow-md transition-shadow relative block"
      >
        <span class="absolute top-lg right-lg text-2xl">{{ stat.icon }}</span>
        <p class="font-heading text-section text-font-primary">{{ stat.count }}</p>
        <p class="font-body text-sm text-font-secondary mt-xs">{{ stat.label }}</p>
      </RouterLink>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="font-heading text-subsection text-font-primary mb-lg">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <RouterLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          class="bg-white rounded-lg p-lg border border-border-light shadow-sm hover:shadow-md transition-shadow group"
        >
          <p class="font-body text-sm font-semibold text-font-primary group-hover:text-accent-green transition-colors">
            {{ action.label }}
          </p>
          <p class="font-body text-xs text-font-tertiary mt-xs">{{ action.description }}</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
