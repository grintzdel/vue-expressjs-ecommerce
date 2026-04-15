import type { HttpClient } from '@/modules/shared/http/http-client'
import type { IOrderPort } from '../ports/order.port'
import type { OrderDomainModel } from '../model/order.domain-model'

export class OrderHttpAdapter implements IOrderPort {
  constructor(private readonly httpClient: HttpClient) {}

  async create(data: OrderDomainModel.CreateOrderDto): Promise<OrderDomainModel.OrderOverviewDto> {
    const result = await this.httpClient.post<OrderDomainModel.OrderOverviewDto>('/orders', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getAll(): Promise<OrderDomainModel.OrderOverviewDto[]> {
    const result = await this.httpClient.get<OrderDomainModel.OrderOverviewDto[]>('/orders')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async updateStatus(id: string, status: string): Promise<OrderDomainModel.OrderOverviewDto> {
    const result = await this.httpClient.patch<OrderDomainModel.OrderOverviewDto>(`/orders/${id}`, { status })
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/orders/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
