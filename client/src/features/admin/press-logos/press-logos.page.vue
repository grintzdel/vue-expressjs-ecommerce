<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useGetPressLogos } from '@/modules/press-logo/ui/hooks/queries/query/use-get-press-logos'
import { useCreatePressLogo } from '@/modules/press-logo/ui/hooks/queries/mutation/use-create-press-logo'
import { useUpdatePressLogo } from '@/modules/press-logo/ui/hooks/queries/mutation/use-update-press-logo'
import { useDeletePressLogo } from '@/modules/press-logo/ui/hooks/queries/mutation/use-delete-press-logo'
import PressLogoTable from '@/modules/press-logo/ui/components/press-logo-table.vue'
import PressLogoFormModal from '@/modules/press-logo/ui/components/press-logo-form-modal.vue'
import type { PressLogoDomainModel } from '@/modules/press-logo/core/model/press-logo.domain-model'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'
import Button from '@/ui/button.vue'

const { data: pressLogos, isLoading } = useGetPressLogos()
const createPressLogo = useCreatePressLogo()
const updatePressLogo = useUpdatePressLogo()
const deletePressLogo = useDeletePressLogo()

const search = ref('')
const showModal = ref(false)
const editingPressLogo = ref<PressLogoDomainModel.PressLogoOverviewDto | null>(null)

const filteredPressLogos = computed(() => {
  if (!pressLogos.value) return []
  if (!search.value) return pressLogos.value
  const q = search.value.toLowerCase()
  return pressLogos.value.filter(l => l.name.toLowerCase().includes(q))
})

function openAdd() { editingPressLogo.value = null; showModal.value = true }
function openEdit(logo: PressLogoDomainModel.PressLogoOverviewDto) { editingPressLogo.value = logo; showModal.value = true }

async function handleSave(data: PressLogoDomainModel.CreatePressLogoDto) {
  if (editingPressLogo.value) { await updatePressLogo.mutateAsync({ id: editingPressLogo.value.id, data }) }
  else { await createPressLogo.mutateAsync(data) }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (confirm('Supprimer ce logo presse ?')) { await deletePressLogo.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Press Logos" description="Gérez les logos presse">
      <Button @click="openAdd">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter
      </Button>
    </PageHeader>
    <div class="flex items-center gap-3 mb-6">
      <SearchInput v-model="search" placeholder="Rechercher..." class="w-[300px]" />
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredPressLogos.length }} logos</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <PressLogoTable v-else :press-logos="filteredPressLogos" @edit="openEdit" @delete="handleDelete" />
    <PressLogoFormModal v-model:open="showModal" :editing-press-logo="editingPressLogo" @save="handleSave" />
  </div>
</template>
