import { IBlogPostRepository } from "../../domain/repository/blog-post.repository.interface";
import { BlogPostEntity } from "../../domain/entity/blog-post.entity";
import { BlogPostModel } from "../schema/blog-post.schema";

export class BlogPostRepositoryMongooseMongo implements IBlogPostRepository {
  private toEntity(doc: any): BlogPostEntity {
    return new BlogPostEntity({
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      excerpt: doc.excerpt,
      featuredImage: doc.featuredImage,
      author: doc.author,
      publishedAt: doc.publishedAt ?? null,
      tags: doc.tags ?? [],
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<BlogPostEntity[]> {
    const docs = await BlogPostModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findBySlug(slug: string): Promise<BlogPostEntity | null> {
    const doc = await BlogPostModel.findOne({ slug });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<BlogPostEntity | null> {
    const doc = await BlogPostModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(data: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    author: string;
    publishedAt: Date | null;
    tags: string[];
  }): Promise<BlogPostEntity> {
    const doc = await BlogPostModel.create(data);
    return this.toEntity(doc);
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      content: string;
      excerpt: string;
      featuredImage: string;
      author: string;
      publishedAt: Date | null;
      tags: string[];
    }>
  ): Promise<BlogPostEntity | null> {
    const doc = await BlogPostModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await BlogPostModel.findByIdAndDelete(id);
    return result !== null;
  }
}
