<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BlogPostDomainModel } from '@/modules/blog-post/core/model/blog-post.domain-model'
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
  editingBlogPost: BlogPostDomainModel.BlogPostOverviewDto | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: BlogPostDomainModel.CreateBlogPostDto]
}>()

const title = ref('')
const slug = ref('')
const content = ref('')
const excerpt = ref('')
const featuredImage = ref('')
const author = ref('')
const publishedAt = ref('')
const tagsInput = ref('')
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
  if (!slugManuallyEdited.value && !props.editingBlogPost) {
    slug.value = generateSlug(title.value)
  }
}

function onSlugInput() {
  slugManuallyEdited.value = true
}

function handleSave() {
  const tags = tagsInput.value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  emit('save', {
    title: title.value,
    slug: slug.value,
    content: content.value,
    excerpt: excerpt.value,
    featuredImage: featuredImage.value,
    author: author.value,
    publishedAt: publishedAt.value || null,
    tags,
  })
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      if (props.editingBlogPost) {
        const p = props.editingBlogPost
        title.value = p.title
        slug.value = p.slug
        content.value = p.content
        excerpt.value = p.excerpt
        featuredImage.value = p.featuredImage
        author.value = p.author
        publishedAt.value = p.publishedAt ? p.publishedAt.split('T')[0] : ''
        tagsInput.value = p.tags.join(', ')
        slugManuallyEdited.value = true
      } else {
        title.value = ''
        slug.value = ''
        content.value = ''
        excerpt.value = ''
        featuredImage.value = ''
        author.value = ''
        publishedAt.value = ''
        tagsInput.value = ''
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
        <DialogTitle>{{ editingBlogPost ? 'Modifier un article' : 'Ajouter un article' }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div>
          <Label>Titre</Label>
          <Input v-model="title" placeholder="Titre de l'article" @input="onTitleInput" />
        </div>

        <div>
          <Label>Slug</Label>
          <Input v-model="slug" placeholder="slug-de-l-article" @input="onSlugInput" />
        </div>

        <div>
          <Label>Contenu</Label>
          <Textarea v-model="content" :rows="8" placeholder="Contenu de l'article" />
        </div>

        <div>
          <Label>Extrait</Label>
          <Textarea v-model="excerpt" :rows="3" placeholder="Court résumé de l'article" />
        </div>

        <div>
          <Label>Image à la une (URL)</Label>
          <Input v-model="featuredImage" placeholder="https://..." />
        </div>

        <div>
          <Label>Auteur</Label>
          <Input v-model="author" placeholder="Nom de l'auteur" />
        </div>

        <div>
          <Label>Date de publication</Label>
          <Input v-model="publishedAt" type="date" />
        </div>

        <div>
          <Label>Tags (séparés par des virgules)</Label>
          <Input v-model="tagsInput" placeholder="tag1, tag2, tag3" />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Annuler</Button>
        <Button @click="handleSave">Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
