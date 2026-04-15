<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface Category {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
}

interface SkinType {
  id: string
  name: string
}

interface ProductImage {
  url: string
  altText: string
  position: number
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  currency: string
  images?: ProductImage[]
  categoryId?: string
  category?: Category
  tagIds?: string[]
  skinTypeIds?: string[]
  stockQuantity: number
  isFeatured: boolean
  ingredients?: string
  howToUse?: string
  shippingInfo?: string
}

type EditingProduct = Partial<Omit<Product, 'tagIds' | 'skinTypeIds' | 'images'>> & {
  tagIds: string[]
  skinTypeIds: string[]
  images: ProductImage[]
  ingredients: string
  howToUse: string
  shippingInfo: string
}

const api = useApi()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const skinTypes = ref<SkinType[]>([])
const loading = ref(false)
const showModal = ref(false)
const search = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const activeDropdown = ref<string | null>(null)

const editingItem = ref<EditingProduct>({
  name: '', slug: '', description: '', price: 0, currency: 'EUR',
  images: [], categoryId: '', tagIds: [], skinTypeIds: [], stockQuantity: 0, isFeatured: false,
  ingredients: '', howToUse: '', shippingInfo: '',
})
const newImageUrl = ref('')
const newImageAlt = ref('')

const filteredProducts = computed(() => {
  let result = products.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }
  if (filterCategory.value) {
    result = result.filter(p => p.categoryId === filterCategory.value)
  }
  if (filterStatus.value === 'active') {
    result = result.filter(p => p.stockQuantity > 0)
  } else if (filterStatus.value === 'out') {
    result = result.filter(p => p.stockQuantity === 0)
  }
  return result
})

function addImage() {
  if (!newImageUrl.value.trim()) return
  editingItem.value.images.push({
    url: newImageUrl.value.trim(),
    altText: newImageAlt.value.trim() || editingItem.value.name || 'Product image',
    position: editingItem.value.images.length,
  })
  newImageUrl.value = ''
  newImageAlt.value = ''
}

function removeImage(index: number) {
  editingItem.value.images.splice(index, 1)
  editingItem.value.images.forEach((img, i) => img.position = i)
}

function moveImage(index: number, direction: -1 | 1) {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= editingItem.value.images.length) return
  const imgs = editingItem.value.images
  ;[imgs[index], imgs[newIndex]] = [imgs[newIndex], imgs[index]]
  imgs.forEach((img, i) => img.position = i)
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function onNameInput(value: string) {
  editingItem.value.name = value
  if (!editingItem.value.id) {
    editingItem.value.slug = generateSlug(value)
  }
}

function getCategoryName(categoryId?: string): string {
  if (!categoryId) return '—'
  return categories.value.find(c => c.id === categoryId)?.name ?? '—'
}

function toggleId(arr: string[], id: string) {
  const idx = arr.indexOf(id)
  if (idx === -1) arr.push(id)
  else arr.splice(idx, 1)
}

async function fetchAll() {
  loading.value = true
  try {
    const [prods, cats, tgs, sts] = await Promise.all([
      api.get<Product[]>('/products'),
      api.get<Category[]>('/categories'),
      api.get<Tag[]>('/tags'),
      api.get<SkinType[]>('/skin-types'),
    ])
    products.value = prods
    categories.value = cats
    tags.value = tgs
    skinTypes.value = sts
  } finally {
    loading.value = false
  }
}

function openAdd() {
  editingItem.value = {
    name: '', slug: '', description: '', price: 0, currency: 'EUR',
    images: [], categoryId: '', tagIds: [], skinTypeIds: [], stockQuantity: 0, isFeatured: false,
    ingredients: '', howToUse: '', shippingInfo: '',
  }
  newImageUrl.value = ''
  newImageAlt.value = ''
  showModal.value = true
}

function openEdit(item: Product) {
  activeDropdown.value = null
  editingItem.value = {
    ...item,
    images: item.images ? item.images.map(img => ({ ...img })) : [],
    tagIds: item.tagIds ? [...item.tagIds] : [],
    skinTypeIds: item.skinTypeIds ? [...item.skinTypeIds] : [],
    ingredients: item.ingredients ?? '',
    howToUse: item.howToUse ?? '',
    shippingInfo: item.shippingInfo ?? '',
  }
  newImageUrl.value = ''
  newImageAlt.value = ''
  showModal.value = true
}

