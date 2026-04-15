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
