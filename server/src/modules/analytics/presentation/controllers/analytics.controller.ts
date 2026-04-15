import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../../application/services/analytics.service";

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  async getDashboardStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await this.analyticsService.getDashboardStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  async getKpis(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.analyticsService.getKpis();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyRevenue(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.analyticsService.getMonthlyRevenue();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getSalesDistribution(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.analyticsService.getSalesDistribution();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getRecentOrders(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.analyticsService.getRecentOrders();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getTopProducts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.analyticsService.getTopProducts();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getTopClients(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.analyticsService.getTopClients();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
