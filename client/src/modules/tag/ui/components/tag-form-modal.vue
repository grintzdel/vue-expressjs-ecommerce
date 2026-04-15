<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'
import Dialog from '@/ui/dialog.vue'
import DialogContent from '@/ui/dialog-content.vue'
import DialogHeader from '@/ui/dialog-header.vue'
import DialogTitle from '@/ui/dialog-title.vue'
import DialogFooter from '@/ui/dialog-footer.vue'
import Input from '@/ui/input.vue'
import Label from '@/ui/label.vue'
import Button from '@/ui/button.vue'

const props = defineProps<{
  open: boolean
  editingTag: TagDomainModel.TagOverviewDto | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: { name: string; slug: string }]
}>()

const name = ref('')
const slug = ref('')
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
  if (!slugManuallyEdited.value && !props.editingTag) {
    slug.value = generateSlug(name.value)
  }
}

function onSlugInput() {
  slugManuallyEdited.value = true
}

function handleSave() {
  emit('save', { name: name.value, slug: slug.value })
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      if (props.editingTag) {
        name.value = props.editingTag.name
        slug.value = props.editingTag.slug
        slugManuallyEdited.value = true
      } else {
        name.value = ''
        slug.value = ''
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
        <DialogTitle>{{ editingTag ? 'Modifier un tag' : 'Ajouter un tag' }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div>
          <Label>Nom</Label>
          <Input v-model="name" placeholder="Nom du tag" @input="onNameInput" />
        </div>
        <div>
          <Label>Slug</Label>
          <Input v-model="slug" placeholder="slug-du-tag" @input="onSlugInput" />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Annuler</Button>
        <Button @click="handleSave">Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
