<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { ProductDomainModel } from '@/modules/product/core/model/product.domain-model'
import type { CategoryDomainModel } from '@/modules/category/core/model/category.domain-model'
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'
import type { SkinTypeDomainModel } from '@/modules/skin-type/core/model/skin-type.domain-model'
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
  editingProduct: ProductDomainModel.ProductOverviewDto | null
  categories: CategoryDomainModel.CategoryOverviewDto[]
  tags: TagDomainModel.TagOverviewDto[]
  skinTypes: SkinTypeDomainModel.SkinTypeOverviewDto[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: ProductDomainModel.CreateProductDto]
}>()

const name = ref('')
const slug = ref('')
const description = ref('')
const imageUrlInput = ref('')
const images = ref<ProductDomainModel.ProductImage[]>([])
const price = ref(0)
const currency = ref('€')
const categoryId = ref('')
const stockQuantity = ref(0)
const selectedTagIds = ref<string[]>([])
const selectedSkinTypeIds = ref<string[]>([])
const isFeatured = ref(false)
const ingredients = ref('')
const howToUse = ref('')
const shippingInfo = ref('')
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
  if (!slugManuallyEdited.value && !props.editingProduct) {
    slug.value = generateSlug(name.value)
  }
}

function onSlugInput() {
  slugManuallyEdited.value = true
}

function addImage() {
  if (imageUrlInput.value.trim()) {
    images.value.push({
      url: imageUrlInput.value.trim(),
      altText: name.value,
      position: images.value.length,
    })
    imageUrlInput.value = ''
  }
}

function removeImage(index: number) {
  images.value.splice(index, 1)
  images.value.forEach((img, i) => {
    img.position = i
  })
}

function toggleTag(tagId: string) {
  const idx = selectedTagIds.value.indexOf(tagId)
  if (idx === -1) {
    selectedTagIds.value.push(tagId)
  } else {
    selectedTagIds.value.splice(idx, 1)
  }
}

function toggleSkinType(skinTypeId: string) {
  const idx = selectedSkinTypeIds.value.indexOf(skinTypeId)
  if (idx === -1) {
    selectedSkinTypeIds.value.push(skinTypeId)
  } else {
    selectedSkinTypeIds.value.splice(idx, 1)
  }
}

function handleSave() {
  emit('save', {
    name: name.value,
    slug: slug.value,
    description: description.value,
    images: images.value,
    price: price.value,
    currency: currency.value,
    categoryId: categoryId.value || undefined,
    stockQuantity: stockQuantity.value,
    tagIds: selectedTagIds.value,
    skinTypeIds: selectedSkinTypeIds.value,
    isFeatured: isFeatured.value,
    ingredients: ingredients.value || undefined,
    howToUse: howToUse.value || undefined,
    shippingInfo: shippingInfo.value || undefined,
  })
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      if (props.editingProduct) {
        const p = props.editingProduct
        name.value = p.name
        slug.value = p.slug
        description.value = p.description || ''
        images.value = p.images ? [...p.images] : []
        price.value = p.price
        currency.value = p.currency
        categoryId.value = p.categoryId || ''
        stockQuantity.value = p.stockQuantity
        selectedTagIds.value = p.tagIds ? [...p.tagIds] : []
        selectedSkinTypeIds.value = p.skinTypeIds ? [...p.skinTypeIds] : []
        isFeatured.value = p.isFeatured
        ingredients.value = p.ingredients || ''
        howToUse.value = p.howToUse || ''
        shippingInfo.value = p.shippingInfo || ''
        slugManuallyEdited.value = true
      } else {
        name.value = ''
        slug.value = ''
        description.value = ''
        images.value = []
        imageUrlInput.value = ''
        price.value = 0
        currency.value = '€'
        categoryId.value = ''
        stockQuantity.value = 0
        selectedTagIds.value = []
        selectedSkinTypeIds.value = []
        isFeatured.value = false
        ingredients.value = ''
        howToUse.value = ''
        shippingInfo.value = ''
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
        <DialogTitle>{{ editingProduct ? 'Modifier un produit' : 'Ajouter un produit' }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div>
          <Label>Nom</Label>
          <Input v-model="name" placeholder="Nom du produit" @input="onNameInput" />
        </div>

        <div>
          <Label>Slug</Label>
          <Input v-model="slug" placeholder="slug-du-produit" @input="onSlugInput" />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea v-model="description" :rows="3" placeholder="Description du produit" />
        </div>

        <div>
          <Label>Images</Label>
          <div class="flex gap-2 mb-2">
            <Input
              v-model="imageUrlInput"
              placeholder="URL de l'image"
              class="flex-1"
              @keyup.enter="addImage"
            />
            <Button type="button" @click="addImage">Ajouter</Button>
          </div>
          <div v-if="images.length > 0" class="space-y-1.5">
            <div
              v-for="(img, idx) in images"
              :key="idx"
              class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
            >
              <img :src="img.url" :alt="img.altText" class="w-8 h-8 object-cover rounded" />
              <span class="flex-1 text-xs font-body text-font-tertiary truncate">{{ img.url }}</span>
              <Button variant="ghost" size="icon" class="h-6 w-6" type="button" @click="removeImage(idx)">
                <X class="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <Label>Prix</Label>
            <Input v-model.number="price" type="number" min="0" step="0.01" />
          </div>
          <div>
            <Label>Devise</Label>
            <Input v-model="currency" />
          </div>
        </div>

        <div>
          <Label>Catégorie</Label>
          <Select v-model="categoryId">
            <option value="">Sélectionner une catégorie</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </Select>
        </div>

        <div>
          <Label>Stock</Label>
          <Input v-model.number="stockQuantity" type="number" min="0" />
        </div>

        <div v-if="tags.length > 0">
          <Label>Tags</Label>
          <div class="flex flex-wrap gap-3 mt-1.5">
            <label
              v-for="tag in tags"
              :key="tag.id"
              class="flex items-center gap-1.5 cursor-pointer"
            >
              <Checkbox
                :model-value="selectedTagIds.includes(tag.id)"
                @update:model-value="toggleTag(tag.id)"
              />
              <span class="text-sm font-body text-font-primary">{{ tag.name }}</span>
            </label>
          </div>
        </div>

        <div v-if="skinTypes.length > 0">
          <Label>Types de peau</Label>
          <div class="flex flex-wrap gap-3 mt-1.5">
            <label
              v-for="skinType in skinTypes"
              :key="skinType.id"
              class="flex items-center gap-1.5 cursor-pointer"
            >
              <Checkbox
                :model-value="selectedSkinTypeIds.includes(skinType.id)"
                @update:model-value="toggleSkinType(skinType.id)"
              />
              <span class="text-sm font-body text-font-primary">{{ skinType.name }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <Checkbox v-model="isFeatured" />
            <span class="text-sm font-body text-font-primary">Produit vedette</span>
          </label>
        </div>

        <div>
          <Label>Ingrédients</Label>
          <Textarea v-model="ingredients" :rows="3" placeholder="Liste des ingrédients" />
        </div>

        <div>
          <Label>Comment utiliser</Label>
          <Textarea v-model="howToUse" :rows="3" placeholder="Instructions d'utilisation" />
        </div>

        <div>
          <Label>Informations de livraison</Label>
          <Textarea v-model="shippingInfo" :rows="3" placeholder="Informations de livraison" />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Annuler</Button>
        <Button @click="handleSave">Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
