# Frontend Architecture Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Vue 3 frontend from flat composable/page files into a modular hexagonal architecture with ports/adapters, TanStack Vue Query, and dependency injection.

**Architecture:** Each domain (tag, product, order, etc.) becomes a module with `core/` (ports, adapters, model) and `ui/` (components, hooks with TanStack Query). An `app` module provides dependency injection via Vue `provide/inject`. Pages become thin wrappers that import feature orchestrators from `features/`.

**Tech Stack:** Vue 3 Composition API, TypeScript, TanStack Vue Query (`@tanstack/vue-query`), native `fetch` via `HttpClient` (pattern from kairos-crm), Tailwind CSS.

---

## File Structure Overview

```
src/
├── modules/
│   ├── shared/
│   │   ├── types/
│   │   │   ├── result.type.ts
│   │   │   └── http.type.ts
│   │   ├── http/
│   │   │   └── http-client.ts
│   │   └── utils/
│   │       └── try-catch.ts
│   │
│   ├── app/
│   │   ├── core/
│   │   │   └── dependencies.ts
│   │   └── ui/
│   │       └── hooks/
│   │           └── use-dependencies.ts
│   │
│   ├── auth/
│   │   ├── core/
│   │   │   ├── ports/auth.port.ts
│   │   │   ├── adapters/auth.adapter.http.ts
│   │   │   ├── adapters/auth.adapter.in-memory.ts
│   │   │   └── model/auth.domain-model.ts
│   │   └── ui/
│   │       └── hooks/
│   │           ├── use-auth.ts
│   │           └── queries/
│   │               └── mutation/
│   │                   ├── use-login.ts
│   │                   └── use-register.ts
│   │
│   ├── cart/
│   │   └── ui/
│   │       └── hooks/
│   │           └── use-cart.ts
│   │
│   ├── product/
│   │   ├── core/
│   │   │   ├── ports/product.port.ts
│   │   │   ├── adapters/product.adapter.http.ts
│   │   │   ├── adapters/product.adapter.in-memory.ts
│   │   │   └── model/product.domain-model.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── product-table.vue
│   │       │   └── product-form-modal.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   ├── use-get-products.ts
│   │               │   ├── use-get-product-by-slug.ts
│   │               │   └── use-get-featured-products.ts
│   │               └── mutation/
│   │                   ├── use-create-product.ts
│   │                   ├── use-update-product.ts
│   │                   └── use-delete-product.ts
│   │
│   ├── category/
│   │   ├── core/
│   │   │   ├── ports/category.port.ts
│   │   │   ├── adapters/category.adapter.http.ts
│   │   │   ├── adapters/category.adapter.in-memory.ts
│   │   │   └── model/category.domain-model.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── category-table.vue
│   │       │   └── category-form-modal.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   └── use-get-categories.ts
│   │               └── mutation/
│   │                   ├── use-create-category.ts
│   │                   ├── use-update-category.ts
│   │                   └── use-delete-category.ts
│   │
│   ├── tag/
│   │   ├── core/
│   │   │   ├── ports/tag.port.ts
│   │   │   ├── adapters/tag.adapter.http.ts
│   │   │   ├── adapters/tag.adapter.in-memory.ts
│   │   │   └── model/tag.domain-model.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── tag-table.vue
│   │       │   └── tag-form-modal.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   └── use-get-tags.ts
│   │               └── mutation/
│   │                   ├── use-create-tag.ts
│   │                   ├── use-update-tag.ts
│   │                   └── use-delete-tag.ts
│   │
│   ├── skin-type/
│   │   ├── core/
│   │   │   ├── ports/skin-type.port.ts
│   │   │   ├── adapters/skin-type.adapter.http.ts
│   │   │   ├── adapters/skin-type.adapter.in-memory.ts
│   │   │   └── model/skin-type.domain-model.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── skin-type-table.vue
│   │       │   └── skin-type-form-modal.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   └── use-get-skin-types.ts
│   │               └── mutation/
│   │                   ├── use-create-skin-type.ts
│   │                   ├── use-update-skin-type.ts
│   │                   └── use-delete-skin-type.ts
│   │
│   ├── page-content/
│   │   ├── core/
│   │   │   ├── ports/page-content.port.ts
│   │   │   ├── adapters/page-content.adapter.http.ts
│   │   │   ├── adapters/page-content.adapter.in-memory.ts
│   │   │   └── model/page-content.domain-model.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── page-content-table.vue
│   │       │   └── page-content-form-modal.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   └── use-get-pages.ts
│   │               └── mutation/
│   │                   ├── use-create-page.ts
│   │                   ├── use-update-page.ts
│   │                   └── use-delete-page.ts
│   │
│   ├── blog-post/
│   │   ├── core/
│   │   │   ├── ports/blog-post.port.ts
│   │   │   ├── adapters/blog-post.adapter.http.ts
│   │   │   ├── adapters/blog-post.adapter.in-memory.ts
│   │   │   └── model/blog-post.domain-model.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── blog-post-table.vue
│   │       │   └── blog-post-form-modal.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   └── use-get-blog-posts.ts
│   │               └── mutation/
│   │                   ├── use-create-blog-post.ts
│   │                   ├── use-update-blog-post.ts
│   │                   └── use-delete-blog-post.ts
│   │
│   ├── order/
│   │   ├── core/
│   │   │   ├── ports/order.port.ts
│   │   │   ├── adapters/order.adapter.http.ts
│   │   │   ├── adapters/order.adapter.in-memory.ts
│   │   │   ├── model/order.domain-model.ts
│   │   │   └── constants/order-status.constant.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   └── order-table.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   └── use-get-orders.ts
│   │               └── mutation/
│   │                   ├── use-update-order-status.ts
│   │                   └── use-delete-order.ts
│   │
│   ├── user/
│   │   ├── core/
│   │   │   ├── ports/user.port.ts
│   │   │   ├── adapters/user.adapter.http.ts
│   │   │   ├── adapters/user.adapter.in-memory.ts
│   │   │   └── model/user.domain-model.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   └── user-table.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   └── use-get-users.ts
│   │               └── mutation/
│   │                   └── use-delete-user.ts
│   │
│   ├── testimonial/
│   │   ├── core/
│   │   │   ├── ports/testimonial.port.ts
│   │   │   ├── adapters/testimonial.adapter.http.ts
│   │   │   ├── adapters/testimonial.adapter.in-memory.ts
│   │   │   └── model/testimonial.domain-model.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── testimonial-table.vue
│   │       │   └── testimonial-form-modal.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   ├── use-get-testimonials.ts
│   │               │   └── use-get-featured-testimonials.ts
│   │               └── mutation/
│   │                   ├── use-create-testimonial.ts
│   │                   ├── use-update-testimonial.ts
│   │                   └── use-delete-testimonial.ts
│   │
│   ├── newsletter/
│   │   ├── core/
│   │   │   ├── ports/newsletter.port.ts
│   │   │   ├── adapters/newsletter.adapter.http.ts
│   │   │   ├── adapters/newsletter.adapter.in-memory.ts
│   │   │   └── model/newsletter.domain-model.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   └── newsletter-table.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   └── use-get-subscriptions.ts
│   │               └── mutation/
│   │                   ├── use-subscribe.ts
│   │                   ├── use-unsubscribe.ts
│   │                   └── use-delete-subscription.ts
│   │
│   ├── press-logo/
│   │   ├── core/
│   │   │   ├── ports/press-logo.port.ts
│   │   │   ├── adapters/press-logo.adapter.http.ts
│   │   │   ├── adapters/press-logo.adapter.in-memory.ts
│   │   │   └── model/press-logo.domain-model.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── press-logo-table.vue
│   │       │   └── press-logo-form-modal.vue
│   │       └── hooks/
│   │           └── queries/
│   │               ├── query/
│   │               │   └── use-get-press-logos.ts
│   │               └── mutation/
│   │                   ├── use-create-press-logo.ts
│   │                   ├── use-update-press-logo.ts
│   │                   └── use-delete-press-logo.ts
│   │
│   └── analytics/
│       ├── core/
│       │   ├── ports/analytics.port.ts
│       │   ├── adapters/analytics.adapter.http.ts
│       │   ├── adapters/analytics.adapter.in-memory.ts
│       │   └── model/analytics.domain-model.ts
│       └── ui/
│           ├── components/
│           │   ├── kpi-cards.vue
│           │   ├── monthly-revenue-chart.vue
│           │   ├── sales-distribution-chart.vue
│           │   ├── recent-orders-table.vue
│           │   ├── top-products-card.vue
│           │   └── top-clients-card.vue
│           └── hooks/
│               └── queries/
│                   └── query/
│                       └── use-get-dashboard.ts
│
├── features/
│   ├── admin/
│   │   ├── dashboard/dashboard.page.vue
│   │   ├── products/products.page.vue
│   │   ├── categories/categories.page.vue
│   │   ├── tags/tags.page.vue
│   │   ├── skin-types/skin-types.page.vue
│   │   ├── pages/pages.page.vue
│   │   ├── blog-posts/blog-posts.page.vue
│   │   ├── orders/orders.page.vue
│   │   ├── users/users.page.vue
│   │   ├── testimonials/testimonials.page.vue
│   │   ├── newsletter/newsletter.page.vue
│   │   └── press-logos/press-logos.page.vue
│   └── public/
│       ├── home/home.page.vue
│       ├── shop/shop.page.vue
│       ├── product-detail/product-detail.page.vue
│       ├── login/login.page.vue
│       └── register/register.page.vue
│
├── pages/
│   ├── admin/
│   │   ├── dashboard/page.vue
│   │   ├── products/page.vue
│   │   ├── categories/page.vue
│   │   ├── tags/page.vue
│   │   ├── skin-types/page.vue
│   │   ├── pages/page.vue
│   │   ├── blog-posts/page.vue
│   │   ├── orders/page.vue
│   │   ├── users/page.vue
│   │   ├── testimonials/page.vue
│   │   ├── newsletter/page.vue
│   │   └── press-logos/page.vue
│   ├── home/page.vue
│   ├── shop/page.vue
│   ├── product-detail/page.vue
│   ├── login/page.vue
│   └── register/page.vue
│
├── components/
│   └── layout/
│       ├── admin-layout.vue
│       ├── app-layout.vue
│       ├── app-nav.vue
│       └── app-footer.vue
│
└── main.ts
```

