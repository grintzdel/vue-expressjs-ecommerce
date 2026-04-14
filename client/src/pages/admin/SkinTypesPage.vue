<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface SkinType {
  _id: string
  name: string
  slug: string
}

const api = useApi()

const skinTypes = ref<SkinType[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = ref({ name: '', slug: '' })

async function fetchSkinTypes() {
  skinTypes.value = await api.get<SkinType[]>('/skin-types')
}

watch(() => form.value.name, (val) => {
  form.value.slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
})

function openAdd() {
  editingId.value = null
  form.value = { name: '', slug: '' }
  showModal.value = true
}

function openEdit(skinType: SkinType) {
  editingId.value = skinType._id
  form.value = { name: skinType.name, slug: skinType.slug }
  showModal.value = true
}

async function save() {
  if (editingId.value) {
    await api.patch(`/skin-types/${editingId.value}`, form.value)
  } else {
    await api.post('/skin-types', form.value)
  }
  showModal.value = false
  await fetchSkinTypes()
}

async function remove(id: string) {
  if (confirm('Are you sure?')) {
    await api.del(`/skin-types/${id}`)
    await fetchSkinTypes()
  }
}

onMounted(fetchSkinTypes)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-lg">
      <h1 class="font-heading text-subsection">Skin Types</h1>
      <button class="btn-primary" @click="openAdd">Add Skin Type</button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border-light overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-primary">
          <tr>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Name</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Slug</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="skinType in skinTypes" :key="skinType._id" class="border-b border-border-light text-sm">
            <td class="px-lg py-md">{{ skinType.name }}</td>
            <td class="px-lg py-md">{{ skinType.slug }}</td>
            <td class="px-lg py-md flex gap-md">
              <button class="text-accent-green hover:underline" @click="openEdit(skinType)">Edit</button>
              <button class="text-red-500 hover:underline" @click="remove(skinType._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-2xl max-w-[560px] w-full mx-md">
        <h2 class="font-heading text-subsection mb-lg">{{ editingId ? 'Edit Skin Type' : 'Add Skin Type' }}</h2>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark"
          />
        </div>

        <div class="mb-xl">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark"
          />
        </div>

        <div class="flex gap-md">
          <button class="btn-primary !py-sm !px-lg" @click="save">Save</button>
          <button class="btn-outline !py-sm !px-lg" @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
