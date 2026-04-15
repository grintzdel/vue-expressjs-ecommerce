<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '@/composables/useApi'

const api = useApi()

interface DashboardData {
  kpis: {
    newsletter: { total: number; changePercent: number }
    orders: { total: number; changePercent: number }
    revenue: { total: number; changePercent: number }
    clients: { total: number; changePercent: number }
  }
  monthlyRevenue: { month: string; amount: number }[]
  salesDistribution: { category: string; amount: number; percentage: number }[]
  recentOrders: {
    id: string
    orderNumber: string
    clientName: string
    products: string
    total: number
    currency: string
    status: string
    date: string
  }[]
  topProducts: {
    rank: number
    name: string
    category: string
    sales: number
    revenue: number
  }[]
  topClients: {
    rank: number
    email: string
    ordersCount: number
    totalSpent: number
  }[]
}

const data = ref<DashboardData | null>(null)
const loading = ref(true)
const hoveredSegment = ref<number | null>(null)

const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

const kpiCards = computed(() => {
  if (!data.value) return []
  const k = data.value.kpis
  return [
    { label: 'Newsletter', value: k.newsletter.total.toLocaleString('fr-FR'), change: k.newsletter.changePercent, icon: 'mail', iconBg: '#E0E8F0', iconColor: '#4A6FA5' },
    { label: 'Commandes', value: k.orders.total.toLocaleString('fr-FR'), change: k.orders.changePercent, icon: 'shopping-cart', iconBg: '#E0E8F0', iconColor: '#4A6FA5' },
    { label: "Chiffre d'affaires", value: `€${k.revenue.total.toLocaleString('fr-FR')}`, change: k.revenue.changePercent, icon: 'euro', iconBg: '#F0EBE0', iconColor: '#A57A4A' },
    { label: 'Clients', value: k.clients.total.toLocaleString('fr-FR'), change: k.clients.changePercent, icon: 'users', iconBg: '#F0E0E8', iconColor: '#A54A6F' },
  ]
})

const maxRevenue = computed(() => {
  if (!data.value) return 1
  return Math.max(...data.value.monthlyRevenue.map(m => m.amount), 1)
})

const donutColors = ['#4A5E3A', '#E6A84D', '#8B6DB0', '#A57A4A', '#E0E8F0', '#F0E0E8', '#D4C8BC']

const donutSegments = computed(() => {
  if (!data.value) return []
  let offset = 25
  return data.value.salesDistribution.map((seg, i) => {
    const segOffset = offset
    offset -= seg.percentage
    return {
      dasharray: `${seg.percentage} ${100 - seg.percentage}`,
      dashoffset: segOffset,
      color: donutColors[i % donutColors.length],
      index: i,
    }
  })
})

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: '#FFF8E1', text: '#E8A830', label: 'En attente' },
  confirmed: { bg: '#E8F5E9', text: '#2E7D32', label: 'Confirmée' },
  shipped: { bg: '#E0E8F0', text: '#4A6FA5', label: 'Expédiée' },
  delivered: { bg: '#E8F5E9', text: '#2E7D32', label: 'Livrée' },
  cancelled: { bg: '#FFEBEE', text: '#C94444', label: 'Annulée' },
}

onMounted(async () => {
  try {
    data.value = await api.get<DashboardData>('/analytics/dashboard')
  } catch (e) {
    console.error('Failed to load dashboard stats', e)
  } finally {
    loading.value = false
  }
})

