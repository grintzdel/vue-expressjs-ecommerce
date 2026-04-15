<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

const api = useApi()

const categories = ref<Category[]>([])
const loading = ref(false)
const showModal = ref(false)
const editingItem = ref<Partial<Category>>({})
const search = ref('')
const activeDropdown = ref<string | null>(null)

const filteredCategories = computed(() => {
  if (!search.value) return categories.value
  const q = search.value.toLowerCase()
  return categories.value.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
})

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function onNameInput(value: string) {
  editingItem.value.name = value
  if (!editingItem.value.id) {
    editingItem.value.slug = generateSlug(value)
  }
}

async function fetchCategories() {
  loading.value = true
  try {
    categories.value = await api.get<Category[]>('/categories')
  } finally {
    loading.value = false
  }
}

function openAdd() {
  editingItem.value = { name: '', slug: '', description: '' }
  showModal.value = true
}

function openEdit(item: Category) {
  activeDropdown.value = null
  editingItem.value = { ...item }
  showModal.value = true
}

async function handleSave() {
  const { id, name, slug, description } = editingItem.value
  const body = { name, slug, description }
  if (id) {
    await api.patch(`/categories/${id}`, body)
  } else {
    await api.post('/categories', body)
  }
  showModal.value = false
  await fetchCategories()
}

async function handleDelete(item: Category) {
  activeDropdown.value = null
  if (!confirm(`Supprimer la catégorie "${item.name}" ?`)) return
  await api.del(`/categories/${item.id}`)
  await fetchCategories()
}

function truncate(text: string | undefined, len = 60): string {
  if (!text) return '—'
  return text.length > len ? text.slice(0, len) + '...' : text
}

onMounted(fetchCategories)
</script>

<template>
  <div class="p-6" @click="activeDropdown = null">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-[28px] font-bold text-font-primary">Catégories</h1>
        <p class="text-sm font-body text-font-secondary mt-1">Organisez vos produits par catégorie</p>
      </div>
      <button class="flex items-center gap-2 bg-accent-green text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition" @click="openAdd">
        + Ajouter
      </button>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-6">
      <div class="flex items-center gap-2 bg-white border border-border-light rounded-lg h-9 px-3 w-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-tertiary flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input v-model="search" type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-body text-font-primary w-full" />
      </div>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredCategories.length }} catégories</span>
    </div>

    <p v-if="loading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-border-light overflow-hidden">
      <div class="flex items-center gap-3 h-9 px-5 bg-white text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">
        <span class="flex-1">NOM</span>
        <span class="w-[150px]">SLUG</span>
        <span class="w-[250px]">DESCRIPTION</span>
        <span class="w-[90px]">STATUT</span>
        <span class="w-[70px]">ACTIONS</span>
      </div>

      <div v-if="filteredCategories.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">
        Aucune catégorie trouvée
      </div>

      <div
        v-for="(cat, i) in filteredCategories"
        :key="cat.id"
        class="flex items-center gap-3 h-12 px-5 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors"
      >
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-body font-medium text-font-primary truncate">{{ cat.name }}</p>
        </div>
        <span class="w-[150px] text-xs font-body text-font-tertiary truncate">{{ cat.slug }}</span>
        <span class="w-[250px] text-xs font-body text-font-secondary truncate">{{ truncate(cat.description) }}</span>
        <div class="w-[90px] flex justify-center">
          <span class="text-[11px] font-semibold font-body px-2.5 py-1 rounded-full bg-[#E8F0E0] text-[#4A5E3A]">Actif</span>
        </div>
        <div class="w-[70px] flex justify-center relative">
          <button class="p-1 text-font-tertiary hover:text-font-primary" @click.stop="activeDropdown = activeDropdown === cat.id ? null : cat.id">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <div v-if="activeDropdown === cat.id" class="absolute right-0 top-8 z-20 bg-white border border-border-light rounded-lg shadow-lg py-1.5 w-[170px]" @click.stop>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-font-primary hover:bg-bg-primary transition" @click="openEdit(cat)">Modifier</button>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-[#C94444] hover:bg-bg-primary transition" @click="handleDelete(cat)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="showModal = false"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-6">
        <h2 class="font-heading text-xl font-bold text-font-primary mb-6">
          {{ editingItem.id ? 'Modifier' : 'Ajouter' }} une catégorie
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Nom</label>
            <input type="text" :value="editingItem.name" @input="onNameInput(($event.target as HTMLInputElement).value)" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm text-font-primary focus:outline-none focus:border-font-tertiary" />
          </div>
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Slug</label>
            <input type="text" v-model="editingItem.slug" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm text-font-primary focus:outline-none focus:border-font-tertiary" />
          </div>
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Description</label>
            <textarea v-model="editingItem.description" rows="3" class="w-full px-3 py-2 bg-white border border-border-light rounded-lg font-body text-sm text-font-primary focus:outline-none focus:border-font-tertiary resize-none" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button class="px-5 py-2.5 rounded-lg border border-border-light font-body text-sm text-font-primary hover:bg-bg-primary transition" @click="showModal = false">Annuler</button>
          <button class="px-5 py-2.5 rounded-lg bg-accent-green text-white font-body text-sm font-medium hover:opacity-90 transition" @click="handleSave">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>
