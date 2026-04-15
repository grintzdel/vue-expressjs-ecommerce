<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AnalyticsDomainModel } from '@/modules/analytics/core/model/analytics.domain-model'
import Card from '@/ui/card.vue'
import CardHeader from '@/ui/card-header.vue'
import CardTitle from '@/ui/card-title.vue'
import CardContent from '@/ui/card-content.vue'

const props = defineProps<{
  salesDistribution: AnalyticsDomainModel.SalesDistributionDto[]
}>()

const COLORS = ['#4A5E3A', '#E6A84D', '#8B6DB0', '#A57A4A', '#E0E8F0', '#F0E0E8', '#D4C8BC']

const tooltip = ref<{ visible: boolean; text: string; x: number; y: number }>({
  visible: false,
  text: '',
  x: 0,
  y: 0,
})

const segments = computed(() => {
  const total = props.salesDistribution.reduce((sum, d) => sum + d.amount, 0)
  if (total === 0) return []

  const cx = 100
  const cy = 100
  const outerR = 80
  const innerR = 50

  let currentAngle = -Math.PI / 2
  return props.salesDistribution.map((item, idx) => {
    const fraction = item.amount / total
    const angle = fraction * 2 * Math.PI
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const x1 = cx + outerR * Math.cos(startAngle)
    const y1 = cy + outerR * Math.sin(startAngle)
    const x2 = cx + outerR * Math.cos(endAngle)
    const y2 = cy + outerR * Math.sin(endAngle)
    const x3 = cx + innerR * Math.cos(endAngle)
    const y3 = cy + innerR * Math.sin(endAngle)
    const x4 = cx + innerR * Math.cos(startAngle)
    const y4 = cy + innerR * Math.sin(startAngle)

    const largeArc = angle > Math.PI ? 1 : 0

    const path = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ')

    const hitR = outerR + 6
    const hx1 = cx + hitR * Math.cos(startAngle)
    const hy1 = cy + hitR * Math.sin(startAngle)
    const hx2 = cx + hitR * Math.cos(endAngle)
    const hy2 = cy + hitR * Math.sin(endAngle)
    const hitPath = [
      `M ${cx} ${cy}`,
      `L ${hx1} ${hy1}`,
      `A ${hitR} ${hitR} 0 ${largeArc} 1 ${hx2} ${hy2}`,
      'Z',
    ].join(' ')

    return {
      path,
      hitPath,
      color: COLORS[idx % COLORS.length],
      category: item.category,
      percentage: item.percentage,
    }
  })
})

const top5 = computed(() => props.salesDistribution.slice(0, 5))

function showTooltip(event: MouseEvent, text: string) {
  const rect = (event.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect()
  tooltip.value = {
    visible: true,
    text,
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function hideTooltip() {
  tooltip.value.visible = false
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Répartition des ventes</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex items-center gap-6">
        <div class="relative flex-shrink-0" style="width: 200px; height: 200px;">
          <svg width="200" height="200" viewBox="0 0 200 200" @mouseleave="hideTooltip">
            <g v-for="(seg, idx) in segments" :key="idx">
              <path
                :d="seg.path"
                :fill="seg.color"
                class="transition-opacity hover:opacity-80"
              />
              <path
                :d="seg.hitPath"
                fill="transparent"
                class="cursor-pointer"
                @mousemove="showTooltip($event, `${seg.category} · ${seg.percentage.toFixed(1)}%`)"
                @mouseleave="hideTooltip"
              />
            </g>
          </svg>
          <div
            v-if="tooltip.visible"
            class="absolute pointer-events-none z-10 bg-white border border-border-light rounded-lg shadow-lg px-2.5 py-1.5 text-xs font-body text-font-primary whitespace-nowrap"
            :style="{ left: `${tooltip.x + 8}px`, top: `${tooltip.y - 24}px` }"
          >
            {{ tooltip.text }}
          </div>
        </div>

        <div class="flex-1 space-y-2">
          <div
            v-for="(item, idx) in top5"
            :key="item.category"
            class="flex items-center gap-2"
          >
            <div
              class="w-3 h-3 rounded-sm flex-shrink-0"
              :style="{ backgroundColor: COLORS[idx % COLORS.length] }"
            />
            <span class="flex-1 text-xs font-body text-font-primary truncate">{{ item.category }}</span>
            <span class="text-xs font-body text-font-tertiary">{{ item.percentage.toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
