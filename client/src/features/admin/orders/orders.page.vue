<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGetOrders } from '@/modules/order/ui/hooks/queries/query/use-get-orders'
import { useUpdateOrderStatus } from '@/modules/order/ui/hooks/queries/mutation/use-update-order-status'
import { useDeleteOrder } from '@/modules/order/ui/hooks/queries/mutation/use-delete-order'
import OrderTable from '@/modules/order/ui/components/order-table.vue'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'
import Select from '@/ui/select.vue'

const { data: orders, isLoading } = useGetOrders()
const updateOrderStatus = useUpdateOrderStatus()
const deleteOrder = useDeleteOrder()

const search = ref('')
const filterStatus = ref('')

const filteredOrders = computed(() => {
  if (!orders.value) return []
  let result = orders.value

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.items.some(item => item.productName.toLowerCase().includes(q))
    )
  }

  if (filterStatus.value) {
    result = result.filter(o => o.status === filterStatus.value)
  }

  return result
})

async function handleUpdateStatus(id: string, status: string) {
  await updateOrderStatus.mutateAsync({ id, status })
}

async function handleDelete(id: string) {
  if (confirm('Supprimer cette commande ?')) { await deleteOrder.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Commandes" description="Suivez et gérez les commandes" />
    <div class="flex items-center gap-3 mb-6 flex-wrap">
      <SearchInput v-model="search" placeholder="Rechercher..." class="w-[300px]" />
      <Select v-model="filterStatus" class="h-9">
        <option value="">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="processing">En cours</option>
        <option value="shipped">Expédié</option>
        <option value="delivered">Livré</option>
        <option value="cancelled">Annulé</option>
      </Select>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredOrders.length }} commandes</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <OrderTable
      v-else
      :orders="filteredOrders"
      @update-status="handleUpdateStatus"
      @delete="handleDelete"
    />
  </div>
</template>
