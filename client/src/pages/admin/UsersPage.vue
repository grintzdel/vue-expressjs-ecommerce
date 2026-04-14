<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface User {
  _id: string
  email: string
  role: string
  createdAt: string
}

const api = useApi()

const users = ref<User[]>([])

async function fetchUsers() {
  users.value = await api.get<User[]>('/users')
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

onMounted(fetchUsers)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-lg">
      <h1 class="font-heading text-subsection">Users</h1>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border-light overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-primary">
          <tr>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Email</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Role</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id" class="border-b border-border-light text-sm">
            <td class="px-lg py-md">{{ user.email }}</td>
            <td class="px-lg py-md">
              <span
                :class="user.role === 'admin' ? 'bg-accent-green text-font-light' : 'bg-bg-primary text-font-secondary'"
                class="px-sm py-xs rounded-full text-xs font-medium"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-lg py-md">{{ formatDate(user.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
