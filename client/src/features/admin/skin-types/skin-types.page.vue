<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useGetSkinTypes } from '@/modules/skin-type/ui/hooks/queries/query/use-get-skin-types'
import { useCreateSkinType } from '@/modules/skin-type/ui/hooks/queries/mutation/use-create-skin-type'
import { useUpdateSkinType } from '@/modules/skin-type/ui/hooks/queries/mutation/use-update-skin-type'
import { useDeleteSkinType } from '@/modules/skin-type/ui/hooks/queries/mutation/use-delete-skin-type'
import SkinTypeTable from '@/modules/skin-type/ui/components/skin-type-table.vue'
import SkinTypeFormModal from '@/modules/skin-type/ui/components/skin-type-form-modal.vue'
import type { SkinTypeDomainModel } from '@/modules/skin-type/core/model/skin-type.domain-model'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'
import Button from '@/ui/button.vue'

const { data: skinTypes, isLoading } = useGetSkinTypes()
const createSkinType = useCreateSkinType()
const updateSkinType = useUpdateSkinType()
const deleteSkinType = useDeleteSkinType()

const search = ref('')
const showModal = ref(false)
const editingSkinType = ref<SkinTypeDomainModel.SkinTypeOverviewDto | null>(null)

const filteredSkinTypes = computed(() => {
  if (!skinTypes.value) return []
  if (!search.value) return skinTypes.value
  const q = search.value.toLowerCase()
  return skinTypes.value.filter(s => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q))
})

function openAdd() { editingSkinType.value = null; showModal.value = true }
function openEdit(skinType: SkinTypeDomainModel.SkinTypeOverviewDto) { editingSkinType.value = skinType; showModal.value = true }

async function handleSave(data: SkinTypeDomainModel.CreateSkinTypeDto) {
  if (editingSkinType.value) { await updateSkinType.mutateAsync({ id: editingSkinType.value.id, data }) }
  else { await createSkinType.mutateAsync(data) }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (confirm('Supprimer ce type de peau ?')) { await deleteSkinType.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Types de peau" description="Gérez les types de peau">
      <Button @click="openAdd">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter
      </Button>
    </PageHeader>
    <div class="flex items-center gap-3 mb-6">
      <SearchInput v-model="search" placeholder="Rechercher..." class="w-[300px]" />
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredSkinTypes.length }} types</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <SkinTypeTable v-else :skin-types="filteredSkinTypes" @edit="openEdit" @delete="handleDelete" />
    <SkinTypeFormModal v-model:open="showModal" :editing-skin-type="editingSkinType" @save="handleSave" />
  </div>
</template>
