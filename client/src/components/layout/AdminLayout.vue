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
      { name: 'Tableau de bord', to: '/admin', lucide: 'layout-dashboard' },
    ]
  },
  {
    label: 'CATALOGUE',
    items: [
      { name: 'Produits', to: '/admin/products', lucide: 'package' },
      { name: 'Catégories', to: '/admin/categories', lucide: 'folder' },
      { name: 'Tags', to: '/admin/tags', lucide: 'tag' },
      { name: 'Skin Types', to: '/admin/skin-types', lucide: 'sparkles' },
    ]
  },
  {
    label: 'CONTENU',
    items: [
      { name: 'Pages', to: '/admin/pages', lucide: 'file-text' },
      { name: 'Blog Posts', to: '/admin/blog-posts', lucide: 'pen-line' },
    ]
  },
  {
    label: 'COMMERCE',
    items: [
      { name: 'Commandes', to: '/admin/orders', lucide: 'shopping-cart' },
    ]
  },
  {
    label: 'ENGAGEMENT',
    items: [
      { name: 'Témoignages', to: '/admin/testimonials', lucide: 'message-square' },
      { name: 'Newsletter', to: '/admin/newsletter', lucide: 'mail' },
      { name: 'Press Logos', to: '/admin/press-logos', lucide: 'image' },
    ]
  },
]

const pageTitle = computed(() => {
  const matched = navSections.flatMap(s => s.items).find(i => i.to === route.path)
  return matched?.name || 'Tableau de bord'
})

