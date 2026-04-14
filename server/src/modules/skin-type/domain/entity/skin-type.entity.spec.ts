import { SkinTypeEntity } from "./skin-type.entity";

describe("SkinTypeEntity", () => {
  const props = {
    id: "abc123",
    name: "Oily",
    slug: "oily",
    createdAt: new Date("2024-01-01"),
  };

  it("should create entity with correct properties", () => {
    const skinType = new SkinTypeEntity(props);
    expect(skinType.id).toBe("abc123");
    expect(skinType.name).toBe("Oily");
    expect(skinType.slug).toBe("oily");
    expect(skinType.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should allow updating name", () => {
    const skinType = new SkinTypeEntity(props);
    skinType.name = "Dry";
    expect(skinType.name).toBe("Dry");
  });

  it("should allow updating slug", () => {
    const skinType = new SkinTypeEntity(props);
    skinType.slug = "dry";
    expect(skinType.slug).toBe("dry");
  });

  it("should not expose a setter for id", () => {
    const skinType = new SkinTypeEntity(props);
    expect(skinType.id).toBe("abc123");
  });

  it("should not expose a setter for createdAt", () => {
    const skinType = new SkinTypeEntity(props);
    expect(skinType.createdAt).toEqual(new Date("2024-01-01"));
  });
});
