<script setup lang="ts">
import { Mail, ShoppingCart, Euro, Users } from 'lucide-vue-next'
import type { AnalyticsDomainModel } from '@/modules/analytics/core/model/analytics.domain-model'
import Card from '@/ui/card.vue'
import CardContent from '@/ui/card-content.vue'

defineProps<{
  kpis: AnalyticsDomainModel.KpisDto
}>()

function formatChange(change: number): string {
  return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardContent class="p-5">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Mail class="w-5 h-5 text-blue-500" />
          </div>
          <span class="text-sm font-body font-medium text-font-tertiary">Newsletter</span>
        </div>
        <div class="text-2xl font-semibold font-body text-font-primary mb-1">{{ kpis.newsletter.total.toLocaleString() }}</div>
        <div
          class="text-xs font-body font-medium"
          :class="kpis.newsletter.changePercent >= 0 ? 'text-[#4A5E3A]' : 'text-[#C94444]'"
        >
          {{ formatChange(kpis.newsletter.changePercent) }} ce mois
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent class="p-5">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <ShoppingCart class="w-5 h-5 text-blue-500" />
          </div>
          <span class="text-sm font-body font-medium text-font-tertiary">Commandes</span>
        </div>
        <div class="text-2xl font-semibold font-body text-font-primary mb-1">{{ kpis.orders.total.toLocaleString() }}</div>
        <div
          class="text-xs font-body font-medium"
          :class="kpis.orders.changePercent >= 0 ? 'text-[#4A5E3A]' : 'text-[#C94444]'"
        >
          {{ formatChange(kpis.orders.changePercent) }} ce mois
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent class="p-5">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Euro class="w-5 h-5 text-amber-600" />
          </div>
          <span class="text-sm font-body font-medium text-font-tertiary">Chiffre d'affaires</span>
        </div>
        <div class="text-2xl font-semibold font-body text-font-primary mb-1">{{ kpis.revenue.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}</div>
        <div
          class="text-xs font-body font-medium"
          :class="kpis.revenue.changePercent >= 0 ? 'text-[#4A5E3A]' : 'text-[#C94444]'"
        >
          {{ formatChange(kpis.revenue.changePercent) }} ce mois
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent class="p-5">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
            <Users class="w-5 h-5 text-pink-500" />
          </div>
          <span class="text-sm font-body font-medium text-font-tertiary">Clients</span>
        </div>
        <div class="text-2xl font-semibold font-body text-font-primary mb-1">{{ kpis.clients.total.toLocaleString() }}</div>
        <div
          class="text-xs font-body font-medium"
          :class="kpis.clients.changePercent >= 0 ? 'text-[#4A5E3A]' : 'text-[#C94444]'"
        >
          {{ formatChange(kpis.clients.changePercent) }} ce mois
        </div>
      </CardContent>
    </Card>
  </div>
</template>
