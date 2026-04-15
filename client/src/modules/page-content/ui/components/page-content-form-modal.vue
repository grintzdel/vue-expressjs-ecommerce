<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PageContentDomainModel } from '@/modules/page-content/core/model/page-content.domain-model'
import Dialog from '@/ui/dialog.vue'
import DialogContent from '@/ui/dialog-content.vue'
import DialogHeader from '@/ui/dialog-header.vue'
import DialogTitle from '@/ui/dialog-title.vue'
import DialogFooter from '@/ui/dialog-footer.vue'
import Input from '@/ui/input.vue'
import Textarea from '@/ui/textarea.vue'
import Label from '@/ui/label.vue'
import Button from '@/ui/button.vue'
import Checkbox from '@/ui/checkbox.vue'

const props = defineProps<{
  open: boolean
  editingPageContent: PageContentDomainModel.PageContentOverviewDto | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: PageContentDomainModel.CreatePageContentDto]
}>()

const title = ref('')
const slug = ref('')
const content = ref('')
const seoTitle = ref('')
const seoDescription = ref('')
const isPublished = ref(false)
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

function onTitleInput() {
  if (!slugManuallyEdited.value && !props.editingPageContent) {
    slug.value = generateSlug(title.value)
  }
}

function onSlugInput() {
  slugManuallyEdited.value = true
}

function handleSave() {
  emit('save', {
    title: title.value,
    slug: slug.value,
    content: content.value,
    seoMeta: {
      title: seoTitle.value,
      description: seoDescription.value,
    },
    isPublished: isPublished.value,
  })
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      if (props.editingPageContent) {
        const p = props.editingPageContent
        title.value = p.title
        slug.value = p.slug
        content.value = p.content
        seoTitle.value = p.seoMeta.title
        seoDescription.value = p.seoMeta.description
        isPublished.value = p.isPublished
        slugManuallyEdited.value = true
      } else {
        title.value = ''
        slug.value = ''
        content.value = ''
        seoTitle.value = ''
        seoDescription.value = ''
        isPublished.value = false
        slugManuallyEdited.value = false
      }
    }
  }
)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ editingPageContent ? 'Modifier une page' : 'Ajouter une page' }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div>
          <Label>Titre</Label>
          <Input v-model="title" placeholder="Titre de la page" @input="onTitleInput" />
        </div>

        <div>
          <Label>Slug</Label>
          <Input v-model="slug" placeholder="slug-de-la-page" @input="onSlugInput" />
        </div>

        <div>
          <Label>Contenu</Label>
          <Textarea v-model="content" :rows="6" placeholder="Contenu de la page" />
        </div>

        <div>
          <Label>Titre SEO</Label>
          <Input v-model="seoTitle" placeholder="Titre pour les moteurs de recherche" />
        </div>

        <div>
          <Label>Description SEO</Label>
          <Textarea v-model="seoDescription" :rows="3" placeholder="Description pour les moteurs de recherche" />
        </div>

        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <Checkbox v-model="isPublished" />
            <span class="text-sm font-body text-font-primary">Publier la page</span>
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
