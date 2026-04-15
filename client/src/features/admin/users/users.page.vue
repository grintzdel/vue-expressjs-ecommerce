<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGetUsers } from '@/modules/user/ui/hooks/queries/query/use-get-users'
import { useDeleteUser } from '@/modules/user/ui/hooks/queries/mutation/use-delete-user'
import UserTable from '@/modules/user/ui/components/user-table.vue'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'

const { data: users, isLoading } = useGetUsers()
const deleteUser = useDeleteUser()

const search = ref('')

const filteredUsers = computed(() => {
  if (!users.value) return []
  if (!search.value) return users.value
  const q = search.value.toLowerCase()
  return users.value.filter(u => u.email.toLowerCase().includes(q))
})

async function handleDelete(id: string) {
  if (confirm('Supprimer cet utilisateur ?')) { await deleteUser.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Utilisateurs" description="Consultez les utilisateurs inscrits" />
    <div class="flex items-center gap-3 mb-6">
      <SearchInput v-model="search" placeholder="Rechercher par email..." class="w-[300px]" />
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredUsers.length }} utilisateurs</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <UserTable v-else :users="filteredUsers" @delete="handleDelete" />
  </div>
</template>
