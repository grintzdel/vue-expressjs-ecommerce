export namespace AnalyticsDomainModel {
  export type KpiItemDto = {
    total: number
    changePercent: number
  }

  export type KpisDto = {
    newsletter: KpiItemDto
    orders: KpiItemDto
    revenue: KpiItemDto
    clients: KpiItemDto
  }

  export type MonthlyRevenueDto = {
    month: string
    amount: number
  }

  export type SalesDistributionDto = {
    category: string
    amount: number
    percentage: number
  }

  export type RecentOrderDto = {
    id: string
    orderNumber: string
    clientName: string
    products: string
    total: number
    currency: string
    status: string
    date: string
  }

  export type TopProductDto = {
    rank: number
    name: string
    category: string
    sales: number
    revenue: number
  }

  export type TopClientDto = {
    rank: number
    email: string
    ordersCount: number
    totalSpent: number
  }

  export type DashboardDto = {
    kpis: KpisDto
    monthlyRevenue: MonthlyRevenueDto[]
    salesDistribution: SalesDistributionDto[]
    recentOrders: RecentOrderDto[]
    topProducts: TopProductDto[]
    topClients: TopClientDto[]
  }
}
