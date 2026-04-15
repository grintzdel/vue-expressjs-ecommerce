<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import type { TestimonialDomainModel } from '@/modules/testimonial/core/model/testimonial.domain-model'
import UiTable from '@/ui/table.vue'
import TableHeader from '@/ui/table-header.vue'
import TableRow from '@/ui/table-row.vue'
import TableEmpty from '@/ui/table-empty.vue'
import Badge from '@/ui/badge.vue'
import DropdownMenu from '@/ui/dropdown-menu.vue'
import DropdownMenuTrigger from '@/ui/dropdown-menu-trigger.vue'
import DropdownMenuContent from '@/ui/dropdown-menu-content.vue'
import DropdownMenuItem from '@/ui/dropdown-menu-item.vue'
import Button from '@/ui/button.vue'

defineProps<{
  testimonials: TestimonialDomainModel.TestimonialOverviewDto[]
}>()

const emit = defineEmits<{
  edit: [testimonial: TestimonialDomainModel.TestimonialOverviewDto]
  delete: [id: string]
}>()

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

function renderStars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase()
}
</script>

<template>
  <UiTable>
    <TableHeader>
      <span class="w-[160px]">CLIENT</span>
      <span class="w-[90px]">NOTE</span>
      <span class="flex-1">COMMENTAIRE</span>
      <span class="w-[90px]">DATE</span>
      <span class="w-[90px]">STATUT</span>
      <span class="w-[70px]">ACTIONS</span>
    </TableHeader>
    <TableEmpty v-if="testimonials.length === 0">Aucun témoignage trouvé</TableEmpty>
    <TableRow v-for="testimonial in testimonials" :key="testimonial.id">
      <div class="w-[160px] flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-full bg-[#C8D4BC] flex items-center justify-center flex-shrink-0">
          <span class="text-[11px] font-semibold font-body text-[#4A5E3A]">{{ getInitial(testimonial.authorName) }}</span>
        </div>
        <span class="text-[13px] font-body font-medium text-font-primary truncate">{{ testimonial.authorName }}</span>
      </div>
      <span class="w-[90px] text-sm text-yellow-500">{{ renderStars(testimonial.rating) }}</span>
      <span class="flex-1 text-xs font-body text-font-tertiary truncate pr-4">{{ testimonial.content }}</span>
      <span class="w-[90px] text-xs font-body text-font-tertiary">{{ formatDate(testimonial.createdAt) }}</span>
      <div class="w-[90px]">
        <Badge v-if="testimonial.isFeatured" variant="success">Vedette</Badge>
        <Badge v-else variant="inactive">Normal</Badge>
      </div>
      <div class="w-[70px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="w-4 h-4 text-font-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="emit('edit', testimonial)">Modifier</DropdownMenuItem>
            <DropdownMenuItem :destructive="true" @click="emit('delete', testimonial.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
