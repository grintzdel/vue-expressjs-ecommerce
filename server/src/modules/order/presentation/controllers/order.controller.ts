import { Request, Response, NextFunction } from "express";
import { OrderService } from "../../application/services/order.service";
import { CreateOrderRequestDto } from "../dto/create-order.request.dto";
import { UpdateOrderStatusRequestDto } from "../dto/update-order-status.request.dto";
import { OrderResponseDto } from "../dto/order.response.dto";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateOrderRequestDto(req.body);
      const order = await this.orderService.createOrder(dto);
      const response = new OrderResponseDto(order);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await this.orderService.getAllOrders();
      const response = orders.map((order) => new OrderResponseDto(order));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      const order = await this.orderService.getOrderById(id);
      const response = new OrderResponseDto(order);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getOrdersByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params["userId"] as string;
      const orders = await this.orderService.getOrdersByUser(userId);
      const response = orders.map((order) => new OrderResponseDto(order));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      const dto = new UpdateOrderStatusRequestDto(req.body);
      const order = await this.orderService.updateOrderStatus(id, dto.status);
      const response = new OrderResponseDto(order);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      await this.orderService.deleteOrder(id);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}
