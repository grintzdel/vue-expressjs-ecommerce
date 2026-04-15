<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import type { NewsletterDomainModel } from '@/modules/newsletter/core/model/newsletter.domain-model'
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
  subscriptions: NewsletterDomainModel.SubscriptionOverviewDto[]
}>()

const emit = defineEmits<{
  unsubscribe: [id: string]
  delete: [id: string]
}>()

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}
</script>

<template>
  <UiTable>
    <TableHeader>
      <span class="flex-1">EMAIL</span>
      <span class="w-[120px]">DATE</span>
      <span class="w-[90px]">STATUT</span>
      <span class="w-[120px]">CODE PROMO</span>
      <span class="w-[70px]">ACTIONS</span>
    </TableHeader>
    <TableEmpty v-if="subscriptions.length === 0">Aucune inscription trouvée</TableEmpty>
    <TableRow v-for="sub in subscriptions" :key="sub.id">
      <span class="flex-1 text-[13px] font-body font-medium text-font-primary">{{ sub.email }}</span>
      <span class="w-[120px] text-xs font-body text-font-tertiary">{{ formatDate(sub.subscribedAt) }}</span>
      <div class="w-[90px]">
        <Badge v-if="sub.isActive" variant="success">Actif</Badge>
        <Badge v-else variant="inactive">Inactif</Badge>
      </div>
      <span class="w-[120px] text-xs font-body text-font-tertiary font-mono">{{ sub.discountCode || '—' }}</span>
      <div class="w-[70px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="w-4 h-4 text-font-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem v-if="sub.isActive" @click="emit('unsubscribe', sub.id)">Désabonner</DropdownMenuItem>
            <DropdownMenuItem :destructive="true" @click="emit('delete', sub.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
