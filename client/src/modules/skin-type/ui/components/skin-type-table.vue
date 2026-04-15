<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import type { SkinTypeDomainModel } from '@/modules/skin-type/core/model/skin-type.domain-model'
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
  skinTypes: SkinTypeDomainModel.SkinTypeOverviewDto[]
}>()

const emit = defineEmits<{
  edit: [skinType: SkinTypeDomainModel.SkinTypeOverviewDto]
  delete: [id: string]
}>()
</script>

<template>
  <UiTable>
    <TableHeader>
      <span class="flex-1">NOM</span>
      <span class="w-[200px]">SLUG</span>
      <span class="w-[70px]">ACTIONS</span>
    </TableHeader>
    <TableEmpty v-if="skinTypes.length === 0">Aucun type de peau trouvé</TableEmpty>
    <TableRow v-for="skinType in skinTypes" :key="skinType.id">
      <span class="flex-1 text-[13px] font-body font-medium text-font-primary">{{ skinType.name }}</span>
      <span class="w-[200px] text-xs font-body text-font-tertiary">{{ skinType.slug }}</span>
      <div class="w-[70px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="w-4 h-4 text-font-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="emit('edit', skinType)">Modifier</DropdownMenuItem>
            <DropdownMenuItem :destructive="true" @click="emit('delete', skinType.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
