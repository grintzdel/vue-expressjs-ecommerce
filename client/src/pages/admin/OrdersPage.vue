<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
const search = ref('')
const filterStatus = ref('')
const activeDropdown = ref<string | null>(null)

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const statusLabels: Record<string, string> = {
  pending: 'En attente', confirmed: 'Confirmée', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
}
const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FFF8E1', text: '#E8A830' },
  confirmed: { bg: '#E8F5E9', text: '#2E7D32' },
  shipped: { bg: '#E0E8F0', text: '#4A6FA5' },
  delivered: { bg: '#E8F5E9', text: '#2E7D32' },
  cancelled: { bg: '#FFEBEE', text: '#C94444' },
}

const filteredOrders = computed(() => {
  let result = orders.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(o => o.id.toLowerCase().includes(q) || o.items.some(i => i.productName.toLowerCase().includes(q)))
  }
  if (filterStatus.value) result = result.filter(o => o.status === filterStatus.value)
  return result
})

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
  activeDropdown.value = null
  if (!confirm('Supprimer cette commande ?')) return
  await api.del(`/orders/${order.id}`)
  await fetchOrders()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

onMounted(fetchOrders)
</script>

<template>
  <div class="p-6" @click="activeDropdown = null">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-[28px] font-bold text-font-primary">Commandes</h1>
        <p class="text-sm font-body text-font-secondary mt-1">Suivez et gérez les commandes</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-6 flex-wrap">
      <div class="flex items-center gap-2 bg-white border border-border-light rounded-lg h-9 px-3 w-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-tertiary flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input v-model="search" type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-body text-font-primary w-full" />
      </div>
      <select v-model="filterStatus" class="bg-white border border-border-light rounded-lg h-9 px-3 text-sm font-body text-font-primary outline-none">
        <option value="">Tous statuts</option>
        <option v-for="s in statuses" :key="s" :value="s">{{ statusLabels[s] }}</option>
      </select>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredOrders.length }} commandes</span>
    </div>

    <p v-if="loading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-border-light overflow-hidden">
      <div class="flex items-center gap-3 h-9 px-5 bg-white text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">
        <span class="w-[120px]">COMMANDE</span>
        <span class="flex-1">PRODUITS</span>
        <span class="w-[90px]">TOTAL</span>
        <span class="w-[110px]">STATUT</span>
        <span class="w-[90px]">DATE</span>
        <span class="w-[70px]">ACTIONS</span>
      </div>

      <div v-if="filteredOrders.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">
        Aucune commande trouvée
      </div>

      <div
        v-for="(order, i) in filteredOrders"
        :key="order.id"
        class="flex items-center gap-3 min-h-[52px] px-5 border-b border-border-light last:border-0 py-2 hover:bg-[#F0F5EB] transition-colors"
      >
        <div class="w-[120px]">
          <p class="text-[13px] font-body font-medium text-font-primary">#{{ order.id.slice(-6).toUpperCase() }}</p>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-body text-font-secondary truncate">{{ order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ') }}</p>
        </div>
        <span class="w-[90px] text-[13px] font-body font-medium text-font-primary">${{ order.totalAmount.toFixed(2) }}</span>
        <div class="w-[110px]">
          <select
            :value="order.status"
            @change="updateStatus(order, ($event.target as HTMLSelectElement).value)"
            class="text-[11px] font-semibold font-body px-2 py-1 rounded-full border-none cursor-pointer outline-none"
            :style="{ backgroundColor: (statusStyles[order.status] || statusStyles.pending).bg, color: (statusStyles[order.status] || statusStyles.pending).text }"
          >
            <option v-for="s in statuses" :key="s" :value="s">{{ statusLabels[s] }}</option>
          </select>
        </div>
        <span class="w-[90px] text-xs font-body text-font-tertiary">{{ formatDate(order.createdAt) }}</span>
        <div class="w-[70px] flex justify-center relative">
          <button class="p-1 text-font-tertiary hover:text-font-primary" @click.stop="activeDropdown = activeDropdown === order.id ? null : order.id">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <div v-if="activeDropdown === order.id" class="absolute right-0 top-8 z-20 bg-white border border-border-light rounded-lg shadow-lg py-1.5 w-[170px]" @click.stop>
            <button class="block w-full text-left px-4 py-2 text-sm font-body text-[#C94444] hover:bg-bg-primary transition" @click="deleteOrder(order)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
