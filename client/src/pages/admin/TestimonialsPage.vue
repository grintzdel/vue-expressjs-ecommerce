<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface Testimonial {
  _id: string
  authorName: string
  content: string
  rating: number
  isFeatured: boolean
}

const api = useApi()

const testimonials = ref<Testimonial[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  authorName: '',
  content: '',
  rating: 5,
  isFeatured: false,
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
  editingId.value = t._id
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
  if (confirm('Are you sure?')) {
    await api.del(`/testimonials/${id}`)
    await fetchTestimonials()
  }
}

function stars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

onMounted(fetchTestimonials)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-lg">
      <h1 class="font-heading text-subsection">Testimonials</h1>
      <button class="btn-primary" @click="openAdd">Add Testimonial</button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border-light overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-primary">
          <tr>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Author</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Rating</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Featured</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in testimonials" :key="t._id" class="border-b border-border-light text-sm">
            <td class="px-lg py-md">{{ t.authorName }}</td>
            <td class="px-lg py-md tracking-wider">{{ stars(t.rating) }}</td>
            <td class="px-lg py-md">
              <span
                :class="t.isFeatured ? 'bg-accent-green text-font-light' : 'bg-border-light text-font-secondary'"
                class="px-sm py-xs rounded-full text-xs font-medium"
              >
                {{ t.isFeatured ? 'Featured' : 'No' }}
              </span>
            </td>
            <td class="px-lg py-md flex gap-md">
              <button class="text-accent-green hover:underline" @click="openEdit(t)">Edit</button>
              <button class="text-red-500 hover:underline" @click="remove(t._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-2xl max-w-[560px] w-full mx-md max-h-[90vh] overflow-y-auto">
        <h2 class="font-heading text-subsection mb-lg">{{ editingId ? 'Edit Testimonial' : 'Add Testimonial' }}</h2>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Author Name</label>
          <input v-model="form.authorName" type="text" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Content</label>
          <textarea v-model="form.content" class="w-full h-[100px] px-md py-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark resize-none" />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Rating</label>
          <select v-model="form.rating" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark">
            <option :value="1">1 ★</option>
            <option :value="2">2 ★★</option>
            <option :value="3">3 ★★★</option>
            <option :value="4">4 ★★★★</option>
            <option :value="5">5 ★★★★★</option>
          </select>
        </div>

        <div class="mb-xl flex items-center gap-sm">
          <input v-model="form.isFeatured" type="checkbox" id="isFeatured" class="w-4 h-4" />
          <label for="isFeatured" class="font-body text-sm text-font-secondary">Featured</label>
        </div>

        <div class="flex gap-md">
          <button class="btn-primary !py-sm !px-lg" @click="save">Save</button>
          <button class="btn-outline !py-sm !px-lg" @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
