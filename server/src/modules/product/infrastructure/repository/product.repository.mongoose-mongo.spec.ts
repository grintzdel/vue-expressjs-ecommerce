import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ProductRepositoryMongooseMongo } from "./product.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: ProductRepositoryMongooseMongo;

const baseData = {
  name: "Hydrating Serum",
  slug: "hydrating-serum",
  description: "A deeply hydrating serum",
  price: 29.99,
  currency: "EUR",
  images: [{ url: "https://example.com/img.jpg", altText: "Image", position: 1 }],
  categoryId: "cat-1",
  tagIds: ["tag-1"],
  skinTypeIds: ["skin-1"],
  rating: 0,
  stockQuantity: 100,
  isFeatured: false,
  ingredients: "",
  howToUse: "",
  shippingInfo: "",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new ProductRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("ProductRepositoryMongooseMongo", () => {
  it("should create a product and return entity", async () => {
    const product = await repository.create(baseData);

    expect(product.id).toBeDefined();
    expect(product.name).toBe("Hydrating Serum");
    expect(product.slug).toBe("hydrating-serum");
    expect(product.price).toBe(29.99);
    expect(product.currency).toBe("EUR");
    expect(product.categoryId).toBe("cat-1");
    expect(product.createdAt).toBeInstanceOf(Date);
  });

  it("should find all products", async () => {
    await repository.create({ ...baseData, slug: "product-a", name: "Product A" });
    await repository.create({ ...baseData, slug: "product-b", name: "Product B" });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it("should find product by slug", async () => {
    await repository.create(baseData);

    const found = await repository.findBySlug("hydrating-serum");
    expect(found).not.toBeNull();
    expect(found!.slug).toBe("hydrating-serum");
  });

  it("should return null for unknown slug", async () => {
    const found = await repository.findBySlug("unknown-slug");
    expect(found).toBeNull();
  });

  it("should find product by id", async () => {
    const created = await repository.create(baseData);

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
  });

  it("should return null for unknown id", async () => {
    const found = await repository.findById(new mongoose.Types.ObjectId().toString());
    expect(found).toBeNull();
  });

  it("should find products by category", async () => {
    await repository.create({ ...baseData, slug: "prod-a", categoryId: "cat-1" });
    await repository.create({ ...baseData, slug: "prod-b", categoryId: "cat-2" });

    const results = await repository.findByCategory("cat-1");
    expect(results).toHaveLength(1);
    expect(results[0]!.categoryId).toBe("cat-1");
  });

  it("should find featured products", async () => {
    await repository.create({ ...baseData, slug: "featured-prod", isFeatured: true });
    await repository.create({ ...baseData, slug: "normal-prod", isFeatured: false });

    const results = await repository.findFeatured();
    expect(results).toHaveLength(1);
    expect(results[0]!.isFeatured).toBe(true);
  });

  it("should update a product", async () => {
    const created = await repository.create(baseData);

    const updated = await repository.update(created.id, { name: "Updated Serum", price: 39.99 });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe("Updated Serum");
    expect(updated!.price).toBe(39.99);
  });

  it("should return null when updating non-existent product", async () => {
    const updated = await repository.update(new mongoose.Types.ObjectId().toString(), { name: "X" });
    expect(updated).toBeNull();
  });

  it("should delete a product and return true", async () => {
    const created = await repository.create(baseData);

    const deleted = await repository.delete(created.id);
    expect(deleted).toBe(true);

    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  it("should return false when deleting non-existent product", async () => {
    const deleted = await repository.delete(new mongoose.Types.ObjectId().toString());
    expect(deleted).toBe(false);
  });
});
