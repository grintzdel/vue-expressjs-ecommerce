<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'
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
  tags: TagDomainModel.TagOverviewDto[]
}>()

const emit = defineEmits<{
  edit: [tag: TagDomainModel.TagOverviewDto]
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
    <TableEmpty v-if="tags.length === 0">Aucun tag trouvé</TableEmpty>
    <TableRow v-for="tag in tags" :key="tag.id">
      <span class="flex-1 text-[13px] font-body font-medium text-font-primary">{{ tag.name }}</span>
      <span class="w-[200px] text-xs font-body text-font-tertiary">{{ tag.slug }}</span>
      <div class="w-[70px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="w-4 h-4 text-font-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="emit('edit', tag)">Modifier</DropdownMenuItem>
            <DropdownMenuItem :destructive="true" @click="emit('delete', tag.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
