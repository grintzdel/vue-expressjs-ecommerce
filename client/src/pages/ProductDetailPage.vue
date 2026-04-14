<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useCart } from '@/composables/useCart'

const route = useRoute()
const { addToCart: addItemToCart } = useCart()
const api = useApi()

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
  rating: number
  stockQuantity: number
  images: ProductImage[]
  categoryId: string
  tagIds: string[]
  skinTypeIds: string[]
  ingredients: string
  howToUse: string
  shippingInfo: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
}

interface SkinType {
  id: string
  name: string
}

const product = ref<Product | null>(null)
const relatedProducts = ref<Product[]>([])
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const skinTypes = ref<SkinType[]>([])
const loading = ref(true)
const error = ref('')
const activeTab = ref<'ingredients' | 'howToUse' | 'reviews' | 'shipping'>('ingredients')
const selectedImageIndex = ref(0)
const quantity = ref(1)

const categoryName = computed(() => {
  if (!product.value) return ''
  return categories.value.find(c => c.id === product.value!.categoryId)?.name || ''
})

const productTags = computed(() => {
  if (!product.value) return []
  return tags.value.filter(t => product.value!.tagIds.includes(t.id))
})

const productSkinTypes = computed(() => {
  if (!product.value) return []
  return skinTypes.value.filter(s => product.value!.skinTypeIds.includes(s.id))
})

const skinTypeNames = computed(() => productSkinTypes.value.map(s => s.name).join(', '))

const selectedImage = computed(() => {
  if (!product.value || !product.value.images.length) return null
  return product.value.images[selectedImageIndex.value]
})

const ingredientsList = computed(() => {
  if (!product.value?.ingredients) return []
  return product.value.ingredients.split('\n').filter(Boolean).map(line => {
    const dashIdx = line.indexOf('—')
    if (dashIdx > -1) {
      return { name: line.substring(0, dashIdx).trim(), desc: line.substring(dashIdx + 1).trim() }
    }
    return { name: line.trim(), desc: '' }
  })
})

function formatPrice(p: Product): string {
  return `${p.currency === 'EUR' ? '€' : p.currency}${p.price.toFixed(2)}`
}

function renderStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty)
}

function getProductImage(p: Product): string | null {
  return p.images?.[0]?.url || null
}

function decrementQty() {
  if (quantity.value > 1) quantity.value--
}

function incrementQty() {
  quantity.value++
}

