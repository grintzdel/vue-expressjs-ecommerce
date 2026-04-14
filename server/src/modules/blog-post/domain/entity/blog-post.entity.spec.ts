import { BlogPostEntity } from "./blog-post.entity";

describe("BlogPostEntity", () => {
  const props = {
    id: "post-1",
    title: "My First Post",
    slug: "my-first-post",
    content: "This is the content",
    excerpt: "Short excerpt",
    featuredImage: "https://example.com/image.jpg",
    author: "Jane Doe",
    publishedAt: new Date("2024-06-01"),
    tags: ["skincare", "beauty"],
    createdAt: new Date("2024-01-01"),
  };

  it("should create a blog post entity with correct props", () => {
    const entity = new BlogPostEntity(props);

    expect(entity.id).toBe("post-1");
    expect(entity.title).toBe("My First Post");
    expect(entity.slug).toBe("my-first-post");
    expect(entity.content).toBe("This is the content");
    expect(entity.excerpt).toBe("Short excerpt");
    expect(entity.featuredImage).toBe("https://example.com/image.jpg");
    expect(entity.author).toBe("Jane Doe");
    expect(entity.publishedAt).toEqual(new Date("2024-06-01"));
    expect(entity.tags).toEqual(["skincare", "beauty"]);
    expect(entity.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should support null publishedAt", () => {
    const entity = new BlogPostEntity({ ...props, publishedAt: null });
    expect(entity.publishedAt).toBeNull();
  });

  it("should update title via setter", () => {
    const entity = new BlogPostEntity(props);
    entity.title = "Updated Title";
    expect(entity.title).toBe("Updated Title");
  });

  it("should update slug via setter", () => {
    const entity = new BlogPostEntity(props);
    entity.slug = "updated-slug";
    expect(entity.slug).toBe("updated-slug");
  });

  it("should update content via setter", () => {
    const entity = new BlogPostEntity(props);
    entity.content = "Updated content";
    expect(entity.content).toBe("Updated content");
  });

  it("should update excerpt via setter", () => {
    const entity = new BlogPostEntity(props);
    entity.excerpt = "Updated excerpt";
    expect(entity.excerpt).toBe("Updated excerpt");
  });

  it("should update featuredImage via setter", () => {
    const entity = new BlogPostEntity(props);
    entity.featuredImage = "https://example.com/new.jpg";
    expect(entity.featuredImage).toBe("https://example.com/new.jpg");
  });

  it("should update author via setter", () => {
    const entity = new BlogPostEntity(props);
    entity.author = "John Doe";
    expect(entity.author).toBe("John Doe");
  });

  it("should update publishedAt via setter", () => {
    const entity = new BlogPostEntity(props);
    entity.publishedAt = null;
    expect(entity.publishedAt).toBeNull();
  });

  it("should update tags via setter", () => {
    const entity = new BlogPostEntity(props);
    entity.tags = ["wellness"];
    expect(entity.tags).toEqual(["wellness"]);
  });

  it("should not allow setting id directly", () => {
    const entity = new BlogPostEntity(props);
    expect(entity.id).toBe("post-1");
  });
});
