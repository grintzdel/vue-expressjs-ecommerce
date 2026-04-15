<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGetSubscriptions } from '@/modules/newsletter/ui/hooks/queries/query/use-get-subscriptions'
import { useUnsubscribe } from '@/modules/newsletter/ui/hooks/queries/mutation/use-unsubscribe'
import { useDeleteSubscription } from '@/modules/newsletter/ui/hooks/queries/mutation/use-delete-subscription'
import NewsletterTable from '@/modules/newsletter/ui/components/newsletter-table.vue'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'

const { data: subscriptions, isLoading } = useGetSubscriptions()
const unsubscribe = useUnsubscribe()
const deleteSubscription = useDeleteSubscription()

const search = ref('')

const filteredSubscriptions = computed(() => {
  if (!subscriptions.value) return []
  if (!search.value) return subscriptions.value
  const q = search.value.toLowerCase()
  return subscriptions.value.filter(s => s.email.toLowerCase().includes(q))
})

async function handleUnsubscribe(id: string) {
  const sub = subscriptions.value?.find(s => s.id === id)
  if (sub && confirm(`Désabonner ${sub.email} ?`)) { await unsubscribe.mutateAsync(sub.email) }
}

async function handleDelete(id: string) {
  if (confirm('Supprimer cet abonné ?')) { await deleteSubscription.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Newsletter" description="Gérez les abonnements newsletter" />
    <div class="flex items-center gap-3 mb-6">
      <SearchInput v-model="search" placeholder="Rechercher par email..." class="w-[300px]" />
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredSubscriptions.length }} abonnés</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <NewsletterTable
      v-else
      :subscriptions="filteredSubscriptions"
      @unsubscribe="handleUnsubscribe"
      @delete="handleDelete"
    />
  </div>
</template>
