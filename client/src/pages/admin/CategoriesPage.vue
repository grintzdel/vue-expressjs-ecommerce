<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  if (!confirm(`Delete category "${item.name}"?`)) return
  await api.del(`/categories/${item.id}`)
  await fetchCategories()
}

function truncate(text: string | undefined, len = 60): string {
  if (!text) return '—'
  return text.length > len ? text.slice(0, len) + '…' : text
}

onMounted(fetchCategories)
</script>

<template>
  <div class="p-2xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-xl">
      <h1 class="font-heading text-subsection text-font-primary">Categories</h1>
      <button class="btn-primary" @click="openAdd">+ Add Category</button>
    </div>

    <!-- Loading -->
    <p v-if="loading" class="font-body text-sm text-font-secondary">Loading...</p>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-border-light overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-primary">
          <tr>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Name</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Slug</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Description</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="categories.length === 0">
            <td colspan="4" class="px-lg py-2xl text-center font-body text-sm text-font-tertiary">
              No items found
            </td>
          </tr>
          <tr
            v-for="cat in categories"
            :key="cat.id"
            class="border-b border-border-light last:border-0"
          >
            <td class="px-lg py-md text-sm text-font-primary font-semibold">{{ cat.name }}</td>
            <td class="px-lg py-md text-sm text-font-secondary font-mono">{{ cat.slug }}</td>
            <td class="px-lg py-md text-sm text-font-secondary">{{ truncate(cat.description) }}</td>
            <td class="px-lg py-md">
              <div class="flex items-center gap-sm">
                <button
                  class="text-xs font-body text-font-secondary hover:text-font-primary underline"
                  @click="openEdit(cat)"
                >Edit</button>
                <button
                  class="text-xs font-body text-red-500 hover:text-red-700 underline"
                  @click="handleDelete(cat)"
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
          {{ editingItem.id ? 'Edit' : 'Add' }} Category
        </h2>

        <div class="space-y-lg">
          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Name
            </label>
            <input
              type="text"
              :value="editingItem.name"
              @input="onNameInput(($event.target as HTMLInputElement).value)"
              class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark"
              placeholder="Category name"
            />
          </div>

          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Slug
            </label>
            <input
              type="text"
              v-model="editingItem.slug"
              class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark"
              placeholder="category-slug"
            />
          </div>

          <div>
            <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">
              Description
            </label>
            <textarea
              v-model="editingItem.description"
              rows="3"
              class="w-full px-md py-sm bg-white border border-border-light rounded-md font-body text-sm text-font-primary focus:outline-none focus:border-border-dark resize-none"
              placeholder="Optional description"
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
