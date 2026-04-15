<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  author: string
  publishedAt: string | null
  tags: string[]
}

const api = useApi()
const posts = ref<BlogPost[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)
const search = ref('')
const activeDropdown = ref<string | null>(null)

const form = ref({ title: '', slug: '', content: '', excerpt: '', featuredImage: '', author: '', publishedAt: '', tags: '' })

const filteredPosts = computed(() => {
  if (!search.value) return posts.value
  const q = search.value.toLowerCase()
  return posts.value.filter(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
})

async function fetchPosts() { posts.value = await api.get<BlogPost[]>('/blog-posts') }

watch(() => form.value.title, (val) => {
  if (!editingId.value) form.value.slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
})

function openAdd() { editingId.value = null; form.value = { title: '', slug: '', content: '', excerpt: '', featuredImage: '', author: '', publishedAt: '', tags: '' }; showModal.value = true }

function openEdit(post: BlogPost) {
  activeDropdown.value = null; editingId.value = post.id
  form.value = { title: post.title, slug: post.slug, content: post.content, excerpt: post.excerpt, featuredImage: post.featuredImage, author: post.author, publishedAt: post.publishedAt ? post.publishedAt.substring(0, 10) : '', tags: post.tags.join(', ') }
  showModal.value = true
}

async function save() {
  const payload = { title: form.value.title, slug: form.value.slug, content: form.value.content, excerpt: form.value.excerpt, featuredImage: form.value.featuredImage, author: form.value.author, publishedAt: form.value.publishedAt || null, tags: form.value.tags.split(',').map(t => t.trim()).filter(Boolean) }
  if (editingId.value) await api.patch(`/blog-posts/${editingId.value}`, payload)
  else await api.post('/blog-posts', payload)
  showModal.value = false; await fetchPosts()
}

async function remove(id: string) {
  activeDropdown.value = null
  if (confirm('Supprimer cet article ?')) { await api.del(`/blog-posts/${id}`); await fetchPosts() }
}

function formatDate(date: string | null) {
  if (!date) return 'Brouillon'
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(fetchPosts)
</script>

<template>
  <div class="p-6" @click="activeDropdown = null">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-[28px] font-bold text-font-primary">Blog Posts</h1>
        <p class="text-sm font-body text-font-secondary mt-1">Publiez du contenu pour vos clients</p>
      </div>
      <button class="flex items-center gap-2 bg-accent-green text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition" @click="openAdd">+ Ajouter</button>
    </div>

    <div class="flex items-center gap-3 mb-6">
      <div class="flex items-center gap-2 bg-white border border-border-light rounded-lg h-9 px-3 w-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-tertiary flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input v-model="search" type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-body text-font-primary w-full" />
      </div>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredPosts.length }} articles</span>
    </div>

    <div class="bg-white rounded-xl border border-border-light overflow-hidden">
      <div class="flex items-center gap-3 h-9 px-5 bg-white text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">
        <span class="flex-1">TITRE</span>
        <span class="w-[120px]">AUTEUR</span>
        <span class="w-[120px]">DATE</span>
        <span class="w-[90px]">STATUT</span>
        <span class="w-[70px]">ACTIONS</span>
      </div>
      <div v-if="filteredPosts.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">Aucun article trouvé</div>
      <div v-for="(post, i) in filteredPosts" :key="post.id" class="flex items-center gap-3 h-12 px-5 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors">
        <span class="flex-1 text-[13px] font-body font-medium text-font-primary truncate">{{ post.title }}</span>
        <span class="w-[120px] text-xs font-body text-font-secondary truncate">{{ post.author }}</span>
        <span class="w-[120px] text-xs font-body text-font-tertiary">{{ formatDate(post.publishedAt) }}</span>
        <div class="w-[90px] flex justify-center">
          <span class="text-[11px] font-semibold font-body px-2.5 py-1 rounded-full" :class="post.publishedAt ? 'bg-[#E8F0E0] text-[#4A5E3A]' : 'bg-[#FFF8E1] text-[#E8A830]'">
            {{ post.publishedAt ? 'Publié' : 'Brouillon' }}
          </span>
        </div>
        <div class="w-[70px] flex justify-center relative">
          <button class="p-1 text-font-tertiary hover:text-font-primary" @click.stop="activeDropdown = activeDropdown === post.id ? null : post.id">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <div v-if="activeDropdown === post.id" class="absolute right-0 top-8 z-20 bg-white border border-border-light rounded-lg shadow-lg py-1.5 w-[170px]" @click.stop>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-font-primary hover:bg-bg-primary transition" @click="openEdit(post)">Modifier</button>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-[#C94444] hover:bg-bg-primary transition" @click="remove(post.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="showModal = false"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-6">
        <h2 class="font-heading text-xl font-bold text-font-primary mb-6">{{ editingId ? 'Modifier' : 'Ajouter' }} un article</h2>
        <div class="space-y-4">
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Titre</label><input v-model="form.title" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" /></div>
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Slug</label><input v-model="form.slug" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" /></div>
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Contenu</label><textarea v-model="form.content" rows="8" class="w-full px-3 py-2 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary resize-none" /></div>
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Extrait</label><textarea v-model="form.excerpt" rows="3" class="w-full px-3 py-2 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary resize-none" /></div>
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Image URL</label><input v-model="form.featuredImage" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" /></div>
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Auteur</label><input v-model="form.author" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" /></div>
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Date de publication</label><input v-model="form.publishedAt" type="date" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" /></div>
          <div><label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Tags (séparés par des virgules)</label><input v-model="form.tags" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" /></div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button class="px-5 py-2.5 rounded-lg border border-border-light font-body text-sm text-font-primary hover:bg-bg-primary transition" @click="showModal = false">Annuler</button>
          <button class="px-5 py-2.5 rounded-lg bg-accent-green text-white font-body text-sm font-medium hover:opacity-90 transition" @click="save">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>
