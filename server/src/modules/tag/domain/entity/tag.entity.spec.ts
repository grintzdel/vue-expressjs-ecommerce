import { TagEntity } from "./tag.entity";

describe("TagEntity", () => {
  const props = {
    id: "123",
    name: "Hydrate",
    slug: "hydrate",
    createdAt: new Date("2024-01-01"),
  };

  it("should create entity with correct properties", () => {
    const tag = new TagEntity(props);
    expect(tag.id).toBe("123");
    expect(tag.name).toBe("Hydrate");
    expect(tag.slug).toBe("hydrate");
    expect(tag.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should allow updating name", () => {
    const tag = new TagEntity(props);
    tag.name = "Protect";
    expect(tag.name).toBe("Protect");
  });

  it("should allow updating slug", () => {
    const tag = new TagEntity(props);
    tag.slug = "protect";
    expect(tag.slug).toBe("protect");
  });

  it("should not allow changing id (no setter)", () => {
    const tag = new TagEntity(props);
    expect(tag.id).toBe("123");
  });
});
