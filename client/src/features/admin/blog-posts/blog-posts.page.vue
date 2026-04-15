<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useGetBlogPosts } from '@/modules/blog-post/ui/hooks/queries/query/use-get-blog-posts'
import { useCreateBlogPost } from '@/modules/blog-post/ui/hooks/queries/mutation/use-create-blog-post'
import { useUpdateBlogPost } from '@/modules/blog-post/ui/hooks/queries/mutation/use-update-blog-post'
import { useDeleteBlogPost } from '@/modules/blog-post/ui/hooks/queries/mutation/use-delete-blog-post'
import BlogPostTable from '@/modules/blog-post/ui/components/blog-post-table.vue'
import BlogPostFormModal from '@/modules/blog-post/ui/components/blog-post-form-modal.vue'
import type { BlogPostDomainModel } from '@/modules/blog-post/core/model/blog-post.domain-model'
import PageHeader from '@/ui/page-header.vue'
import SearchInput from '@/ui/search-input.vue'
import Button from '@/ui/button.vue'

const { data: blogPosts, isLoading } = useGetBlogPosts()
const createBlogPost = useCreateBlogPost()
const updateBlogPost = useUpdateBlogPost()
const deleteBlogPost = useDeleteBlogPost()

const search = ref('')
const showModal = ref(false)
const editingBlogPost = ref<BlogPostDomainModel.BlogPostOverviewDto | null>(null)

const filteredBlogPosts = computed(() => {
  if (!blogPosts.value) return []
  if (!search.value) return blogPosts.value
  const q = search.value.toLowerCase()
  return blogPosts.value.filter(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
})

function openAdd() { editingBlogPost.value = null; showModal.value = true }
function openEdit(post: BlogPostDomainModel.BlogPostOverviewDto) { editingBlogPost.value = post; showModal.value = true }

async function handleSave(data: BlogPostDomainModel.CreateBlogPostDto) {
  if (editingBlogPost.value) { await updateBlogPost.mutateAsync({ id: editingBlogPost.value.id, data }) }
  else { await createBlogPost.mutateAsync(data) }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (confirm('Supprimer cet article ?')) { await deleteBlogPost.mutateAsync(id) }
}
</script>

<template>
  <div class="p-6">
    <PageHeader title="Blog Posts" description="Publiez du contenu pour vos clients">
      <Button @click="openAdd">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter
      </Button>
    </PageHeader>
    <div class="flex items-center gap-3 mb-6">
      <SearchInput v-model="search" placeholder="Rechercher..." class="w-[300px]" />
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredBlogPosts.length }} articles</span>
    </div>
    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>
    <BlogPostTable v-else :blog-posts="filteredBlogPosts" @edit="openEdit" @delete="handleDelete" />
    <BlogPostFormModal v-model:open="showModal" :editing-blog-post="editingBlogPost" @save="handleSave" />
  </div>
</template>