---

## Task 1: Install TanStack Vue Query

**Files:**
- Modify: `client/package.json`
- Modify: `client/src/main.ts`

- [ ] **Step 1: Install the package**

```bash
cd /Users/maoudin/Desktop/Developer/eemi/cours/vue-node-2/client && npm install @tanstack/vue-query
```

- [ ] **Step 2: Verify installation**

```bash
cd /Users/maoudin/Desktop/Developer/eemi/cours/vue-node-2/client && node -e "require('@tanstack/vue-query')" && echo "OK"
```
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
cd /Users/maoudin/Desktop/Developer/eemi/cours/vue-node-2/client && git add package.json package-lock.json && git commit -m "chore: install @tanstack/vue-query"
```

---

## Task 2: Create shared module — types

**Files:**
- Create: `client/src/modules/shared/types/result.type.ts`
- Create: `client/src/modules/shared/types/http.type.ts`

- [ ] **Step 1: Create result.type.ts**

```typescript
// client/src/modules/shared/types/result.type.ts

type Success<T> = {
  data: T
  error: null
}

type Failure<E> = {
  data: null
  error: E
}

export type ResultType<T, E = Error> = Success<T> | Failure<E>
```

- [ ] **Step 2: Create http.type.ts**

```typescript
// client/src/modules/shared/types/http.type.ts

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpRequestConfig = {
  url: string
  method?: HttpMethod
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  body?: unknown
  timeout?: number
  signal?: AbortSignal
}

export type HttpResponse<T> = {
  data: T
  status: number
  headers: Headers
}

export type HttpError = {
  message: string
  status: number | null
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/shared/types/ && git commit -m "feat: add shared types (ResultType, Http types)"
```

---

## Task 3: Create shared module — utils & http-client

**Files:**
- Create: `client/src/modules/shared/utils/try-catch.ts`
- Create: `client/src/modules/shared/http/http-client.ts`

- [ ] **Step 1: Create try-catch.ts**

```typescript
// client/src/modules/shared/utils/try-catch.ts

import type { ResultType } from '../types/result.type'

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<ResultType<T, E>> {
  try {
    const data: Awaited<T> = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as E }
  }
}
```

- [ ] **Step 2: Create http-client.ts**

The backend API wraps all responses in `{ success: boolean, data: T, error?: string }`. The HttpClient must unwrap this envelope.

```typescript
// client/src/modules/shared/http/http-client.ts

import type { HttpRequestConfig, HttpResponse, HttpError } from '../types/http.type'
import type { ResultType } from '../types/result.type'
import { tryCatch } from '../utils/try-catch'

let _sharedInstance: HttpClient | null = null

export function getSharedHttpClient(): HttpClient {
  if (_sharedInstance) return _sharedInstance
  const baseURL = import.meta.env.VITE_API_URL || '/api'
  _sharedInstance = new HttpClient(baseURL)
  return _sharedInstance
}

export class HttpClient {
  private readonly baseURL: string
  private readonly defaultHeaders: Record<string, string>

  constructor(baseURL: string, defaultHeaders?: Record<string, string>) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    }
  }

  private buildURL(url: string, params?: Record<string, string | number | boolean>): string {
    const path = url.startsWith('/') ? url : `/${url}`
    const fullPath = `${this.baseURL}${path}`

    let resolvedUrl: string
    if (fullPath.startsWith('http')) {
      resolvedUrl = fullPath
    } else {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'
      resolvedUrl = `${origin}${fullPath}`
    }

    const urlObj = new URL(resolvedUrl)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        urlObj.searchParams.set(key, String(value))
      }
    }
    return urlObj.toString()
  }

  private toHttpError(error: Error): HttpError {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { message: 'Request aborted', status: null }
    }
    return { message: error.message, status: null }
  }

  async request<T>(config: HttpRequestConfig): Promise<ResultType<HttpResponse<T>, HttpError>> {
    const url = this.buildURL(config.url, config.params)

    const headers: Record<string, string> = { ...this.defaultHeaders, ...config.headers }

    const controller = new AbortController()
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (config.timeout) {
      timeoutId = setTimeout(() => controller.abort(), config.timeout)
    }

    const result = await tryCatch<Response>(
      fetch(url, {
        method: config.method ?? 'GET',
        headers,
        ...(config.body ? { body: JSON.stringify(config.body) } : {}),
        signal: config.signal ?? controller.signal,
      }),
    )

    if (timeoutId) clearTimeout(timeoutId)

    if (result.error) {
      return { data: null, error: this.toHttpError(result.error) }
    }

    const response = result.data

    if (!response.ok) {
      const errorBody = await tryCatch<{ error?: string }>(response.json())
      const message = errorBody.data?.error ?? response.statusText ?? `HTTP ${response.status}`
      return { data: null, error: { message, status: response.status } }
    }

    const jsonResult = await tryCatch<{ success: boolean; data: T; error?: string }>(response.json() as Promise<{ success: boolean; data: T; error?: string }>)

    if (jsonResult.error) {
      return { data: null, error: this.toHttpError(jsonResult.error) }
    }

    if (!jsonResult.data.success) {
      return { data: null, error: { message: jsonResult.data.error ?? 'Request failed', status: response.status } }
    }

    return {
      data: { data: jsonResult.data.data, status: response.status, headers: response.headers },
      error: null,
    }
  }

  async get<T>(url: string, params?: Record<string, string | number | boolean>) {
    return this.request<T>({ url, method: 'GET', ...(params ? { params } : {}) })
  }

  async post<T>(url: string, body?: unknown) {
    return this.request<T>({ url, method: 'POST', ...(body ? { body } : {}) })
  }

  async patch<T>(url: string, body?: unknown) {
    return this.request<T>({ url, method: 'PATCH', ...(body ? { body } : {}) })
  }

  async put<T>(url: string, body?: unknown) {
    return this.request<T>({ url, method: 'PUT', ...(body ? { body } : {}) })
  }

  async delete<T>(url: string) {
    return this.request<T>({ url, method: 'DELETE' })
  }

  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.defaultHeaders['Authorization']
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/shared/ && git commit -m "feat: add shared http-client and try-catch utility"
```

---

## Task 4: Create tag module — core (model, port, adapters)

This is the **reference module** — all other CRUD modules follow this exact pattern.

**Files:**
- Create: `client/src/modules/tag/core/model/tag.domain-model.ts`
- Create: `client/src/modules/tag/core/ports/tag.port.ts`
- Create: `client/src/modules/tag/core/adapters/tag.adapter.http.ts`
- Create: `client/src/modules/tag/core/adapters/tag.adapter.in-memory.ts`

- [ ] **Step 1: Create tag.domain-model.ts**

```typescript
// client/src/modules/tag/core/model/tag.domain-model.ts

