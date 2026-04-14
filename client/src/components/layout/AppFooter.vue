<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
</script>

<template>
  <footer class="bg-bg-dark text-font-light">
    <div class="max-w-[1440px] mx-auto px-2xl py-3xl">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-2xl">
        <!-- Logo & Tagline -->
        <div class="md:col-span-1">
          <div class="font-heading text-body-lg tracking-[3px]">VELVETY</div>
          <div class="font-heading text-xs italic text-border-light mt-xs">Facial & skincare</div>
          <p class="text-sm text-border-light mt-lg">
            Natural skincare inspired by traditional knowledge and nature.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-heading text-body mb-md">Quick Links</h4>
          <nav class="flex flex-col gap-sm">
            <router-link to="/" class="text-sm text-border-light hover:text-font-light transition-colors">Home</router-link>
            <router-link to="/shop" class="text-sm text-border-light hover:text-font-light transition-colors">Shop</router-link>
            <router-link to="/about" class="text-sm text-border-light hover:text-font-light transition-colors">About</router-link>
            <router-link to="/blog" class="text-sm text-border-light hover:text-font-light transition-colors">Blog</router-link>
          </nav>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-heading text-body mb-md">Support</h4>
          <nav class="flex flex-col gap-sm">
            <a href="#" class="text-sm text-border-light hover:text-font-light transition-colors">Contact Us</a>
            <a href="#" class="text-sm text-border-light hover:text-font-light transition-colors">Licenses</a>
            <a href="#" class="text-sm text-border-light hover:text-font-light transition-colors">Changelog</a>
            <a href="#" class="text-sm text-border-light hover:text-font-light transition-colors">Style Guide</a>
          </nav>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="font-heading text-body mb-md">Subscribe</h4>
          <p class="text-sm text-border-light mb-md">Get 10% off your first order</p>
          <form @submit.prevent class="flex gap-sm">
            <input
              v-model="email"
              type="email"
              placeholder="Your email"
              class="flex-1 bg-transparent border border-border-light rounded-full px-lg py-sm text-sm text-font-light placeholder:text-font-tertiary focus:outline-none focus:border-font-light"
            />
            <button class="btn-secondary !bg-accent-green !text-font-light !py-sm !px-lg">
              Go
            </button>
          </form>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-accent-green mt-2xl pt-lg flex flex-col md:flex-row justify-between items-center gap-md">
        <p class="text-xs text-font-tertiary">&copy; 2024 VELVETY. All rights reserved.</p>
        <div class="flex gap-lg">
          <a href="#" class="text-xs text-font-tertiary hover:text-font-light">Privacy Policy</a>
          <a href="#" class="text-xs text-font-tertiary hover:text-font-light">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</template>
