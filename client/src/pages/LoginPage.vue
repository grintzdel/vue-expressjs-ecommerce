<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const json = await res.json()
    if (!res.ok) {
      error.value = json.error || 'Invalid credentials'
      return
    }
    localStorage.setItem('token', json.data.token)
    router.push('/admin')
  } catch {
    error.value = 'Server connection error'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-60px)] flex flex-col md:flex-row">
    <!-- Left: Image Panel (desktop only) -->
    <div class="hidden md:block md:w-1/2 relative">
      <img
        src="https://images.unsplash.com/photo-1631390179226-19682ca159de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
        alt="Skincare products"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-bg-dark/30"></div>
      <div class="absolute bottom-16 left-16 right-16">
        <p class="font-heading text-[36px] leading-[1.2] text-font-light">
          Welcome back to your natural beauty ritual.
        </p>
      </div>
    </div>

    <!-- Right: Form Panel -->
    <div class="flex-1 flex items-center justify-center px-[20px] py-[60px] md:px-3xl bg-bg-primary">
      <div class="w-full max-w-[420px]">
        <!-- Logo -->
        <div class="mb-3xl">
          <router-link to="/" class="inline-block">
            <span class="font-heading text-[24px] tracking-[3px] text-font-green">VELVETY</span>
          </router-link>
        </div>

        <!-- Heading -->
        <h1 class="font-heading text-section md:text-[42px] text-font-primary mb-sm">
          Sign in
        </h1>
        <p class="font-body text-sm text-font-secondary mb-2xl">
          Welcome back. Enter your credentials to access your account.
        </p>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-md mb-lg">
          {{ error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="flex flex-col gap-lg">
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="your@email.com"
              class="w-full h-[48px] px-lg bg-white border border-border-light rounded-md font-body text-sm text-font-primary placeholder:text-font-tertiary focus:outline-none focus:border-border-dark transition-colors"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-sm">
              <label class="font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary">
                Password
              </label>
              <a href="#" class="font-body text-xs text-accent-green hover:underline">Forgot password?</a>
            </div>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full h-[48px] px-lg bg-white border border-border-light rounded-md font-body text-sm text-font-primary placeholder:text-font-tertiary focus:outline-none focus:border-border-dark transition-colors"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary justify-center h-[48px] !py-0 mt-sm"
          >
            <span v-if="loading" class="animate-pulse">Signing in...</span>
            <span v-else>Sign in →</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-md my-2xl">
          <div class="flex-1 h-px bg-border-light"></div>
          <span class="font-body text-xs text-font-tertiary">or</span>
          <div class="flex-1 h-px bg-border-light"></div>
        </div>

        <!-- Register link -->
        <p class="text-center font-body text-sm text-font-secondary">
          Don't have an account?
          <router-link to="/register" class="text-font-green font-medium hover:underline">
            Create one
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
