import { RemoveCartItemUseCase } from "./remove-cart-item.use-case";
import { ICartItemRepository } from "../../../domain/repository/cart-item.repository.interface";
import { CartItemNotFoundError } from "../../../domain/errors/cart.error";

describe("RemoveCartItemUseCase", () => {
  let useCase: RemoveCartItemUseCase;
  let mockRepo: jest.Mocked<ICartItemRepository>;

  beforeEach(() => {
    mockRepo = {
      findBySessionId: jest.fn(),
      findById: jest.fn(),
      findBySessionAndProduct: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new RemoveCartItemUseCase(mockRepo);
  });

  it("should delete a cart item successfully", async () => {
    mockRepo.delete.mockResolvedValue(true);

    await expect(useCase.execute("item-1")).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith("item-1");
  });

  it("should throw CartItemNotFoundError when item not found", async () => {
    mockRepo.delete.mockResolvedValue(false);

    await expect(useCase.execute("nonexistent")).rejects.toThrow(CartItemNotFoundError);
  });
});
