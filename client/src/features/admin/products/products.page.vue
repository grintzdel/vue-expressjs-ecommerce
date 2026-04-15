<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useGetProducts } from '@/modules/product/ui/hooks/queries/query/use-get-products'
import { useGetCategories } from '@/modules/category/ui/hooks/queries/query/use-get-categories'
import { useGetTags } from '@/modules/tag/ui/hooks/queries/query/use-get-tags'
import { useGetSkinTypes } from '@/modules/skin-type/ui/hooks/queries/query/use-get-skin-types'
import { useCreateProduct } from '@/modules/product/ui/hooks/queries/mutation/use-create-product'
import { useUpdateProduct } from '@/modules/product/ui/hooks/queries/mutation/use-update-product'
import { useDeleteProduct } from '@/modules/product/ui/hooks/queries/mutation/use-delete-product'
import ProductTable from '@/modules/product/ui/components/product-table.vue'
import ProductFormModal from '@/modules/product/ui/components/product-form-modal.vue'
import type { ProductDomainModel } from '@/modules/product/core/model/product.domain-model'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'
import Button from '@/ui/button.vue'
import Select from '@/ui/select.vue'

const { data: products, isLoading } = useGetProducts()
const { data: categories } = useGetCategories()
const { data: tags } = useGetTags()
const { data: skinTypes } = useGetSkinTypes()
const createProduct = useCreateProduct()
const updateProduct = useUpdateProduct()
const deleteProduct = useDeleteProduct()

const search = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const editingProduct = ref<ProductDomainModel.ProductOverviewDto | null>(null)

const filteredProducts = computed(() => {
  if (!products.value) return []
  let result = products.value

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }

  if (filterCategory.value) {
    result = result.filter(p => p.categoryId === filterCategory.value)
  }

  if (filterStatus.value === 'active') {
    result = result.filter(p => p.stockQuantity > 0)
  } else if (filterStatus.value === 'out') {
    result = result.filter(p => p.stockQuantity === 0)
  }

  return result
})

function openAdd() { editingProduct.value = null; showModal.value = true }
function openEdit(product: ProductDomainModel.ProductOverviewDto) { editingProduct.value = product; showModal.value = true }

async function handleSave(data: ProductDomainModel.CreateProductDto) {
  if (editingProduct.value) { await updateProduct.mutateAsync({ id: editingProduct.value.id, data }) }
  else { await createProduct.mutateAsync(data) }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (confirm('Supprimer ce produit ?')) { await deleteProduct.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Produits" description="Gérez votre catalogue de produits">
      <Button @click="openAdd">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter
      </Button>
    </PageHeader>
    <div class="flex items-center gap-3 mb-6 flex-wrap">
      <SearchInput v-model="search" placeholder="Rechercher..." class="w-[300px]" />
      <Select v-model="filterCategory" class="h-9">
        <option value="">Toutes les catégories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </Select>
      <Select v-model="filterStatus" class="h-9">
        <option value="">Tous les statuts</option>
        <option value="active">En stock</option>
        <option value="out">Rupture</option>
      </Select>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredProducts.length }} produits</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <ProductTable v-else :products="filteredProducts" :categories="categories || []" @edit="openEdit" @delete="handleDelete" />
    <ProductFormModal
      v-model:open="showModal"
      :editing-product="editingProduct"
      :categories="categories || []"
      :tags="tags || []"
      :skin-types="skinTypes || []"
      @save="handleSave"
    />
  </div>
</template>
