import { PageEntity } from "./page.entity";

describe("PageEntity", () => {
  const props = {
    id: "page-1",
    title: "About Us",
    slug: "about-us",
    content: "Welcome to our company",
    seoMeta: { title: "About Us | Company", description: "Learn more about us" },
    isPublished: true,
    createdAt: new Date("2024-01-01"),
  };

  it("should create a page entity with correct props", () => {
    const entity = new PageEntity(props);

    expect(entity.id).toBe("page-1");
    expect(entity.title).toBe("About Us");
    expect(entity.slug).toBe("about-us");
    expect(entity.content).toBe("Welcome to our company");
    expect(entity.seoMeta).toEqual({ title: "About Us | Company", description: "Learn more about us" });
    expect(entity.isPublished).toBe(true);
    expect(entity.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should update title via setter", () => {
    const entity = new PageEntity(props);
    entity.title = "Updated Title";
    expect(entity.title).toBe("Updated Title");
  });

  it("should update slug via setter", () => {
    const entity = new PageEntity(props);
    entity.slug = "updated-slug";
    expect(entity.slug).toBe("updated-slug");
  });

  it("should update content via setter", () => {
    const entity = new PageEntity(props);
    entity.content = "Updated content";
    expect(entity.content).toBe("Updated content");
  });

  it("should update seoMeta via setter", () => {
    const entity = new PageEntity(props);
    entity.seoMeta = { title: "New SEO Title", description: "New SEO Desc" };
    expect(entity.seoMeta).toEqual({ title: "New SEO Title", description: "New SEO Desc" });
  });

  it("should update isPublished via setter", () => {
    const entity = new PageEntity(props);
    entity.isPublished = false;
    expect(entity.isPublished).toBe(false);
  });

  it("should not allow setting id directly", () => {
    const entity = new PageEntity(props);
    expect(entity.id).toBe("page-1");
  });
});
