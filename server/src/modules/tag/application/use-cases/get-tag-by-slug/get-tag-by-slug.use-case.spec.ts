import { GetTagBySlugUseCase } from "./get-tag-by-slug.use-case";
import { ITagRepository } from "../../../domain/repository/tag.repository.interface";
import { TagNotFoundError } from "../../../domain/errors/tag.error";
import { TagEntity } from "../../../domain/entity/tag.entity";

describe("GetTagBySlugUseCase", () => {
  let useCase: GetTagBySlugUseCase;
  let mockRepo: jest.Mocked<ITagRepository>;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findById: jest.fn(),
      findByIds: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetTagBySlugUseCase(mockRepo);
  });

  it("should return tag when found by slug", async () => {
    const tag = new TagEntity({ id: "1", name: "Hydrate", slug: "hydrate", createdAt: new Date() });
    mockRepo.findBySlug.mockResolvedValue(tag);

    const result = await useCase.execute("hydrate");

    expect(result.slug).toBe("hydrate");
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("hydrate");
  });

  it("should throw TagNotFoundError when slug not found", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute("unknown")).rejects.toThrow(TagNotFoundError);
  });
});
