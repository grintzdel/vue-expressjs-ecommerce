<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface Page {
  _id: string
  title: string
  slug: string
  content: string
  seoMeta: { title: string; description: string }
  isPublished: boolean
}

const api = useApi()

const pages = ref<Page[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  title: '',
  slug: '',
  content: '',
  seoMeta: { title: '', description: '' },
  isPublished: false,
})

async function fetchPages() {
  pages.value = await api.get<Page[]>('/pages')
}

watch(() => form.value.title, (val) => {
  form.value.slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
})

function openAdd() {
  editingId.value = null
  form.value = { title: '', slug: '', content: '', seoMeta: { title: '', description: '' }, isPublished: false }
  showModal.value = true
}

function openEdit(page: Page) {
  editingId.value = page._id
  form.value = {
    title: page.title,
    slug: page.slug,
    content: page.content,
    seoMeta: { title: page.seoMeta?.title ?? '', description: page.seoMeta?.description ?? '' },
    isPublished: page.isPublished,
  }
  showModal.value = true
}

async function save() {
  if (editingId.value) {
    await api.patch(`/pages/${editingId.value}`, form.value)
  } else {
    await api.post('/pages', form.value)
  }
  showModal.value = false
  await fetchPages()
}

async function remove(id: string) {
  if (confirm('Are you sure?')) {
    await api.del(`/pages/${id}`)
    await fetchPages()
  }
}

onMounted(fetchPages)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-lg">
      <h1 class="font-heading text-subsection">Pages</h1>
      <button class="btn-primary" @click="openAdd">Add Page</button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border-light overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-primary">
          <tr>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Title</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Slug</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Published</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="page in pages" :key="page._id" class="border-b border-border-light text-sm">
            <td class="px-lg py-md">{{ page.title }}</td>
            <td class="px-lg py-md">{{ page.slug }}</td>
            <td class="px-lg py-md">
              <span
                :class="page.isPublished ? 'bg-accent-green text-font-light' : 'bg-border-light text-font-secondary'"
                class="px-sm py-xs rounded-full text-xs font-medium"
              >
                {{ page.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-lg py-md flex gap-md">
              <button class="text-accent-green hover:underline" @click="openEdit(page)">Edit</button>
              <button class="text-red-500 hover:underline" @click="remove(page._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-2xl max-w-[560px] w-full mx-md overflow-y-auto max-h-[90vh]">
        <h2 class="font-heading text-subsection mb-lg">{{ editingId ? 'Edit Page' : 'Add Page' }}</h2>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Title</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark"
          />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark"
          />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Content</label>
          <textarea
            v-model="form.content"
            class="w-full h-[100px] px-md py-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark resize-none"
          />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">SEO Title</label>
          <input
            v-model="form.seoMeta.title"
            type="text"
            class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark"
          />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">SEO Description</label>
          <textarea
            v-model="form.seoMeta.description"
            class="w-full h-[100px] px-md py-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark resize-none"
          />
        </div>

        <div class="mb-xl flex items-center gap-sm">
          <input id="isPublished" v-model="form.isPublished" type="checkbox" class="w-4 h-4 cursor-pointer" />
          <label for="isPublished" class="font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary cursor-pointer">Published</label>
        </div>

        <div class="flex gap-md">
          <button class="btn-primary !py-sm !px-lg" @click="save">Save</button>
          <button class="btn-outline !py-sm !px-lg" @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
