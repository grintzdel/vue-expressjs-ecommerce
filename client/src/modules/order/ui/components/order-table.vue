<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import type { OrderDomainModel } from '@/modules/order/core/model/order.domain-model'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  ORDER_STATUSES,
} from '@/modules/order/core/constants/order-status.constant'
import UiTable from '@/ui/table.vue'
import TableHeader from '@/ui/table-header.vue'
import TableRow from '@/ui/table-row.vue'
import TableEmpty from '@/ui/table-empty.vue'
import DropdownMenu from '@/ui/dropdown-menu.vue'
import DropdownMenuTrigger from '@/ui/dropdown-menu-trigger.vue'
import DropdownMenuContent from '@/ui/dropdown-menu-content.vue'
import DropdownMenuItem from '@/ui/dropdown-menu-item.vue'
import Button from '@/ui/button.vue'

defineProps<{
  orders: OrderDomainModel.OrderOverviewDto[]
}>()

const emit = defineEmits<{
  updateStatus: [id: string, status: string]
  delete: [id: string]
}>()

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

function formatTotal(amount: number, currency: string): string {
  return `${currency}${amount.toFixed(2)}`
}

function formatOrderNumber(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`
}

function formatItems(items: OrderDomainModel.OrderItemDto[]): string {
  return items.map((item) => `${item.productName} ×${item.quantity}`).join(', ')
}

function getStatusStyle(status: string): { bg: string; text: string } {
  return (ORDER_STATUS_STYLES as Record<string, { bg: string; text: string }>)[status] || { bg: '#F0F0F0', text: '#666' }
}

function getStatusLabel(status: string): string {
  return (ORDER_STATUS_LABELS as Record<string, string>)[status] || status
}
</script>

<template>
  <UiTable>
    <TableHeader>
      <span class="w-[120px]">COMMANDE</span>
      <span class="flex-1">PRODUITS</span>
      <span class="w-[90px]">TOTAL</span>
      <span class="w-[110px]">STATUT</span>
      <span class="w-[90px]">DATE</span>
      <span class="w-[70px]">ACTIONS</span>
    </TableHeader>
    <TableEmpty v-if="orders.length === 0">Aucune commande trouvée</TableEmpty>
    <TableRow v-for="order in orders" :key="order.id">
      <span class="w-[120px] text-[13px] font-body font-medium text-font-primary">{{ formatOrderNumber(order.id) }}</span>
      <span class="flex-1 text-xs font-body text-font-tertiary truncate pr-4">{{ formatItems(order.items) }}</span>
      <span class="w-[90px] text-[13px] font-body font-medium text-font-primary">{{ formatTotal(order.totalAmount, order.currency) }}</span>
      <div class="w-[110px]">
        <select
          :value="order.status"
          class="w-full text-[11px] font-semibold font-body px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer"
          :style="{ backgroundColor: getStatusStyle(order.status).bg, color: getStatusStyle(order.status).text }"
          @change="emit('updateStatus', order.id, ($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="status in ORDER_STATUSES"
            :key="status"
            :value="status"
          >
            {{ getStatusLabel(status) }}
          </option>
        </select>
      </div>
      <span class="w-[90px] text-xs font-body text-font-tertiary">{{ formatDate(order.createdAt) }}</span>
      <div class="w-[70px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="w-4 h-4 text-font-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem :destructive="true" @click="emit('delete', order.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
