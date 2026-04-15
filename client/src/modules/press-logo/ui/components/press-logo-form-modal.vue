<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PressLogoDomainModel } from '@/modules/press-logo/core/model/press-logo.domain-model'
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
  editingPressLogo: PressLogoDomainModel.PressLogoOverviewDto | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: PressLogoDomainModel.CreatePressLogoDto]
}>()

const name = ref('')
const logoUrl = ref('')
const link = ref('')
const position = ref(0)

function handleSave() {
  emit('save', {
    name: name.value,
    logoUrl: logoUrl.value,
    link: link.value,
    position: position.value,
  })
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      if (props.editingPressLogo) {
        const p = props.editingPressLogo
        name.value = p.name
        logoUrl.value = p.logoUrl
        link.value = p.link
        position.value = p.position
      } else {
        name.value = ''
        logoUrl.value = ''
        link.value = ''
        position.value = 0
      }
    }
  }
)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ editingPressLogo ? 'Modifier un logo' : 'Ajouter un logo' }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div>
          <Label>Nom</Label>
          <Input v-model="name" placeholder="Nom de la publication" />
        </div>

        <div>
          <Label>URL du logo</Label>
          <Input v-model="logoUrl" placeholder="https://..." />
        </div>

        <div>
          <Label>Lien</Label>
          <Input v-model="link" placeholder="https://..." />
        </div>

        <div>
          <Label>Position</Label>
          <Input v-model.number="position" type="number" min="0" />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Annuler</Button>
        <Button @click="handleSave">Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
