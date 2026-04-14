<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface Subscription {
  _id: string
  email: string
  subscribedAt: string
  isActive: boolean
  discountCode: string
}

const api = useApi()

const subscriptions = ref<Subscription[]>([])

async function fetchSubscriptions() {
  subscriptions.value = await api.get<Subscription[]>('/newsletter')
}

async function unsubscribe(email: string) {
  if (confirm(`Unsubscribe ${email}?`)) {
    await api.post('/newsletter/unsubscribe', { email })
    await fetchSubscriptions()
  }
}

async function remove(id: string) {
  if (confirm('Delete this subscription?')) {
    await api.del(`/newsletter/${id}`)
    await fetchSubscriptions()
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

onMounted(fetchSubscriptions)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-lg">
      <h1 class="font-heading text-subsection">Newsletter</h1>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border-light overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-primary">
          <tr>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Email</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Subscribed At</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Active</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Discount Code</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in subscriptions" :key="item._id" class="border-b border-border-light text-sm">
            <td class="px-lg py-md">{{ item.email }}</td>
            <td class="px-lg py-md">{{ formatDate(item.subscribedAt) }}</td>
            <td class="px-lg py-md">
              <span
                :class="item.isActive ? 'bg-accent-green text-font-light' : 'bg-border-light text-font-secondary'"
                class="px-sm py-xs rounded-full text-xs font-medium"
              >
                {{ item.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-lg py-md">{{ item.discountCode }}</td>
            <td class="px-lg py-md flex gap-md">
              <button class="text-accent-green hover:underline" @click="unsubscribe(item.email)">Unsubscribe</button>
              <button class="text-red-500 hover:underline" @click="remove(item._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
