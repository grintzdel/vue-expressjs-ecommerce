<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import type { PageContentDomainModel } from '@/modules/page-content/core/model/page-content.domain-model'
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
  pageContents: PageContentDomainModel.PageContentOverviewDto[]
}>()

const emit = defineEmits<{
  edit: [pageContent: PageContentDomainModel.PageContentOverviewDto]
  delete: [id: string]
}>()
</script>

<template>
  <UiTable>
    <TableHeader>
      <span class="flex-1">TITRE</span>
      <span class="w-[150px]">SLUG</span>
      <span class="w-[90px]">STATUT</span>
      <span class="w-[70px]">ACTIONS</span>
    </TableHeader>
    <TableEmpty v-if="pageContents.length === 0">Aucune page trouvée</TableEmpty>
    <TableRow v-for="page in pageContents" :key="page.id">
      <span class="flex-1 text-[13px] font-body font-medium text-font-primary">{{ page.title }}</span>
      <span class="w-[150px] text-xs font-body text-font-tertiary">{{ page.slug }}</span>
      <div class="w-[90px]">
        <Badge v-if="page.isPublished" variant="success">Publié</Badge>
        <Badge v-else variant="warning">Brouillon</Badge>
      </div>
      <div class="w-[70px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="w-4 h-4 text-font-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="emit('edit', page)">Modifier</DropdownMenuItem>
            <DropdownMenuItem :destructive="true" @click="emit('delete', page.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
