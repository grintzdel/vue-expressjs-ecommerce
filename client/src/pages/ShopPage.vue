<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useCart } from '@/composables/useCart'

const api = useApi()
const { addToCart } = useCart()

interface ProductImage {
  url: string
  altText: string
  position: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  currency: string
  rating?: number
  reviewCount?: number
  images?: ProductImage[]
  categoryId?: string
  tagIds?: string[]
  skinTypeIds?: string[]
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface SkinType {
  id: string
  name: string
  slug: string
}

const allProducts = ref<Product[]>([])
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const skinTypes = ref<SkinType[]>([])
const loading = ref(true)

// Filters
const selectedCategory = ref<string | null>(null)
const selectedSkinType = ref<string | null>(null)
const selectedTag = ref<string | null>(null)
const sortBy = ref('popular')
const priceMinBound = ref(0)
const priceMaxBound = ref(200)
const priceMin = ref(0)
const priceMax = ref(200)

const priceLeftPercent = computed(() => {
  const range = priceMaxBound.value - priceMinBound.value
  if (range === 0) return 0
  return ((priceMin.value - priceMinBound.value) / range) * 100
})

const priceRightPercent = computed(() => {
  const range = priceMaxBound.value - priceMinBound.value
  if (range === 0) return 100
  return ((priceMax.value - priceMinBound.value) / range) * 100
})

function onPriceMinInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  priceMin.value = Math.min(val, priceMax.value - 1)
  currentPage.value = 1
}

function onPriceMaxInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  priceMax.value = Math.max(val, priceMin.value + 1)
  currentPage.value = 1
}

// Pagination
const currentPage = ref(1)
const perPage = 8

const filteredProducts = computed(() => {
  let result = allProducts.value

  if (selectedCategory.value) {
    result = result.filter(p => p.categoryId === selectedCategory.value)
  }
  if (selectedSkinType.value) {
    result = result.filter(p => p.skinTypeIds?.includes(selectedSkinType.value!))
  }
  if (selectedTag.value) {
    result = result.filter(p => p.tagIds?.includes(selectedTag.value!))
  }
  result = result.filter(p => p.price >= priceMin.value && p.price <= priceMax.value)

  if (sortBy.value === 'price-asc') {
    result = [...result].sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    result = [...result].sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'name') {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name))
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value && i <= 5; i++) {
    pages.push(i)
  }
  return pages
})

function getProductImage(product: Product): string | null {
  if (product.images && product.images.length > 0) {
    return product.images[0].url
  }
  return null
}

function formatPrice(product: Product): string {
  return `${product.currency === 'EUR' ? '€' : product.currency}${product.price.toFixed(2)}`
}

function renderStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty)
}

function toggleCategory(id: string | null) {
  selectedCategory.value = selectedCategory.value === id ? null : id
  currentPage.value = 1
}

function toggleSkinType(id: string | null) {
  selectedSkinType.value = selectedSkinType.value === id ? null : id
  currentPage.value = 1
}

