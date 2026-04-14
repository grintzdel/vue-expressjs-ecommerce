<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  author: string
  publishedAt: string | null
  tags: string[]
}

const api = useApi()

const posts = ref<BlogPost[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featuredImage: '',
  author: '',
  publishedAt: '',
  tags: '',
})

async function fetchPosts() {
  posts.value = await api.get<BlogPost[]>('/blog-posts')
}

watch(() => form.value.title, (val) => {
  if (!editingId.value) {
    form.value.slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }
})

function openAdd() {
  editingId.value = null
  form.value = { title: '', slug: '', content: '', excerpt: '', featuredImage: '', author: '', publishedAt: '', tags: '' }
  showModal.value = true
}

function openEdit(post: BlogPost) {
  editingId.value = post._id
  form.value = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    author: post.author,
    publishedAt: post.publishedAt ? post.publishedAt.substring(0, 10) : '',
    tags: post.tags.join(', '),
  }
  showModal.value = true
}

async function save() {
  const payload = {
    title: form.value.title,
    slug: form.value.slug,
    content: form.value.content,
    excerpt: form.value.excerpt,
    featuredImage: form.value.featuredImage,
    author: form.value.author,
    publishedAt: form.value.publishedAt || null,
    tags: form.value.tags.split(',').map(t => t.trim()).filter(Boolean),
  }
  if (editingId.value) {
    await api.patch(`/blog-posts/${editingId.value}`, payload)
  } else {
    await api.post('/blog-posts', payload)
  }
  showModal.value = false
  await fetchPosts()
}

async function remove(id: string) {
  if (confirm('Are you sure?')) {
    await api.del(`/blog-posts/${id}`)
    await fetchPosts()
  }
}

function formatDate(date: string | null) {
  if (!date) return 'Draft'
  return new Date(date).toLocaleDateString()
}

onMounted(fetchPosts)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-lg">
      <h1 class="font-heading text-subsection">Blog Posts</h1>
      <button class="btn-primary" @click="openAdd">Add Post</button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border-light overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-primary">
          <tr>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Title</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Author</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Published</th>
            <th class="text-xs uppercase tracking-wide text-font-tertiary px-lg py-md text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post._id" class="border-b border-border-light text-sm">
            <td class="px-lg py-md">{{ post.title }}</td>
            <td class="px-lg py-md">{{ post.author }}</td>
            <td class="px-lg py-md">{{ formatDate(post.publishedAt) }}</td>
            <td class="px-lg py-md flex gap-md">
              <button class="text-accent-green hover:underline" @click="openEdit(post)">Edit</button>
              <button class="text-red-500 hover:underline" @click="remove(post._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-2xl max-w-[560px] w-full mx-md max-h-[90vh] overflow-y-auto">
        <h2 class="font-heading text-subsection mb-lg">{{ editingId ? 'Edit Post' : 'Add Post' }}</h2>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Title</label>
          <input v-model="form.title" type="text" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Slug</label>
          <input v-model="form.slug" type="text" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Content</label>
          <textarea v-model="form.content" class="w-full h-[200px] px-md py-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark resize-none" />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Excerpt</label>
          <textarea v-model="form.excerpt" class="w-full h-[100px] px-md py-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark resize-none" />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Featured Image URL</label>
          <input v-model="form.featuredImage" type="text" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Author</label>
          <input v-model="form.author" type="text" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="mb-md">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Published At</label>
          <input v-model="form.publishedAt" type="date" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="mb-xl">
          <label class="block font-body text-xs font-semibold tracking-[1px] uppercase text-font-tertiary mb-sm">Tags (comma-separated)</label>
          <input v-model="form.tags" type="text" placeholder="e.g. skincare, tips, natural" class="w-full h-[44px] px-md bg-white border border-border-light rounded-md font-body text-sm focus:outline-none focus:border-border-dark" />
        </div>

        <div class="flex gap-md">
          <button class="btn-primary !py-sm !px-lg" @click="save">Save</button>
          <button class="btn-outline !py-sm !px-lg" @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
