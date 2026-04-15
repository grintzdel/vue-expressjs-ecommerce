export namespace NewsletterDomainModel {
  export type SubscriptionOverviewDto = {
    id: string
    email: string
    subscribedAt: string
    isActive: boolean
    discountCode: string
  }

  export type SubscribeDto = {
    email: string
  }
}
