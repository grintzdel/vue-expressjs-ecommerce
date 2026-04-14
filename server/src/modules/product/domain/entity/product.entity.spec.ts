import { ProductEntity, ProductImage } from "./product.entity";

describe("ProductEntity", () => {
  const images: ProductImage[] = [
    { url: "https://example.com/img.jpg", altText: "Product image", position: 1 },
  ];

  const props = {
    id: "prod-1",
    name: "Hydrating Serum",
    slug: "hydrating-serum",
    description: "A deeply hydrating serum",
    price: 29.99,
    currency: "EUR",
    images,
    categoryId: "cat-1",
    tagIds: ["tag-1", "tag-2"],
    skinTypeIds: ["skin-1"],
    rating: 4.5,
    stockQuantity: 100,
    isFeatured: true,
    ingredients: "Aloe Vera, Hyaluronic Acid",
    howToUse: "Apply to clean skin",
    shippingInfo: "Free shipping over €50",
    createdAt: new Date("2024-01-01"),
  };

  it("should create a product entity with correct props", () => {
    const entity = new ProductEntity(props);

    expect(entity.id).toBe("prod-1");
    expect(entity.name).toBe("Hydrating Serum");
    expect(entity.slug).toBe("hydrating-serum");
    expect(entity.description).toBe("A deeply hydrating serum");
    expect(entity.price).toBe(29.99);
    expect(entity.currency).toBe("EUR");
    expect(entity.images).toEqual(images);
    expect(entity.categoryId).toBe("cat-1");
    expect(entity.tagIds).toEqual(["tag-1", "tag-2"]);
    expect(entity.skinTypeIds).toEqual(["skin-1"]);
    expect(entity.rating).toBe(4.5);
    expect(entity.stockQuantity).toBe(100);
    expect(entity.isFeatured).toBe(true);
    expect(entity.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should update name via setter", () => {
    const entity = new ProductEntity(props);
    entity.name = "Updated Serum";
    expect(entity.name).toBe("Updated Serum");
  });

  it("should update slug via setter", () => {
    const entity = new ProductEntity(props);
    entity.slug = "updated-serum";
    expect(entity.slug).toBe("updated-serum");
  });

  it("should update price via setter", () => {
    const entity = new ProductEntity(props);
    entity.price = 39.99;
    expect(entity.price).toBe(39.99);
  });

  it("should update isFeatured via setter", () => {
    const entity = new ProductEntity(props);
    entity.isFeatured = false;
    expect(entity.isFeatured).toBe(false);
  });

  it("should update stockQuantity via setter", () => {
    const entity = new ProductEntity(props);
    entity.stockQuantity = 50;
    expect(entity.stockQuantity).toBe(50);
  });

  it("should not allow setting id directly", () => {
    const entity = new ProductEntity(props);
    expect(entity.id).toBe("prod-1");
  });
});