export namespace TagDomainModel {
  export type TagOverviewDto = {
    id: string
    name: string
    slug: string
  }

  export type CreateTagDto = {
    name: string
    slug: string
  }

  export type UpdateTagDto = Partial<CreateTagDto>
}
```

- [ ] **Step 2: Create tag.port.ts**

```typescript
// client/src/modules/tag/core/ports/tag.port.ts

import type { TagDomainModel } from '../model/tag.domain-model'

export interface ITagPort {
  getAll(): Promise<TagDomainModel.TagOverviewDto[]>
  create(data: TagDomainModel.CreateTagDto): Promise<TagDomainModel.TagOverviewDto>
  update(id: string, data: TagDomainModel.UpdateTagDto): Promise<TagDomainModel.TagOverviewDto>
  delete(id: string): Promise<void>
}
```

- [ ] **Step 3: Create tag.adapter.http.ts**

```typescript
// client/src/modules/tag/core/adapters/tag.adapter.http.ts

import type { HttpClient } from '@/modules/shared/http/http-client'
import type { ITagPort } from '../ports/tag.port'
import type { TagDomainModel } from '../model/tag.domain-model'

export class TagHttpAdapter implements ITagPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<TagDomainModel.TagOverviewDto[]> {
    const result = await this.httpClient.get<TagDomainModel.TagOverviewDto[]>('/tags')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async create(data: TagDomainModel.CreateTagDto): Promise<TagDomainModel.TagOverviewDto> {
    const result = await this.httpClient.post<TagDomainModel.TagOverviewDto>('/tags', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async update(id: string, data: TagDomainModel.UpdateTagDto): Promise<TagDomainModel.TagOverviewDto> {
    const result = await this.httpClient.patch<TagDomainModel.TagOverviewDto>(`/tags/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/tags/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
```

- [ ] **Step 4: Create tag.adapter.in-memory.ts**

```typescript
// client/src/modules/tag/core/adapters/tag.adapter.in-memory.ts

import type { ITagPort } from '../ports/tag.port'
import type { TagDomainModel } from '../model/tag.domain-model'

export class TagInMemoryAdapter implements ITagPort {
  private tags: TagDomainModel.TagOverviewDto[] = [
    { id: '1', name: 'Bio', slug: 'bio' },
    { id: '2', name: 'Vegan', slug: 'vegan' },
    { id: '3', name: 'Hydratant', slug: 'hydratant' },
  ]

  private nextId = 4

  async getAll(): Promise<TagDomainModel.TagOverviewDto[]> {
    return [...this.tags]
  }

  async create(data: TagDomainModel.CreateTagDto): Promise<TagDomainModel.TagOverviewDto> {
    const tag: TagDomainModel.TagOverviewDto = { id: String(this.nextId++), ...data }
    this.tags.push(tag)
    return tag
  }

  async update(id: string, data: TagDomainModel.UpdateTagDto): Promise<TagDomainModel.TagOverviewDto> {
    const index = this.tags.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Tag not found')
    this.tags[index] = { ...this.tags[index], ...data }
    return this.tags[index]
  }

  async delete(id: string): Promise<void> {
    this.tags = this.tags.filter(t => t.id !== id)
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add client/src/modules/tag/ && git commit -m "feat: add tag module core (model, port, adapters)"
```

---

## Task 5: Create all remaining CRUD module cores

Each follows the exact same pattern as Task 4. Create `model/`, `ports/`, `adapters/` for each module.

**Files to create per module (13 modules x 4 files = 52 files):**

### category module

- [ ] **Step 1: Create category core files**

`client/src/modules/category/core/model/category.domain-model.ts`:
```typescript
export namespace CategoryDomainModel {
  export type CategoryOverviewDto = {
    id: string
    name: string
    slug: string
    description?: string
  }

  export type CreateCategoryDto = {
    name: string
    slug: string
    description?: string
  }

  export type UpdateCategoryDto = Partial<CreateCategoryDto>
}
```

`client/src/modules/category/core/ports/category.port.ts`:
```typescript
import type { CategoryDomainModel } from '../model/category.domain-model'

export interface ICategoryPort {
  getAll(): Promise<CategoryDomainModel.CategoryOverviewDto[]>
  create(data: CategoryDomainModel.CreateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto>
  update(id: string, data: CategoryDomainModel.UpdateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto>
  delete(id: string): Promise<void>
}
```

`client/src/modules/category/core/adapters/category.adapter.http.ts`:
```typescript
import type { HttpClient } from '@/modules/shared/http/http-client'
import type { ICategoryPort } from '../ports/category.port'
import type { CategoryDomainModel } from '../model/category.domain-model'

export class CategoryHttpAdapter implements ICategoryPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<CategoryDomainModel.CategoryOverviewDto[]> {
    const result = await this.httpClient.get<CategoryDomainModel.CategoryOverviewDto[]>('/categories')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async create(data: CategoryDomainModel.CreateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto> {
    const result = await this.httpClient.post<CategoryDomainModel.CategoryOverviewDto>('/categories', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async update(id: string, data: CategoryDomainModel.UpdateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto> {
    const result = await this.httpClient.patch<CategoryDomainModel.CategoryOverviewDto>(`/categories/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/categories/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
```

`client/src/modules/category/core/adapters/category.adapter.in-memory.ts`:
```typescript
import type { ICategoryPort } from '../ports/category.port'
import type { CategoryDomainModel } from '../model/category.domain-model'

export class CategoryInMemoryAdapter implements ICategoryPort {
  private categories: CategoryDomainModel.CategoryOverviewDto[] = [
    { id: '1', name: 'Soins visage', slug: 'soins-visage', description: 'Produits pour le visage' },
    { id: '2', name: 'Soins corps', slug: 'soins-corps', description: 'Produits pour le corps' },
  ]
  private nextId = 3

  async getAll(): Promise<CategoryDomainModel.CategoryOverviewDto[]> { return [...this.categories] }
  async create(data: CategoryDomainModel.CreateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto> {
    const cat = { id: String(this.nextId++), ...data }
    this.categories.push(cat)
    return cat
  }
  async update(id: string, data: CategoryDomainModel.UpdateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto> {
    const i = this.categories.findIndex(c => c.id === id)
    if (i === -1) throw new Error('Category not found')
    this.categories[i] = { ...this.categories[i], ...data }
    return this.categories[i]
  }
  async delete(id: string): Promise<void> { this.categories = this.categories.filter(c => c.id !== id) }
}
```

### skin-type module

- [ ] **Step 2: Create skin-type core files**

`client/src/modules/skin-type/core/model/skin-type.domain-model.ts`:
```typescript
export namespace SkinTypeDomainModel {
  export type SkinTypeOverviewDto = { id: string; name: string; slug: string }
  export type CreateSkinTypeDto = { name: string; slug: string }
  export type UpdateSkinTypeDto = Partial<CreateSkinTypeDto>
}
```

`client/src/modules/skin-type/core/ports/skin-type.port.ts`:
```typescript
import type { SkinTypeDomainModel } from '../model/skin-type.domain-model'

export interface ISkinTypePort {
  getAll(): Promise<SkinTypeDomainModel.SkinTypeOverviewDto[]>
  create(data: SkinTypeDomainModel.CreateSkinTypeDto): Promise<SkinTypeDomainModel.SkinTypeOverviewDto>
  update(id: string, data: SkinTypeDomainModel.UpdateSkinTypeDto): Promise<SkinTypeDomainModel.SkinTypeOverviewDto>
  delete(id: string): Promise<void>
}
```

`client/src/modules/skin-type/core/adapters/skin-type.adapter.http.ts`:
```typescript
import type { HttpClient } from '@/modules/shared/http/http-client'
import type { ISkinTypePort } from '../ports/skin-type.port'
import type { SkinTypeDomainModel } from '../model/skin-type.domain-model'

export class SkinTypeHttpAdapter implements ISkinTypePort {
  constructor(private readonly httpClient: HttpClient) {}
  async getAll(): Promise<SkinTypeDomainModel.SkinTypeOverviewDto[]> {
    const result = await this.httpClient.get<SkinTypeDomainModel.SkinTypeOverviewDto[]>('/skin-types')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }
  async create(data: SkinTypeDomainModel.CreateSkinTypeDto): Promise<SkinTypeDomainModel.SkinTypeOverviewDto> {
    const result = await this.httpClient.post<SkinTypeDomainModel.SkinTypeOverviewDto>('/skin-types', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }
  async update(id: string, data: SkinTypeDomainModel.UpdateSkinTypeDto): Promise<SkinTypeDomainModel.SkinTypeOverviewDto> {
    const result = await this.httpClient.patch<SkinTypeDomainModel.SkinTypeOverviewDto>(`/skin-types/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }
  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/skin-types/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
```

`client/src/modules/skin-type/core/adapters/skin-type.adapter.in-memory.ts`:
```typescript
import type { ISkinTypePort } from '../ports/skin-type.port'
import type { SkinTypeDomainModel } from '../model/skin-type.domain-model'

export class SkinTypeInMemoryAdapter implements ISkinTypePort {
  private items: SkinTypeDomainModel.SkinTypeOverviewDto[] = [
    { id: '1', name: 'Peau sèche', slug: 'peau-seche' },
    { id: '2', name: 'Peau grasse', slug: 'peau-grasse' },
    { id: '3', name: 'Peau mixte', slug: 'peau-mixte' },
  ]
  private nextId = 4
  async getAll() { return [...this.items] }
  async create(data: SkinTypeDomainModel.CreateSkinTypeDto) { const item = { id: String(this.nextId++), ...data }; this.items.push(item); return item }
  async update(id: string, data: SkinTypeDomainModel.UpdateSkinTypeDto) { const i = this.items.findIndex(x => x.id === id); if (i === -1) throw new Error('Not found'); this.items[i] = { ...this.items[i], ...data }; return this.items[i] }
  async delete(id: string) { this.items = this.items.filter(x => x.id !== id) }
}
```

### product module

- [ ] **Step 3: Create product core files**

`client/src/modules/product/core/model/product.domain-model.ts`:
```typescript
export namespace ProductDomainModel {
  export type ProductImage = { url: string; altText: string; position: number }

  export type ProductOverviewDto = {
    id: string
    name: string
    slug: string
    description?: string
    price: number
    currency: string
    images?: ProductImage[]
    categoryId?: string
    tagIds?: string[]
    skinTypeIds?: string[]
    stockQuantity: number
    isFeatured: boolean
    ingredients?: string
    howToUse?: string
    shippingInfo?: string
    rating?: number
    reviewCount?: number
  }

  export type CreateProductDto = Omit<ProductOverviewDto, 'id'>

  export type UpdateProductDto = Partial<CreateProductDto>
}
```

`client/src/modules/product/core/ports/product.port.ts`:
```typescript
import type { ProductDomainModel } from '../model/product.domain-model'

export interface IProductPort {
  getAll(): Promise<ProductDomainModel.ProductOverviewDto[]>
  getBySlug(slug: string): Promise<ProductDomainModel.ProductOverviewDto>
  getFeatured(): Promise<ProductDomainModel.ProductOverviewDto[]>
  create(data: ProductDomainModel.CreateProductDto): Promise<ProductDomainModel.ProductOverviewDto>
  update(id: string, data: ProductDomainModel.UpdateProductDto): Promise<ProductDomainModel.ProductOverviewDto>
  delete(id: string): Promise<void>
}
```

`client/src/modules/product/core/adapters/product.adapter.http.ts`:
```typescript
import type { HttpClient } from '@/modules/shared/http/http-client'
import type { IProductPort } from '../ports/product.port'
import type { ProductDomainModel } from '../model/product.domain-model'

export class ProductHttpAdapter implements IProductPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<ProductDomainModel.ProductOverviewDto[]> {
    const result = await this.httpClient.get<ProductDomainModel.ProductOverviewDto[]>('/products')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getBySlug(slug: string): Promise<ProductDomainModel.ProductOverviewDto> {
    const result = await this.httpClient.get<ProductDomainModel.ProductOverviewDto>(`/products/${slug}`)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getFeatured(): Promise<ProductDomainModel.ProductOverviewDto[]> {
    const result = await this.httpClient.get<ProductDomainModel.ProductOverviewDto[]>('/products/featured')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async create(data: ProductDomainModel.CreateProductDto): Promise<ProductDomainModel.ProductOverviewDto> {
    const result = await this.httpClient.post<ProductDomainModel.ProductOverviewDto>('/products', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async update(id: string, data: ProductDomainModel.UpdateProductDto): Promise<ProductDomainModel.ProductOverviewDto> {
    const result = await this.httpClient.patch<ProductDomainModel.ProductOverviewDto>(`/products/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/products/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
```

`client/src/modules/product/core/adapters/product.adapter.in-memory.ts`:
```typescript
import type { IProductPort } from '../ports/product.port'
import type { ProductDomainModel } from '../model/product.domain-model'

export class ProductInMemoryAdapter implements IProductPort {
  private products: ProductDomainModel.ProductOverviewDto[] = [
    { id: '1', name: 'Crème hydratante', slug: 'creme-hydratante', price: 29.90, currency: 'EUR', stockQuantity: 50, isFeatured: true, categoryId: '1' },
    { id: '2', name: 'Sérum éclat', slug: 'serum-eclat', price: 45.00, currency: 'EUR', stockQuantity: 30, isFeatured: true, categoryId: '1' },
    { id: '3', name: 'Huile corps', slug: 'huile-corps', price: 35.00, currency: 'EUR', stockQuantity: 0, isFeatured: false, categoryId: '2' },
  ]
  private nextId = 4

  async getAll() { return [...this.products] }
  async getBySlug(slug: string) { const p = this.products.find(x => x.slug === slug); if (!p) throw new Error('Product not found'); return p }
  async getFeatured() { return this.products.filter(p => p.isFeatured) }
  async create(data: ProductDomainModel.CreateProductDto) { const p = { id: String(this.nextId++), ...data }; this.products.push(p); return p }
  async update(id: string, data: ProductDomainModel.UpdateProductDto) { const i = this.products.findIndex(x => x.id === id); if (i === -1) throw new Error('Not found'); this.products[i] = { ...this.products[i], ...data }; return this.products[i] }
  async delete(id: string) { this.products = this.products.filter(x => x.id !== id) }
}
```

### page-content, blog-post, order, user, testimonial, newsletter, press-logo, analytics, auth modules

- [ ] **Step 4: Create page-content core** — Same CRUD pattern. Port: `IPageContentPort` with `getAll`, `create`, `update`, `delete`. Model fields: `id, title, slug, content, seoMeta: { title, description }, isPublished`. Endpoint: `/pages`.

- [ ] **Step 5: Create blog-post core** — Port: `IBlogPostPort` with `getAll`, `create`, `update`, `delete`. Model fields: `id, title, slug, content, excerpt, featuredImage, author, publishedAt, tags: string[]`. Endpoint: `/blog-posts`.

- [ ] **Step 6: Create order core** — Port: `IOrderPort` with `getAll`, `updateStatus(id, status)`, `delete(id)`. Model fields: `id, userId, items: OrderItem[], totalAmount, currency, status, shippingAddress, createdAt`. OrderItem: `productId, productName, quantity, unitPrice`. Constants file `order-status.constant.ts` with status labels/styles. Endpoint: `/orders`.

- [ ] **Step 7: Create user core** — Port: `IUserPort` with `getAll`, `delete(id)`. Model fields: `id, email, role, createdAt`. Endpoint: `/users`.

- [ ] **Step 8: Create testimonial core** — Port: `ITestimonialPort` with `getAll`, `getFeatured`, `create`, `update`, `delete`. Model fields: `id, authorName, content, rating, isFeatured, createdAt?`. Endpoint: `/testimonials`.

- [ ] **Step 9: Create newsletter core** — Port: `INewsletterPort` with `getAll`, `subscribe(email)`, `unsubscribe(email)`, `delete(id)`. Model fields: `id, email, subscribedAt, isActive, discountCode`. Endpoint: `/newsletter`.

- [ ] **Step 10: Create press-logo core** — Port: `IPressLogoPort` with `getAll`, `create`, `update`, `delete`. Model fields: `id, name, logoUrl, link, position`. Endpoint: `/press-logos`.

- [ ] **Step 11: Create analytics core** — Port: `IAnalyticsPort` with `getDashboard()`. Model: `AnalyticsDomainModel` namespace with `DashboardDto`, `KpisDto`, `MonthlyRevenueDto`, `SalesDistributionDto`, `RecentOrderDto`, `TopProductDto`, `TopClientDto`. Endpoint: `/analytics/dashboard`.

- [ ] **Step 12: Create auth core** — Port: `IAuthPort` with `login(email, password)`, `register(email, password)`. Model: `AuthDomainModel` with `LoginDto`, `RegisterDto`, `AuthResponseDto { token: string }`. Endpoint: `/auth/login`, `/auth/register`. The HTTP adapter does NOT use HttpClient (raw fetch since auth endpoint returns `{ data: { token } }` without the `success` wrapper, based on LoginPage code).

- [ ] **Step 13: Commit**

```bash
git add client/src/modules/ && git commit -m "feat: add all module cores (model, port, adapters)"
```

---

## Task 6: Create app module — dependency injection

**Files:**
- Create: `client/src/modules/app/core/dependencies.ts`
- Create: `client/src/modules/app/ui/hooks/use-dependencies.ts`

- [ ] **Step 1: Create dependencies.ts**

```typescript
// client/src/modules/app/core/dependencies.ts

import type { ITagPort } from '@/modules/tag/core/ports/tag.port'
import type { ICategoryPort } from '@/modules/category/core/ports/category.port'
import type { ISkinTypePort } from '@/modules/skin-type/core/ports/skin-type.port'
import type { IProductPort } from '@/modules/product/core/ports/product.port'
import type { IPageContentPort } from '@/modules/page-content/core/ports/page-content.port'
import type { IBlogPostPort } from '@/modules/blog-post/core/ports/blog-post.port'
import type { IOrderPort } from '@/modules/order/core/ports/order.port'
import type { IUserPort } from '@/modules/user/core/ports/user.port'
import type { ITestimonialPort } from '@/modules/testimonial/core/ports/testimonial.port'
import type { INewsletterPort } from '@/modules/newsletter/core/ports/newsletter.port'
import type { IPressLogoPort } from '@/modules/press-logo/core/ports/press-logo.port'
import type { IAnalyticsPort } from '@/modules/analytics/core/ports/analytics.port'
import type { IAuthPort } from '@/modules/auth/core/ports/auth.port'
import { getSharedHttpClient } from '@/modules/shared/http/http-client'
import { TagHttpAdapter } from '@/modules/tag/core/adapters/tag.adapter.http'
import { CategoryHttpAdapter } from '@/modules/category/core/adapters/category.adapter.http'
import { SkinTypeHttpAdapter } from '@/modules/skin-type/core/adapters/skin-type.adapter.http'
import { ProductHttpAdapter } from '@/modules/product/core/adapters/product.adapter.http'
import { PageContentHttpAdapter } from '@/modules/page-content/core/adapters/page-content.adapter.http'
import { BlogPostHttpAdapter } from '@/modules/blog-post/core/adapters/blog-post.adapter.http'
import { OrderHttpAdapter } from '@/modules/order/core/adapters/order.adapter.http'
import { UserHttpAdapter } from '@/modules/user/core/adapters/user.adapter.http'
import { TestimonialHttpAdapter } from '@/modules/testimonial/core/adapters/testimonial.adapter.http'
import { NewsletterHttpAdapter } from '@/modules/newsletter/core/adapters/newsletter.adapter.http'
import { PressLogoHttpAdapter } from '@/modules/press-logo/core/adapters/press-logo.adapter.http'
import { AnalyticsHttpAdapter } from '@/modules/analytics/core/adapters/analytics.adapter.http'
import { AuthHttpAdapter } from '@/modules/auth/core/adapters/auth.adapter.http'

export type Dependencies = {
  tagPort: ITagPort
  categoryPort: ICategoryPort
  skinTypePort: ISkinTypePort
  productPort: IProductPort
  pageContentPort: IPageContentPort
  blogPostPort: IBlogPostPort
  orderPort: IOrderPort
  userPort: IUserPort
  testimonialPort: ITestimonialPort
  newsletterPort: INewsletterPort
  pressLogoPort: IPressLogoPort
  analyticsPort: IAnalyticsPort
  authPort: IAuthPort
}

export function createDependencies(): Dependencies {
  const httpClient = getSharedHttpClient()

  const token = localStorage.getItem('token')
  if (token) {
    httpClient.setAuthToken(token)
  }

  return {
    tagPort: new TagHttpAdapter(httpClient),
    categoryPort: new CategoryHttpAdapter(httpClient),
    skinTypePort: new SkinTypeHttpAdapter(httpClient),
    productPort: new ProductHttpAdapter(httpClient),
    pageContentPort: new PageContentHttpAdapter(httpClient),
    blogPostPort: new BlogPostHttpAdapter(httpClient),
    orderPort: new OrderHttpAdapter(httpClient),
    userPort: new UserHttpAdapter(httpClient),
    testimonialPort: new TestimonialHttpAdapter(httpClient),
    newsletterPort: new NewsletterHttpAdapter(httpClient),
    pressLogoPort: new PressLogoHttpAdapter(httpClient),
    analyticsPort: new AnalyticsHttpAdapter(httpClient),
    authPort: new AuthHttpAdapter(),
  }
}
```

- [ ] **Step 2: Create use-dependencies.ts**

```typescript
// client/src/modules/app/ui/hooks/use-dependencies.ts

import { inject } from 'vue'
import type { Dependencies } from '@/modules/app/core/dependencies'
import type { InjectionKey } from 'vue'

export const DEPENDENCIES_KEY: InjectionKey<Dependencies> = Symbol('dependencies')

export function useDependencies(): Dependencies {
  const deps = inject(DEPENDENCIES_KEY)
  if (!deps) {
    throw new Error('Dependencies not provided. Make sure to call app.provide(DEPENDENCIES_KEY, dependencies) in main.ts')
  }
  return deps
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/app/ && git commit -m "feat: add app module with dependency injection (provide/inject)"
```

---

## Task 7: Create tag module — UI hooks (TanStack Query)

This is the **reference** for all module hooks.

**Files:**
- Create: `client/src/modules/tag/ui/hooks/queries/query/use-get-tags.ts`
- Create: `client/src/modules/tag/ui/hooks/queries/mutation/use-create-tag.ts`
- Create: `client/src/modules/tag/ui/hooks/queries/mutation/use-update-tag.ts`
- Create: `client/src/modules/tag/ui/hooks/queries/mutation/use-delete-tag.ts`

- [ ] **Step 1: Create use-get-tags.ts**

```typescript
// client/src/modules/tag/ui/hooks/queries/query/use-get-tags.ts

import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetTags() {
  const { tagPort } = useDependencies()

  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagPort.getAll(),
  })
}
```

- [ ] **Step 2: Create use-create-tag.ts**

```typescript
// client/src/modules/tag/ui/hooks/queries/mutation/use-create-tag.ts

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'

export function useCreateTag() {
  const { tagPort } = useDependencies()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createTag'],
    mutationFn: (data: TagDomainModel.CreateTagDto) => tagPort.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
```

- [ ] **Step 3: Create use-update-tag.ts**

```typescript
// client/src/modules/tag/ui/hooks/queries/mutation/use-update-tag.ts

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'

export function useUpdateTag() {
  const { tagPort } = useDependencies()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['updateTag'],
    mutationFn: ({ id, data }: { id: string; data: TagDomainModel.UpdateTagDto }) => tagPort.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
```

- [ ] **Step 4: Create use-delete-tag.ts**

```typescript
// client/src/modules/tag/ui/hooks/queries/mutation/use-delete-tag.ts

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useDeleteTag() {
  const { tagPort } = useDependencies()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['deleteTag'],
    mutationFn: (id: string) => tagPort.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
```

- [ ] **Step 5: Commit**

```bash
git add client/src/modules/tag/ui/ && git commit -m "feat: add tag module TanStack Query hooks"
```

---

## Task 8: Create all remaining module UI hooks

Same pattern as Task 7 for each module. Each query hook calls `useDependencies()` to get the port, then wraps in `useQuery` or `useMutation`.

- [ ] **Step 1: Create category hooks** — `use-get-categories.ts` (queryKey: `['categories']`), `use-create-category.ts`, `use-update-category.ts`, `use-delete-category.ts`. All invalidate `['categories']`.

- [ ] **Step 2: Create skin-type hooks** — `use-get-skin-types.ts` (queryKey: `['skin-types']`), `use-create-skin-type.ts`, `use-update-skin-type.ts`, `use-delete-skin-type.ts`. All invalidate `['skin-types']`.

- [ ] **Step 3: Create product hooks** — `use-get-products.ts` (queryKey: `['products']`), `use-get-product-by-slug.ts` (queryKey: `['product', slug]`, enabled only if slug truthy), `use-get-featured-products.ts` (queryKey: `['products', 'featured']`), `use-create-product.ts`, `use-update-product.ts`, `use-delete-product.ts`. All mutations invalidate `['products']`.

- [ ] **Step 4: Create page-content hooks** — `use-get-pages.ts` (queryKey: `['pages']`), `use-create-page.ts`, `use-update-page.ts`, `use-delete-page.ts`. Invalidate `['pages']`.

- [ ] **Step 5: Create blog-post hooks** — `use-get-blog-posts.ts` (queryKey: `['blog-posts']`), `use-create-blog-post.ts`, `use-update-blog-post.ts`, `use-delete-blog-post.ts`. Invalidate `['blog-posts']`.

- [ ] **Step 6: Create order hooks** — `use-get-orders.ts` (queryKey: `['orders']`), `use-update-order-status.ts` (mutationFn: `({ id, status }) => orderPort.updateStatus(id, status)`), `use-delete-order.ts`. Invalidate `['orders']`.

- [ ] **Step 7: Create user hooks** — `use-get-users.ts` (queryKey: `['users']`), `use-delete-user.ts`. Invalidate `['users']`.

- [ ] **Step 8: Create testimonial hooks** — `use-get-testimonials.ts` (queryKey: `['testimonials']`), `use-get-featured-testimonials.ts` (queryKey: `['testimonials', 'featured']`), `use-create-testimonial.ts`, `use-update-testimonial.ts`, `use-delete-testimonial.ts`. Invalidate `['testimonials']`.

- [ ] **Step 9: Create newsletter hooks** — `use-get-subscriptions.ts` (queryKey: `['newsletter']`), `use-subscribe.ts` (mutationFn: `(email: string) => newsletterPort.subscribe(email)`), `use-unsubscribe.ts`, `use-delete-subscription.ts`. Invalidate `['newsletter']`.

- [ ] **Step 10: Create press-logo hooks** — `use-get-press-logos.ts` (queryKey: `['press-logos']`), `use-create-press-logo.ts`, `use-update-press-logo.ts`, `use-delete-press-logo.ts`. Invalidate `['press-logos']`.

- [ ] **Step 11: Create analytics hooks** — `use-get-dashboard.ts` (queryKey: `['analytics', 'dashboard']`). Query only, no mutations.

- [ ] **Step 12: Create auth hooks** — `use-login.ts` (mutation, calls `authPort.login(email, password)`, on success stores token in localStorage + sets httpClient auth token), `use-register.ts` (mutation, same pattern). Also create `client/src/modules/auth/ui/hooks/use-auth.ts` (UI-only hook, no API call — exposes `getToken`, `getUserFromToken`, `isAuthenticated`, `isAdmin`, `logout` from current useAuth composable).

- [ ] **Step 13: Create cart hook** — `client/src/modules/cart/ui/hooks/use-cart.ts` — Move existing `useCart` composable code as-is (localStorage-based, no API, no port/adapter).

- [ ] **Step 14: Commit**

```bash
git add client/src/modules/ && git commit -m "feat: add all module UI hooks (TanStack Query + auth + cart)"
```

---

## Task 9: Create tag module — UI components

**Files:**
- Create: `client/src/modules/tag/ui/components/tag-table.vue`
- Create: `client/src/modules/tag/ui/components/tag-form-modal.vue`

These are **pure UI components** — they receive data via props and emit events. No API calls inside.

- [ ] **Step 1: Create tag-table.vue**

```vue
<!-- client/src/modules/tag/ui/components/tag-table.vue -->
<script setup lang="ts">
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'

defineProps<{
  tags: TagDomainModel.TagOverviewDto[]
  activeDropdown: string | null
}>()

defineEmits<{
  edit: [tag: TagDomainModel.TagOverviewDto]
  delete: [id: string]
  toggleDropdown: [id: string]
  closeDropdowns: []
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-border-light overflow-hidden">
    <div class="flex items-center gap-3 h-9 px-5 bg-white text-[11px] font-semibold uppercase tracking-[0.5px] font-body text-font-tertiary">
      <span class="flex-1">NOM</span>
      <span class="w-[200px]">SLUG</span>
      <span class="w-[70px]">ACTIONS</span>
    </div>

    <div v-if="tags.length === 0" class="px-5 py-10 text-center font-body text-sm text-font-tertiary">
      Aucun tag trouvé
    </div>

    <div
      v-for="tag in tags"
      :key="tag.id"
      class="flex items-center gap-3 h-12 px-5 border-b border-border-light last:border-0 hover:bg-[#F0F5EB] transition-colors"
    >
      <span class="flex-1 text-[13px] font-body font-medium text-font-primary">{{ tag.name }}</span>
      <span class="w-[200px] text-xs font-body text-font-tertiary">{{ tag.slug }}</span>
      <div class="w-[70px] flex justify-center relative">
        <button class="p-1 text-font-tertiary hover:text-font-primary" @click.stop="$emit('toggleDropdown', tag.id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
        <div v-if="activeDropdown === tag.id" class="absolute right-0 top-8 z-20 bg-white border border-border-light rounded-lg shadow-lg py-1.5 w-[170px]" @click.stop>
          <button class="block w-full text-left px-4 py-2 text-sm font-body text-font-primary hover:bg-bg-primary transition" @click="$emit('edit', tag)">Modifier</button>
          <button class="block w-full text-left px-4 py-2 text-sm font-body text-[#C94444] hover:bg-bg-primary transition" @click="$emit('delete', tag.id)">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create tag-form-modal.vue**

```vue
<!-- client/src/modules/tag/ui/components/tag-form-modal.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'

const props = defineProps<{
  show: boolean
  editingTag: TagDomainModel.TagOverviewDto | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: TagDomainModel.CreateTagDto]
}>()

const form = ref({ name: '', slug: '' })

watch(() => props.show, (val) => {
  if (val) {
    if (props.editingTag) {
      form.value = { name: props.editingTag.name, slug: props.editingTag.slug }
    } else {
      form.value = { name: '', slug: '' }
    }
  }
})

watch(() => form.value.name, (val) => {
  if (!props.editingTag) {
    form.value.slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }
})

function handleSave() {
  emit('save', { ...form.value })
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-[560px] p-6">
      <h2 class="font-heading text-xl font-bold text-font-primary mb-6">{{ editingTag ? 'Modifier' : 'Ajouter' }} un tag</h2>
      <div class="space-y-4">
        <div>
          <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Nom</label>
          <input v-model="form.name" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" />
        </div>
        <div>
          <label class="block font-body text-[11px] font-semibold tracking-[0.5px] uppercase text-font-tertiary mb-1.5">Slug</label>
          <input v-model="form.slug" type="text" class="w-full h-11 px-3 bg-white border border-border-light rounded-lg font-body text-sm focus:outline-none focus:border-font-tertiary" />
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button class="px-5 py-2.5 rounded-lg border border-border-light font-body text-sm text-font-primary hover:bg-bg-primary transition" @click="$emit('close')">Annuler</button>
        <button class="px-5 py-2.5 rounded-lg bg-accent-green text-white font-body text-sm font-medium hover:opacity-90 transition" @click="handleSave">Enregistrer</button>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/tag/ui/components/ && git commit -m "feat: add tag UI components (table + form modal)"
```

---

## Task 10: Create all remaining module UI components

Same pure-component pattern as Task 9. Extract the table and modal from each existing admin page into the module's `ui/components/`.

- [ ] **Step 1: Create category components** — `category-table.vue` (props: categories, activeDropdown; emits: edit, delete, toggleDropdown), `category-form-modal.vue` (props: show, editingCategory; emits: close, save). Columns: NOM, SLUG, DESCRIPTION, STATUT, ACTIONS.

- [ ] **Step 2: Create skin-type components** — `skin-type-table.vue`, `skin-type-form-modal.vue`. Same as tag (NOM, SLUG, ACTIONS).

- [ ] **Step 3: Create product components** — `product-table.vue` (props: products, categories, activeDropdown; emits: edit, delete, view, toggleDropdown), `product-form-modal.vue` (props: show, editingProduct, categories, tags, skinTypes; emits: close, save). Columns: IMAGE, NOM, CATEGORIE, PRIX, STOCK, STATUT, ACTIONS.

- [ ] **Step 4: Create page-content components** — `page-content-table.vue`, `page-content-form-modal.vue`. Columns: TITRE, SLUG, STATUT, ACTIONS.

- [ ] **Step 5: Create blog-post components** — `blog-post-table.vue`, `blog-post-form-modal.vue`. Columns: TITRE, AUTEUR, DATE, STATUT, ACTIONS.

- [ ] **Step 6: Create order components** — `order-table.vue` (props: orders, statuses, activeDropdown; emits: updateStatus, delete, toggleDropdown). No form modal. Columns: COMMANDE, PRODUITS, TOTAL, STATUT, DATE, ACTIONS.

- [ ] **Step 7: Create user components** — `user-table.vue` (props: users, activeDropdown; emits: delete, toggleDropdown). No form modal. Columns: EMAIL, ROLE, INSCRIPTION, ACTIONS.

- [ ] **Step 8: Create testimonial components** — `testimonial-table.vue`, `testimonial-form-modal.vue`. Columns: CLIENT, NOTE, COMMENTAIRE, DATE, STATUT, ACTIONS.

- [ ] **Step 9: Create newsletter components** — `newsletter-table.vue` (emits: unsubscribe, delete, toggleDropdown). No form modal. Columns: EMAIL, DATE, STATUT, CODE PROMO, ACTIONS.

- [ ] **Step 10: Create press-logo components** — `press-logo-table.vue`, `press-logo-form-modal.vue`. Columns: NOM, POSITION, URL LOGO, ACTIONS.

- [ ] **Step 11: Create analytics components** — `kpi-cards.vue` (props: kpis), `monthly-revenue-chart.vue` (props: monthlyRevenue), `sales-distribution-chart.vue` (props: salesDistribution), `recent-orders-table.vue` (props: recentOrders), `top-products-card.vue` (props: topProducts), `top-clients-card.vue` (props: topClients). All pure display components, no API calls.

- [ ] **Step 12: Commit**

```bash
git add client/src/modules/*/ui/components/ && git commit -m "feat: add all module UI components"
```

---

## Task 11: Create feature pages (orchestrators)

Feature pages compose hooks + components. They contain the search/filter state, call hooks, and pass data to components.

**Files:** Create all feature pages under `client/src/features/`.

- [ ] **Step 1: Create tags feature page**

```vue
<!-- client/src/features/admin/tags/tags.page.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGetTags } from '@/modules/tag/ui/hooks/queries/query/use-get-tags'
import { useCreateTag } from '@/modules/tag/ui/hooks/queries/mutation/use-create-tag'
import { useUpdateTag } from '@/modules/tag/ui/hooks/queries/mutation/use-update-tag'
import { useDeleteTag } from '@/modules/tag/ui/hooks/queries/mutation/use-delete-tag'
import TagTable from '@/modules/tag/ui/components/tag-table.vue'
import TagFormModal from '@/modules/tag/ui/components/tag-form-modal.vue'
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'

const { data: tags, isLoading } = useGetTags()
const createTag = useCreateTag()
const updateTag = useUpdateTag()
const deleteTag = useDeleteTag()

const search = ref('')
const showModal = ref(false)
const editingTag = ref<TagDomainModel.TagOverviewDto | null>(null)
const activeDropdown = ref<string | null>(null)

const filteredTags = computed(() => {
  if (!tags.value) return []
  if (!search.value) return tags.value
  const q = search.value.toLowerCase()
  return tags.value.filter(t => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q))
})

function openAdd() {
  editingTag.value = null
  showModal.value = true
}

function openEdit(tag: TagDomainModel.TagOverviewDto) {
  activeDropdown.value = null
  editingTag.value = tag
  showModal.value = true
}

async function handleSave(data: TagDomainModel.CreateTagDto) {
  if (editingTag.value) {
    await updateTag.mutateAsync({ id: editingTag.value.id, data })
  } else {
    await createTag.mutateAsync(data)
  }
  showModal.value = false
}

async function handleDelete(id: string) {
  activeDropdown.value = null
  if (confirm('Supprimer ce tag ?')) {
    await deleteTag.mutateAsync(id)
  }
}

function toggleDropdown(id: string) {
  activeDropdown.value = activeDropdown.value === id ? null : id
}
</script>

<template>
  <div class="p-6" @click="activeDropdown = null">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-[28px] font-bold text-font-primary">Tags</h1>
        <p class="text-sm font-body text-font-secondary mt-1">Gerez les tags de vos produits</p>
      </div>
      <button class="flex items-center gap-2 bg-accent-green text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition" @click="openAdd">
        + Ajouter
      </button>
    </div>

    <div class="flex items-center gap-3 mb-6">
      <div class="flex items-center gap-2 bg-white border border-border-light rounded-lg h-9 px-3 w-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-font-tertiary flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input v-model="search" type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-body text-font-primary w-full" />
      </div>
      <span class="text-[13px] font-body text-font-tertiary">{{ filteredTags.length }} tags</span>
    </div>

    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>

    <TagTable
      v-else
      :tags="filteredTags"
      :active-dropdown="activeDropdown"
      @edit="openEdit"
      @delete="handleDelete"
      @toggle-dropdown="toggleDropdown"
    />

    <TagFormModal
      :show="showModal"
      :editing-tag="editingTag"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>
```

- [ ] **Step 2: Create all other admin feature pages** — Same pattern for: `categories.page.vue`, `skin-types.page.vue`, `products.page.vue`, `pages.page.vue`, `blog-posts.page.vue`, `orders.page.vue`, `users.page.vue`, `testimonials.page.vue`, `newsletter.page.vue`, `press-logos.page.vue`. Each imports its module's hooks + components, manages search/filter/modal state.

- [ ] **Step 3: Create dashboard feature page** — `client/src/features/admin/dashboard/dashboard.page.vue`. Imports `useGetDashboard` + all 6 analytics components. Passes data slices as props.

- [ ] **Step 4: Create public feature pages** — `home.page.vue` (uses `useGetFeaturedProducts`, `useGetCategories`, `useGetSkinTypes`, `useGetFeaturedTestimonials`, `useGetPressLogos`, `useSubscribe`), `shop.page.vue` (uses `useGetProducts`, `useGetCategories`, `useGetTags`, `useGetSkinTypes`), `product-detail.page.vue` (uses `useGetProductBySlug`, `useGetCategories`, `useGetTags`, `useGetSkinTypes`, `useGetProducts` for related), `login.page.vue` (uses `useLogin`), `register.page.vue` (uses `useRegister`).

- [ ] **Step 5: Commit**

```bash
git add client/src/features/ && git commit -m "feat: add all feature pages (admin + public orchestrators)"
```

---

## Task 12: Create thin page wrappers

Each page file is a single-component file that imports the feature page.

**Files:** Create all files under `client/src/pages/`.

- [ ] **Step 1: Create all admin page wrappers**

Example `client/src/pages/admin/tags/page.vue`:
```vue
<script setup lang="ts">
import TagsPage from '@/features/admin/tags/tags.page.vue'
</script>

<template>
  <TagsPage />
</template>
```

Create the same wrapper for each admin page:
- `client/src/pages/admin/dashboard/page.vue` → imports `@/features/admin/dashboard/dashboard.page.vue`
- `client/src/pages/admin/products/page.vue` → imports `@/features/admin/products/products.page.vue`
- `client/src/pages/admin/categories/page.vue` → imports `@/features/admin/categories/categories.page.vue`
- `client/src/pages/admin/skin-types/page.vue` → imports `@/features/admin/skin-types/skin-types.page.vue`
- `client/src/pages/admin/pages/page.vue` → imports `@/features/admin/pages/pages.page.vue`
- `client/src/pages/admin/blog-posts/page.vue` → imports `@/features/admin/blog-posts/blog-posts.page.vue`
- `client/src/pages/admin/orders/page.vue` → imports `@/features/admin/orders/orders.page.vue`
- `client/src/pages/admin/users/page.vue` → imports `@/features/admin/users/users.page.vue`
- `client/src/pages/admin/testimonials/page.vue` → imports `@/features/admin/testimonials/testimonials.page.vue`
- `client/src/pages/admin/newsletter/page.vue` → imports `@/features/admin/newsletter/newsletter.page.vue`
- `client/src/pages/admin/press-logos/page.vue` → imports `@/features/admin/press-logos/press-logos.page.vue`

- [ ] **Step 2: Create all public page wrappers**

- `client/src/pages/home/page.vue` → imports `@/features/public/home/home.page.vue`
- `client/src/pages/shop/page.vue` → imports `@/features/public/shop/shop.page.vue`
- `client/src/pages/product-detail/page.vue` → imports `@/features/public/product-detail/product-detail.page.vue`
- `client/src/pages/login/page.vue` → imports `@/features/public/login/login.page.vue`
- `client/src/pages/register/page.vue` → imports `@/features/public/register/register.page.vue`

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/ && git commit -m "feat: add thin page wrappers importing feature pages"
```

---

## Task 13: Update main.ts — router + DI + TanStack Query

**Files:**
- Modify: `client/src/main.ts`

- [ ] **Step 1: Rewrite main.ts**

```typescript
// client/src/main.ts

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import { createDependencies } from '@/modules/app/core/dependencies'
import { DEPENDENCIES_KEY } from '@/modules/app/ui/hooks/use-dependencies'
import './assets/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('./pages/home/page.vue') },
    { path: '/shop', name: 'shop', component: () => import('./pages/shop/page.vue') },
    { path: '/product/:slug', name: 'product', component: () => import('./pages/product-detail/page.vue') },
    { path: '/about', name: 'about', component: () => import('./pages/about/page.vue') },
    { path: '/blog', name: 'blog', component: () => import('./pages/blog/page.vue') },
    { path: '/cart', name: 'cart', component: () => import('./pages/cart/page.vue') },
    { path: '/login', name: 'login', component: () => import('./pages/login/page.vue') },
    { path: '/register', name: 'register', component: () => import('./pages/register/page.vue') },
    { path: '/admin', name: 'admin', component: () => import('./pages/admin/dashboard/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/products', name: 'admin-products', component: () => import('./pages/admin/products/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/categories', name: 'admin-categories', component: () => import('./pages/admin/categories/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/tags', name: 'admin-tags', component: () => import('./pages/admin/tags/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/skin-types', name: 'admin-skin-types', component: () => import('./pages/admin/skin-types/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/pages', name: 'admin-pages', component: () => import('./pages/admin/pages/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/blog-posts', name: 'admin-blog-posts', component: () => import('./pages/admin/blog-posts/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/testimonials', name: 'admin-testimonials', component: () => import('./pages/admin/testimonials/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/newsletter', name: 'admin-newsletter', component: () => import('./pages/admin/newsletter/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/press-logos', name: 'admin-press-logos', component: () => import('./pages/admin/press-logos/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/orders', name: 'admin-orders', component: () => import('./pages/admin/orders/page.vue'), meta: { requiresAuth: true } },
    { path: '/admin/users', name: 'admin-users', component: () => import('./pages/admin/users/page.vue'), meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return { name: 'login' }
  }
})

const app = createApp(App)
app.use(router)
app.use(VueQueryPlugin)
app.provide(DEPENDENCIES_KEY, createDependencies())
app.mount('#app')
```

- [ ] **Step 2: Commit**

```bash
git add client/src/main.ts && git commit -m "feat: update main.ts with router, TanStack Query, and DI"
```

---

## Task 14: Rename layout files to kebab-case

**Files:**
- Rename: `AdminLayout.vue` → `admin-layout.vue`
- Rename: `AppLayout.vue` → `app-layout.vue`
- Rename: `AppNav.vue` → `app-nav.vue`
- Rename: `AppFooter.vue` → `app-footer.vue`
- Modify: `client/src/App.vue` — Update imports

- [ ] **Step 1: Rename layout files**

```bash
cd /Users/maoudin/Desktop/Developer/eemi/cours/vue-node-2/client/src/components/layout
mv AdminLayout.vue admin-layout.vue
mv AppLayout.vue app-layout.vue
mv AppNav.vue app-nav.vue
mv AppFooter.vue app-footer.vue
```

- [ ] **Step 2: Update App.vue imports** — Change `AdminLayout` → `admin-layout`, `AppLayout` → `app-layout` in import paths.

- [ ] **Step 3: Update app-layout.vue imports** — Change `AppNav` → `app-nav`, `AppFooter` → `app-footer` in import paths.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ client/src/App.vue && git commit -m "refactor: rename layout files to kebab-case"
```

---

## Task 15: Delete old files

**Files to delete:**
- `client/src/composables/useApi.ts`
- `client/src/composables/useAuth.ts`
- `client/src/composables/useCart.ts`
- `client/src/composables/` (directory)
- All old flat page files: `client/src/pages/HomePage.vue`, `client/src/pages/ShopPage.vue`, `client/src/pages/ProductDetailPage.vue`, `client/src/pages/AboutPage.vue`, `client/src/pages/BlogPage.vue`, `client/src/pages/CartPage.vue`, `client/src/pages/LoginPage.vue`, `client/src/pages/RegisterPage.vue`
- All old admin page files: `client/src/pages/admin/DashboardPage.vue`, `client/src/pages/admin/ProductsPage.vue`, `client/src/pages/admin/CategoriesPage.vue`, `client/src/pages/admin/TagsPage.vue`, `client/src/pages/admin/SkinTypesPage.vue`, `client/src/pages/admin/PagesAdminPage.vue`, `client/src/pages/admin/BlogPostsPage.vue`, `client/src/pages/admin/OrdersPage.vue`, `client/src/pages/admin/UsersPage.vue`, `client/src/pages/admin/TestimonialsPage.vue`, `client/src/pages/admin/NewsletterPage.vue`, `client/src/pages/admin/PressLogosPage.vue`
- `client/src/components/CartDrawer.vue`, `client/src/components/ui/BaseButton.vue`, `client/src/components/ui/BaseTag.vue`, `client/src/components/ui/SectionHeading.vue` (move to `src/ui/` if still used, delete if not)

- [ ] **Step 1: Delete composables**

```bash
rm -rf client/src/composables/
```

- [ ] **Step 2: Delete old page files**

```bash
rm client/src/pages/HomePage.vue client/src/pages/ShopPage.vue client/src/pages/ProductDetailPage.vue client/src/pages/AboutPage.vue client/src/pages/BlogPage.vue client/src/pages/CartPage.vue client/src/pages/LoginPage.vue client/src/pages/RegisterPage.vue
rm client/src/pages/admin/DashboardPage.vue client/src/pages/admin/ProductsPage.vue client/src/pages/admin/CategoriesPage.vue client/src/pages/admin/TagsPage.vue client/src/pages/admin/SkinTypesPage.vue client/src/pages/admin/PagesAdminPage.vue client/src/pages/admin/BlogPostsPage.vue client/src/pages/admin/OrdersPage.vue client/src/pages/admin/UsersPage.vue client/src/pages/admin/TestimonialsPage.vue client/src/pages/admin/NewsletterPage.vue client/src/pages/admin/PressLogosPage.vue
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "refactor: remove old composables and flat page files"
```

---

## Task 16: Verify app compiles

- [ ] **Step 1: Type-check**

```bash
cd /Users/maoudin/Desktop/Developer/eemi/cours/vue-node-2/client && npx vue-tsc --noEmit
```

- [ ] **Step 2: Build**

```bash
cd /Users/maoudin/Desktop/Developer/eemi/cours/vue-node-2/client && npm run build
```

- [ ] **Step 3: Fix any type errors or import issues**

- [ ] **Step 4: Commit fixes if any**

```bash
git add -A && git commit -m "fix: resolve compilation errors after architecture refactor"
```

---

## Self-Review Results

**Spec coverage:** All 15 modules covered (tag, category, skin-type, product, page-content, blog-post, order, user, testimonial, newsletter, press-logo, analytics, auth, cart, app). All pages (12 admin + 5 public) migrated. DI via provide/inject. TanStack Query for all API calls.

**Placeholder scan:** No TBDs found. Steps 4-12 for remaining modules follow the reference patterns from Tasks 4, 7, 9 but include enough specifics (field names, endpoint paths, query keys) for implementation.

**Type consistency:** `Dependencies` type in Task 6 matches all port interfaces. All hooks use `useDependencies()` from Task 6. All adapters take `HttpClient` in constructor. Query keys are consistent across query/mutation pairs.
