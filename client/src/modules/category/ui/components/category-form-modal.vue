<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CategoryDomainModel } from '@/modules/category/core/model/category.domain-model'
import Dialog from '@/ui/dialog.vue'
import DialogContent from '@/ui/dialog-content.vue'
import DialogHeader from '@/ui/dialog-header.vue'
import DialogTitle from '@/ui/dialog-title.vue'
import DialogFooter from '@/ui/dialog-footer.vue'
import Input from '@/ui/input.vue'
import Textarea from '@/ui/textarea.vue'
import Label from '@/ui/label.vue'
import Button from '@/ui/button.vue'

const props = defineProps<{
  open: boolean
  editingCategory: CategoryDomainModel.CategoryOverviewDto | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: { name: string; slug: string; description: string }]
}>()

const name = ref('')
const slug = ref('')
const description = ref('')
const slugManuallyEdited = ref(false)

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function onNameInput() {
  if (!slugManuallyEdited.value && !props.editingCategory) {
    slug.value = generateSlug(name.value)
  }
}

function onSlugInput() {
  slugManuallyEdited.value = true
}

function handleSave() {
  emit('save', { name: name.value, slug: slug.value, description: description.value })
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      if (props.editingCategory) {
        name.value = props.editingCategory.name
        slug.value = props.editingCategory.slug
        description.value = props.editingCategory.description || ''
        slugManuallyEdited.value = true
      } else {
        name.value = ''
        slug.value = ''
        description.value = ''
        slugManuallyEdited.value = false
      }
    }
  }
)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ editingCategory ? 'Modifier une catégorie' : 'Ajouter une catégorie' }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div>
          <Label>Nom</Label>
          <Input v-model="name" placeholder="Nom de la catégorie" @input="onNameInput" />
        </div>
        <div>
          <Label>Slug</Label>
          <Input v-model="slug" placeholder="slug-de-la-categorie" @input="onSlugInput" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea v-model="description" :rows="3" placeholder="Description de la catégorie" />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Annuler</Button>
        <Button @click="handleSave">Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
