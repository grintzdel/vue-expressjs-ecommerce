import { CreateOrderUseCase } from "../use-cases/create-order/create-order.use-case";
import { GetAllOrdersUseCase } from "../use-cases/get-all-orders/get-all-orders.use-case";
import { GetOrderByIdUseCase } from "../use-cases/get-order-by-id/get-order-by-id.use-case";
import { GetOrdersByUserUseCase } from "../use-cases/get-orders-by-user/get-orders-by-user.use-case";
import { UpdateOrderStatusUseCase } from "../use-cases/update-order-status/update-order-status.use-case";
import { DeleteOrderUseCase } from "../use-cases/delete-order/delete-order.use-case";
import { OrderItem } from "../../domain/entity/order.entity";

export class OrderService {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly getOrdersByUserUseCase: GetOrdersByUserUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase
  ) {}

  async createOrder(input: {
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    currency: string;
    shippingAddress: string;
  }) {
    return this.createOrderUseCase.execute(input);
  }

  async getAllOrders() {
    return this.getAllOrdersUseCase.execute();
  }

  async getOrderById(id: string) {
    return this.getOrderByIdUseCase.execute(id);
  }

  async getOrdersByUser(userId: string) {
    return this.getOrdersByUserUseCase.execute(userId);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.updateOrderStatusUseCase.execute(id, status);
  }

  async deleteOrder(id: string) {
    return this.deleteOrderUseCase.execute(id);
  }
}
