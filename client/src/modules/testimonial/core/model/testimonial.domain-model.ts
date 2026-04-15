export namespace TestimonialDomainModel {
  export type TestimonialOverviewDto = {
    id: string
    authorName: string
    content: string
    rating: number
    isFeatured: boolean
    createdAt?: string
  }

  export type CreateTestimonialDto = {
    authorName: string
    content: string
    rating: number
    isFeatured: boolean
  }

  export type UpdateTestimonialDto = Partial<CreateTestimonialDto>
}
