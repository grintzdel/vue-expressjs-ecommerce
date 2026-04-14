import { Router } from "express";
import { OrderRepositoryMongooseMongo } from "./infrastructure/repository/order.repository.mongoose-mongo";
import { CreateOrderUseCase } from "./application/use-cases/create-order/create-order.use-case";
import { GetAllOrdersUseCase } from "./application/use-cases/get-all-orders/get-all-orders.use-case";
import { GetOrderByIdUseCase } from "./application/use-cases/get-order-by-id/get-order-by-id.use-case";
import { GetOrdersByUserUseCase } from "./application/use-cases/get-orders-by-user/get-orders-by-user.use-case";
import { UpdateOrderStatusUseCase } from "./application/use-cases/update-order-status/update-order-status.use-case";
import { DeleteOrderUseCase } from "./application/use-cases/delete-order/delete-order.use-case";
import { OrderService } from "./application/services/order.service";
import { OrderController } from "./presentation/controllers/order.controller";

export function createOrderModule(): Router {
  const router = Router();

  const orderRepository = new OrderRepositoryMongooseMongo();

  const createOrderUseCase = new CreateOrderUseCase(orderRepository);
  const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);
  const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
  const getOrdersByUserUseCase = new GetOrdersByUserUseCase(orderRepository);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  const deleteOrderUseCase = new DeleteOrderUseCase(orderRepository);

  const orderService = new OrderService(
    createOrderUseCase,
    getAllOrdersUseCase,
    getOrderByIdUseCase,
    getOrdersByUserUseCase,
    updateOrderStatusUseCase,
    deleteOrderUseCase
  );

  const controller = new OrderController(orderService);

  router.post("/", (req, res, next) => controller.createOrder(req, res, next));
  router.get("/", (req, res, next) => controller.getAllOrders(req, res, next));
  router.get("/user/:userId", (req, res, next) => controller.getOrdersByUser(req, res, next));
  router.get("/:id", (req, res, next) => controller.getOrderById(req, res, next));
  router.patch("/:id", (req, res, next) => controller.updateOrderStatus(req, res, next));
  router.delete("/:id", (req, res, next) => controller.deleteOrder(req, res, next));

  return router;
}
