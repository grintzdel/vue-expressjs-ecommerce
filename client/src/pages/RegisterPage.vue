<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    const apiBase = import.meta.env.VITE_API_URL || '/api'
    const res = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const json = await res.json()
    if (!res.ok) {
      error.value = json.error || 'Registration failed'
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
        src="https://images.unsplash.com/photo-1634449277989-0e50ad2ca43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
        alt="Natural skincare"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-bg-dark/30"></div>
      <div class="absolute bottom-16 left-16 right-16">
        <p class="font-heading text-[36px] leading-[1.2] text-font-light">
          Begin your journey to naturally radiant skin.
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
          Create account
        </h1>
        <p class="font-body text-sm text-font-secondary mb-2xl">
          Join Velvety and discover your personalized skincare routine.
        </p>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-md mb-lg">
          {{ error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="flex flex-col gap-lg">
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
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full h-[48px] px-lg bg-white border border-border-light rounded-md font-body text-sm text-font-primary placeholder:text-font-tertiary focus:outline-none focus:border-border-dark transition-colors"
            />
          </div>

          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Confirm password
            </label>
            <input
              v-model="confirmPassword"
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
            <span v-if="loading" class="animate-pulse">Creating account...</span>
            <span v-else>Create account →</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-md my-2xl">
          <div class="flex-1 h-px bg-border-light"></div>
          <span class="font-body text-xs text-font-tertiary">or</span>
          <div class="flex-1 h-px bg-border-light"></div>
        </div>

        <!-- Login link -->
        <p class="text-center font-body text-sm text-font-secondary">
          Already have an account?
          <router-link to="/login" class="text-font-green font-medium hover:underline">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
