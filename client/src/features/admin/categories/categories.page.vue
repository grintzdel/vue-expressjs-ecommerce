<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useGetCategories } from '@/modules/category/ui/hooks/queries/query/use-get-categories'
import { useCreateCategory } from '@/modules/category/ui/hooks/queries/mutation/use-create-category'
import { useUpdateCategory } from '@/modules/category/ui/hooks/queries/mutation/use-update-category'
import { useDeleteCategory } from '@/modules/category/ui/hooks/queries/mutation/use-delete-category'
import CategoryTable from '@/modules/category/ui/components/category-table.vue'
import CategoryFormModal from '@/modules/category/ui/components/category-form-modal.vue'
import type { CategoryDomainModel } from '@/modules/category/core/model/category.domain-model'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'
import Button from '@/ui/button.vue'

const { data: categories, isLoading } = useGetCategories()
const createCategory = useCreateCategory()
const updateCategory = useUpdateCategory()
const deleteCategory = useDeleteCategory()

const search = ref('')
const showModal = ref(false)
const editingCategory = ref<CategoryDomainModel.CategoryOverviewDto | null>(null)

const filteredCategories = computed(() => {
  if (!categories.value) return []
  if (!search.value) return categories.value
  const q = search.value.toLowerCase()
  return categories.value.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
})

function openAdd() { editingCategory.value = null; showModal.value = true }
function openEdit(category: CategoryDomainModel.CategoryOverviewDto) { editingCategory.value = category; showModal.value = true }

async function handleSave(data: { name: string; slug: string; description: string }) {
  if (editingCategory.value) { await updateCategory.mutateAsync({ id: editingCategory.value.id, data }) }
  else { await createCategory.mutateAsync(data) }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (confirm('Supprimer cette catégorie ?')) { await deleteCategory.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Catégories" description="Organisez vos produits par catégorie">
      <Button @click="openAdd">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter
      </Button>
    </PageHeader>
    <div class="flex items-center gap-3 mb-6">
      <SearchInput v-model="search" placeholder="Rechercher..." class="w-[300px]" />
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredCategories.length }} catégories</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <CategoryTable v-else :categories="filteredCategories" @edit="openEdit" @delete="handleDelete" />
    <CategoryFormModal v-model:open="showModal" :editing-category="editingCategory" @save="handleSave" />
  </div>
</template>
