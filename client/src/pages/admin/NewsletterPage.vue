<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface Subscription {
  id: string
  email: string
  subscribedAt: string
  isActive: boolean
  discountCode: string
}

const api = useApi()

const subscriptions = ref<Subscription[]>([])
const search = ref('')
const activeDropdown = ref<string | null>(null)

const filteredSubscriptions = computed(() => {
  if (!search.value) return subscriptions.value
  const q = search.value.toLowerCase()
  return subscriptions.value.filter(s => s.email.toLowerCase().includes(q))
})

async function fetchSubscriptions() {
  subscriptions.value = await api.get<Subscription[]>('/newsletter')
}

async function unsubscribe(email: string) {
  activeDropdown.value = null
  if (confirm(`Désabonner ${email} ?`)) {
    await api.post('/newsletter/unsubscribe', { email })
    await fetchSubscriptions()
  }
}

async function remove(id: string) {
  activeDropdown.value = null
  if (confirm('Supprimer cet abonnement ?')) {
    await api.del(`/newsletter/${id}`)
    await fetchSubscriptions()
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(fetchSubscriptions)
</script>

<template>
  <div class="p-6" @click="activeDropdown = null">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-[28px] font-bold text-font-primary">Newsletter</h1>
        <p class="text-sm font-body text-font-secondary mt-1">Gérez les abonnements newsletter</p>
      </div>
    </div>

    <div class="flex items-center gap-3 mb-6">
      <div class="flex items-center gap-2 bg-white border border-border-light rounded-lg h-9 px-3 w-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-tertiary flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input v-model="search" type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-body text-font-primary w-full" />
      </div>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredSubscriptions.length }} abonnés</span>
    </div>

    <div class="bg-white rounded-xl border border-border-light overflow-hidden">
      <div class="flex items-center gap-3 h-9 px-5 bg-white text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">
        <span class="flex-1">EMAIL</span>
        <span class="w-[120px]">DATE</span>
        <span class="w-[90px]">STATUT</span>
        <span class="w-[120px]">CODE PROMO</span>
        <span class="w-[70px]">ACTIONS</span>
      </div>

      <div v-if="filteredSubscriptions.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">
        Aucun abonné trouvé
      </div>

      <div
        v-for="(item, i) in filteredSubscriptions"
        :key="item.id"
        class="flex items-center gap-3 h-12 px-5 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors"
      >
        <span class="flex-1 text-[13px] font-body text-font-primary truncate">{{ item.email }}</span>
        <span class="w-[120px] text-xs font-body text-font-tertiary">{{ formatDate(item.subscribedAt) }}</span>
        <div class="w-[90px] flex justify-center">
          <span
            class="text-[11px] font-semibold font-body px-2.5 py-1 rounded-full"
            :class="item.isActive ? 'bg-[#E8F0E0] text-[#4A5E3A]' : 'bg-[#F0F0F0] text-font-tertiary'"
          >
            {{ item.isActive ? 'Actif' : 'Inactif' }}
          </span>
        </div>
        <span class="w-[120px] text-xs font-body text-font-tertiary">{{ item.discountCode || '—' }}</span>
        <div class="w-[70px] flex justify-center relative">
          <button class="p-1 text-font-tertiary hover:text-font-primary" @click.stop="activeDropdown = activeDropdown === item.id ? null : item.id">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <div v-if="activeDropdown === item.id" class="absolute right-0 top-8 z-20 bg-white border border-border-light rounded-lg shadow-lg py-1.5 w-[170px]" @click.stop>
            <button v-if="item.isActive" class="block w-full text-left px-4 py-2 text-sm font-body text-font-primary hover:bg-bg-primary transition" @click="unsubscribe(item.email)">Désabonner</button>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-[#C94444] hover:bg-bg-primary transition" @click="remove(item.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