function generateSKU(slug: string): string {
  const parts = slug.split('-')
  const prefix = 'VLV'
  const code = parts.map(p => p.substring(0, 3).toUpperCase()).slice(0, 2).join('-')
  return `${prefix}-${code}-001`
}

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    const [prod, cats, tgs, sts, allProds] = await Promise.all([
      api.get<Product>(`/products/${slug}`),
      api.get<Category[]>('/categories'),
      api.get<Tag[]>('/tags'),
      api.get<SkinType[]>('/skin-types'),
      api.get<Product[]>('/products'),
    ])
    product.value = prod
    categories.value = cats
    tags.value = tgs
    skinTypes.value = sts

    // Related products: same category, excluding current
    relatedProducts.value = allProds
      .filter(p => p.categoryId === prod.categoryId && p.id !== prod.id)
      .slice(0, 4)

    // If not enough from same category, fill with other products
    if (relatedProducts.value.length < 4) {
      const remaining = allProds
        .filter(p => p.id !== prod.id && !relatedProducts.value.find(r => r.id === p.id))
        .slice(0, 4 - relatedProducts.value.length)
      relatedProducts.value.push(...remaining)
    }
  } catch (e: any) {
    error.value = e.message || 'Product not found'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="flex items-center justify-center py-4xl">
    <p class="font-body text-font-tertiary">Loading...</p>
  </div>

  <!-- Error -->
  <div v-else-if="error" class="flex flex-col items-center justify-center py-4xl gap-md">
    <p class="font-heading text-subsection text-font-primary">Product not found</p>
    <router-link to="/shop" class="text-accent-green font-body text-sm hover:underline">Back to shop</router-link>
  </div>

  <template v-else-if="product">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 px-lg lg:px-[80px] py-md bg-bg-primary">
      <router-link to="/" class="font-body text-[13px] text-font-tertiary hover:text-font-primary transition-colors">Home</router-link>
      <span class="font-body text-[13px] text-font-tertiary">/</span>
      <router-link to="/shop" class="font-body text-[13px] text-font-tertiary hover:text-font-primary transition-colors">Shop</router-link>
      <span class="font-body text-[13px] text-font-tertiary">/</span>
      <span class="font-body text-[13px] font-medium text-font-primary">{{ product.name }}</span>
    </div>

    <!-- Product Section -->
    <section class="px-lg lg:px-[80px] py-xl">
      <div class="flex flex-col lg:flex-row gap-3xl">

        <!-- Gallery -->
        <div class="flex flex-col-reverse lg:flex-row gap-md lg:w-[640px] flex-shrink-0">
          <!-- Thumbnails -->
          <div v-if="product.images.length > 1" class="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            <button
              v-for="(img, idx) in product.images"
              :key="idx"
              class="w-[80px] h-[80px] rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors"
              :class="idx === selectedImageIndex ? 'border-accent-green' : 'border-transparent'"
              @click="selectedImageIndex = idx"
            >
              <img :src="img.url" :alt="img.altText" class="w-full h-full object-cover" />
            </button>
          </div>

          <!-- Main Image -->
          <div class="flex-1 rounded-lg overflow-hidden bg-bg-primary aspect-square lg:aspect-auto lg:h-[540px]">
            <img
              v-if="selectedImage"
              :src="selectedImage.url"
              :alt="selectedImage.altText"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-6xl">🧴</span>
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col gap-lg flex-1">
          <!-- Category badge -->
          <span class="font-body text-xs font-semibold text-accent-green tracking-[2px] uppercase">
            {{ categoryName }}
          </span>

          <!-- Title -->
          <h1 class="font-heading text-[36px] leading-[1.2] text-font-primary">
            {{ product.name }}
          </h1>

          <!-- Rating -->
          <div class="flex items-center gap-3">
            <span class="text-accent-green text-body">{{ renderStars(product.rating) }}</span>
            <span class="font-body text-sm font-semibold text-font-primary">{{ product.rating.toFixed(1) }} / 5</span>
            <span class="font-body text-sm text-font-tertiary">(24 reviews)</span>
          </div>

          <!-- Price -->
          <span class="font-body text-[32px] font-bold text-font-primary">
            {{ formatPrice(product) }}
          </span>

          <!-- Divider -->
          <div class="h-px bg-border-light"></div>

          <!-- Description -->
          <p class="font-body text-[15px] leading-[1.7] text-font-secondary">
            {{ product.description }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in productTags"
              :key="tag.id"
              class="tag-filter cursor-default"
            >{{ tag.name }}</span>
            <span
              v-for="st in productSkinTypes"
              :key="st.id"
              class="tag-filter cursor-default"
            >{{ st.name }}</span>
          </div>

          <!-- Divider -->
          <div class="h-px bg-border-light"></div>

          <!-- Meta Grid -->
          <div class="flex flex-wrap gap-xl">
            <div class="flex flex-col gap-1">
              <span class="font-body text-xs font-semibold text-font-tertiary tracking-wide">Category</span>
              <span class="font-body text-sm text-font-primary">{{ categoryName }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-body text-xs font-semibold text-font-tertiary tracking-wide">Skin Type</span>
              <span class="font-body text-sm text-font-primary">{{ skinTypeNames }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-body text-xs font-semibold text-font-tertiary tracking-wide">Size</span>
              <span class="font-body text-sm text-font-primary">100ml</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-body text-xs font-semibold text-font-tertiary tracking-wide">SKU</span>
              <span class="font-body text-sm text-font-primary">{{ generateSKU(product.slug) }}</span>
            </div>
          </div>

          <!-- Add to Cart Row -->
          <div class="flex items-center gap-md">
            <!-- Quantity -->
            <div class="flex items-center border border-border-light rounded-md overflow-hidden">
              <button
                class="w-11 h-12 flex items-center justify-center font-body text-body-lg text-font-primary hover:bg-bg-primary transition-colors"
                @click="decrementQty"
              >-</button>
              <div class="w-11 h-12 flex items-center justify-center bg-white font-body text-body font-semibold text-font-primary">
                {{ quantity }}
              </div>
              <button
                class="w-11 h-12 flex items-center justify-center font-body text-body-lg text-font-primary hover:bg-bg-primary transition-colors"
                @click="incrementQty"
              >+</button>
            </div>

            <!-- Add to Cart Button -->
            <button
              class="flex-1 h-12 bg-bg-dark text-font-light font-body text-body font-semibold rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              @click="addItemToCart({
                productId: product.id,
                productName: product.name,
                productSlug: product.slug,
                productImage: selectedImage?.url || '',
                unitPrice: product.price,
                currency: product.currency,
              }, quantity)"
            >
              Add to Cart
              <span>→</span>
            </button>

            <!-- Wishlist -->
            <button class="w-12 h-12 border border-border-light rounded-md flex items-center justify-center text-font-secondary hover:border-border-dark transition-colors">
              ♡
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabs Section -->
    <section class="px-lg lg:px-[80px] pb-2xl">
      <!-- Tabs Bar -->
      <div class="flex border-b border-border-light overflow-x-auto">
        <button
          class="px-lg py-md font-body text-sm whitespace-nowrap transition-colors"
          :class="activeTab === 'ingredients'
            ? 'font-semibold text-font-green border-b-2 border-accent-green'
            : 'text-font-tertiary hover:text-font-primary'"
          @click="activeTab = 'ingredients'"
        >Ingredients</button>
        <button
          class="px-lg py-md font-body text-sm whitespace-nowrap transition-colors"
          :class="activeTab === 'howToUse'
            ? 'font-semibold text-font-green border-b-2 border-accent-green'
            : 'text-font-tertiary hover:text-font-primary'"
          @click="activeTab = 'howToUse'"
        >How to Use</button>
        <button
          class="px-lg py-md font-body text-sm whitespace-nowrap transition-colors"
          :class="activeTab === 'reviews'
            ? 'font-semibold text-font-green border-b-2 border-accent-green'
            : 'text-font-tertiary hover:text-font-primary'"
          @click="activeTab = 'reviews'"
        >Reviews (24)</button>
        <button
          class="px-lg py-md font-body text-sm whitespace-nowrap transition-colors"
          :class="activeTab === 'shipping'
            ? 'font-semibold text-font-green border-b-2 border-accent-green'
            : 'text-font-tertiary hover:text-font-primary'"
          @click="activeTab = 'shipping'"
        >Shipping</button>
      </div>

      <!-- Tab Content -->
      <div class="py-xl">
        <!-- Ingredients Tab -->
        <div v-if="activeTab === 'ingredients'" class="flex flex-col lg:flex-row gap-3xl">
          <div class="flex-1 flex flex-col gap-md">
            <h3 class="font-heading text-[24px] text-font-primary">Key Ingredients</h3>
            <p class="font-body text-sm leading-[1.7] text-font-secondary">
              Our {{ product.name }} is formulated with carefully selected organic ingredients to provide maximum hydration and skin protection.
            </p>
            <div class="flex flex-col gap-3">
              <div
                v-for="(ing, idx) in ingredientsList"
                :key="idx"
                class="flex gap-3 items-start"
              >
                <div class="w-2 h-2 rounded-full bg-accent-green mt-2 flex-shrink-0"></div>
                <div class="flex flex-col gap-0.5">
                  <span class="font-body text-sm font-semibold text-font-primary">{{ ing.name }}</span>
                  <span v-if="ing.desc" class="font-body text-[13px] text-font-tertiary">{{ ing.desc }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Certifications -->
          <div class="lg:w-[400px] flex flex-col gap-5">
            <h3 class="font-heading text-[24px] text-font-primary">Certifications</h3>
            <div class="flex items-center gap-md bg-white rounded-[12px] p-5">
              <div class="w-12 h-12 rounded-full bg-bg-light-sage flex items-center justify-center flex-shrink-0">
                <span class="text-accent-green text-lg">🍃</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="font-body text-sm font-semibold text-font-primary">100% Organic</span>
                <span class="font-body text-[13px] text-font-tertiary">Certified organic ingredients only</span>
              </div>
            </div>
            <div class="flex items-center gap-md bg-white rounded-[12px] p-5">
              <div class="w-12 h-12 rounded-full bg-bg-light-sage flex items-center justify-center flex-shrink-0">
                <span class="text-accent-green text-lg">🛡</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="font-body text-sm font-semibold text-font-primary">Dermatologically Tested</span>
                <span class="font-body text-[13px] text-font-tertiary">Safe for sensitive skin</span>
              </div>
            </div>
            <div class="flex items-center gap-md bg-white rounded-[12px] p-5">
              <div class="w-12 h-12 rounded-full bg-bg-light-sage flex items-center justify-center flex-shrink-0">
                <span class="text-accent-green text-lg">🐰</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="font-body text-sm font-semibold text-font-primary">Cruelty Free</span>
                <span class="font-body text-[13px] text-font-tertiary">Never tested on animals</span>
              </div>
            </div>
            <div class="flex items-center gap-md bg-white rounded-[12px] p-5">
              <div class="w-12 h-12 rounded-full bg-bg-light-sage flex items-center justify-center flex-shrink-0">
                <span class="text-accent-green text-lg">♻</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="font-body text-sm font-semibold text-font-primary">Eco-Friendly Packaging</span>
                <span class="font-body text-[13px] text-font-tertiary">100% recyclable materials</span>
              </div>
            </div>
          </div>
        </div>

        <!-- How to Use Tab -->
        <div v-else-if="activeTab === 'howToUse'" class="max-w-3xl">
          <h3 class="font-heading text-[24px] text-font-primary mb-md">How to Use</h3>
          <p class="font-body text-[15px] leading-[1.7] text-font-secondary whitespace-pre-line">
            {{ product.howToUse || 'Usage instructions coming soon.' }}
          </p>
        </div>

        <!-- Reviews Tab -->
        <div v-else-if="activeTab === 'reviews'" class="max-w-3xl">
          <h3 class="font-heading text-[24px] text-font-primary mb-md">Customer Reviews</h3>
          <div class="flex items-center gap-3 mb-lg">
            <span class="text-accent-green text-subsection">{{ renderStars(product.rating) }}</span>
            <span class="font-body text-body-lg font-semibold text-font-primary">{{ product.rating.toFixed(1) }} out of 5</span>
          </div>
          <p class="font-body text-sm text-font-tertiary">Reviews coming soon.</p>
        </div>

        <!-- Shipping Tab -->
        <div v-else-if="activeTab === 'shipping'" class="max-w-3xl">
          <h3 class="font-heading text-[24px] text-font-primary mb-md">Shipping & Returns</h3>
          <p class="font-body text-[15px] leading-[1.7] text-font-secondary whitespace-pre-line">
            {{ product.shippingInfo || 'Shipping information coming soon.' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Related Products Section -->
    <section v-if="relatedProducts.length" class="px-lg lg:px-[80px] pb-3xl pt-2xl">
      <div class="flex items-center justify-between mb-xl">
        <h2 class="font-heading text-subsection text-font-primary">You might also like</h2>
        <router-link to="/shop" class="flex items-center gap-2 font-body text-sm font-medium text-accent-green hover:underline">
          View all <span>→</span>
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <router-link
          v-for="rp in relatedProducts"
          :key="rp.id"
          :to="`/product/${rp.slug}`"
          class="bg-white rounded-[12px] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
        >
          <!-- Image -->
          <div class="h-[280px] bg-bg-primary overflow-hidden">
            <img
              v-if="getProductImage(rp)"
              :src="getProductImage(rp)!"
              :alt="rp.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-4xl">🧴</span>
            </div>
          </div>

          <!-- Body -->
          <div class="flex flex-col gap-3 p-md pb-5">
            <div class="flex items-center justify-between">
              <span class="font-body text-[13px] font-semibold text-font-primary tracking-wide uppercase truncate">
                {{ rp.name }}
              </span>
              <div class="flex items-center gap-1 flex-shrink-0">
                <span class="text-accent-green text-xs">{{ renderStars(rp.rating) }}</span>
              </div>
            </div>
            <p class="font-body text-[13px] leading-[1.5] text-font-secondary line-clamp-2">
              {{ rp.description }}
            </p>
            <div class="flex items-center justify-between mt-auto">
              <span class="font-body text-body-lg font-semibold text-font-primary">
                {{ formatPrice(rp) }}
              </span>
              <span class="bg-bg-dark text-font-light font-body text-xs font-medium px-md py-sm rounded-full">
                Add to cart
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </section>
  </template>
</template>
