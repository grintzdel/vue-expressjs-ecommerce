import type { OrderDomainModel } from '../model/order.domain-model'

export interface IOrderPort {
  getAll(): Promise<OrderDomainModel.OrderOverviewDto[]>
  create(data: OrderDomainModel.CreateOrderDto): Promise<OrderDomainModel.OrderOverviewDto>
  updateStatus(id: string, status: string): Promise<OrderDomainModel.OrderOverviewDto>
  delete(id: string): Promise<void>
}
