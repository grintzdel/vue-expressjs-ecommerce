import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import { createDependencies } from '@/modules/app/core/dependencies'
import { DEPENDENCIES_KEY } from '@/modules/app/ui/hooks/use-dependencies'
import './assets/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('./pages/home/page.vue') },
    { path: '/shop', name: 'shop', component: () => import('./pages/shop/page.vue') },
    { path: '/product/:slug', name: 'product', component: () => import('./pages/product-detail/page.vue') },
    { path: '/about', name: 'about', component: () => import('./pages/about/page.vue') },
    { path: '/blog', name: 'blog', component: () => import('./pages/blog/page.vue') },
    { path: '/cart', name: 'cart', component: () => import('./pages/cart/page.vue') },
    { path: '/login', name: 'login', component: () => import('./pages/login/page.vue') },
    { path: '/register', name: 'register', component: () => import('./pages/register/page.vue') },
    { path: '/admin', name: 'admin', component: () => import('./pages/admin/dashboard/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/products', name: 'admin-products', component: () => import('./pages/admin/products/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/categories', name: 'admin-categories', component: () => import('./pages/admin/categories/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/tags', name: 'admin-tags', component: () => import('./pages/admin/tags/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/skin-types', name: 'admin-skin-types', component: () => import('./pages/admin/skin-types/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/pages', name: 'admin-pages', component: () => import('./pages/admin/pages/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/blog-posts', name: 'admin-blog-posts', component: () => import('./pages/admin/blog-posts/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/testimonials', name: 'admin-testimonials', component: () => import('./pages/admin/testimonials/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/newsletter', name: 'admin-newsletter', component: () => import('./pages/admin/newsletter/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/press-logos', name: 'admin-press-logos', component: () => import('./pages/admin/press-logos/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/orders', name: 'admin-orders', component: () => import('./pages/admin/orders/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/users', name: 'admin-users', component: () => import('./pages/admin/users/page.vue'), meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return { name: 'login' }
  }
})

const app = createApp(App)
app.use(router)
app.use(VueQueryPlugin)
app.provide(DEPENDENCIES_KEY, createDependencies())
app.mount('#app')
