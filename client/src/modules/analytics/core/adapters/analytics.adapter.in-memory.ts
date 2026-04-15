import type { IAnalyticsPort } from '../ports/analytics.port'
import type { AnalyticsDomainModel } from '../model/analytics.domain-model'

const mockKpis: AnalyticsDomainModel.KpisDto = {
  newsletter: { total: 1248, changePercent: 12.5 },
  orders: { total: 342, changePercent: 8.3 },
  revenue: { total: 18750, changePercent: 15.2 },
  clients: { total: 895, changePercent: 6.7 },
}

const mockMonthlyRevenue: AnalyticsDomainModel.MonthlyRevenueDto[] = [
  { month: 'Jan', amount: 1200 }, { month: 'Fév', amount: 1450 },
  { month: 'Mar', amount: 1800 }, { month: 'Avr', amount: 1650 },
  { month: 'Mai', amount: 2100 }, { month: 'Juin', amount: 2350 },
  { month: 'Juil', amount: 1950 }, { month: 'Août', amount: 2200 },
  { month: 'Sep', amount: 2500 }, { month: 'Oct', amount: 2750 },
  { month: 'Nov', amount: 3100 }, { month: 'Déc', amount: 3500 },
]

const mockSalesDistribution: AnalyticsDomainModel.SalesDistributionDto[] = [
  { category: 'Soins visage', amount: 9800, percentage: 52.3 },
  { category: 'Soins corps', amount: 5600, percentage: 29.9 },
  { category: 'Accessoires', amount: 2150, percentage: 11.5 },
  { category: 'Coffrets', amount: 1200, percentage: 6.3 },
]

const mockRecentOrders: AnalyticsDomainModel.RecentOrderDto[] = [
  { id: '1', orderNumber: 'CMD-2026-001', clientName: 'Alice Dupont', products: 'Crème hydratante x2, Sérum anti-âge x1', total: 109.97, currency: 'EUR', status: 'confirmed', date: '2026-04-10T14:30:00Z' },
  { id: '2', orderNumber: 'CMD-2026-002', clientName: 'Bob Martin', products: 'Huile corps bio x1', total: 24.99, currency: 'EUR', status: 'pending', date: '2026-04-12T09:15:00Z' },
  { id: '3', orderNumber: 'CMD-2026-003', clientName: 'Claire Bernard', products: 'Coffret découverte x1', total: 59.99, currency: 'EUR', status: 'shipped', date: '2026-04-13T16:45:00Z' },
]

const mockTopProducts: AnalyticsDomainModel.TopProductDto[] = [
  { rank: 1, name: 'Crème hydratante visage', category: 'Soins visage', sales: 84, revenue: 2519.16 },
  { rank: 2, name: 'Sérum anti-âge', category: 'Soins visage', sales: 62, revenue: 3099.38 },
  { rank: 3, name: 'Huile corps bio', category: 'Soins corps', sales: 57, revenue: 1424.43 },
  { rank: 4, name: 'Masque purifiant', category: 'Soins visage', sales: 45, revenue: 1124.55 },
  { rank: 5, name: 'Coffret découverte', category: 'Coffrets', sales: 20, revenue: 1199.80 },
]

const mockTopClients: AnalyticsDomainModel.TopClientDto[] = [
  { rank: 1, email: 'alice@example.com', ordersCount: 8, totalSpent: 524.80 },
  { rank: 2, email: 'sophie.r@example.com', ordersCount: 6, totalSpent: 389.50 },
  { rank: 3, email: 'lea.m@example.com', ordersCount: 5, totalSpent: 312.45 },
  { rank: 4, email: 'marie.d@example.com', ordersCount: 4, totalSpent: 248.90 },
  { rank: 5, email: 'camille.b@example.com', ordersCount: 3, totalSpent: 179.97 },
]

export class AnalyticsInMemoryAdapter implements IAnalyticsPort {
  async getDashboard(): Promise<AnalyticsDomainModel.DashboardDto> {
    return {
      kpis: mockKpis,
      monthlyRevenue: mockMonthlyRevenue,
      salesDistribution: mockSalesDistribution,
      recentOrders: mockRecentOrders,
      topProducts: mockTopProducts,
      topClients: mockTopClients,
    }
  }

  async getKpis(): Promise<AnalyticsDomainModel.KpisDto> { return mockKpis }
  async getMonthlyRevenue(): Promise<AnalyticsDomainModel.MonthlyRevenueDto[]> { return mockMonthlyRevenue }
  async getSalesDistribution(): Promise<AnalyticsDomainModel.SalesDistributionDto[]> { return mockSalesDistribution }
  async getRecentOrders(): Promise<AnalyticsDomainModel.RecentOrderDto[]> { return mockRecentOrders }
  async getTopProducts(): Promise<AnalyticsDomainModel.TopProductDto[]> { return mockTopProducts }
  async getTopClients(): Promise<AnalyticsDomainModel.TopClientDto[]> { return mockTopClients }
}
