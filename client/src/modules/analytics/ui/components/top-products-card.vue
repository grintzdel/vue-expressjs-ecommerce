<script setup lang="ts">
import type { AnalyticsDomainModel } from '@/modules/analytics/core/model/analytics.domain-model'
import Card from '@/ui/card.vue'
import CardHeader from '@/ui/card-header.vue'
import CardTitle from '@/ui/card-title.vue'
import CardContent from '@/ui/card-content.vue'

defineProps<{
  topProducts: AnalyticsDomainModel.TopProductDto[]
}>()

function formatRevenue(amount: number): string {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Top produits</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div v-if="topProducts.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">
        Aucun produit
      </div>
      <div
        v-for="product in topProducts"
        :key="product.rank"
        class="flex items-center gap-4 px-5 py-3 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors"
      >
        <span class="w-6 text-center text-[13px] font-semibold font-body text-font-tertiary flex-shrink-0">{{ product.rank }}</span>
        <div class="flex-1 min-w-0">
          <div class="text-[13px] font-body font-medium text-font-primary truncate">{{ product.name }}</div>
          <div class="text-xs font-body text-font-tertiary">{{ product.category }}</div>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="text-[13px] font-body font-medium text-font-primary">{{ formatRevenue(product.revenue) }}</div>
          <div class="text-xs font-body text-font-tertiary">{{ product.sales }} ventes</div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
