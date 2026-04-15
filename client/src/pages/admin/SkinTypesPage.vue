<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface SkinType {
  id: string
  name: string
  slug: string
}

const api = useApi()
const skinTypes = ref<SkinType[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)
const search = ref('')
const activeDropdown = ref<string | null>(null)
const form = ref({ name: '', slug: '' })

const filteredSkinTypes = computed(() => {
  if (!search.value) return skinTypes.value
  const q = search.value.toLowerCase()
  return skinTypes.value.filter(s => s.name.toLowerCase().includes(q))
})

async function fetchSkinTypes() { skinTypes.value = await api.get<SkinType[]>('/skin-types') }

watch(() => form.value.name, (val) => {
  if (!editingId.value) form.value.slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
})

function openAdd() { editingId.value = null; form.value = { name: '', slug: '' }; showModal.value = true }
function openEdit(s: SkinType) { activeDropdown.value = null; editingId.value = s.id; form.value = { name: s.name, slug: s.slug }; showModal.value = true }

async function save() {
  if (editingId.value) await api.patch(`/skin-types/${editingId.value}`, form.value)
  else await api.post('/skin-types', form.value)
  showModal.value = false; await fetchSkinTypes()
}

async function remove(id: string) {
  activeDropdown.value = null
  if (confirm('Supprimer ce type de peau ?')) { await api.del(`/skin-types/${id}`); await fetchSkinTypes() }
}

onMounted(fetchSkinTypes)
</script>

<template>
  <div class="p-6" @click="activeDropdown = null">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-[28px] font-bold text-font-primary">Types de peau</h1>
        <p class="text-sm font-body text-font-secondary mt-1">Gérez les types de peau</p>
      </div>
      <button class="flex items-center gap-2 bg-accent-green text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition" @click="openAdd">+ Ajouter</button>
    </div>

    <div class="flex items-center gap-3 mb-6">
      <div class="flex items-center gap-2 bg-white border border-border-light rounded-lg h-9 px-3 w-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-tertiary flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input v-model="search" type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-body text-font-primary w-full" />
      </div>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredSkinTypes.length }} types</span>
    </div>

    <div class="bg-white rounded-xl border border-border-light overflow-hidden">
      <div class="flex items-center gap-3 h-9 px-5 bg-white text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">
        <span class="flex-1">NOM</span>
        <span class="w-[200px]">SLUG</span>
        <span class="w-[70px]">ACTIONS</span>
      </div>
      <div v-if="filteredSkinTypes.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">Aucun type trouvé</div>
      <div v-for="(s, i) in filteredSkinTypes" :key="s.id" class="flex items-center gap-3 h-12 px-5 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors">
        <span class="flex-1 text-[13px] font-body font-medium text-font-primary">{{ s.name }}</span>
        <span class="w-[200px] text-xs font-body text-font-tertiary">{{ s.slug }}</span>
        <div class="w-[70px] flex justify-center relative">
          <button class="p-1 text-font-tertiary hover:text-font-primary" @click.stop="activeDropdown = activeDropdown === s.id ? null : s.id">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <div v-if="activeDropdown === s.id" class="absolute right-0 top-8 z-20 bg-white border border-border-light rounded-lg shadow-lg py-1.5 w-[170px]" @click.stop>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-font-primary hover:bg-bg-primary transition" @click="openEdit(s)">Modifier</button>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-[#C94444] hover:bg-bg-primary transition" @click="remove(s.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="showModal = false"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-[560px] p-6">
        <h2 class="font-heading text-xl font-bold text-font-primary mb-6">{{ editingId ? 'Modifier' : 'Ajouter' }} un type de peau</h2>
        <div class="space-y-4">
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Nom</label>
            <input v-model="form.name" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" />
          </div>
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Slug</label>
            <input v-model="form.slug" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button class="px-5 py-2.5 rounded-lg border border-border-light font-body text-sm text-font-primary hover:bg-bg-primary transition" @click="showModal = false">Annuler</button>
          <button class="px-5 py-2.5 rounded-lg bg-accent-green text-white font-body text-sm font-medium hover:opacity-90 transition" @click="save">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>
