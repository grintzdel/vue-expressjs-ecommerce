<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

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
  price: number
  currency: string
  images?: ProductImage[]
  categoryId?: string
  isFeatured?: boolean
}

interface Category {
  id: string
  name: string
  slug: string
}

interface SkinType {
  id: string
  name: string
  slug: string
}

interface Testimonial {
  id: string
  authorName: string
  content: string
  rating: number
  featuredProductIds?: string[]
  isFeatured?: boolean
}

interface PressLogo {
  id: string
  name: string
  logoUrl: string
  link: string
  position: number
}

const activeCategory = ref('all')
const activeSkinType = ref('')

const categories = ref<Category[]>([])
const skinTypes = ref<SkinType[]>([])
const featuredProducts = ref<Product[]>([])
const allProducts = ref<Product[]>([])
const testimonials = ref<Testimonial[]>([])
const pressLogos = ref<PressLogo[]>([])
const loading = ref(true)
const email = ref('')
const subscribeMessage = ref('')

const diagnosisSteps = [
  { number: '01', title: 'Tell us about your skin', description: 'Answer a few quick questions about your skin type, concerns, and lifestyle habits.' },
  { number: '02', title: 'Get your diagnosis', description: 'Our experts analyze your answers to identify your unique skin profile and needs.' },
  { number: '03', title: 'Discover your routine', description: 'Receive a personalized skincare routine with products tailored just for you.' },
]

function getProductImage(product: Product): string | null {
  if (product.images && product.images.length > 0) {
    return product.images[0].url
  }
  return null
}

function formatPrice(product: Product): string {
  return `${product.currency === 'EUR' ? '€' : product.currency}${product.price.toFixed(2)}`
}

function filteredRoutineProducts(): Product[] {
  let filtered = allProducts.value
  if (activeCategory.value !== 'all') {
    const cat = categories.value.find(c => c.slug === activeCategory.value)
    if (cat) filtered = filtered.filter(p => p.categoryId === cat.id)
  }
  if (activeSkinType.value) {
    // skinTypeIds filtering would require the field on product — show all for now
  }
  return filtered.slice(0, 8)
}

const featuredTestimonial = ref<Testimonial | null>(null)

async function handleSubscribe() {
  if (!email.value) return
  try {
    await api.post('/newsletter/subscribe', { email: email.value })
    subscribeMessage.value = 'Thanks! Check your email for your discount code.'
    email.value = ''
  } catch (e: any) {
    subscribeMessage.value = e.message || 'Something went wrong'
  }
}

