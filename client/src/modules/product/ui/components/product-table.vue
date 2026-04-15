<script setup lang="ts">
import { MoreHorizontal, ImageIcon } from 'lucide-vue-next'
import type { ProductDomainModel } from '@/modules/product/core/model/product.domain-model'
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

const props = defineProps<{
  products: ProductDomainModel.ProductOverviewDto[]
  categories: CategoryDomainModel.CategoryOverviewDto[]
}>()

const emit = defineEmits<{
  edit: [product: ProductDomainModel.ProductOverviewDto]
  delete: [id: string]
}>()

function getCategoryName(categoryId: string | undefined): string {
  if (!categoryId) return '—'
  const category = props.categories.find((c) => c.id === categoryId)
  return category ? category.name : '—'
}

function formatPrice(price: number, currency: string): string {
  return `${currency}${price.toFixed(2)}`
}
</script>

<template>
  <UiTable>
    <TableHeader>
      <span class="w-[60px]">IMAGE</span>
      <span class="flex-1">NOM</span>
      <span class="w-[120px]">CATEGORIE</span>
      <span class="w-[80px]">PRIX</span>
      <span class="w-[80px]">STOCK</span>
      <span class="w-[90px]">STATUT</span>
      <span class="w-[70px]">ACTIONS</span>
    </TableHeader>
    <TableEmpty v-if="products.length === 0">Aucun produit trouvé</TableEmpty>
    <TableRow v-for="product in products" :key="product.id" class="h-[52px]">
      <div class="w-[60px]">
        <img
          v-if="product.images && product.images.length > 0"
          :src="product.images[0].url"
          :alt="product.name"
          class="w-9 h-9 object-cover rounded-lg"
        />
        <div v-else class="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
          <ImageIcon class="w-3.5 h-3.5 text-font-tertiary" />
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-[13px] font-body font-medium text-font-primary truncate">{{ product.name }}</div>
        <div class="text-xs font-body text-font-tertiary">{{ getCategoryName(product.categoryId) }}</div>
      </div>
      <span class="w-[120px] text-xs font-body text-font-tertiary">{{ getCategoryName(product.categoryId) }}</span>
      <span class="w-[80px] text-[13px] font-body font-medium text-font-primary">{{ formatPrice(product.price, product.currency) }}</span>
      <span class="w-[80px] text-[13px] font-body text-font-primary">{{ product.stockQuantity }}</span>
      <div class="w-[90px]">
        <Badge v-if="product.stockQuantity > 0" variant="success">Actif</Badge>
        <Badge v-else variant="destructive">Rupture</Badge>
      </div>
      <div class="w-[70px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="w-4 h-4 text-font-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="emit('edit', product)">Modifier</DropdownMenuItem>
            <DropdownMenuItem :destructive="true" @click="emit('delete', product.id)">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableRow>
  </UiTable>
</template>
