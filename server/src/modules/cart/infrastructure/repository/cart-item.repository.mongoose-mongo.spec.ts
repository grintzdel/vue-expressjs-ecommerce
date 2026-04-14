import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { CartItemRepositoryMongooseMongo } from "./cart-item.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: CartItemRepositoryMongooseMongo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new CartItemRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("CartItemRepositoryMongooseMongo", () => {
  it("should create a cart item and return entity", async () => {
    const item = await repository.create({
      sessionId: "session-abc",
      productId: "product-xyz",
      quantity: 2,
    });

    expect(item.id).toBeDefined();
    expect(item.sessionId).toBe("session-abc");
    expect(item.productId).toBe("product-xyz");
    expect(item.quantity).toBe(2);
    expect(item.createdAt).toBeInstanceOf(Date);
  });

  it("should find cart items by sessionId", async () => {
    await repository.create({ sessionId: "session-abc", productId: "product-1", quantity: 1 });
    await repository.create({ sessionId: "session-abc", productId: "product-2", quantity: 3 });
    await repository.create({ sessionId: "session-other", productId: "product-1", quantity: 1 });

    const items = await repository.findBySessionId("session-abc");
    expect(items).toHaveLength(2);
  });

  it("should return empty array when no items for session", async () => {
    const items = await repository.findBySessionId("nonexistent-session");
    expect(items).toHaveLength(0);
  });

  it("should find cart item by id", async () => {
    const created = await repository.create({ sessionId: "session-abc", productId: "product-xyz", quantity: 1 });

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
  });

  it("should return null for unknown id", async () => {
    const found = await repository.findById(new mongoose.Types.ObjectId().toString());
    expect(found).toBeNull();
  });

  it("should find cart item by session and product", async () => {
    await repository.create({ sessionId: "session-abc", productId: "product-xyz", quantity: 2 });

    const found = await repository.findBySessionAndProduct("session-abc", "product-xyz");
    expect(found).not.toBeNull();
    expect(found!.sessionId).toBe("session-abc");
    expect(found!.productId).toBe("product-xyz");
  });

  it("should return null when session+product combo not found", async () => {
    const found = await repository.findBySessionAndProduct("session-abc", "product-xyz");
    expect(found).toBeNull();
  });

  it("should update a cart item quantity", async () => {
    const created = await repository.create({ sessionId: "session-abc", productId: "product-xyz", quantity: 1 });

    const updated = await repository.update(created.id, { quantity: 5 });
    expect(updated).not.toBeNull();
    expect(updated!.quantity).toBe(5);
  });

  it("should return null when updating non-existent cart item", async () => {
    const updated = await repository.update(new mongoose.Types.ObjectId().toString(), { quantity: 5 });
    expect(updated).toBeNull();
  });

  it("should delete a cart item and return true", async () => {
    const created = await repository.create({ sessionId: "session-abc", productId: "product-xyz", quantity: 1 });

    const deleted = await repository.delete(created.id);
    expect(deleted).toBe(true);

    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  it("should return false when deleting non-existent cart item", async () => {
    const deleted = await repository.delete(new mongoose.Types.ObjectId().toString());
    expect(deleted).toBe(false);
  });
});
