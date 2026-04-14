<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface PressLogo {
  _id: string
  name: string
  logoUrl: string
  link: string
  position: number
}

const api = useApi()

const logos = ref<PressLogo[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  name: '',
  logoUrl: '',
  link: '',
  position: 0,
})

async function fetchLogos() {
  logos.value = await api.get<PressLogo[]>('/press-logos')
}

function openAdd() {
  editingId.value = null
  form.value = { name: '', logoUrl: '', link: '', position: 0 }
  showModal.value = true
}

function openEdit(logo: PressLogo) {
  editingId.value = logo._id
  form.value = { name: logo.name, logoUrl: logo.logoUrl, link: logo.link, position: logo.position }
  showModal.value = true
}

async function save() {
  if (editingId.value) {
    await api.patch(`/press-logos/${editingId.value}`, form.value)
  } else {
    await api.post('/press-logos', form.value)
  }
  showModal.value = false
  await fetchLogos()
}

async function remove(id: string) {
  if (confirm('Are you sure?')) {
    await api.del(`/press-logos/${id}`)
    await fetchLogos()
  }
}

function truncate(str: string, max = 40) {
  return str.length > max ? str.substring(0, max) + '…' : str
}

onMounted(fetchLogos)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-lg">
      <h1 class="font-heading text-subsection">Press Logos</h1>
      <button class="btn-primary" @click="openAdd">Add Logo</button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border-light overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-primary">
          <tr>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Name</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Position</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Logo URL</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="logo in logos" :key="logo._id" class="border-b border-border-light text-sm">
            <td class="px-lg py-md">{{ logo.name }}</td>
            <td class="px-lg py-md">{{ logo.position }}</td>
            <td class="px-lg py-md text-font-tertiary">{{ truncate(logo.logoUrl) }}</td>
            <td class="px-lg py-md flex gap-md">
              <button class="text-accent-green hover:underline" @click="openEdit(logo)">Edit</button>
              <button class="text-red-500 hover:underline" @click="remove(logo._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-2xl max-w-[560px] w-full mx-md max-h-[90vh] overflow-y-auto">
        <h2 class="font-heading text-subsection mb-lg">{{ editingId ? 'Edit Logo' : 'Add Logo' }}</h2>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Name</label>
          <input v-model="form.name" type="text" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Logo URL</label>
          <input v-model="form.logoUrl" type="text" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Link URL</label>
          <input v-model="form.link" type="text" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="mb-xl">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Position</label>
          <input v-model.number="form.position" type="number" min="0" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="flex gap-md">
          <button class="btn-primary !py-sm !px-lg" @click="save">Save</button>
          <button class="btn-outline !py-sm !px-lg" @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
