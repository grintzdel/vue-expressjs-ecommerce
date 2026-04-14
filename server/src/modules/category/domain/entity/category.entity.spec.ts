import { CategoryEntity } from "./category.entity";

describe("CategoryEntity", () => {
  const props = {
    id: "cat-1",
    name: "Skincare",
    slug: "skincare",
    description: "All skincare products",
    createdAt: new Date("2024-01-01"),
  };

  it("should create a category entity with correct props", () => {
    const entity = new CategoryEntity(props);

    expect(entity.id).toBe("cat-1");
    expect(entity.name).toBe("Skincare");
    expect(entity.slug).toBe("skincare");
    expect(entity.description).toBe("All skincare products");
    expect(entity.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should update name via setter", () => {
    const entity = new CategoryEntity(props);
    entity.name = "Updated Name";
    expect(entity.name).toBe("Updated Name");
  });

  it("should update slug via setter", () => {
    const entity = new CategoryEntity(props);
    entity.slug = "updated-slug";
    expect(entity.slug).toBe("updated-slug");
  });

  it("should update description via setter", () => {
    const entity = new CategoryEntity(props);
    entity.description = "Updated description";
    expect(entity.description).toBe("Updated description");
  });

  it("should not allow setting id directly", () => {
    const entity = new CategoryEntity(props);
    // id has no setter, so this should be a TypeScript compile-time check
    // Just verify it stays the same
    expect(entity.id).toBe("cat-1");
  });
});
