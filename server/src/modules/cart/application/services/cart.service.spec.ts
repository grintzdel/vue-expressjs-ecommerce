import { CartService } from "./cart.service";
import { AddToCartUseCase } from "../use-cases/add-to-cart/add-to-cart.use-case";
import { GetCartUseCase } from "../use-cases/get-cart/get-cart.use-case";
import { UpdateCartItemUseCase } from "../use-cases/update-cart-item/update-cart-item.use-case";
import { RemoveCartItemUseCase } from "../use-cases/remove-cart-item/remove-cart-item.use-case";
import { CartItemEntity } from "../../domain/entity/cart-item.entity";

describe("CartService", () => {
  let service: CartService;
  let mockAddToCart: jest.Mocked<AddToCartUseCase>;
  let mockGetCart: jest.Mocked<GetCartUseCase>;
  let mockUpdateCartItem: jest.Mocked<UpdateCartItemUseCase>;
  let mockRemoveCartItem: jest.Mocked<RemoveCartItemUseCase>;

  const mockItem = new CartItemEntity({
    id: "item-1",
    sessionId: "session-abc",
    productId: "product-xyz",
    quantity: 2,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockAddToCart = { execute: jest.fn() } as any;
    mockGetCart = { execute: jest.fn() } as any;
    mockUpdateCartItem = { execute: jest.fn() } as any;
    mockRemoveCartItem = { execute: jest.fn() } as any;

    service = new CartService(mockAddToCart, mockGetCart, mockUpdateCartItem, mockRemoveCartItem);
  });

  it("should delegate addToCart to AddToCartUseCase", async () => {
    mockAddToCart.execute.mockResolvedValue(mockItem);

    const result = await service.addToCart({ sessionId: "session-abc", productId: "product-xyz", quantity: 2 });

    expect(result).toEqual(mockItem);
    expect(mockAddToCart.execute).toHaveBeenCalledWith({ sessionId: "session-abc", productId: "product-xyz", quantity: 2 });
  });

  it("should delegate getCart to GetCartUseCase", async () => {
    mockGetCart.execute.mockResolvedValue([mockItem]);

    const result = await service.getCart("session-abc");

    expect(result).toHaveLength(1);
    expect(mockGetCart.execute).toHaveBeenCalledWith("session-abc");
  });

  it("should delegate updateCartItem to UpdateCartItemUseCase", async () => {
    mockUpdateCartItem.execute.mockResolvedValue(mockItem);

    const result = await service.updateCartItem("item-1", 5);

    expect(result).toEqual(mockItem);
    expect(mockUpdateCartItem.execute).toHaveBeenCalledWith("item-1", 5);
  });

  it("should delegate removeCartItem to RemoveCartItemUseCase", async () => {
    mockRemoveCartItem.execute.mockResolvedValue(undefined);

    await service.removeCartItem("item-1");

    expect(mockRemoveCartItem.execute).toHaveBeenCalledWith("item-1");
  });
});
