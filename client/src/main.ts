import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./assets/main.css";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: () => import("./pages/HomePage.vue") },
    { path: "/shop", name: "shop", component: () => import("./pages/ShopPage.vue") },
    { path: "/product/:slug", name: "product", component: () => import("./pages/ProductDetailPage.vue") },
    { path: "/about", name: "about", component: () => import("./pages/AboutPage.vue") },
    { path: "/blog", name: "blog", component: () => import("./pages/BlogPage.vue") },
    { path: "/cart", name: "cart", component: () => import("./pages/CartPage.vue") },
    { path: "/login", name: "login", component: () => import("./pages/LoginPage.vue") },
    { path: "/register", name: "register", component: () => import("./pages/RegisterPage.vue") },
    {
      path: "/admin",
      name: "admin",
      component: () => import("./pages/admin/DashboardPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/products",
      name: "admin-products",
      component: () => import("./pages/admin/ProductsPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/categories",
      name: "admin-categories",
      component: () => import("./pages/admin/CategoriesPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/tags",
      name: "admin-tags",
      component: () => import("./pages/admin/TagsPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/skin-types",
      name: "admin-skin-types",
      component: () => import("./pages/admin/SkinTypesPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/pages",
      name: "admin-pages",
      component: () => import("./pages/admin/PagesAdminPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/blog-posts",
      name: "admin-blog-posts",
      component: () => import("./pages/admin/BlogPostsPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/testimonials",
      name: "admin-testimonials",
      component: () => import("./pages/admin/TestimonialsPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/newsletter",
      name: "admin-newsletter",
      component: () => import("./pages/admin/NewsletterPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/press-logos",
      name: "admin-press-logos",
      component: () => import("./pages/admin/PressLogosPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/orders",
      name: "admin-orders",
      component: () => import("./pages/admin/OrdersPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/users",
      name: "admin-users",
      component: () => import("./pages/admin/UsersPage.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem("token")) {
    return { name: "login" };
  }
});

const app = createApp(App);
app.use(router);
app.mount("#app");
