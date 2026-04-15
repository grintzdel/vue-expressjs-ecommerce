import type { HttpClient } from '@/modules/shared/http/http-client'
import type { IAnalyticsPort } from '../ports/analytics.port'
import type { AnalyticsDomainModel } from '../model/analytics.domain-model'

export class AnalyticsHttpAdapter implements IAnalyticsPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getDashboard(): Promise<AnalyticsDomainModel.DashboardDto> {
    const result = await this.httpClient.get<AnalyticsDomainModel.DashboardDto>('/analytics/dashboard')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getKpis(): Promise<AnalyticsDomainModel.KpisDto> {
    const result = await this.httpClient.get<AnalyticsDomainModel.KpisDto>('/analytics/kpis')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getMonthlyRevenue(): Promise<AnalyticsDomainModel.MonthlyRevenueDto[]> {
    const result = await this.httpClient.get<AnalyticsDomainModel.MonthlyRevenueDto[]>('/analytics/monthly-revenue')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getSalesDistribution(): Promise<AnalyticsDomainModel.SalesDistributionDto[]> {
    const result = await this.httpClient.get<AnalyticsDomainModel.SalesDistributionDto[]>('/analytics/sales-distribution')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getRecentOrders(): Promise<AnalyticsDomainModel.RecentOrderDto[]> {
    const result = await this.httpClient.get<AnalyticsDomainModel.RecentOrderDto[]>('/analytics/recent-orders')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getTopProducts(): Promise<AnalyticsDomainModel.TopProductDto[]> {
    const result = await this.httpClient.get<AnalyticsDomainModel.TopProductDto[]>('/analytics/top-products')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getTopClients(): Promise<AnalyticsDomainModel.TopClientDto[]> {
    const result = await this.httpClient.get<AnalyticsDomainModel.TopClientDto[]>('/analytics/top-clients')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }
}