function formatEuro(amount: number): string {
  return `€${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0 })}`
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="font-heading text-[28px] font-bold text-font-primary">Tableau de bord</h1>
      <p class="text-sm font-body text-font-secondary mt-1">Bienvenue, Admin — {{ today }}</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-font-tertiary font-body">
      Chargement...
    </div>

    <template v-else-if="data">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="card in kpiCards"
          :key="card.label"
          class="bg-white rounded-xl border border-border-light p-4 flex items-center gap-4"
        >
          <div class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: card.iconBg }">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="card.iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <use :href="`#lucide-${card.icon}`" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-body font-medium text-font-tertiary">{{ card.label }}</p>
            <p class="text-2xl font-bold font-body text-font-primary">{{ card.value }}</p>
            <p
              class="text-[13px] font-semibold font-body"
              :class="card.change >= 0 ? 'text-accent-green' : 'text-[#C94444]'"
            >
              {{ card.change >= 0 ? '+' : '' }}{{ card.change }}% ce mois
            </p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <!-- Bar Chart - Monthly Revenue -->
        <div class="bg-white rounded-xl border border-border-light p-5">
          <h2 class="font-heading text-base font-semibold text-font-primary mb-4">Revenus mensuels</h2>
          <div class="flex items-end gap-1 h-[180px]">
            <div
              v-for="(m, i) in data.monthlyRevenue"
              :key="i"
              class="flex-1 flex flex-col items-center justify-end gap-1.5 h-full relative [&:hover>span:first-child]:opacity-100 [&:hover>div]:opacity-100"
            >
              <span class="text-[10px] font-body text-font-tertiary opacity-0 transition-opacity duration-200 pointer-events-none">
                {{ m.amount > 0 ? formatEuro(m.amount) : '' }}
              </span>
              <div
                class="w-full max-w-[32px] rounded-t-md transition-opacity duration-200 opacity-70"
                :style="{
                  height: `${Math.max((m.amount / maxRevenue) * 140, m.amount > 0 ? 4 : 0)}px`,
                  backgroundColor: i === new Date().getMonth() ? '#4A5E3A' : '#C8D4BC',
                }"
              />
              <span class="text-[10px] font-body text-font-tertiary capitalize">{{ m.month }}</span>
            </div>
          </div>
        </div>

        <!-- Donut Chart - Sales Distribution -->
        <div class="bg-white rounded-xl border border-border-light p-5">
          <h2 class="font-heading text-base font-semibold text-font-primary mb-4">Répartition des ventes</h2>
          <div class="flex items-center gap-5">
            <!-- Donut SVG with tooltip -->
            <div class="relative w-[200px] h-[200px] flex-shrink-0">
              <svg viewBox="0 0 42 42" class="w-full h-full overflow-visible">
                <!-- Visible segments -->
                <circle
                  v-for="seg in donutSegments"
                  :key="'v' + seg.index"
                  cx="21" cy="21" r="15.91549431"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="5"
                  :stroke-dasharray="seg.dasharray"
                  :stroke-dashoffset="seg.dashoffset"
                  :opacity="hoveredSegment === null || hoveredSegment === seg.index ? 1 : 0.35"
                  class="transition-opacity duration-200 pointer-events-none"
                />
                <!-- Invisible hit areas on top -->
                <circle
                  v-for="seg in donutSegments"
                  :key="'h' + seg.index"
                  cx="21" cy="21" r="15.91549431"
                  fill="none"
                  stroke="transparent"
                  stroke-width="5"
                  :stroke-dasharray="seg.dasharray"
                  :stroke-dashoffset="seg.dashoffset"
                  class="cursor-pointer"
                  style="pointer-events: stroke"
                  @mouseenter="hoveredSegment = seg.index"
                  @mouseleave="hoveredSegment = null"
                />
              </svg>
              <div
                v-if="hoveredSegment !== null && data.salesDistribution[hoveredSegment]"
                class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2E3D22] text-white text-[11px] font-body font-semibold px-2.5 py-1.5 rounded-md whitespace-nowrap pointer-events-none shadow-lg"
              >
                {{ data.salesDistribution[hoveredSegment].category }} · {{ data.salesDistribution[hoveredSegment].percentage }}%
              </div>
            </div>
            <!-- Legend -->
            <div class="flex flex-col gap-3">
              <div
                v-for="(seg, i) in data.salesDistribution.slice(0, 5)"
                :key="i"
                class="flex items-center gap-2"
              >
                <div class="w-2.5 h-2.5 rounded-sm flex-shrink-0" :style="{ backgroundColor: donutColors[i % donutColors.length] }" />
                <span class="text-xs font-body text-font-secondary">{{ seg.category }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="bg-white rounded-xl border border-border-light p-5 pb-2">
        <h2 class="font-heading text-base font-semibold text-font-primary mb-4">Commandes récentes</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-bg-primary rounded">
                <th class="text-[11px] font-semibold text-font-tertiary uppercase font-body py-2 px-3">Commande</th>
                <th class="text-[11px] font-semibold text-font-tertiary uppercase font-body py-2 px-3">Client</th>
                <th class="text-[11px] font-semibold text-font-tertiary uppercase font-body py-2 px-3">Produits</th>
                <th class="text-[11px] font-semibold text-font-tertiary uppercase font-body py-2 px-3 w-[90px]">Total</th>
                <th class="text-[11px] font-semibold text-font-tertiary uppercase font-body py-2 px-3 w-[90px]">Statut</th>
                <th class="text-[11px] font-semibold text-font-tertiary uppercase font-body py-2 px-3 w-[90px]">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(order, i) in data.recentOrders"
                :key="order.id"
                class="border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors"
              >
                <td class="py-2 px-3 text-xs font-body font-medium text-font-primary">{{ order.orderNumber }}</td>
                <td class="py-2 px-3 text-xs font-body text-font-secondary">{{ order.clientName }}</td>
                <td class="py-2 px-3 text-xs font-body text-font-secondary max-w-[200px] truncate">{{ order.products }}</td>
                <td class="py-2 px-3 text-xs font-body font-medium text-font-primary">€{{ order.total.toFixed(2) }}</td>
                <td class="py-2 px-3">
                  <span
                    class="inline-block text-[11px] font-semibold font-body px-2 py-0.5 rounded-full"
                    :style="{
                      backgroundColor: (statusColors[order.status] || statusColors.pending).bg,
                      color: (statusColors[order.status] || statusColors.pending).text,
                    }"
                  >
                    {{ (statusColors[order.status] || statusColors.pending).label }}
                  </span>
                </td>
                <td class="py-2 px-3 text-xs font-body text-font-tertiary">{{ order.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bottom Row: Top Products + Top Clients -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Top Products -->
        <div class="bg-white rounded-xl border border-border-light p-4 pb-5">
          <h2 class="font-heading text-base font-semibold text-font-primary mb-3">Top 5 — Meilleurs produits</h2>
          <div class="divide-y divide-border-light">
            <div
              v-for="(prod, i) in data.topProducts"
              :key="i"
              class="flex items-center justify-between py-2 -mx-4 px-4 hover:bg-[#F0F5EB] transition-colors rounded"
            >
              <div class="flex items-center gap-3">
                <span class="text-xs font-body font-bold text-font-tertiary w-5">{{ prod.rank }}.</span>
                <div>
                  <p class="text-[13px] font-body font-medium text-font-primary">{{ prod.name }}</p>
                  <p class="text-[11px] font-body text-font-tertiary">{{ prod.category }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[13px] font-body font-semibold text-font-primary">{{ formatEuro(prod.revenue) }}</p>
                <p class="text-[11px] font-body text-font-tertiary">{{ prod.sales }} ventes</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Clients -->
        <div class="bg-white rounded-xl border border-border-light p-4 pb-5">
          <h2 class="font-heading text-base font-semibold text-font-primary mb-3">Top 5 — Meilleurs clients</h2>
          <div class="divide-y divide-border-light">
            <div
              v-for="(client, i) in data.topClients"
              :key="i"
              class="flex items-center justify-between py-2 -mx-4 px-4 hover:bg-[#F0F5EB] transition-colors rounded"
            >
              <div class="flex items-center gap-3">
                <span class="text-xs font-body font-bold text-font-tertiary w-5">{{ client.rank }}.</span>
                <div>
                  <p class="text-[13px] font-body font-medium text-font-primary">{{ client.email }}</p>
                  <p class="text-[11px] font-body text-font-tertiary">{{ client.ordersCount }} commandes</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[13px] font-body font-semibold text-font-primary">{{ formatEuro(client.totalSpent) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Extra icon sprites needed by dashboard -->
  <svg xmlns="http://www.w3.org/2000/svg" class="hidden">
    <symbol id="lucide-euro" viewBox="0 0 24 24"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19.17 5a8 8 0 0 0-5.17-2 8 8 0 1 0 0 16 8 8 0 0 0 5.17-2"/></symbol>
    <symbol id="lucide-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
  </svg>
</template>
