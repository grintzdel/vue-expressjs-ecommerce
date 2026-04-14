<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useCart } from "@/composables/useCart";

const route = useRoute();
const { totalItems, openCart } = useCart();
const mobileMenuOpen = ref(false);
const pagesDropdownOpen = ref(false);
const pagesExpanded = ref(false);

const isHeroPage = computed(() => route.path === "/");

const pageLinks = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Shop", to: "/shop" },
  { name: "Blog", to: "/blog" },
  { name: "Contact Us", to: "#" },
  { name: "Style Guide", to: "#" },
];

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (!mobileMenuOpen.value) {
    pagesExpanded.value = false;
  }
}
</script>

<template>
  <!-- Desktop Nav -->
  <nav
    :class="[
      'hidden md:flex items-center justify-between h-[60px] px-2xl w-full z-50',
      isHeroPage ? 'absolute top-0 left-0 right-0' : 'bg-bg-primary'
    ]"
  >
    <!-- Logo -->
    <router-link to="/" class="flex flex-col">
      <span
        :class="['font-heading text-body-lg tracking-[3px]', isHeroPage ? 'text-font-light' : 'text-font-green']"
      >VELVETY</span>
      <span
        :class="['font-heading text-[9px] italic', isHeroPage ? 'text-border-light' : 'text-accent-green-light']"
      >Facial & skincare</span>
    </router-link>

    <!-- Center Links -->
    <div class="flex items-center gap-xl">
      <div class="relative" @mouseenter="pagesDropdownOpen = true" @mouseleave="pagesDropdownOpen = false">
        <button
          :class="['font-body text-[13px] font-medium uppercase tracking-wide flex items-center gap-1', isHeroPage ? 'text-font-light' : 'text-font-primary']"
        >
          Pages
          <span class="text-[16px]">⌄</span>
        </button>

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="pagesDropdownOpen"
            class="absolute top-full left-0 mt-2 bg-bg-primary rounded-md p-lg shadow-lg min-w-[320px]"
          >
            <div class="flex flex-col gap-3">
              <router-link
                v-for="link in pageLinks"
                :key="link.name"
                :to="link.to"
                class="block text-[15px] font-body text-font-primary px-md py-sm rounded-sm hover:bg-bg-light-sage transition-colors"
                @click="pagesDropdownOpen = false"
              >
                {{ link.name }}
              </router-link>
            </div>
          </div>
        </Transition>
      </div>

      <router-link
        to="/shop"
        :class="['font-body text-[13px] font-medium uppercase tracking-wide', isHeroPage ? 'text-font-light' : 'text-font-primary']"
      >Shop</router-link>

      <router-link
        to="/about"
        :class="['font-body text-[13px] font-medium uppercase tracking-wide', isHeroPage ? 'text-font-light' : 'text-font-primary']"
      >About</router-link>
    </div>

    <!-- Right Links -->
    <div class="flex items-center gap-xl">
      <router-link
        to="/login"
        :class="['font-body text-[13px] font-medium uppercase tracking-wide', isHeroPage ? 'text-font-light' : 'text-font-primary']"
      >Login</router-link>

      <button
        @click="openCart"
        :class="['font-body text-[13px] font-medium uppercase tracking-wide cursor-pointer', isHeroPage ? 'text-font-light' : 'text-font-primary']"
      >Cart ({{ totalItems }})</button>
    </div>
  </nav>

  <!-- Mobile Nav -->
  <nav class="md:hidden flex items-center justify-between h-[60px] px-lg bg-bg-primary">
    <router-link to="/" class="flex flex-col">
      <span class="font-heading text-body-lg tracking-[3px] text-font-green">VELVETY</span>
      <span class="font-heading text-[9px] italic text-accent-green-light">Facial & skincare</span>
    </router-link>

    <div class="flex items-center gap-md">
      <router-link to="/shop" class="font-body text-[13px] font-medium uppercase text-font-primary">Shop</router-link>
      <button @click="openCart" class="font-body text-[13px] font-medium uppercase text-font-primary cursor-pointer">Cart ({{ totalItems }})</button>
      <button
        @click="toggleMobileMenu"
        class="w-9 h-9 rounded-full bg-accent-green-light flex items-center justify-center"
      >
        <span v-if="!mobileMenuOpen" class="text-font-light text-xs">☰</span>
        <span v-else class="text-font-light text-body">✕</span>
      </button>
    </div>
  </nav>

  <!-- Mobile Menu Overlay -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 top-[60px] bg-bg-primary z-40 overflow-y-auto">
      <div class="flex flex-col h-full px-lg py-lg gap-lg">
        <div class="border-t border-border-light" />

        <!-- Pages Accordion -->
        <div>
          <button
            @click="pagesExpanded = !pagesExpanded"
            class="flex items-center justify-between w-full"
          >
            <span class="font-heading text-[32px] text-font-primary">Pages</span>
            <span class="text-font-primary text-subsection">{{ pagesExpanded ? '⌃' : '⌄' }}</span>
          </button>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[500px]"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 max-h-[500px]"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="pagesExpanded" class="overflow-hidden mt-md flex flex-col gap-3">
              <div class="grid grid-cols-2 gap-3">
                <router-link
                  v-for="link in pageLinks"
                  :key="link.name"
                  :to="link.to"
                  class="text-[15px] font-body text-font-primary"
                  @click="toggleMobileMenu"
                >
                  {{ link.name }}
                </router-link>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Big Links -->
        <div class="flex flex-col gap-sm">
          <router-link to="/shop" class="font-heading text-[36px] text-font-primary" @click="toggleMobileMenu">Shop</router-link>
          <router-link to="/about" class="font-heading text-[36px] text-font-primary" @click="toggleMobileMenu">About</router-link>
          <button class="font-heading text-[36px] text-font-primary text-left" @click="toggleMobileMenu(); openCart()">Cart({{ totalItems }})</button>
        </div>

        <div class="flex-1" />

        <!-- Login Button -->
        <router-link
          to="/login"
          class="flex items-center justify-center h-[52px] border border-border-dark text-font-primary font-body text-body w-full"
          @click="toggleMobileMenu"
        >
          Login
        </router-link>
      </div>
    </div>
  </Transition>
</template>
