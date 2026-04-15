<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import type { UserDomainModel } from '@/modules/user/core/model/user.domain-model'
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
  users: UserDomainModel.UserOverviewDto[]
}>()

const emit = defineEmits<{
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
      <span class="w-[90px]">ROLE</span>
      <span class="w-[120px]">INSCRIPTION</span>
      <span class="w-[70px]">ACTIONS</span>
    </TableHeader>
    <TableEmpty v-if="users.length === 0">Aucun utilisateur trouvé</TableEmpty>
    <TableRow v-for="user in users" :key="user.id">
      <span class="flex-1 text-[13px] font-body font-medium text-font-primary">{{ user.email }}</span>
      <div class="w-[90px]">
        <Badge v-if="user.role === 'admin'" variant="info">Admin</Badge>
        <Badge v-else variant="success">Client</Badge>
      </div>
      <span class="w-[120px] text-xs font-body text-font-tertiary">{{ formatDate(user.createdAt) }}</span>
      <div class="w-[70px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="w-4 h-4 text-font-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem :destructive="true" @click="emit('delete', user.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
