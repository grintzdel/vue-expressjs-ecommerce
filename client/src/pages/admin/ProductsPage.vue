<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
const editingItem = ref<EditingProduct>({
  name: '', slug: '', description: '', price: 0, currency: 'EUR',
  images: [], categoryId: '', tagIds: [], skinTypeIds: [], stockQuantity: 0, isFeatured: false,
  ingredients: '', howToUse: '', shippingInfo: '',
})
const newImageUrl = ref('')
const newImageAlt = ref('')

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
  if (!confirm(`Delete product "${item.name}"?`)) return
  await api.del(`/products/${item.id}`)
  await fetchAll()
}

onMounted(fetchAll)
</script>

<template>
  <div class="p-2xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-xl">
      <h1 class="font-heading text-subsection text-font-primary">Products</h1>
      <div class="flex items-center gap-md">
        <a href="/shop" target="_blank" class="btn-outline !py-sm !px-lg">View Shop</a>
        <button class="btn-primary" @click="openAdd">+ Add Product</button>
      </div>
    </div>

    <!-- Loading -->
    <p v-if="loading" class="font-body text-sm text-font-secondary">Loading...</p>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-border-light overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-primary">
          <tr>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Image</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Name</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Price</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Category</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Stock</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Featured</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="products.length === 0">
            <td colspan="7" class="px-lg py-2xl text-center font-body text-sm text-font-tertiary">
              No items found
            </td>
          </tr>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b border-border-light last:border-0"
          >
            <td class="px-lg py-md">
              <img
                v-if="product.images && product.images.length > 0"
                :src="product.images[0].url"
                :alt="product.images[0].altText"
                class="w-12 h-12 object-cover rounded-md"
              />
              <div v-else class="w-12 h-12 bg-bg-light-sage rounded-md flex items-center justify-center text-font-tertiary text-xs">
                No img
              </div>
            </td>
            <td class="px-lg py-md text-sm text-font-primary font-semibold">{{ product.name }}</td>
            <td class="px-lg py-md text-sm text-font-secondary">
              {{ product.price }} {{ product.currency }}
            </td>
            <td class="px-lg py-md text-sm text-font-secondary">
              {{ product.category?.name ?? getCategoryName(product.categoryId) }}
            </td>
            <td class="px-lg py-md text-sm text-font-secondary">{{ product.stockQuantity }}</td>
            <td class="px-lg py-md">
              <span
                v-if="product.isFeatured"
                class="inline-block px-sm py-xs text-xs font-semibold bg-bg-light-sage text-accent-green rounded-sm"
              >Featured</span>
              <span v-else class="text-sm text-font-tertiary">—</span>
            </td>
            <td class="px-lg py-md">
              <div class="flex items-center gap-sm">
                <a
                  :href="`/product/${product.slug}`"
                  target="_blank"
                  class="text-xs font-body text-accent-green hover:text-accent-green-light underline"
                >View</a>
                <button
                  class="text-xs font-body text-font-secondary hover:text-font-primary underline"
                  @click="openEdit(product)"
                >Edit</button>
                <button
                  class="text-xs font-body text-red-500 hover:text-red-700 underline"
                  @click="handleDelete(product)"
                >Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-md">
      <div class="absolute inset-0 bg-black/40" @click="showModal = false"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-2xl">
        <h2 class="font-heading text-subsection text-font-primary mb-xl">
          {{ editingItem.id ? 'Edit' : 'Add' }} Product
        </h2>

        <div class="space-y-lg">
          <!-- Name -->
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Name
            </label>
            <input
              type="text"
              :value="editingItem.name"
              @input="onNameInput(($event.target as HTMLInputElement).value)"
              class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark"
              placeholder="Product name"
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Slug
            </label>
            <input
              type="text"
              v-model="editingItem.slug"
              class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark"
              placeholder="product-slug"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Description
            </label>
            <textarea
              v-model="editingItem.description"
              rows="3"
              class="w-full px-md py-sm bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark resize-none"
              placeholder="Product description"
            />
          </div>

          <!-- Images -->
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Images
            </label>

            <!-- Existing images -->
            <div v-if="editingItem.images.length > 0" class="flex flex-wrap gap-md mb-md">
              <div
                v-for="(img, index) in editingItem.images"
                :key="index"
                class="relative group w-[100px]"
              >
                <img
                  :src="img.url"
                  :alt="img.altText"
                  class="w-[100px] h-[100px] object-cover rounded-md border border-border-light"
                />
                <div class="absolute inset-0 bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-xs">
                  <button
                    v-if="index > 0"
                    @click="moveImage(index, -1)"
                    class="w-6 h-6 bg-white rounded-full text-xs flex items-center justify-center"
                    title="Move left"
                  >←</button>
                  <button
                    @click="removeImage(index)"
                    class="w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                    title="Remove"
                  >✕</button>
                  <button
                    v-if="index < editingItem.images.length - 1"
                    @click="moveImage(index, 1)"
                    class="w-6 h-6 bg-white rounded-full text-xs flex items-center justify-center"
                    title="Move right"
                  >→</button>
                </div>
                <span class="absolute top-1 left-1 bg-bg-dark text-font-light text-[10px] px-1 rounded">
                  {{ index + 1 }}
                </span>
              </div>
            </div>

            <!-- Add image form -->
            <div class="flex flex-col gap-sm">
              <div class="flex gap-sm">
                <input
                  v-model="newImageUrl"
                  type="url"
                  placeholder="Image URL (https://...)"
                  class="flex-1 h-[40px] px-md bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark"
                  @keydown.enter.prevent="addImage"
                />
                <button
                  type="button"
                  class="h-[40px] px-md bg-bg-primary text-font-green font-body text-sm rounded-md border border-border-light hover:bg-bg-light-sage transition-colors"
                  @click="addImage"
                >
                  + Add
                </button>
              </div>
              <input
                v-model="newImageAlt"
                type="text"
                placeholder="Alt text (optional)"
                class="w-full h-[36px] px-md bg-white border border-border-light rounded-md font-body text-xs text-font-secondary focus:outline-none focus:border-border-dark"
              />
            </div>

            <p v-if="editingItem.images.length === 0" class="font-body text-xs text-font-tertiary mt-sm">
              No images added yet. Paste an image URL above.
            </p>
          </div>

          <!-- Price & Currency -->
          <div class="grid grid-cols-2 gap-md">
            <div>
              <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
                Price
              </label>
              <input
                type="number"
                v-model="editingItem.price"
                min="0"
                step="0.01"
                class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark"
                placeholder="0.00"
              />
            </div>
            <div>
              <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
                Currency
              </label>
              <input
                type="text"
                v-model="editingItem.currency"
                class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark"
                placeholder="EUR"
              />
            </div>
          </div>

          <!-- Category -->
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Category
            </label>
            <select
              v-model="editingItem.categoryId"
              class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark"
            >
              <option value="">— None —</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Stock -->
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Stock Quantity
            </label>
            <input
              type="number"
              v-model="editingItem.stockQuantity"
              min="0"
              class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark"
              placeholder="0"
            />
          </div>

          <!-- Tags -->
          <div v-if="tags.length > 0">
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Tags
            </label>
            <div class="flex flex-wrap gap-sm">
              <label
                v-for="tag in tags"
                :key="tag.id"
                class="flex items-center gap-xs cursor-pointer font-body text-sm text-font-secondary"
              >
                <input
                  type="checkbox"
                  :value="tag.id"
                  :checked="editingItem.tagIds.includes(tag.id)"
                  @change="toggleId(editingItem.tagIds, tag.id)"
                  class="accent-accent-green"
                />
                {{ tag.name }}
              </label>
            </div>
          </div>

          <!-- Skin Types -->
          <div v-if="skinTypes.length > 0">
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Skin Types
            </label>
            <div class="flex flex-wrap gap-sm">
              <label
                v-for="st in skinTypes"
                :key="st.id"
                class="flex items-center gap-xs cursor-pointer font-body text-sm text-font-secondary"
              >
                <input
                  type="checkbox"
                  :value="st.id"
                  :checked="editingItem.skinTypeIds.includes(st.id)"
                  @change="toggleId(editingItem.skinTypeIds, st.id)"
                  class="accent-accent-green"
                />
                {{ st.name }}
              </label>
            </div>
          </div>

          <!-- Featured -->
          <div>
            <label class="flex items-center gap-sm cursor-pointer font-body text-sm text-font-primary">
              <input
                type="checkbox"
                v-model="editingItem.isFeatured"
                class="accent-accent-green w-4 h-4"
              />
              Featured product
            </label>
          </div>

          <!-- Ingredients -->
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Ingredients
            </label>
            <textarea
              v-model="editingItem.ingredients"
              rows="4"
              class="w-full px-md py-sm bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark resize-none"
              placeholder="One ingredient per line (e.g. Aloe Vera — Hydrates and soothes skin)"
            />
            <p class="font-body text-xs text-font-tertiary mt-xs">One per line. Use — to separate name and description.</p>
          </div>

          <!-- How to Use -->
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              How to Use
            </label>
            <textarea
              v-model="editingItem.howToUse"
              rows="3"
              class="w-full px-md py-sm bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark resize-none"
              placeholder="Usage instructions for the product"
            />
          </div>

          <!-- Shipping Info -->
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Shipping Info
            </label>
            <textarea
              v-model="editingItem.shippingInfo"
              rows="3"
              class="w-full px-md py-sm bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark resize-none"
              placeholder="Shipping and returns policy"
            />
          </div>
        </div>

        <div class="flex justify-end gap-md mt-2xl">
          <button class="btn-outline !py-sm !px-lg" @click="showModal = false">Cancel</button>
          <button class="btn-primary !py-sm !px-lg" @click="handleSave">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
