import { AnalyticsService } from "./analytics.service";
import { GetKpisUseCase } from "../use-cases/get-kpis/get-kpis.use-case";
import { GetMonthlyRevenueUseCase } from "../use-cases/get-monthly-revenue/get-monthly-revenue.use-case";
import { GetSalesDistributionUseCase } from "../use-cases/get-sales-distribution/get-sales-distribution.use-case";
import { GetRecentOrdersUseCase } from "../use-cases/get-recent-orders/get-recent-orders.use-case";
import { GetTopProductsUseCase } from "../use-cases/get-top-products/get-top-products.use-case";
import { GetTopClientsUseCase } from "../use-cases/get-top-clients/get-top-clients.use-case";

describe("AnalyticsService", () => {
  let service: AnalyticsService;
  let mockGetKpis: jest.Mocked<GetKpisUseCase>;
  let mockGetMonthlyRevenue: jest.Mocked<GetMonthlyRevenueUseCase>;
  let mockGetSalesDistribution: jest.Mocked<GetSalesDistributionUseCase>;
  let mockGetRecentOrders: jest.Mocked<GetRecentOrdersUseCase>;
  let mockGetTopProducts: jest.Mocked<GetTopProductsUseCase>;
  let mockGetTopClients: jest.Mocked<GetTopClientsUseCase>;

  beforeEach(() => {
    mockGetKpis = { execute: jest.fn() } as any;
    mockGetMonthlyRevenue = { execute: jest.fn() } as any;
    mockGetSalesDistribution = { execute: jest.fn() } as any;
    mockGetRecentOrders = { execute: jest.fn() } as any;
    mockGetTopProducts = { execute: jest.fn() } as any;
    mockGetTopClients = { execute: jest.fn() } as any;
    service = new AnalyticsService(
      mockGetKpis, mockGetMonthlyRevenue, mockGetSalesDistribution,
      mockGetRecentOrders, mockGetTopProducts, mockGetTopClients,
    );
  });

  it("should delegate getKpis to GetKpisUseCase", async () => {
    const expected = { newsletter: { total: 10, changePercent: 5 }, orders: { total: 5, changePercent: 0 }, revenue: { total: 100, changePercent: 10 }, clients: { total: 20, changePercent: -2 } };
    mockGetKpis.execute.mockResolvedValue(expected);

    const result = await service.getKpis();

    expect(result).toEqual(expected);
    expect(mockGetKpis.execute).toHaveBeenCalled();
  });

  it("should delegate getMonthlyRevenue to GetMonthlyRevenueUseCase", async () => {
    const expected = [{ month: "janv", amount: 1000 }];
    mockGetMonthlyRevenue.execute.mockResolvedValue(expected);

    const result = await service.getMonthlyRevenue();

    expect(result).toEqual(expected);
    expect(mockGetMonthlyRevenue.execute).toHaveBeenCalled();
  });

  it("should delegate getSalesDistribution to GetSalesDistributionUseCase", async () => {
    const expected = [{ category: "Face", amount: 500, percentage: 100 }];
    mockGetSalesDistribution.execute.mockResolvedValue(expected);

    const result = await service.getSalesDistribution();

    expect(result).toEqual(expected);
    expect(mockGetSalesDistribution.execute).toHaveBeenCalled();
  });

  it("should delegate getRecentOrders to GetRecentOrdersUseCase", async () => {
    const expected = [{ id: "1", orderNumber: "#VLV-1000", clientName: "test", products: "Sérum", total: 29.9, currency: "EUR", status: "delivered", date: "10 avr." }];
    mockGetRecentOrders.execute.mockResolvedValue(expected);

    const result = await service.getRecentOrders();

    expect(result).toEqual(expected);
    expect(mockGetRecentOrders.execute).toHaveBeenCalled();
  });

  it("should delegate getTopProducts to GetTopProductsUseCase", async () => {
    const expected = [{ rank: 1, name: "Sérum", category: "Face", sales: 10, revenue: 299 }];
    mockGetTopProducts.execute.mockResolvedValue(expected);

    const result = await service.getTopProducts();

    expect(result).toEqual(expected);
    expect(mockGetTopProducts.execute).toHaveBeenCalled();
  });

  it("should delegate getTopClients to GetTopClientsUseCase", async () => {
    const expected = [{ rank: 1, email: "a@b.com", ordersCount: 5, totalSpent: 500 }];
    mockGetTopClients.execute.mockResolvedValue(expected);

    const result = await service.getTopClients();

    expect(result).toEqual(expected);
    expect(mockGetTopClients.execute).toHaveBeenCalled();
  });

  it("should aggregate all stats in getDashboardStats", async () => {
    const kpis = { newsletter: { total: 10, changePercent: 5 }, orders: { total: 5, changePercent: 0 }, revenue: { total: 100, changePercent: 10 }, clients: { total: 20, changePercent: -2 } };
    const monthly = [{ month: "janv", amount: 1000 }];
    const distribution = [{ category: "Face", amount: 500, percentage: 100 }];
    const orders = [{ id: "1", orderNumber: "#VLV-1000", clientName: "test", products: "Sérum", total: 29.9, currency: "EUR", status: "delivered", date: "10 avr." }];
    const products = [{ rank: 1, name: "Sérum", category: "Face", sales: 10, revenue: 299 }];
    const clients = [{ rank: 1, email: "a@b.com", ordersCount: 5, totalSpent: 500 }];

    mockGetKpis.execute.mockResolvedValue(kpis);
    mockGetMonthlyRevenue.execute.mockResolvedValue(monthly);
    mockGetSalesDistribution.execute.mockResolvedValue(distribution);
    mockGetRecentOrders.execute.mockResolvedValue(orders);
    mockGetTopProducts.execute.mockResolvedValue(products);
    mockGetTopClients.execute.mockResolvedValue(clients);

    const result = await service.getDashboardStats();

    expect(result).toEqual({ kpis, monthlyRevenue: monthly, salesDistribution: distribution, recentOrders: orders, topProducts: products, topClients: clients });
  });
});
