<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { getUserFromToken, logout: authLogout } = useAuth()

const sidebarOpen = ref(false)
const currentUser = getUserFromToken()

const navSections = [
  {
    items: [
      { name: 'Dashboard', to: '/admin', icon: '📊' },
    ]
  },
  {
    label: 'Catalog',
    items: [
      { name: 'Products', to: '/admin/products', icon: '🧴' },
      { name: 'Categories', to: '/admin/categories', icon: '📁' },
      { name: 'Tags', to: '/admin/tags', icon: '🏷️' },
      { name: 'Skin Types', to: '/admin/skin-types', icon: '✨' },
    ]
  },
  {
    label: 'Content',
    items: [
      { name: 'Pages', to: '/admin/pages', icon: '📄' },
      { name: 'Blog Posts', to: '/admin/blog-posts', icon: '✏️' },
    ]
  },
  {
    label: 'Sales',
    items: [
      { name: 'Orders', to: '/admin/orders', icon: '📦' },
    ]
  },
  {
    label: 'Engagement',
    items: [
      { name: 'Testimonials', to: '/admin/testimonials', icon: '💬' },
      { name: 'Newsletter', to: '/admin/newsletter', icon: '📧' },
      { name: 'Press Logos', to: '/admin/press-logos', icon: '🏆' },
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Users', to: '/admin/users', icon: '👤' },
    ]
  }
]

const pageTitle = computed(() => {
  const matched = navSections.flatMap(s => s.items).find(i => i.to === route.path)
  return matched?.name || 'Dashboard'
})

const userInitials = computed(() => {
  return 'A'
})

function handleLogout() {
  authLogout()
}

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}
</script>

<template>
  <div class="min-h-screen bg-cream flex">
    <!-- Mobile overlay backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/50 z-20 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Mobile sidebar (slide-in overlay) -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-in-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in-out"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="sidebarOpen"
        class="fixed top-0 left-0 h-full w-64 bg-bg-dark flex flex-col z-30 lg:hidden"
      >
        <!-- Logo -->
        <div class="px-5 py-5 border-b border-white/10 flex-shrink-0 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="font-heading text-xl text-font-light tracking-widest">VELVETY</span>
            <span class="text-[10px] font-body font-semibold uppercase tracking-widest bg-white/20 text-font-light/80 px-2 py-0.5 rounded-sm">
              Admin
            </span>
          </div>
          <button
            class="text-font-light/60 hover:text-font-light transition-colors p-1"
            aria-label="Close menu"
            @click="sidebarOpen = false"
          >
            ✕
          </button>
        </div>

        <!-- Nav -->
        <nav class="flex-1 overflow-y-auto py-4 px-3">
          <template v-for="(section, si) in navSections" :key="si">
            <p
              v-if="section.label"
              class="text-[11px] uppercase tracking-[2px] text-font-light/40 font-semibold mt-6 mb-2 px-3"
            >
              {{ section.label }}
            </p>
            <RouterLink
              v-for="item in section.items"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body mb-0.5 transition-colors"
              :class="
                isActive(item.to)
                  ? 'bg-accent-green text-font-light'
                  : 'text-font-light/80 hover:text-font-light hover:bg-white/10'
              "
              @click="sidebarOpen = false"
            >
              <span class="text-base leading-none">{{ item.icon }}</span>
              <span>{{ item.name }}</span>
            </RouterLink>
          </template>
        </nav>

        <!-- User footer -->
        <div class="px-3 py-4 border-t border-white/10 flex-shrink-0">
          <div class="flex items-center gap-3 px-3 mb-3">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span class="text-xs font-semibold text-font-light font-body">{{ userInitials }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-body text-font-light/80 truncate">{{ user?.email || 'Admin' }}</p>
              <p class="text-[10px] font-body text-font-light/40 capitalize">{{ user?.role || 'admin' }}</p>
            </div>
          </div>
          <button
            class="w-full text-left px-3 py-2 rounded-md text-sm font-body text-font-light/60 hover:text-font-light hover:bg-white/10 transition-colors"
            @click="handleLogout"
          >
            Sign out
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Desktop sidebar (always visible) -->
    <aside class="hidden lg:flex flex-col w-64 bg-bg-dark fixed top-0 left-0 h-full z-10">
      <!-- Logo -->
      <div class="px-5 py-5 border-b border-white/10 flex-shrink-0">
        <div class="flex items-center gap-3">
          <span class="font-heading text-xl text-font-light tracking-widest">VELVETY</span>
          <span class="text-[10px] font-body font-semibold uppercase tracking-widest bg-white/20 text-font-light/80 px-2 py-0.5 rounded-sm">
            Admin
          </span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <template v-for="(section, si) in navSections" :key="si">
          <p
            v-if="section.label"
            class="text-[11px] uppercase tracking-[2px] text-font-light/40 font-semibold mt-6 mb-2 px-3"
          >
            {{ section.label }}
          </p>
          <RouterLink
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body mb-0.5 transition-colors"
            :class="
              isActive(item.to)
                ? 'bg-accent-green text-font-light'
                : 'text-font-light/80 hover:text-font-light hover:bg-white/10'
            "
          >
            <span class="text-base leading-none">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </RouterLink>
        </template>
      </nav>

      <!-- User footer -->
      <div class="px-3 py-4 border-t border-white/10 flex-shrink-0">
        <div class="flex items-center gap-3 px-3 mb-3">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-semibold text-font-light font-body">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-body text-font-light/80 truncate">{{ user?.email || 'Admin' }}</p>
            <p class="text-[10px] font-body text-font-light/40 capitalize">{{ user?.role || 'admin' }}</p>
          </div>
        </div>
        <button
          class="w-full text-left px-3 py-2 rounded-md text-sm font-body text-font-light/60 hover:text-font-light hover:bg-white/10 transition-colors"
          @click="handleLogout"
        >
          Sign out
        </button>
      </div>
    </aside>

    <!-- Main area: topbar + content -->
    <div class="flex-1 flex flex-col lg:ml-64 min-h-screen">
      <!-- Topbar -->
      <header class="h-[60px] bg-white border-b border-border-light flex items-center px-5 gap-4 sticky top-0 z-10 flex-shrink-0">
        <!-- Hamburger (mobile only) -->
        <button
          class="lg:hidden flex flex-col justify-center gap-[5px] w-6 h-6 flex-shrink-0"
          aria-label="Open menu"
          @click="sidebarOpen = true"
        >
          <span class="w-full h-0.5 bg-font-primary block rounded-full" />
          <span class="w-full h-0.5 bg-font-primary block rounded-full" />
          <span class="w-full h-0.5 bg-font-primary block rounded-full" />
        </button>

        <!-- Page title -->
        <h1 class="font-heading text-lg text-font-primary flex-1 leading-none">{{ pageTitle }}</h1>

        <!-- User avatar -->
        <div class="w-9 h-9 rounded-full bg-bg-dark flex items-center justify-center flex-shrink-0 cursor-default select-none">
          <span class="text-sm font-semibold text-font-light font-body">{{ userInitials }}</span>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-5 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
