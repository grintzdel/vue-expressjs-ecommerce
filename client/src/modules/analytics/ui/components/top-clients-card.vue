<script setup lang="ts">
import type { AnalyticsDomainModel } from '@/modules/analytics/core/model/analytics.domain-model'
import Card from '@/ui/card.vue'
import CardHeader from '@/ui/card-header.vue'
import CardTitle from '@/ui/card-title.vue'
import CardContent from '@/ui/card-content.vue'

defineProps<{
  topClients: AnalyticsDomainModel.TopClientDto[]
}>()

function formatSpent(amount: number): string {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Top clients</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div v-if="topClients.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">
        Aucun client
      </div>
      <div
        v-for="client in topClients"
        :key="client.rank"
        class="flex items-center gap-4 px-5 py-3 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors"
      >
        <span class="w-6 text-center text-[13px] font-semibold font-body text-font-tertiary flex-shrink-0">{{ client.rank }}</span>
        <div class="flex-1 min-w-0">
          <div class="text-[13px] font-body font-medium text-font-primary truncate">{{ client.email }}</div>
          <div class="text-xs font-body text-font-tertiary">{{ client.ordersCount }} commande{{ client.ordersCount > 1 ? 's' : '' }}</div>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="text-[13px] font-body font-medium text-font-primary">{{ formatSpent(client.totalSpent) }}</div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
