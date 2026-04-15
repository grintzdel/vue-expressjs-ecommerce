import type { AnalyticsDomainModel } from '../model/analytics.domain-model'

export interface IAnalyticsPort {
  getDashboard(): Promise<AnalyticsDomainModel.DashboardDto>
  getKpis(): Promise<AnalyticsDomainModel.KpisDto>
  getMonthlyRevenue(): Promise<AnalyticsDomainModel.MonthlyRevenueDto[]>
  getSalesDistribution(): Promise<AnalyticsDomainModel.SalesDistributionDto[]>
  getRecentOrders(): Promise<AnalyticsDomainModel.RecentOrderDto[]>
  getTopProducts(): Promise<AnalyticsDomainModel.TopProductDto[]>
  getTopClients(): Promise<AnalyticsDomainModel.TopClientDto[]>
}
