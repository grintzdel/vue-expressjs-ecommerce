import { UpdateCartItemUseCase } from "./update-cart-item.use-case";
import { ICartItemRepository } from "../../../domain/repository/cart-item.repository.interface";
import { CartItemEntity } from "../../../domain/entity/cart-item.entity";
import { CartItemNotFoundError } from "../../../domain/errors/cart.error";

describe("UpdateCartItemUseCase", () => {
  let useCase: UpdateCartItemUseCase;
  let mockRepo: jest.Mocked<ICartItemRepository>;

  const mockItem = new CartItemEntity({
    id: "item-1",
    sessionId: "session-abc",
    productId: "product-xyz",
    quantity: 5,
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
    useCase = new UpdateCartItemUseCase(mockRepo);
  });

  it("should update cart item quantity", async () => {
    mockRepo.update.mockResolvedValue(mockItem);

    const result = await useCase.execute("item-1", 5);

    expect(result).toEqual(mockItem);
    expect(mockRepo.update).toHaveBeenCalledWith("item-1", { quantity: 5 });
  });

  it("should throw CartItemNotFoundError when item not found", async () => {
    mockRepo.update.mockResolvedValue(null);

    await expect(useCase.execute("nonexistent", 5)).rejects.toThrow(CartItemNotFoundError);
  });
});
