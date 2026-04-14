import { GetCartUseCase } from "./get-cart.use-case";
import { ICartItemRepository } from "../../../domain/repository/cart-item.repository.interface";
import { CartItemEntity } from "../../../domain/entity/cart-item.entity";

describe("GetCartUseCase", () => {
  let useCase: GetCartUseCase;
  let mockRepo: jest.Mocked<ICartItemRepository>;

  const mockItem = new CartItemEntity({
    id: "item-1",
    sessionId: "session-abc",
    productId: "product-xyz",
    quantity: 2,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockRepo = {
      findBySessionId: jest.fn(),
      findById: jest.fn(),
      findBySessionAndProduct: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetCartUseCase(mockRepo);
  });

  it("should return cart items for a session", async () => {
    mockRepo.findBySessionId.mockResolvedValue([mockItem]);

    const result = await useCase.execute("session-abc");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockItem);
    expect(mockRepo.findBySessionId).toHaveBeenCalledWith("session-abc");
  });

  it("should return empty array when session has no items", async () => {
    mockRepo.findBySessionId.mockResolvedValue([]);

    const result = await useCase.execute("empty-session");

    expect(result).toHaveLength(0);
  });
});
