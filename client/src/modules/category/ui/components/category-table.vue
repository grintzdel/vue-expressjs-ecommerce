<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import type { CategoryDomainModel } from '@/modules/category/core/model/category.domain-model'
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
  categories: CategoryDomainModel.CategoryOverviewDto[]
}>()

const emit = defineEmits<{
  edit: [category: CategoryDomainModel.CategoryOverviewDto]
  delete: [id: string]
}>()
</script>

<template>
  <UiTable>
    <TableHeader>
      <span class="flex-1">NOM</span>
      <span class="w-[150px]">SLUG</span>
      <span class="w-[250px]">DESCRIPTION</span>
      <span class="w-[90px]">STATUT</span>
      <span class="w-[70px]">ACTIONS</span>
    </TableHeader>
    <TableEmpty v-if="categories.length === 0">Aucune catégorie trouvée</TableEmpty>
    <TableRow v-for="category in categories" :key="category.id">
      <span class="flex-1 text-[13px] font-body font-medium text-font-primary">{{ category.name }}</span>
      <span class="w-[150px] text-xs font-body text-font-tertiary">{{ category.slug }}</span>
      <span class="w-[250px] text-xs font-body text-font-tertiary truncate pr-4">{{ category.description || '—' }}</span>
      <div class="w-[90px]">
        <Badge variant="success">Actif</Badge>
      </div>
      <div class="w-[70px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="w-4 h-4 text-font-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="emit('edit', category)">Modifier</DropdownMenuItem>
            <DropdownMenuItem :destructive="true" @click="emit('delete', category.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
