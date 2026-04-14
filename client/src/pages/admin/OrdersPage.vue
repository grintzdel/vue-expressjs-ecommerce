<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  currency: string
  status: string
  shippingAddress: string
  createdAt: string
}

const api = useApi()
const orders = ref<Order[]>([])
const loading = ref(false)

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

async function fetchOrders() {
  loading.value = true
  try {
    orders.value = await api.get<Order[]>('/orders')
  } finally {
    loading.value = false
  }
}

async function updateStatus(order: Order, newStatus: string) {
  await api.patch(`/orders/${order.id}`, { status: newStatus })
  order.status = newStatus
}

async function deleteOrder(order: Order) {
  if (!confirm(`Delete order #${order.id.slice(-6)}?`)) return
  await api.del(`/orders/${order.id}`)
  await fetchOrders()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

onMounted(fetchOrders)
</script>

<template>
  <div class="p-2xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-xl">
      <h1 class="font-heading text-subsection text-font-primary">Orders</h1>
    </div>

    <p v-if="loading" class="font-body text-sm text-font-secondary">Loading...</p>

    <div v-else class="bg-white rounded-lg shadow-sm border border-border-light overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-primary">
          <tr>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Order</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Date</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Items</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Total</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Status</th>
            <th class="px-lg py-md text-left text-xs uppercase tracking-wide text-font-tertiary">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="orders.length === 0">
            <td colspan="6" class="px-lg py-2xl text-center font-body text-sm text-font-tertiary">
              No orders yet
            </td>
          </tr>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-b border-border-light last:border-0"
          >
            <td class="px-lg py-md">
              <span class="font-body text-sm font-semibold text-font-primary">#{{ order.id.slice(-6).toUpperCase() }}</span>
              <p class="font-body text-xs text-font-tertiary mt-0.5">{{ order.userId.slice(-6) }}</p>
            </td>
            <td class="px-lg py-md text-sm text-font-secondary font-body">
              {{ formatDate(order.createdAt) }}
            </td>
            <td class="px-lg py-md">
              <div class="flex flex-col gap-0.5">
                <span
                  v-for="(item, idx) in order.items"
                  :key="idx"
                  class="font-body text-xs text-font-secondary"
                >
                  {{ item.quantity }}x {{ item.productName }} (€{{ item.unitPrice.toFixed(2) }})
                </span>
              </div>
            </td>
            <td class="px-lg py-md text-sm font-semibold text-font-primary font-body">
              €{{ order.totalAmount.toFixed(2) }}
            </td>
            <td class="px-lg py-md">
              <select
                :value="order.status"
                @change="updateStatus(order, ($event.target as HTMLSelectElement).value)"
                class="font-body text-xs font-semibold px-2 py-1 rounded-sm border-none cursor-pointer"
                :class="statusColors[order.status] || 'bg-gray-100 text-gray-800'"
              >
                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </td>
            <td class="px-lg py-md">
              <button
                class="text-xs font-body text-red-500 hover:text-red-700 underline"
                @click="deleteOrder(order)"
              >Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