onMounted(async () => {
  try {
    const [cats, sts, prods, featProds, testiData, logos] = await Promise.all([
      api.get<Category[]>('/categories'),
      api.get<SkinType[]>('/skin-types'),
      api.get<Product[]>('/products'),
      api.get<Product[]>('/products/featured'),
      api.get<Testimonial[]>('/testimonials/featured'),
      api.get<PressLogo[]>('/press-logos'),
    ])
    categories.value = cats
    skinTypes.value = sts
    allProducts.value = prods
    featuredProducts.value = featProds.length > 0 ? featProds : prods.slice(0, 4)
    testimonials.value = testiData
    featuredTestimonial.value = testiData.length > 0 ? testiData[0] : null
    pressLogos.value = logos
  } catch {
    // Fallback: use empty arrays
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- 1. Hero Section -->
    <section class="relative w-full h-[580px] md:h-[700px] overflow-hidden">
      <!-- Mobile: single image with gradient overlay -->
      <div class="absolute inset-0 md:hidden">
        <img
          src="https://images.unsplash.com/photo-1657103858297-0a1accd7b5b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
          alt="Botanical skincare"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-[#8B9E7B00] via-[#8B9E7BCC] to-[#8B9E7B]"></div>
      </div>
      <!-- Desktop: split halves with images -->
      <div class="absolute inset-0 hidden md:flex">
        <div class="w-1/2 h-full relative">
          <img
            src="https://images.unsplash.com/photo-1657103858297-0a1accd7b5b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
            alt="Nature skincare"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-bg-medium-green/40"></div>
        </div>
        <div class="w-1/2 h-full">
          <img
            src="https://images.unsplash.com/photo-1602879952653-a3830f12a7cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
            alt="Botanical plants"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-[20px] md:px-md">
        <h1 class="font-heading text-[36px] md:text-[56px] leading-[1.15] md:leading-[1.2] text-font-light max-w-[335px] md:max-w-[620px] mb-xl">
          Let nature take care of your body and soul
        </h1>
        <!-- Mobile CTA button -->
        <button class="md:hidden bg-bg-dark text-white rounded-full py-[14px] px-[32px] font-body text-sm font-medium hover:opacity-90 transition-opacity">
          Shop now &rarr;
        </button>
        <!-- Desktop CTA button -->
        <button class="hidden md:inline-flex bg-white text-font-primary rounded-full py-[14px] px-[32px] font-body text-sm font-medium hover:opacity-90 transition-opacity">
          Shop now &rarr;
        </button>
      </div>
    </section>

    <!-- 2. Inspired Section -->
    <section class="bg-bg-primary py-[40px] md:py-[80px] px-[20px] md:px-3xl">
      <div class="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-2xl md:gap-3xl">
        <div class="md:w-[480px] shrink-0">
          <h2 class="font-heading text-[28px] md:text-[48px] leading-[1.2] text-font-primary">
            Inspired by traditional knowledge and nature
          </h2>
        </div>
        <div class="flex flex-col gap-[24px] md:gap-[40px]">
          <!-- Feature 1 -->
          <div class="flex gap-md">
            <div class="hidden md:flex w-[48px] h-[48px] rounded-full bg-bg-light-sage items-center justify-center text-accent-green shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1 2.5-1 6c-2 3.5-4 5-4 5"/><path d="M11.7 12.3c2-2 4-3.5 5.3-4.3"/></svg>
            </div>
            <div>
              <h3 class="font-body text-[15px] md:text-body font-semibold text-font-primary mb-sm">100% Organic</h3>
              <p class="font-body text-[13px] md:text-sm text-font-secondary leading-[1.5] md:leading-[1.6]">
                We craft skincare using the most exquisite ingredients sourced directly from nature, ensuring every product is 100% organic and gentle on your skin.
              </p>
            </div>
          </div>
          <!-- Feature 2 -->
          <div class="flex gap-md">
            <div class="hidden md:flex w-[48px] h-[48px] rounded-full bg-bg-light-sage items-center justify-center text-accent-green shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
            </div>
            <div>
              <h3 class="font-body text-[15px] md:text-body font-semibold text-font-primary mb-sm">Leaf Extract</h3>
              <p class="font-body text-[13px] md:text-sm text-font-secondary leading-[1.5] md:leading-[1.6]">
                A rich concentration of natural leaf extract provides deep nourishment and revitalization for all skin types.
              </p>
            </div>
          </div>
          <!-- Feature 3 -->
          <div class="flex gap-md">
            <div class="hidden md:flex w-[48px] h-[48px] rounded-full bg-bg-light-sage items-center justify-center text-accent-green shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div>
              <h3 class="font-body text-[15px] md:text-body font-semibold text-font-primary mb-sm">Certified</h3>
              <p class="font-body text-[13px] md:text-sm text-font-secondary leading-[1.5] md:leading-[1.6]">
                We have the highest certification organic production ensuring safety and quality in every product we deliver.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Products Section -->
    <section class="bg-bg-primary py-[40px] md:py-[80px] px-[20px] md:px-3xl">
      <div class="max-w-[1200px] mx-auto md:text-center">
        <p class="font-body text-[13px] font-normal md:font-semibold tracking-[2px] uppercase text-font-tertiary md:text-accent-green mb-md">
          Our skincare for face
        </p>
        <h2 class="font-heading text-[24px] md:text-[36px] leading-[1.2] md:leading-[1.3] text-font-primary max-w-[600px] md:mx-auto mb-2xl text-left md:text-center">
          Facial and skincare, natural and certified organic
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-lg">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="bg-white rounded-lg overflow-hidden pb-[20px]"
          >
            <img
              v-if="getProductImage(product)"
              :src="getProductImage(product)!"
              :alt="product.name"
              class="h-[280px] w-full object-cover"
            />
            <div v-else class="h-[280px] bg-bg-light-sage"></div>
            <div class="px-md pt-md flex flex-col gap-sm">
              <span class="font-body text-sm font-semibold tracking-[1px] text-font-primary">{{ product.name }}</span>
              <span class="font-body text-sm text-font-secondary">{{ formatPrice(product) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Brand Statement Section -->
    <section class="bg-bg-primary md:bg-white py-[40px] md:py-[80px] px-[20px] md:px-3xl">
      <div class="max-w-[1200px] mx-auto">
        <div class="flex flex-col md:flex-row gap-2xl md:gap-3xl mb-2xl">
          <div class="md:w-[480px] shrink-0">
            <h2 class="font-heading text-[28px] md:text-[42px] leading-[1.2] text-font-primary">
              Velvety facial and skincare company
            </h2>
          </div>
          <div>
            <p class="font-body text-[14px] md:text-[15px] text-font-secondary leading-[1.6] md:leading-[1.7]">
              At Velvety, we believe that true beauty comes from nature. Our products are carefully formulated with the finest organic ingredients, blending traditional botanical knowledge with modern skincare science. Every product we create is designed to nurture your skin while respecting the environment.
            </p>
          </div>
        </div>
        <div v-if="pressLogos.length > 0" class="border-t border-border-light pt-2xl">
          <div class="flex flex-wrap items-center justify-between gap-lg">
            <span
              v-for="logo in pressLogos"
              :key="logo.id"
              class="font-heading text-[14px] md:text-[22px] text-font-tertiary font-semibold tracking-[2px]"
            >
              {{ logo.name }}
            </span>
          </div>
        </div>
        <div v-else class="border-t border-border-light pt-2xl">
          <div class="flex flex-wrap items-center justify-between gap-lg">
            <span class="font-heading text-[14px] md:text-[24px] italic md:not-italic md:font-bold tracking-[3px] text-font-tertiary">VOGUE</span>
            <span class="font-heading text-[14px] md:text-[24px] font-bold md:font-normal md:italic text-font-tertiary">Forbes</span>
            <span class="hidden md:inline font-body text-body font-semibold tracking-[2px] text-font-tertiary">THOUGHT CATALOG</span>
            <span class="hidden md:inline font-heading text-[22px] italic text-font-tertiary">Women's Health</span>
            <span class="font-body text-[14px] md:text-[24px] font-bold tracking-[4px] text-font-tertiary">WWD</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Skincare Routine Section -->
    <section class="bg-white md:bg-bg-primary py-[40px] md:py-[80px] px-[20px] md:px-3xl">
      <div class="max-w-[1200px] mx-auto">
        <h2 class="font-heading text-[28px] md:text-[36px] text-font-primary mb-2xl">
          Mild skincare &amp; facial routine
        </h2>
        <div class="flex flex-col md:flex-row gap-2xl">
          <!-- Mobile Filters: single row of tags -->
          <div class="md:hidden">
            <div class="flex flex-wrap gap-sm">
              <button
                :class="activeCategory === 'all' ? 'tag-active' : 'tag-filter'"
                @click="activeCategory = 'all'"
              >All</button>
              <button
                v-for="cat in categories"
                :key="'m-cat-' + cat.id"
                :class="activeCategory === cat.slug ? 'tag-active' : 'tag-filter'"
                @click="activeCategory = cat.slug"
              >{{ cat.name }}</button>
              <button
                v-for="st in skinTypes"
                :key="'m-st-' + st.id"
                :class="activeSkinType === st.slug ? 'tag-active' : 'tag-filter'"
                @click="activeSkinType = activeSkinType === st.slug ? '' : st.slug"
              >{{ st.name }}</button>
            </div>
          </div>
          <!-- Desktop Filters -->
          <div class="hidden md:block md:w-[280px] shrink-0">
            <p class="font-body text-xs font-semibold tracking-[2px] text-font-tertiary mb-md">CATEGORIES</p>
            <div class="flex flex-wrap gap-sm mb-xl">
              <button
                :class="activeCategory === 'all' ? 'tag-active' : 'tag-filter'"
                @click="activeCategory = 'all'"
              >All</button>
              <button
                v-for="cat in categories"
                :key="'d-cat-' + cat.id"
                :class="activeCategory === cat.slug ? 'tag-active' : 'tag-filter'"
                @click="activeCategory = cat.slug"
              >{{ cat.name }}</button>
            </div>
            <p class="font-body text-xs font-semibold tracking-[2px] text-font-tertiary mb-md">SKIN TYPES</p>
            <div class="flex flex-wrap gap-sm">
              <button
                v-for="st in skinTypes"
                :key="'d-st-' + st.id"
                :class="activeSkinType === st.slug ? 'tag-active' : 'tag-filter'"
                @click="activeSkinType = activeSkinType === st.slug ? '' : st.slug"
              >{{ st.name }}</button>
            </div>
          </div>
          <!-- Product Grid -->
          <div class="flex-1 grid grid-cols-2 gap-[12px] md:gap-lg">
            <div
              v-for="(product, index) in filteredRoutineProducts()"
              :key="product.id"
              :class="['bg-white rounded-md overflow-hidden pb-md', { 'hidden md:block': index >= 2 }]"
            >
              <img
                v-if="getProductImage(product)"
                :src="getProductImage(product)!"
                :alt="product.name"
                class="h-[200px] w-full object-cover"
              />
              <div v-else class="h-[200px] bg-bg-light-sage"></div>
              <div class="px-[12px] pt-[12px] flex flex-col gap-xs">
                <span class="font-body text-[13px] font-semibold text-font-primary">{{ product.name }}</span>
                <span class="font-body text-[13px] text-font-secondary">{{ formatPrice(product) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Skin Diagnosis Section -->
    <section class="bg-bg-primary md:bg-white py-[40px] md:py-[80px] px-[20px] md:px-3xl">
      <div class="max-w-[1200px] mx-auto md:text-center">
        <h2 class="font-heading text-[28px] md:text-[36px] text-font-primary mb-2xl">
          Your skin diagnosis in 3 minutes
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-[16px] md:gap-xl">
          <div
            v-for="step in diagnosisSteps"
            :key="step.number"
            class="bg-white md:bg-bg-primary rounded-[12px] md:rounded-lg p-[16px] md:p-xl flex flex-row md:flex-col gap-[16px] md:gap-md text-left"
          >
            <span class="font-heading text-[28px] md:text-[48px] text-accent-green md:text-accent-green-light shrink-0">{{ step.number }}</span>
            <div class="flex flex-col gap-[8px] md:gap-md">
              <h3 class="font-heading text-[22px] leading-[1.3] text-font-primary">{{ step.title }}</h3>
              <p class="font-body text-sm text-font-secondary leading-[1.6]">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Testimonial Section -->
    <section class="bg-bg-dark py-[40px] md:py-[80px] px-[20px] md:px-3xl">
      <div class="max-w-[1200px] mx-auto text-left md:text-center">
        <p class="font-heading text-[20px] md:text-[28px] italic md:not-italic text-font-light leading-[1.4] md:leading-[1.5] max-w-[900px] md:mx-auto mb-xl">
          "{{ featuredTestimonial?.content || "I've struggled with sensitive skin for years. Velvety's organic line has completely transformed my routine. My skin feels nourished, calm, and more radiant than ever." }}"
        </p>
        <p class="hidden md:block font-body text-sm text-accent-green-light tracking-[1px] mb-2xl">
          — {{ featuredTestimonial?.authorName || 'Sarah M.' }}, Verified Customer
        </p>
        <div class="flex md:justify-center gap-[12px] md:gap-lg">
          <div
            v-for="product in featuredProducts.slice(0, 3)"
            :key="'testi-' + product.id"
            class="flex flex-col items-center gap-sm"
          >
            <img
              v-if="getProductImage(product)"
              :src="getProductImage(product)!"
              :alt="product.name"
              class="w-[80px] h-[80px] rounded-md object-cover"
            />
            <div v-else class="w-[80px] h-[80px] rounded-md bg-bg-medium-green"></div>
            <span class="font-body text-[10px] md:text-xs text-border-light md:text-font-light">{{ product.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Subscribe Section -->
    <section class="bg-bg-light-sage py-[40px] md:py-[80px] px-[20px] md:px-3xl">
      <div class="max-w-[1200px] mx-auto md:text-center">
        <h2 class="font-heading text-[22px] md:text-[28px] leading-[1.3] text-font-primary mb-xl">
          Subscribe to get 10% off your first order
        </h2>
        <p v-if="subscribeMessage" class="font-body text-sm text-accent-green mb-md">{{ subscribeMessage }}</p>
        <!-- Mobile form: stacked -->
        <form class="flex flex-col md:hidden" @submit.prevent="handleSubscribe">
          <input
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            class="bg-white py-0 px-[12px] h-[44px] w-full font-body text-sm text-font-primary outline-none"
          />
          <button
            type="submit"
            class="bg-bg-dark text-white h-[44px] w-full font-body text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            Subscribe
          </button>
        </form>
        <!-- Desktop form: inline -->
        <form class="hidden md:flex justify-center" @submit.prevent="handleSubscribe">
          <input
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            class="bg-white rounded-l-full py-[14px] px-[20px] w-[320px] font-body text-sm text-font-primary outline-none"
          />
          <button
            type="submit"
            class="bg-bg-dark text-font-light rounded-r-full py-[14px] px-lg font-body text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
