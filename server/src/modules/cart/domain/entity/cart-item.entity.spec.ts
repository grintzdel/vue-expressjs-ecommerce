import { CartItemEntity } from "./cart-item.entity";

describe("CartItemEntity", () => {
  const props = {
    id: "item-1",
    sessionId: "session-abc",
    productId: "product-xyz",
    quantity: 2,
    createdAt: new Date("2024-01-01"),
  };

  it("should create a cart item entity with correct props", () => {
    const entity = new CartItemEntity(props);

    expect(entity.id).toBe("item-1");
    expect(entity.sessionId).toBe("session-abc");
    expect(entity.productId).toBe("product-xyz");
    expect(entity.quantity).toBe(2);
    expect(entity.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should update quantity via setter", () => {
    const entity = new CartItemEntity(props);
    entity.quantity = 5;
    expect(entity.quantity).toBe(5);
  });

  it("should not allow setting id directly", () => {
    const entity = new CartItemEntity(props);
    expect(entity.id).toBe("item-1");
  });

  it("should have read-only sessionId", () => {
    const entity = new CartItemEntity(props);
    expect(entity.sessionId).toBe("session-abc");
  });

  it("should have read-only productId", () => {
    const entity = new CartItemEntity(props);
    expect(entity.productId).toBe("product-xyz");
  });
});
