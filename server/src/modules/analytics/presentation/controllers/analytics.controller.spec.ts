import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "../../application/services/analytics.service";
import { Request, Response, NextFunction } from "express";

describe("AnalyticsController", () => {
  let controller: AnalyticsController;
  let mockService: jest.Mocked<AnalyticsService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockService = {
      getDashboardStats: jest.fn(),
      getKpis: jest.fn(),
      getMonthlyRevenue: jest.fn(),
      getSalesDistribution: jest.fn(),
      getRecentOrders: jest.fn(),
      getTopProducts: jest.fn(),
      getTopClients: jest.fn(),
    } as any;
    controller = new AnalyticsController(mockService);
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it("should return 200 on getDashboardStats", async () => {
    const stats = { kpis: {}, monthlyRevenue: [], salesDistribution: [], recentOrders: [], topProducts: [], topClients: [] };
    mockService.getDashboardStats.mockResolvedValue(stats as any);

    await controller.getDashboardStats(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: stats });
  });

  it("should return 200 on getKpis", async () => {
    const data = { newsletter: { total: 10, changePercent: 5 }, orders: { total: 5, changePercent: 0 }, revenue: { total: 100, changePercent: 10 }, clients: { total: 20, changePercent: -2 } };
    mockService.getKpis.mockResolvedValue(data);

    await controller.getKpis(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data });
  });

  it("should return 200 on getMonthlyRevenue", async () => {
    const data = [{ month: "janv", amount: 1000 }];
    mockService.getMonthlyRevenue.mockResolvedValue(data);

    await controller.getMonthlyRevenue(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data });
  });

  it("should return 200 on getSalesDistribution", async () => {
    const data = [{ category: "Face", amount: 500, percentage: 100 }];
    mockService.getSalesDistribution.mockResolvedValue(data);

    await controller.getSalesDistribution(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data });
  });

  it("should return 200 on getRecentOrders", async () => {
    const data = [{ id: "1", orderNumber: "#VLV-1000", clientName: "test", products: "Sérum", total: 29.9, currency: "EUR", status: "delivered", date: "10 avr." }];
    mockService.getRecentOrders.mockResolvedValue(data);

    await controller.getRecentOrders(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data });
  });

  it("should return 200 on getTopProducts", async () => {
    const data = [{ rank: 1, name: "Sérum", category: "Face", sales: 10, revenue: 299 }];
    mockService.getTopProducts.mockResolvedValue(data);

    await controller.getTopProducts(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data });
  });

  it("should return 200 on getTopClients", async () => {
    const data = [{ rank: 1, email: "a@b.com", ordersCount: 5, totalSpent: 500 }];
    mockService.getTopClients.mockResolvedValue(data);

    await controller.getTopClients(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data });
  });

  it("should call next on error", async () => {
    const error = new Error("fail");
    mockService.getDashboardStats.mockRejectedValue(error);

    await controller.getDashboardStats(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
