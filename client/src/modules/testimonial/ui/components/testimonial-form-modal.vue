<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TestimonialDomainModel } from '@/modules/testimonial/core/model/testimonial.domain-model'
import Dialog from '@/ui/dialog.vue'
import DialogContent from '@/ui/dialog-content.vue'
import DialogHeader from '@/ui/dialog-header.vue'
import DialogTitle from '@/ui/dialog-title.vue'
import DialogFooter from '@/ui/dialog-footer.vue'
import Input from '@/ui/input.vue'
import Textarea from '@/ui/textarea.vue'
import Label from '@/ui/label.vue'
import Button from '@/ui/button.vue'
import Select from '@/ui/select.vue'
import Checkbox from '@/ui/checkbox.vue'

const props = defineProps<{
  open: boolean
  editingTestimonial: TestimonialDomainModel.TestimonialOverviewDto | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: TestimonialDomainModel.CreateTestimonialDto]
}>()

const authorName = ref('')
const content = ref('')
const rating = ref(5)
const isFeatured = ref(false)

function handleSave() {
  emit('save', {
    authorName: authorName.value,
    content: content.value,
    rating: rating.value,
    isFeatured: isFeatured.value,
  })
}

function ratingLabel(r: number): string {
  return `${'★'.repeat(r)}${'☆'.repeat(5 - r)} (${r}/5)`
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      if (props.editingTestimonial) {
        const t = props.editingTestimonial
        authorName.value = t.authorName
        content.value = t.content
        rating.value = t.rating
        isFeatured.value = t.isFeatured
      } else {
        authorName.value = ''
        content.value = ''
        rating.value = 5
        isFeatured.value = false
      }
    }
  }
)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ editingTestimonial ? 'Modifier un témoignage' : 'Ajouter un témoignage' }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div>
          <Label>Nom du client</Label>
          <Input v-model="authorName" placeholder="Nom du client" />
        </div>

        <div>
          <Label>Commentaire</Label>
          <Textarea v-model="content" :rows="4" placeholder="Commentaire du client" />
        </div>

        <div>
          <Label>Note</Label>
          <Select v-model.number="rating">
            <option v-for="r in [1, 2, 3, 4, 5]" :key="r" :value="r">{{ ratingLabel(r) }}</option>
          </Select>
        </div>

        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <Checkbox v-model="isFeatured" />
            <span class="text-sm font-body text-font-primary">Témoignage vedette</span>
          </label>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Annuler</Button>
        <Button @click="handleSave">Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
