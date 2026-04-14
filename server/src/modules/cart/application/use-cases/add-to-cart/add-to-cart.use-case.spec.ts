import { AddToCartUseCase } from "./add-to-cart.use-case";
import { ICartItemRepository } from "../../../domain/repository/cart-item.repository.interface";
import { CartItemEntity } from "../../../domain/entity/cart-item.entity";

describe("AddToCartUseCase", () => {
  let useCase: AddToCartUseCase;
  let mockRepo: jest.Mocked<ICartItemRepository>;

  const makeEntity = (overrides: Partial<CartItemEntity> = {}) =>
    new CartItemEntity({
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
    useCase = new AddToCartUseCase(mockRepo);
  });

  it("should create a new cart item when no existing item found", async () => {
    const newItem = makeEntity();
    mockRepo.findBySessionAndProduct.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(newItem);

    const result = await useCase.execute({ sessionId: "session-abc", productId: "product-xyz", quantity: 2 });

    expect(result).toEqual(newItem);
    expect(mockRepo.findBySessionAndProduct).toHaveBeenCalledWith("session-abc", "product-xyz");
    expect(mockRepo.create).toHaveBeenCalledWith({ sessionId: "session-abc", productId: "product-xyz", quantity: 2 });
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it("should increment quantity when item already exists in cart", async () => {
    const existing = new CartItemEntity({
      id: "item-1",
      sessionId: "session-abc",
      productId: "product-xyz",
      quantity: 3,
      createdAt: new Date(),
    });
    const updatedItem = new CartItemEntity({
      id: "item-1",
      sessionId: "session-abc",
      productId: "product-xyz",
      quantity: 5,
      createdAt: new Date(),
    });

    mockRepo.findBySessionAndProduct.mockResolvedValue(existing);
    mockRepo.update.mockResolvedValue(updatedItem);

    const result = await useCase.execute({ sessionId: "session-abc", productId: "product-xyz", quantity: 2 });

    expect(result).toEqual(updatedItem);
    expect(mockRepo.update).toHaveBeenCalledWith("item-1", { quantity: 5 });
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
