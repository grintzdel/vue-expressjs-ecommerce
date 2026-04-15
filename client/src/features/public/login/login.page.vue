<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLogin } from '@/modules/auth/ui/hooks/queries/mutation/use-login'

const router = useRouter()
const login = useLogin()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login.mutateAsync({ email: email.value, password: password.value })
    router.push('/admin')
  } catch (e: any) {
    error.value = e?.message || 'Identifiants invalides'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-bg-primary flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl shadow-sm border border-border-light w-full max-w-[400px] p-8">
      <div class="mb-8 text-center">
        <h1 class="font-heading text-[28px] font-bold text-font-primary mb-1">Connexion</h1>
        <p class="font-body text-sm text-font-secondary">Accédez à votre espace administrateur</p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Email</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="votre@email.com"
            class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm text-font-primary focus:outline-none focus:border-accent-green transition-colors"
          />
        </div>

        <div>
          <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm text-font-primary focus:outline-none focus:border-accent-green transition-colors"
          />
        </div>

        <p v-if="error" class="font-body text-sm text-[#C94444]">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full h-11 bg-accent-green text-white font-body text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <p class="font-body text-sm text-font-tertiary text-center mt-6">
        Pas encore de compte ?
        <router-link to="/register" class="text-accent-green hover:underline font-medium">S'inscrire</router-link>
      </p>
    </div>
  </div>
</template>
