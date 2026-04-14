import { PressLogoEntity } from "./press-logo.entity";

describe("PressLogoEntity", () => {
  const props = {
    id: "pl-1",
    name: "VOGUE",
    logoUrl: "https://example.com/vogue.png",
    link: "https://vogue.com",
    position: 1,
    createdAt: new Date("2024-01-01"),
  };

  it("should create a press logo entity with correct props", () => {
    const entity = new PressLogoEntity(props);

    expect(entity.id).toBe("pl-1");
    expect(entity.name).toBe("VOGUE");
    expect(entity.logoUrl).toBe("https://example.com/vogue.png");
    expect(entity.link).toBe("https://vogue.com");
    expect(entity.position).toBe(1);
    expect(entity.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should update name via setter", () => {
    const entity = new PressLogoEntity(props);
    entity.name = "Forbes";
    expect(entity.name).toBe("Forbes");
  });

  it("should update logoUrl via setter", () => {
    const entity = new PressLogoEntity(props);
    entity.logoUrl = "https://example.com/forbes.png";
    expect(entity.logoUrl).toBe("https://example.com/forbes.png");
  });

  it("should update link via setter", () => {
    const entity = new PressLogoEntity(props);
    entity.link = "https://forbes.com";
    expect(entity.link).toBe("https://forbes.com");
  });

  it("should update position via setter", () => {
    const entity = new PressLogoEntity(props);
    entity.position = 5;
    expect(entity.position).toBe(5);
  });

  it("should not allow setting id directly", () => {
    const entity = new PressLogoEntity(props);
    expect(entity.id).toBe("pl-1");
  });
});
