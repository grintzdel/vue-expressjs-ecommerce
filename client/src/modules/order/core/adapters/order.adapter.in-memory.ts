import type { IOrderPort } from '../ports/order.port'
import type { OrderDomainModel } from '../model/order.domain-model'

const mockOrders: OrderDomainModel.OrderOverviewDto[] = [
  {
    id: '1',
    userId: 'user-1',
    items: [
      { productId: '1', productName: 'Crème hydratante visage', quantity: 2, unitPrice: 29.99 },
      { productId: '3', productName: 'Sérum anti-âge', quantity: 1, unitPrice: 49.99 },
    ],
    totalAmount: 109.97,
    currency: 'EUR',
    status: 'confirmed',
    shippingAddress: '12 rue de la Paix, 75001 Paris',
    createdAt: '2026-03-20T14:30:00Z',
  },
  {
    id: '2',
    userId: 'user-2',
    items: [
      { productId: '2', productName: 'Huile corps bio', quantity: 1, unitPrice: 24.99 },
    ],
    totalAmount: 24.99,
    currency: 'EUR',
    status: 'pending',
    shippingAddress: '5 avenue des Fleurs, 69001 Lyon',
    createdAt: '2026-04-01T09:15:00Z',
  },
]

export class OrderInMemoryAdapter implements IOrderPort {
  private orders: OrderDomainModel.OrderOverviewDto[] = [...mockOrders]

  private nextId = 3

  async create(data: OrderDomainModel.CreateOrderDto): Promise<OrderDomainModel.OrderOverviewDto> {
    const order: OrderDomainModel.OrderOverviewDto = { id: String(this.nextId++), ...data, status: 'pending', createdAt: new Date().toISOString() }
    this.orders.push(order)
    return order
  }

  async getAll(): Promise<OrderDomainModel.OrderOverviewDto[]> {
    return [...this.orders]
  }

  async updateStatus(id: string, status: string): Promise<OrderDomainModel.OrderOverviewDto> {
    const index = this.orders.findIndex((o) => o.id === id)
    if (index === -1) throw new Error(`Order with id ${id} not found`)
    this.orders[index] = { ...this.orders[index], status }
    return this.orders[index]
  }

  async delete(id: string): Promise<void> {
    this.orders = this.orders.filter((o) => o.id !== id)
  }
}
