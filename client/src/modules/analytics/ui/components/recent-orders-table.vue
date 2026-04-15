<script setup lang="ts">
import type { AnalyticsDomainModel } from '@/modules/analytics/core/model/analytics.domain-model'
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from '@/modules/order/core/constants/order-status.constant'
import Card from '@/ui/card.vue'
import CardHeader from '@/ui/card-header.vue'
import CardTitle from '@/ui/card-title.vue'
import CardContent from '@/ui/card-content.vue'
import Badge from '@/ui/badge.vue'

defineProps<{
  recentOrders: AnalyticsDomainModel.RecentOrderDto[]
}>()

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

function formatTotal(amount: number, currency: string): string {
  return `${currency}${amount.toFixed(2)}`
}

function getStatusStyle(status: string): { bg: string; text: string } {
  return (ORDER_STATUS_STYLES as Record<string, { bg: string; text: string }>)[status] || { bg: '#F0F0F0', text: '#666' }
}

function getStatusLabel(status: string): string {
  return (ORDER_STATUS_LABELS as Record<string, string>)[status] || status
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Commandes récentes</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="h-9 border-b border-border-light">
              <th class="px-5 text-left text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">Commande</th>
              <th class="px-5 text-left text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">Client</th>
              <th class="px-5 text-left text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">Produits</th>
              <th class="px-5 text-left text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">Total</th>
              <th class="px-5 text-left text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">Statut</th>
              <th class="px-5 text-left text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in recentOrders"
              :key="order.id"
              class="h-12 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors"
            >
              <td class="px-5 text-[13px] font-body font-medium text-font-primary">{{ order.orderNumber }}</td>
              <td class="px-5 text-xs font-body text-font-tertiary">{{ order.clientName }}</td>
              <td class="px-5 text-xs font-body text-font-tertiary max-w-[180px] truncate">{{ order.products }}</td>
              <td class="px-5 text-[13px] font-body font-medium text-font-primary">{{ formatTotal(order.total, order.currency) }}</td>
              <td class="px-5">
                <span
                  class="text-[11px] font-semibold font-body px-2.5 py-1 rounded-full"
                  :style="{ backgroundColor: getStatusStyle(order.status).bg, color: getStatusStyle(order.status).text }"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-5 text-xs font-body text-font-tertiary">{{ formatDate(order.date) }}</td>
            </tr>
            <tr v-if="recentOrders.length === 0">
              <td colspan="6" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">
                Aucune commande récente
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</template>