const breadcrumbs = computed(() => {
  const current = navSections.flatMap(s => s.items).find(i => i.to === route.path)
  if (!current || current.to === '/admin') return [{ name: 'Dashboard', to: '/admin', active: true }]
  return [
    { name: 'Dashboard', to: '/admin', active: false },
    { name: current.name, to: current.to, active: true },
  ]
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
  <div class="min-h-screen bg-bg-primary flex">
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

    <!-- Mobile sidebar -->
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
        class="fixed top-0 left-0 h-full w-[220px] flex flex-col z-30 lg:hidden bg-[#2E3D22]"
      >
        <div class="h-14 px-5 flex items-center gap-2.5 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A8B89A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-3 4.5-3.5 6-3 10"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          <span class="font-heading text-xl text-white tracking-[2px]">VELVETY</span>
          <span class="text-[11px] font-body font-medium tracking-[1px] text-[#A8B89A]">Admin</span>
        </div>
        <nav class="flex-1 overflow-y-auto py-4">
          <template v-for="(section, si) in navSections" :key="si">
            <p v-if="section.label" class="text-[10px] uppercase tracking-[2px] text-[#8A9B7A] font-bold mt-4 mb-1.5 px-5">
              {{ section.label }}
            </p>
            <RouterLink
              v-for="item in section.items"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 px-5 my-px text-[13px] font-body no-underline transition-all duration-150"
              :class="isActive(item.to)
                ? 'bg-[#4A5E3A] text-white font-semibold h-10'
                : 'text-[#C8D4BC] hover:text-white hover:bg-white/[0.08] h-9'"
              @click="sidebarOpen = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <use :href="`#lucide-${item.lucide}`" />
              </svg>
              <span>{{ item.name }}</span>
            </RouterLink>
          </template>
        </nav>
        <div class="px-5 pb-5 flex-shrink-0">
          <button class="w-full text-left px-3 py-2 rounded-md text-sm font-body text-[#C8D4BC] hover:text-white hover:bg-white/10 transition-colors" @click="handleLogout">
            Déconnexion
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Desktop sidebar -->
    <aside class="hidden lg:flex flex-col w-[220px] flex-shrink-0 h-screen sticky top-0 bg-[#2E3D22]">
      <div class="h-14 px-5 flex items-center gap-2.5 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A8B89A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-3 4.5-3.5 6-3 10"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
        <span class="font-heading text-xl text-white tracking-[2px]">VELVETY</span>
        <span class="text-[11px] font-body font-medium tracking-[1px] text-[#A8B89A]">Admin</span>
      </div>
      <nav class="flex-1 overflow-y-auto py-4">
        <template v-for="(section, si) in navSections" :key="si">
          <p v-if="section.label" class="text-[10px] uppercase tracking-[2px] text-[#8A9B7A] font-bold mt-4 mb-1.5 px-5">
            {{ section.label }}
          </p>
          <RouterLink
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-5 my-px text-[13px] font-body no-underline transition-all duration-150"
            :class="isActive(item.to)
              ? 'bg-[#4A5E3A] text-white font-semibold h-10'
              : 'text-[#C8D4BC] hover:text-white hover:bg-white/[0.08] h-9'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <use :href="`#lucide-${item.lucide}`" />
            </svg>
            <span>{{ item.name }}</span>
          </RouterLink>
        </template>
      </nav>
      <div class="px-5 pb-5 flex-shrink-0">
        <button class="w-full text-left px-3 py-2 rounded-md text-sm font-body text-[#C8D4BC] hover:text-white hover:bg-white/10 transition-colors" @click="handleLogout">
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Lucide icon sprites -->
    <svg xmlns="http://www.w3.org/2000/svg" class="hidden">
      <symbol id="lucide-layout-dashboard" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></symbol>
      <symbol id="lucide-package" viewBox="0 0 24 24"><path d="m16.5 9.4-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></symbol>
      <symbol id="lucide-folder" viewBox="0 0 24 24"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></symbol>
      <symbol id="lucide-tag" viewBox="0 0 24 24"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></symbol>
      <symbol id="lucide-sparkles" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></symbol>
      <symbol id="lucide-file-text" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></symbol>
      <symbol id="lucide-pen-line" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></symbol>
      <symbol id="lucide-shopping-cart" viewBox="0 0 24 24"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></symbol>
      <symbol id="lucide-message-square" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></symbol>
      <symbol id="lucide-mail" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></symbol>
      <symbol id="lucide-image" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></symbol>
      <symbol id="lucide-house" viewBox="0 0 24 24"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></symbol>
      <symbol id="lucide-chevron-right" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>
      <symbol id="lucide-bell" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></symbol>
      <symbol id="lucide-user" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></symbol>
    </svg>

    <!-- Main area -->
    <div class="flex-1 flex flex-col min-h-screen min-w-0">
      <!-- Top bar -->
      <header class="h-14 bg-white border-b border-border-light flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
        <div class="flex items-center gap-2">
          <!-- Hamburger (mobile only) -->
          <button
            class="lg:hidden flex flex-col justify-center gap-[5px] w-6 h-6 flex-shrink-0 mr-2"
            aria-label="Open menu"
            @click="sidebarOpen = true"
          >
            <span class="w-full h-0.5 bg-font-primary block rounded-full" />
            <span class="w-full h-0.5 bg-font-primary block rounded-full" />
            <span class="w-full h-0.5 bg-font-primary block rounded-full" />
          </button>

          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-[13px] font-body">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-tertiary">
              <use href="#lucide-house" />
            </svg>
            <template v-for="(crumb, i) in breadcrumbs" :key="i">
              <svg v-if="i > 0 || true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-tertiary">
                <use href="#lucide-chevron-right" />
              </svg>
              <span :class="crumb.active ? 'text-font-primary font-medium' : 'text-font-tertiary'">
                {{ crumb.name }}
              </span>
            </template>
          </nav>
        </div>

        <!-- Right section -->
        <div class="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-secondary cursor-pointer">
            <use href="#lucide-bell" />
          </svg>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-accent-green flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <use href="#lucide-user" />
              </svg>
            </div>
            <span class="text-[13px] font-body font-medium text-font-primary hidden sm:inline">Admin</span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
