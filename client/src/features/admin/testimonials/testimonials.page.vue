<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useGetTestimonials } from '@/modules/testimonial/ui/hooks/queries/query/use-get-testimonials'
import { useCreateTestimonial } from '@/modules/testimonial/ui/hooks/queries/mutation/use-create-testimonial'
import { useUpdateTestimonial } from '@/modules/testimonial/ui/hooks/queries/mutation/use-update-testimonial'
import { useDeleteTestimonial } from '@/modules/testimonial/ui/hooks/queries/mutation/use-delete-testimonial'
import TestimonialTable from '@/modules/testimonial/ui/components/testimonial-table.vue'
import TestimonialFormModal from '@/modules/testimonial/ui/components/testimonial-form-modal.vue'
import type { TestimonialDomainModel } from '@/modules/testimonial/core/model/testimonial.domain-model'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'
import Button from '@/ui/button.vue'
import Select from '@/ui/select.vue'

const { data: testimonials, isLoading } = useGetTestimonials()
const createTestimonial = useCreateTestimonial()
const updateTestimonial = useUpdateTestimonial()
const deleteTestimonial = useDeleteTestimonial()

const search = ref('')
const filterStatus = ref('')
const filterRating = ref('')
const showModal = ref(false)
const editingTestimonial = ref<TestimonialDomainModel.TestimonialOverviewDto | null>(null)

const filteredTestimonials = computed(() => {
  if (!testimonials.value) return []
  let result = testimonials.value

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(t => t.authorName.toLowerCase().includes(q) || t.content.toLowerCase().includes(q))
  }

  if (filterStatus.value === 'featured') {
    result = result.filter(t => t.isFeatured)
  } else if (filterStatus.value === 'normal') {
    result = result.filter(t => !t.isFeatured)
  }

  if (filterRating.value) {
    result = result.filter(t => t.rating === Number(filterRating.value))
  }

  return result
})

function openAdd() { editingTestimonial.value = null; showModal.value = true }
function openEdit(testimonial: TestimonialDomainModel.TestimonialOverviewDto) { editingTestimonial.value = testimonial; showModal.value = true }

async function handleSave(data: TestimonialDomainModel.CreateTestimonialDto) {
  if (editingTestimonial.value) { await updateTestimonial.mutateAsync({ id: editingTestimonial.value.id, data }) }
  else { await createTestimonial.mutateAsync(data) }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (confirm('Supprimer ce témoignage ?')) { await deleteTestimonial.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Témoignages" description="Gérez les avis de vos clients">
      <Button @click="openAdd">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter
      </Button>
    </PageHeader>
    <div class="flex items-center gap-3 mb-6 flex-wrap">
      <SearchInput v-model="search" placeholder="Rechercher..." class="w-[300px]" />
      <Select v-model="filterStatus" class="h-9">
        <option value="">Tous les statuts</option>
        <option value="featured">Vedette</option>
        <option value="normal">Normal</option>
      </Select>
      <Select v-model="filterRating" class="h-9">
        <option value="">Toutes les notes</option>
        <option v-for="r in [1, 2, 3, 4, 5]" :key="r" :value="r">{{ r }} étoile{{ r > 1 ? 's' : '' }}</option>
      </Select>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredTestimonials.length }} témoignages</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <TestimonialTable v-else :testimonials="filteredTestimonials" @edit="openEdit" @delete="handleDelete" />
    <TestimonialFormModal v-model:open="showModal" :editing-testimonial="editingTestimonial" @save="handleSave" />
  </div>
</template>
