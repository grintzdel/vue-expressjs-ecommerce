export namespace OrderDomainModel {
  export type OrderItemDto = {
    productId: string
    productName: string
    quantity: number
    unitPrice: number
  }

  export type OrderOverviewDto = {
    id: string
    userId: string
    items: OrderItemDto[]
    totalAmount: number
    currency: string
    status: string
    shippingAddress: string
    createdAt: string
  }

  export type CreateOrderDto = Omit<OrderOverviewDto, 'id' | 'createdAt' | 'status'>
}
