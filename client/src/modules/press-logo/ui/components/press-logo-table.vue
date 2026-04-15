<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import type { PressLogoDomainModel } from '@/modules/press-logo/core/model/press-logo.domain-model'
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
  pressLogos: PressLogoDomainModel.PressLogoOverviewDto[]
}>()

const emit = defineEmits<{
  edit: [pressLogo: PressLogoDomainModel.PressLogoOverviewDto]
  delete: [id: string]
}>()
</script>

<template>
  <UiTable>
    <TableHeader>
      <span class="flex-1">NOM</span>
      <span class="w-[80px] text-center">POSITION</span>
      <span class="w-[200px]">URL LOGO</span>
      <span class="w-[70px]">ACTIONS</span>
    </TableHeader>
    <TableEmpty v-if="pressLogos.length === 0">Aucun logo trouvé</TableEmpty>
    <TableRow v-for="logo in pressLogos" :key="logo.id">
      <span class="flex-1 text-[13px] font-body font-medium text-font-primary">{{ logo.name }}</span>
      <span class="w-[80px] text-center text-[13px] font-body text-font-primary">{{ logo.position }}</span>
      <span class="w-[200px] text-xs font-body text-font-tertiary truncate pr-4">{{ logo.logoUrl }}</span>
      <div class="w-[70px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="w-4 h-4 text-font-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="emit('edit', logo)">Modifier</DropdownMenuItem>
            <DropdownMenuItem :destructive="true" @click="emit('delete', logo.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
