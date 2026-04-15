import { Router } from "express";
import { GetKpisUseCase } from "./application/use-cases/get-kpis/get-kpis.use-case";
import { GetMonthlyRevenueUseCase } from "./application/use-cases/get-monthly-revenue/get-monthly-revenue.use-case";
import { GetSalesDistributionUseCase } from "./application/use-cases/get-sales-distribution/get-sales-distribution.use-case";
import { GetRecentOrdersUseCase } from "./application/use-cases/get-recent-orders/get-recent-orders.use-case";
import { GetTopProductsUseCase } from "./application/use-cases/get-top-products/get-top-products.use-case";
import { GetTopClientsUseCase } from "./application/use-cases/get-top-clients/get-top-clients.use-case";
import { AnalyticsService } from "./application/services/analytics.service";
import { AnalyticsController } from "./presentation/controllers/analytics.controller";

export function createAnalyticsModule(): Router {
  const router = Router();

  const getKpisUseCase = new GetKpisUseCase();
  const getMonthlyRevenueUseCase = new GetMonthlyRevenueUseCase();
  const getSalesDistributionUseCase = new GetSalesDistributionUseCase();
  const getRecentOrdersUseCase = new GetRecentOrdersUseCase();
  const getTopProductsUseCase = new GetTopProductsUseCase();
  const getTopClientsUseCase = new GetTopClientsUseCase();

  const analyticsService = new AnalyticsService(
    getKpisUseCase,
    getMonthlyRevenueUseCase,
    getSalesDistributionUseCase,
    getRecentOrdersUseCase,
    getTopProductsUseCase,
    getTopClientsUseCase,
  );

  const controller = new AnalyticsController(analyticsService);

  router.get("/dashboard", (req, res, next) => controller.getDashboardStats(req, res, next));
  router.get("/kpis", (req, res, next) => controller.getKpis(req, res, next));
  router.get("/monthly-revenue", (req, res, next) => controller.getMonthlyRevenue(req, res, next));
  router.get("/sales-distribution", (req, res, next) => controller.getSalesDistribution(req, res, next));
  router.get("/recent-orders", (req, res, next) => controller.getRecentOrders(req, res, next));
  router.get("/top-products", (req, res, next) => controller.getTopProducts(req, res, next));
  router.get("/top-clients", (req, res, next) => controller.getTopClients(req, res, next));

  return router;
}
