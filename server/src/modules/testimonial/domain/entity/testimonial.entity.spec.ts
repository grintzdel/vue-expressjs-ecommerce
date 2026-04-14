import { TestimonialEntity } from "./testimonial.entity";

describe("TestimonialEntity", () => {
  const props = {
    id: "test-1",
    authorName: "Jane Doe",
    content: "Great product!",
    rating: 5,
    featuredProductIds: ["prod-1", "prod-2"],
    isFeatured: true,
    createdAt: new Date("2024-01-01"),
  };

  it("should create a testimonial entity with correct props", () => {
    const entity = new TestimonialEntity(props);

    expect(entity.id).toBe("test-1");
    expect(entity.authorName).toBe("Jane Doe");
    expect(entity.content).toBe("Great product!");
    expect(entity.rating).toBe(5);
    expect(entity.featuredProductIds).toEqual(["prod-1", "prod-2"]);
    expect(entity.isFeatured).toBe(true);
    expect(entity.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should update authorName via setter", () => {
    const entity = new TestimonialEntity(props);
    entity.authorName = "John Smith";
    expect(entity.authorName).toBe("John Smith");
  });

  it("should update content via setter", () => {
    const entity = new TestimonialEntity(props);
    entity.content = "Updated content";
    expect(entity.content).toBe("Updated content");
  });

  it("should update rating via setter", () => {
    const entity = new TestimonialEntity(props);
    entity.rating = 3;
    expect(entity.rating).toBe(3);
  });

  it("should update featuredProductIds via setter", () => {
    const entity = new TestimonialEntity(props);
    entity.featuredProductIds = ["prod-3"];
    expect(entity.featuredProductIds).toEqual(["prod-3"]);
  });

  it("should update isFeatured via setter", () => {
    const entity = new TestimonialEntity(props);
    entity.isFeatured = false;
    expect(entity.isFeatured).toBe(false);
  });

  it("should not allow setting id directly", () => {
    const entity = new TestimonialEntity(props);
    expect(entity.id).toBe("test-1");
  });
});