function toggleTag(id: string | null) {
  selectedTag.value = selectedTag.value === id ? null : id
  currentPage.value = 1
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Mobile filter
const showMobileFilters = ref(false)

onMounted(async () => {
  try {
    const [prods, cats, tgs, sts] = await Promise.all([
      api.get<Product[]>('/products'),
      api.get<Category[]>('/categories'),
      api.get<Tag[]>('/tags'),
      api.get<SkinType[]>('/skin-types'),
    ])
    allProducts.value = prods
    categories.value = cats
    tags.value = tgs
    skinTypes.value = sts

    const prices = prods.map(p => p.price)
    if (prices.length) {
      priceMinBound.value = Math.floor(Math.min(...prices))
      priceMaxBound.value = Math.ceil(Math.max(...prices))
      priceMin.value = priceMinBound.value
      priceMax.value = priceMaxBound.value
    }
  } catch (e) {
    console.error('Failed to load shop data', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Header -->
  <section class="bg-bg-primary px-2xl py-2xl lg:px-[80px] lg:pt-[48px] lg:pb-[32px]">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 mb-md">
      <router-link to="/" class="font-body text-[13px] text-font-tertiary hover:text-font-primary transition-colors">Home</router-link>
      <span class="font-body text-[13px] text-font-tertiary">/</span>
      <span class="font-body text-[13px] font-medium text-font-primary">Shop</span>
    </div>

    <!-- Title -->
    <h1 class="font-heading text-[44px] leading-[1.15] text-font-primary mb-md">
      Mild skincare & facial routine
    </h1>

    <!-- Meta: count + sort -->
    <div class="flex items-center justify-between">
      <p class="font-body text-sm text-font-tertiary">
        Showing {{ paginatedProducts.length }} of {{ filteredProducts.length }} products
      </p>

      <div class="hidden md:flex items-center gap-2 border border-border-light rounded-md px-md py-[10px] bg-white">
        <span class="font-body text-[13px] text-font-tertiary">Sort by:</span>
        <select
          v-model="sortBy"
          class="font-body text-[13px] font-medium text-font-primary bg-transparent border-none outline-none cursor-pointer"
        >
          <option value="popular">Most Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>

      <!-- Mobile filter toggle -->
      <button
        class="md:hidden flex items-center gap-2 border border-border-light rounded-md px-md py-[10px] bg-white font-body text-[13px] font-medium text-font-primary"
        @click="showMobileFilters = !showMobileFilters"
      >
        Filters
        <span class="text-font-tertiary">{{ showMobileFilters ? '✕' : '☰' }}</span>
      </button>
    </div>
  </section>

  <!-- Main Content -->
  <section class="px-lg lg:px-[80px] pb-3xl pt-0">
    <div class="flex gap-[40px]">

      <!-- Sidebar Filters (Desktop) -->
      <aside class="hidden md:flex flex-col gap-xl w-[280px] flex-shrink-0">
        <!-- Categories -->
        <div class="flex flex-col gap-3">
          <p class="font-body text-xs font-semibold text-font-tertiary tracking-[2px] uppercase">Categories</p>
          <div class="flex flex-wrap gap-2">
            <button
              :class="selectedCategory === null ? 'tag-active' : 'tag-filter'"
              @click="toggleCategory(null)"
            >All</button>
            <button
              v-for="cat in categories"
              :key="cat.id"
              :class="selectedCategory === cat.id ? 'tag-active' : 'tag-filter'"
              @click="toggleCategory(cat.id)"
            >{{ cat.name }}</button>
          </div>
        </div>

        <!-- Skin Types -->
        <div class="flex flex-col gap-3">
          <p class="font-body text-xs font-semibold text-font-tertiary tracking-[2px] uppercase">Skin Types</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="st in skinTypes"
              :key="st.id"
              :class="selectedSkinType === st.id ? 'tag-active' : 'tag-filter'"
              @click="toggleSkinType(st.id)"
            >{{ st.name }}</button>
          </div>
        </div>

        <!-- Needs (Tags) -->
        <div class="flex flex-col gap-3">
          <p class="font-body text-xs font-semibold text-font-tertiary tracking-[2px] uppercase">Needs</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in tags"
              :key="tag.id"
              :class="selectedTag === tag.id ? 'tag-active' : 'tag-filter'"
              @click="toggleTag(tag.id)"
            >{{ tag.name }}</button>
          </div>
        </div>

        <!-- Price Range -->
        <div class="flex flex-col gap-3">
          <p class="font-body text-xs font-semibold text-font-tertiary tracking-[2px] uppercase">Price Range</p>
          <div class="relative h-[20px]">
            <!-- Track background -->
            <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-border-light rounded-full"></div>
            <!-- Active track -->
            <div
              class="absolute top-1/2 -translate-y-1/2 h-1 bg-accent-green rounded-full"
              :style="{ left: priceLeftPercent + '%', right: (100 - priceRightPercent) + '%' }"
            ></div>
            <!-- Min slider -->
            <input
              type="range"
              :min="priceMinBound"
              :max="priceMaxBound"
              :value="priceMin"
              @input="onPriceMinInput"
              class="price-range-input absolute inset-0 w-full pointer-events-none appearance-none bg-transparent"
            />
            <!-- Max slider -->
            <input
              type="range"
              :min="priceMinBound"
              :max="priceMaxBound"
              :value="priceMax"
              @input="onPriceMaxInput"
              class="price-range-input absolute inset-0 w-full pointer-events-none appearance-none bg-transparent"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="font-body text-[13px] text-font-secondary">€{{ priceMin }}</span>
            <span class="font-body text-[13px] text-font-secondary">€{{ priceMax }}</span>
          </div>
        </div>
      </aside>

      <!-- Mobile Filters (slide down) -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[800px]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-[800px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="showMobileFilters" class="md:hidden overflow-hidden w-full mb-lg">
          <div class="flex flex-col gap-lg pb-lg border-b border-border-light">
            <!-- Sort (mobile) -->
            <div class="flex flex-col gap-2">
              <p class="font-body text-xs font-semibold text-font-tertiary tracking-[2px] uppercase">Sort</p>
              <select
                v-model="sortBy"
                class="font-body text-sm text-font-primary bg-white border border-border-light rounded-md px-md py-[10px] outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>

            <!-- Categories (mobile) -->
            <div class="flex flex-col gap-2">
              <p class="font-body text-xs font-semibold text-font-tertiary tracking-[2px] uppercase">Categories</p>
              <div class="flex flex-wrap gap-2">
                <button
                  :class="selectedCategory === null ? 'tag-active' : 'tag-filter'"
                  @click="toggleCategory(null)"
                >All</button>
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  :class="selectedCategory === cat.id ? 'tag-active' : 'tag-filter'"
                  @click="toggleCategory(cat.id)"
                >{{ cat.name }}</button>
              </div>
            </div>

            <!-- Skin Types (mobile) -->
            <div class="flex flex-col gap-2">
              <p class="font-body text-xs font-semibold text-font-tertiary tracking-[2px] uppercase">Skin Types</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="st in skinTypes"
                  :key="st.id"
                  :class="selectedSkinType === st.id ? 'tag-active' : 'tag-filter'"
                  @click="toggleSkinType(st.id)"
                >{{ st.name }}</button>
              </div>
            </div>

            <!-- Needs (mobile) -->
            <div class="flex flex-col gap-2">
              <p class="font-body text-xs font-semibold text-font-tertiary tracking-[2px] uppercase">Needs</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in tags"
                  :key="tag.id"
                  :class="selectedTag === tag.id ? 'tag-active' : 'tag-filter'"
                  @click="toggleTag(tag.id)"
                >{{ tag.name }}</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Product Grid -->
      <div class="flex-1 flex flex-col gap-lg">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-4xl">
          <p class="font-body text-font-tertiary">Loading products...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-4xl gap-md">
          <p class="font-heading text-subsection text-font-primary">No products found</p>
          <p class="font-body text-sm text-font-tertiary">Try adjusting your filters</p>
        </div>

        <!-- Grid -->
        <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <router-link
              v-for="product in paginatedProducts"
              :key="product.id"
              :to="`/product/${product.slug}`"
              class="bg-white rounded-[12px] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <!-- Image -->
              <div class="relative h-[280px] bg-bg-primary overflow-hidden">
                <img
                  v-if="getProductImage(product)"
                  :src="getProductImage(product)!"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-4xl">🧴</span>
                </div>
              </div>

              <!-- Body -->
              <div class="flex flex-col gap-3 p-md pb-5">
                <!-- Top: Name + Rating -->
                <div class="flex items-center justify-between">
                  <span class="font-body text-[13px] font-semibold text-font-primary tracking-wide uppercase truncate">
                    {{ product.name }}
                  </span>
                  <div class="flex items-center gap-1 flex-shrink-0">
                    <span class="text-accent-green text-xs">{{ renderStars(product.rating || 4) }}</span>
                    <span class="font-body text-[11px] text-font-tertiary">({{ product.reviewCount || 0 }})</span>
                  </div>
                </div>

                <!-- Description -->
                <p class="font-body text-[13px] leading-[1.5] text-font-secondary line-clamp-2">
                  {{ product.description }}
                </p>

                <!-- Bottom: Price + Add to cart -->
                <div class="flex items-center justify-between mt-auto">
                  <span class="font-body text-body-lg font-semibold text-font-primary">
                    {{ formatPrice(product) }}
                  </span>
                  <span
                    class="bg-bg-dark text-font-light font-body text-xs font-medium px-md py-sm rounded-full hover:opacity-90 transition-opacity"
                    @click.prevent="addToCart({
                      productId: product.id,
                      productName: product.name,
                      productSlug: product.slug,
                      productImage: getProductImage(product) || '',
                      unitPrice: product.price,
                      currency: product.currency,
                    })"
                  >
                    Add to cart
                  </span>
                </div>
              </div>
            </router-link>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-md">
            <button
              class="w-10 h-10 rounded-md border border-border-light bg-white flex items-center justify-center font-body text-sm text-font-tertiary hover:border-border-dark transition-colors disabled:opacity-40"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >←</button>

            <button
              v-for="page in visiblePages"
              :key="page"
              class="w-10 h-10 rounded-md flex items-center justify-center font-body text-sm font-semibold transition-colors"
              :class="page === currentPage
                ? 'bg-bg-dark text-font-light'
                : 'bg-white border border-border-light text-font-primary hover:border-border-dark'"
              @click="goToPage(page)"
            >{{ page }}</button>

            <button
              class="w-10 h-10 rounded-md border border-border-light bg-white flex items-center justify-center font-body text-sm text-font-primary hover:border-border-dark transition-colors disabled:opacity-40"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >→</button>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.price-range-input {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  margin: 0;
  height: 100%;
}

.price-range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 2px solid #5C7045;
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}

.price-range-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 2px solid #5C7045;
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}
</style>
