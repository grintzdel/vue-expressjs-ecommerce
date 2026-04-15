<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import type { BlogPostDomainModel } from '@/modules/blog-post/core/model/blog-post.domain-model'
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
  blogPosts: BlogPostDomainModel.BlogPostOverviewDto[]
}>()

const emit = defineEmits<{
  edit: [blogPost: BlogPostDomainModel.BlogPostOverviewDto]
  delete: [id: string]
}>()

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Brouillon'
  const d = new Date(dateStr)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}
</script>

<template>
  <UiTable>
    <TableHeader>
      <span class="flex-1">TITRE</span>
      <span class="w-[120px]">AUTEUR</span>
      <span class="w-[120px]">DATE</span>
      <span class="w-[90px]">STATUT</span>
      <span class="w-[70px]">ACTIONS</span>
    </TableHeader>
    <TableEmpty v-if="blogPosts.length === 0">Aucun article trouvé</TableEmpty>
    <TableRow v-for="post in blogPosts" :key="post.id">
      <span class="flex-1 text-[13px] font-body font-medium text-font-primary truncate pr-4">{{ post.title }}</span>
      <span class="w-[120px] text-xs font-body text-font-tertiary">{{ post.author }}</span>
      <span class="w-[120px] text-xs font-body text-font-tertiary">{{ formatDate(post.publishedAt) }}</span>
      <div class="w-[90px]">
        <Badge v-if="post.publishedAt" variant="success">Publié</Badge>
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
            <DropdownMenuItem @click="emit('edit', post)">Modifier</DropdownMenuItem>
            <DropdownMenuItem :destructive="true" @click="emit('delete', post.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
