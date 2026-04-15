<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface PressLogo {
  id: string
  name: string
  logoUrl: string
  link: string
  position: number
}

const api = useApi()
const logos = ref<PressLogo[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)
const search = ref('')
const activeDropdown = ref<string | null>(null)
const form = ref({ name: '', logoUrl: '', link: '', position: 0 })

const filteredLogos = computed(() => {
  if (!search.value) return logos.value
  const q = search.value.toLowerCase()
  return logos.value.filter(l => l.name.toLowerCase().includes(q))
})

async function fetchLogos() { logos.value = await api.get<PressLogo[]>('/press-logos') }

function openAdd() { editingId.value = null; form.value = { name: '', logoUrl: '', link: '', position: 0 }; showModal.value = true }
function openEdit(logo: PressLogo) { activeDropdown.value = null; editingId.value = logo.id; form.value = { name: logo.name, logoUrl: logo.logoUrl, link: logo.link, position: logo.position }; showModal.value = true }

async function save() {
  if (editingId.value) await api.patch(`/press-logos/${editingId.value}`, form.value)
  else await api.post('/press-logos', form.value)
  showModal.value = false; await fetchLogos()
}

async function remove(id: string) {
  activeDropdown.value = null
  if (confirm('Supprimer ce logo ?')) { await api.del(`/press-logos/${id}`); await fetchLogos() }
}

function truncate(str: string, max = 40) { return str.length > max ? str.substring(0, max) + '...' : str }

onMounted(fetchLogos)
</script>

<template>
  <div class="p-6" @click="activeDropdown = null">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-[28px] font-bold text-font-primary">Press Logos</h1>
        <p class="text-sm font-body text-font-secondary mt-1">Gérez les logos presse</p>
      </div>
      <button class="flex items-center gap-2 bg-accent-green text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition" @click="openAdd">+ Ajouter</button>
    </div>

    <div class="flex items-center gap-3 mb-6">
      <div class="flex items-center gap-2 bg-white border border-border-light rounded-lg h-9 px-3 w-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-tertiary flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input v-model="search" type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-body text-font-primary w-full" />
      </div>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredLogos.length }} logos</span>
    </div>

    <div class="bg-white rounded-xl border border-border-light overflow-hidden">
      <div class="flex items-center gap-3 h-9 px-5 bg-white text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">
        <span class="flex-1">NOM</span>
        <span class="w-[80px]">POSITION</span>
        <span class="w-[200px]">URL LOGO</span>
        <span class="w-[70px]">ACTIONS</span>
      </div>
      <div v-if="filteredLogos.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">Aucun logo trouvé</div>
      <div v-for="(logo, i) in filteredLogos" :key="logo.id" class="flex items-center gap-3 h-12 px-5 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors">
        <span class="flex-1 text-[13px] font-body font-medium text-font-primary truncate">{{ logo.name }}</span>
        <span class="w-[80px] text-[13px] font-body text-font-primary text-center">{{ logo.position }}</span>
        <span class="w-[200px] text-xs font-body text-font-tertiary truncate">{{ truncate(logo.logoUrl) }}</span>
        <div class="w-[70px] flex justify-center relative">
          <button class="p-1 text-font-tertiary hover:text-font-primary" @click.stop="activeDropdown = activeDropdown === logo.id ? null : logo.id">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <div v-if="activeDropdown === logo.id" class="absolute right-0 top-8 z-20 bg-white border border-border-light rounded-lg shadow-lg py-1.5 w-[170px]" @click.stop>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-font-primary hover:bg-bg-primary transition" @click="openEdit(logo)">Modifier</button>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-[#C94444] hover:bg-bg-primary transition" @click="remove(logo.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="showModal = false"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-[560px] p-6">
        <h2 class="font-heading text-xl font-bold text-font-primary mb-6">{{ editingId ? 'Modifier' : 'Ajouter' }} un logo</h2>
        <div class="space-y-4">
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Nom</label><input v-model="form.name" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" /></div>
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">URL du logo</label><input v-model="form.logoUrl" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" /></div>
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Lien</label><input v-model="form.link" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" /></div>
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Position</label><input v-model.number="form.position" type="number" min="0" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" /></div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button class="px-5 py-2.5 rounded-lg border border-border-light font-body text-sm text-font-primary hover:bg-bg-primary transition" @click="showModal = false">Annuler</button>
          <button class="px-5 py-2.5 rounded-lg bg-accent-green text-white font-body text-sm font-medium hover:opacity-90 transition" @click="save">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>
