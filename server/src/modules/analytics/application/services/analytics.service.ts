import { GetKpisUseCase, KpisResult } from "../use-cases/get-kpis/get-kpis.use-case";
import { GetMonthlyRevenueUseCase, MonthlyRevenueItem } from "../use-cases/get-monthly-revenue/get-monthly-revenue.use-case";
import { GetSalesDistributionUseCase, SalesDistributionItem } from "../use-cases/get-sales-distribution/get-sales-distribution.use-case";
import { GetRecentOrdersUseCase, RecentOrderItem } from "../use-cases/get-recent-orders/get-recent-orders.use-case";
import { GetTopProductsUseCase, TopProductItem } from "../use-cases/get-top-products/get-top-products.use-case";
import { GetTopClientsUseCase, TopClientItem } from "../use-cases/get-top-clients/get-top-clients.use-case";

export interface DashboardStats {
  kpis: KpisResult;
  monthlyRevenue: MonthlyRevenueItem[];
  salesDistribution: SalesDistributionItem[];
  recentOrders: RecentOrderItem[];
  topProducts: TopProductItem[];
  topClients: TopClientItem[];
}

export class AnalyticsService {
  constructor(
    private readonly getKpisUseCase: GetKpisUseCase,
    private readonly getMonthlyRevenueUseCase: GetMonthlyRevenueUseCase,
    private readonly getSalesDistributionUseCase: GetSalesDistributionUseCase,
    private readonly getRecentOrdersUseCase: GetRecentOrdersUseCase,
    private readonly getTopProductsUseCase: GetTopProductsUseCase,
    private readonly getTopClientsUseCase: GetTopClientsUseCase,
  ) {}

  async getKpis(): Promise<KpisResult> {
    return this.getKpisUseCase.execute();
  }

  async getMonthlyRevenue(): Promise<MonthlyRevenueItem[]> {
    return this.getMonthlyRevenueUseCase.execute();
  }

  async getSalesDistribution(): Promise<SalesDistributionItem[]> {
    return this.getSalesDistributionUseCase.execute();
  }

  async getRecentOrders(): Promise<RecentOrderItem[]> {
    return this.getRecentOrdersUseCase.execute();
  }

  async getTopProducts(): Promise<TopProductItem[]> {
    return this.getTopProductsUseCase.execute();
  }

  async getTopClients(): Promise<TopClientItem[]> {
    return this.getTopClientsUseCase.execute();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [kpis, monthlyRevenue, salesDistribution, recentOrders, topProducts, topClients] =
      await Promise.all([
        this.getKpis(),
        this.getMonthlyRevenue(),
        this.getSalesDistribution(),
        this.getRecentOrders(),
        this.getTopProducts(),
        this.getTopClients(),
      ]);

    return { kpis, monthlyRevenue, salesDistribution, recentOrders, topProducts, topClients };
  }
}
