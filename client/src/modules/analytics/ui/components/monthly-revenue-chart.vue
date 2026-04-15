<script setup lang="ts">
import { computed } from 'vue'
import type { AnalyticsDomainModel } from '@/modules/analytics/core/model/analytics.domain-model'
import Card from '@/ui/card.vue'
import CardHeader from '@/ui/card-header.vue'
import CardTitle from '@/ui/card-title.vue'
import CardContent from '@/ui/card-content.vue'

const props = defineProps<{
  monthlyRevenue: AnalyticsDomainModel.MonthlyRevenueDto[]
}>()

const maxAmount = computed(() => {
  if (!props.monthlyRevenue.length) return 1
  return Math.max(...props.monthlyRevenue.map((m) => m.amount))
})

const currentMonth = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('fr-FR', { month: 'short' })
})

function barHeight(amount: number): number {
  if (maxAmount.value === 0) return 0
  return Math.round((amount / maxAmount.value) * 180)
}

function isCurrentMonth(monthLabel: string): boolean {
  return monthLabel.toLowerCase().startsWith(currentMonth.value.toLowerCase())
}

function formatAmount(amount: number): string {
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k`
  return `${amount}`
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Revenus mensuels</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex items-end gap-2" style="height: 180px;">
        <div
          v-for="item in monthlyRevenue"
          :key="item.month"
          class="flex-1 flex flex-col items-center justify-end group relative"
          style="height: 180px;"
        >
          <span
            class="absolute bottom-full mb-1 text-[10px] font-body text-font-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
          >
            {{ formatAmount(item.amount) }}€
          </span>
          <div
            class="w-full rounded-t-sm transition-all"
            :style="{
              height: `${barHeight(item.amount)}px`,
              backgroundColor: isCurrentMonth(item.month) ? '#4A5E3A' : '#C8D4BC',
            }"
          />
          <span class="text-[10px] font-body text-font-tertiary mt-1 truncate w-full text-center">{{ item.month }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
