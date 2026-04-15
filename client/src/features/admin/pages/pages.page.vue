<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useGetPages } from '@/modules/page-content/ui/hooks/queries/query/use-get-pages'
import { useCreatePage } from '@/modules/page-content/ui/hooks/queries/mutation/use-create-page'
import { useUpdatePage } from '@/modules/page-content/ui/hooks/queries/mutation/use-update-page'
import { useDeletePage } from '@/modules/page-content/ui/hooks/queries/mutation/use-delete-page'
import PageContentTable from '@/modules/page-content/ui/components/page-content-table.vue'
import PageContentFormModal from '@/modules/page-content/ui/components/page-content-form-modal.vue'
import type { PageContentDomainModel } from '@/modules/page-content/core/model/page-content.domain-model'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'
import Button from '@/ui/button.vue'

const { data: pages, isLoading } = useGetPages()
const createPage = useCreatePage()
const updatePage = useUpdatePage()
const deletePage = useDeletePage()

const search = ref('')
const showModal = ref(false)
const editingPage = ref<PageContentDomainModel.PageContentOverviewDto | null>(null)

const filteredPages = computed(() => {
  if (!pages.value) return []
  if (!search.value) return pages.value
  const q = search.value.toLowerCase()
  return pages.value.filter(p => p.title.toLowerCase().includes(q))
})

function openAdd() { editingPage.value = null; showModal.value = true }
function openEdit(page: PageContentDomainModel.PageContentOverviewDto) { editingPage.value = page; showModal.value = true }

async function handleSave(data: PageContentDomainModel.CreatePageContentDto) {
  if (editingPage.value) { await updatePage.mutateAsync({ id: editingPage.value.id, data }) }
  else { await createPage.mutateAsync(data) }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (confirm('Supprimer cette page ?')) { await deletePage.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Pages" description="Gérez les pages statiques du site">
      <Button @click="openAdd">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter
      </Button>
    </PageHeader>
    <div class="flex items-center gap-3 mb-6">
      <SearchInput v-model="search" placeholder="Rechercher..." class="w-[300px]" />
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredPages.length }} pages</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <PageContentTable v-else :page-contents="filteredPages" @edit="openEdit" @delete="handleDelete" />
    <PageContentFormModal v-model:open="showModal" :editing-page-content="editingPage" @save="handleSave" />
  </div>
</template>
