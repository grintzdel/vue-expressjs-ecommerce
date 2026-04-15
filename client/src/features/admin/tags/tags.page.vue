<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useGetTags } from '@/modules/tag/ui/hooks/queries/query/use-get-tags'
import { useCreateTag } from '@/modules/tag/ui/hooks/queries/mutation/use-create-tag'
import { useUpdateTag } from '@/modules/tag/ui/hooks/queries/mutation/use-update-tag'
import { useDeleteTag } from '@/modules/tag/ui/hooks/queries/mutation/use-delete-tag'
import TagTable from '@/modules/tag/ui/components/tag-table.vue'
import TagFormModal from '@/modules/tag/ui/components/tag-form-modal.vue'
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'
import Button from '@/ui/button.vue'

const { data: tags, isLoading } = useGetTags()
const createTag = useCreateTag()
const updateTag = useUpdateTag()
const deleteTag = useDeleteTag()

const search = ref('')
const showModal = ref(false)
const editingTag = ref<TagDomainModel.TagOverviewDto | null>(null)

const filteredTags = computed(() => {
  if (!tags.value) return []
  if (!search.value) return tags.value
  const q = search.value.toLowerCase()
  return tags.value.filter(t => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q))
})

function openAdd() { editingTag.value = null; showModal.value = true }
function openEdit(tag: TagDomainModel.TagOverviewDto) { editingTag.value = tag; showModal.value = true }

async function handleSave(data: TagDomainModel.CreateTagDto) {
  if (editingTag.value) { await updateTag.mutateAsync({ id: editingTag.value.id, data }) }
  else { await createTag.mutateAsync(data) }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (confirm('Supprimer ce tag ?')) { await deleteTag.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Tags" description="Gérez les tags de vos produits">
      <Button @click="openAdd">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter
      </Button>
    </PageHeader>
    <div class="flex items-center gap-3 mb-6">
      <SearchInput v-model="search" placeholder="Rechercher..." class="w-[300px]" />
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredTags.length }} tags</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <TagTable v-else :tags="filteredTags" @edit="openEdit" @delete="handleDelete" />
    <TagFormModal v-model:open="showModal" :editing-tag="editingTag" @save="handleSave" />
  </div>
</template>
