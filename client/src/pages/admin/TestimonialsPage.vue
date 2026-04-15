<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface Testimonial {
  id: string
  authorName: string
  content: string
  rating: number
  isFeatured: boolean
  createdAt?: string
}

const api = useApi()

const testimonials = ref<Testimonial[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)
const search = ref('')
const filterStatus = ref('')
const filterRating = ref('')
const activeDropdown = ref<string | null>(null)

const form = ref({ authorName: '', content: '', rating: 5, isFeatured: false })

const filteredTestimonials = computed(() => {
  let result = testimonials.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(t => t.authorName.toLowerCase().includes(q) || t.content.toLowerCase().includes(q))
  }
  if (filterStatus.value === 'featured') result = result.filter(t => t.isFeatured)
  else if (filterStatus.value === 'normal') result = result.filter(t => !t.isFeatured)
  if (filterRating.value) result = result.filter(t => t.rating === Number(filterRating.value))
  return result
})

async function fetchTestimonials() {
  testimonials.value = await api.get<Testimonial[]>('/testimonials')
}

function openAdd() {
  editingId.value = null
  form.value = { authorName: '', content: '', rating: 5, isFeatured: false }
  showModal.value = true
}

function openEdit(t: Testimonial) {
  activeDropdown.value = null
  editingId.value = t.id
  form.value = { authorName: t.authorName, content: t.content, rating: t.rating, isFeatured: t.isFeatured }
  showModal.value = true
}

async function save() {
  if (editingId.value) {
    await api.patch(`/testimonials/${editingId.value}`, form.value)
  } else {
    await api.post('/testimonials', form.value)
  }
  showModal.value = false
  await fetchTestimonials()
}

async function remove(id: string) {
  activeDropdown.value = null
  if (confirm('Supprimer ce témoignage ?')) {
    await api.del(`/testimonials/${id}`)
    await fetchTestimonials()
  }
}

function stars(rating: number) {
  return '\u2605'.repeat(rating) + '\u2606'.repeat(5 - rating)
}

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

onMounted(fetchTestimonials)
</script>

<template>
  <div class="p-6" @click="activeDropdown = null">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-[28px] font-bold text-font-primary">Témoignages</h1>
        <p class="text-sm font-body text-font-secondary mt-1">Gérez les avis de vos clients</p>
      </div>
      <button class="flex items-center gap-2 bg-accent-green text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition" @click="openAdd">
        + Ajouter
      </button>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-6 flex-wrap">
      <div class="flex items-center gap-2 bg-white border border-border-light rounded-lg h-9 px-3 w-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-tertiary flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input v-model="search" type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-body text-font-primary w-full" />
      </div>
      <select v-model="filterStatus" class="bg-white border border-border-light rounded-lg h-9 px-3 text-sm font-body text-font-primary outline-none">
        <option value="">Tous statuts</option>
        <option value="featured">Vedette</option>
        <option value="normal">Normal</option>
      </select>
      <select v-model="filterRating" class="bg-white border border-border-light rounded-lg h-9 px-3 text-sm font-body text-font-primary outline-none">
        <option value="">Toutes notes</option>
        <option v-for="n in 5" :key="n" :value="n">{{ n }} \u2605</option>
      </select>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredTestimonials.length }} témoignages</span>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-border-light overflow-hidden">
      <div class="flex items-center gap-3 h-9 px-5 bg-white text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">
        <span class="w-[160px]">CLIENT</span>
        <span class="w-[90px]">NOTE</span>
        <span class="flex-1">COMMENTAIRE</span>
        <span class="w-[90px]">DATE</span>
        <span class="w-[90px]">STATUT</span>
        <span class="w-[70px]">ACTIONS</span>
      </div>

      <div v-if="filteredTestimonials.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">
        Aucun témoignage trouvé
      </div>

      <div
        v-for="(t, i) in filteredTestimonials"
        :key="t.id"
        class="flex items-center gap-3 h-[52px] px-5 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors"
      >
        <div class="w-[160px] flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-bg-light-sage flex items-center justify-center flex-shrink-0">
            <span class="text-[11px] font-body font-bold text-accent-green">{{ t.authorName.charAt(0).toUpperCase() }}</span>
          </div>
          <span class="text-[13px] font-body font-medium text-font-primary truncate">{{ t.authorName }}</span>
        </div>
        <span class="w-[90px] text-xs font-body text-[#E8A830] tracking-wider">{{ stars(t.rating) }}</span>
        <span class="flex-1 text-xs font-body text-font-secondary truncate">{{ t.content }}</span>
        <span class="w-[90px] text-xs font-body text-font-tertiary">{{ formatDate(t.createdAt) }}</span>
        <div class="w-[90px] flex justify-center">
          <span
            class="text-[11px] font-semibold font-body px-2.5 py-1 rounded-full"
            :class="t.isFeatured ? 'bg-[#E8F0E0] text-[#4A5E3A]' : 'bg-[#F0F0F0] text-font-tertiary'"
          >
            {{ t.isFeatured ? 'Vedette' : 'Normal' }}
          </span>
        </div>
        <div class="w-[70px] flex justify-center relative">
          <button class="p-1 text-font-tertiary hover:text-font-primary" @click.stop="activeDropdown = activeDropdown === t.id ? null : t.id">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <div v-if="activeDropdown === t.id" class="absolute right-0 top-8 z-20 bg-white border border-border-light rounded-lg shadow-lg py-1.5 w-[170px]" @click.stop>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-font-primary hover:bg-bg-primary transition" @click="openEdit(t)">Modifier</button>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-[#C94444] hover:bg-bg-primary transition" @click="remove(t.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="showModal = false"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-6">
        <h2 class="font-heading text-xl font-bold text-font-primary mb-6">{{ editingId ? 'Modifier' : 'Ajouter' }} un témoignage</h2>
        <div class="space-y-4">
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Auteur</label>
            <input v-model="form.authorName" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" />
          </div>
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Commentaire</label>
            <textarea v-model="form.content" rows="4" class="w-full px-3 py-2 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary resize-none" />
          </div>
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Note</label>
            <select v-model="form.rating" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary">
              <option v-for="n in 5" :key="n" :value="n">{{ n }} {{ '\u2605'.repeat(n) }}</option>
            </select>
          </div>
          <label class="flex items-center gap-2 cursor-pointer font-body text-sm text-font-primary">
            <input v-model="form.isFeatured" type="checkbox" class="accent-accent-green w-4 h-4" />
            Témoignage vedette
          </label>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button class="px-5 py-2.5 rounded-lg border border-border-light font-body text-sm text-font-primary hover:bg-bg-primary transition" @click="showModal = false">Annuler</button>
          <button class="px-5 py-2.5 rounded-lg bg-accent-green text-white font-body text-sm font-medium hover:opacity-90 transition" @click="save">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>