async function handleSave() {
  const { id, name, slug, description, price, currency, images, categoryId, tagIds, skinTypeIds, stockQuantity, isFeatured, ingredients, howToUse, shippingInfo } = editingItem.value
  const body = { name, slug, description, price: Number(price), currency, images, categoryId, tagIds, skinTypeIds, stockQuantity: Number(stockQuantity), isFeatured, ingredients, howToUse, shippingInfo }
  if (id) {
    await api.patch(`/products/${id}`, body)
  } else {
    await api.post('/products', body)
  }
  showModal.value = false
  await fetchAll()
}

async function handleDelete(item: Product) {
  activeDropdown.value = null
  if (!confirm(`Supprimer le produit "${item.name}" ?`)) return
  await api.del(`/products/${item.id}`)
  await fetchAll()
}

function toggleDropdown(id: string) {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

onMounted(fetchAll)
</script>

<template>
  <div class="p-6" @click="activeDropdown = null">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-[28px] font-bold text-font-primary">Produits</h1>
        <p class="text-sm font-body text-font-secondary mt-1">Gérez votre catalogue de produits</p>
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
      <select v-model="filterCategory" class="bg-white border border-border-light rounded-lg h-9 px-3 text-sm font-body text-font-primary outline-none">
        <option value="">Toutes catégories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <select v-model="filterStatus" class="bg-white border border-border-light rounded-lg h-9 px-3 text-sm font-body text-font-primary outline-none">
        <option value="">Tous statuts</option>
        <option value="active">En stock</option>
        <option value="out">Rupture</option>
      </select>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredProducts.length }} produits</span>
    </div>

    <!-- Loading -->
    <p v-if="loading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-border-light overflow-hidden">
      <!-- Header -->
      <div class="flex items-center gap-3 h-9 px-5 bg-white text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">
        <span class="w-[60px]">Image</span>
        <span class="flex-1">NOM</span>
        <span class="w-[120px]">CATÉGORIE</span>
        <span class="w-[80px]">PRIX</span>
        <span class="w-[80px]">STOCK</span>
        <span class="w-[90px]">STATUT</span>
        <span class="w-[70px]">ACTIONS</span>
      </div>

      <div v-if="filteredProducts.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">
        Aucun produit trouvé
      </div>

      <!-- Rows -->
      <div
        v-for="(product, i) in filteredProducts"
        :key="product.id"
        class="flex items-center gap-3 h-[52px] px-5 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors"
      >
        <!-- Image -->
        <div class="w-[60px] flex-shrink-0">
          <img
            v-if="product.images && product.images.length > 0"
            :src="product.images[0].url"
            :alt="product.images[0].altText"
            class="w-10 h-10 object-cover rounded-lg"
          />
          <div v-else class="w-10 h-10 bg-bg-light-sage rounded-lg" />
        </div>

        <!-- Name -->
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-body font-medium text-font-primary truncate">{{ product.name }}</p>
          <p class="text-[11px] font-body text-font-tertiary truncate">{{ getCategoryName(product.categoryId) }}</p>
        </div>

        <!-- Category -->
        <span class="w-[120px] text-[11px] font-body text-font-secondary truncate">{{ getCategoryName(product.categoryId) }}</span>

        <!-- Price -->
        <span class="w-[80px] text-[13px] font-body font-semibold text-font-primary">€{{ product.price.toFixed(2) }}</span>

        <!-- Stock -->
        <span class="w-[80px] text-[13px] font-body text-font-primary">{{ product.stockQuantity }}</span>

        <!-- Status -->
        <div class="w-[90px] flex justify-center">
          <span
            class="text-[11px] font-semibold font-body px-2.5 py-1 rounded-full"
            :class="product.stockQuantity > 0
              ? 'bg-[#E8F0E0] text-[#4A5E3A]'
              : 'bg-[#FFEBEE] text-[#C94444]'"
          >
            {{ product.stockQuantity > 0 ? 'Actif' : 'Rupture' }}
          </span>
        </div>

        <!-- Actions -->
        <div class="w-[70px] flex justify-center relative">
          <button class="p-1 text-font-tertiary hover:text-font-primary" @click.stop="toggleDropdown(product.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <div
            v-if="activeDropdown === product.id"
            class="absolute right-0 top-8 z-20 bg-white border border-border-light rounded-lg shadow-lg py-1.5 w-[170px]"
            @click.stop
          >
            <a
              :href="`/product/${product.slug}`"
              target="_blank"
              class="block px-4 py-2 text-sm font-body text-font-primary hover:bg-bg-primary transition"
            >Voir</a>
            <button
              class="block w-full text-left px-4 py-2 text-sm font-body text-font-primary hover:bg-bg-primary transition"
              @click="openEdit(product)"
            >Modifier</button>
            <button
              class="block w-full text-left px-4 py-2 text-sm font-body text-[#C94444] hover:bg-bg-primary transition"
              @click="handleDelete(product)"
            >Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="showModal = false"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-6">
        <h2 class="font-heading text-xl font-bold text-font-primary mb-6">
          {{ editingItem.id ? 'Modifier' : 'Ajouter' }} un produit
        </h2>

        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Nom</label>
            <input type="text" :value="editingItem.name" @input="onNameInput(($event.target as HTMLInputElement).value)" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm text-font-primary focus:outline-none focus:border-font-tertiary" placeholder="Nom du produit" />
          </div>

          <!-- Slug -->
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Slug</label>
            <input type="text" v-model="editingItem.slug" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm text-font-primary focus:outline-none focus:border-font-tertiary" />
          </div>

          <!-- Description -->
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Description</label>
            <textarea v-model="editingItem.description" rows="3" class="w-full px-3 py-2 bg-white border border-border-light rounded-lg font-body text-sm text-font-primary focus:outline-none focus:border-font-tertiary resize-none" />
          </div>

          <!-- Images -->
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Images</label>
            <div v-if="editingItem.images.length > 0" class="flex flex-wrap gap-2 mb-2">
              <div v-for="(img, index) in editingItem.images" :key="index" class="relative group w-[80px]">
                <img :src="img.url" :alt="img.altText" class="w-[80px] h-[80px] object-cover rounded-lg border border-border-light" />
                <div class="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button v-if="index > 0" @click="moveImage(index, -1)" class="w-5 h-5 bg-white rounded-full text-[10px] flex items-center justify-center">←</button>
                  <button @click="removeImage(index)" class="w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">✕</button>
                  <button v-if="index < editingItem.images.length - 1" @click="moveImage(index, 1)" class="w-5 h-5 bg-white rounded-full text-[10px] flex items-center justify-center">→</button>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <input v-model="newImageUrl" type="url" placeholder="URL de l'image" class="flex-1 h-9 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" @keydown.enter.prevent="addImage" />
              <button type="button" class="h-9 px-3 bg-bg-primary font-body text-sm rounded-lg border border-border-light hover:bg-bg-light-sage transition" @click="addImage">+ Ajouter</button>
            </div>
          </div>

          <!-- Price & Currency -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Prix</label>
              <input type="number" v-model="editingItem.price" min="0" step="0.01" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" />
            </div>
            <div>
              <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Devise</label>
              <input type="text" v-model="editingItem.currency" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" />
            </div>
          </div>

          <!-- Category -->
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Catégorie</label>
            <select v-model="editingItem.categoryId" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary">
              <option value="">— Aucune —</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <!-- Stock -->
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Stock</label>
            <input type="number" v-model="editingItem.stockQuantity" min="0" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" />
          </div>

          <!-- Tags -->
          <div v-if="tags.length > 0">
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Tags</label>
            <div class="flex flex-wrap gap-2">
              <label v-for="tag in tags" :key="tag.id" class="flex items-center gap-1.5 cursor-pointer font-body text-sm text-font-secondary">
                <input type="checkbox" :checked="editingItem.tagIds.includes(tag.id)" @change="toggleId(editingItem.tagIds, tag.id)" class="accent-accent-green" />
                {{ tag.name }}
              </label>
            </div>
          </div>

          <!-- Skin Types -->
          <div v-if="skinTypes.length > 0">
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Types de peau</label>
            <div class="flex flex-wrap gap-2">
              <label v-for="st in skinTypes" :key="st.id" class="flex items-center gap-1.5 cursor-pointer font-body text-sm text-font-secondary">
                <input type="checkbox" :checked="editingItem.skinTypeIds.includes(st.id)" @change="toggleId(editingItem.skinTypeIds, st.id)" class="accent-accent-green" />
                {{ st.name }}
              </label>
            </div>
          </div>

          <!-- Featured -->
          <label class="flex items-center gap-2 cursor-pointer font-body text-sm text-font-primary">
            <input type="checkbox" v-model="editingItem.isFeatured" class="accent-accent-green w-4 h-4" />
            Produit vedette
          </label>

          <!-- Ingredients -->
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Ingrédients</label>
            <textarea v-model="editingItem.ingredients" rows="3" class="w-full px-3 py-2 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary resize-none" />
          </div>

          <!-- How to Use -->
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Mode d'emploi</label>
            <textarea v-model="editingItem.howToUse" rows="3" class="w-full px-3 py-2 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary resize-none" />
          </div>

          <!-- Shipping Info -->
          <div>
            <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Livraison</label>
            <textarea v-model="editingItem.shippingInfo" rows="3" class="w-full px-3 py-2 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary resize-none" />
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
