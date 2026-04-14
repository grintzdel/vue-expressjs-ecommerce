import { CreateTagUseCase } from "./create-tag.use-case";
import { ITagRepository } from "../../../domain/repository/tag.repository.interface";
import { TagAlreadyExistsError } from "../../../domain/errors/tag.error";
import { TagEntity } from "../../../domain/entity/tag.entity";

describe("CreateTagUseCase", () => {
  let useCase: CreateTagUseCase;
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
    useCase = new CreateTagUseCase(mockRepo);
  });

  it("should create a tag when slug does not exist", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);
    const entity = new TagEntity({ id: "1", name: "Hydrate", slug: "hydrate", createdAt: new Date() });
    mockRepo.create.mockResolvedValue(entity);

    const result = await useCase.execute({ name: "Hydrate", slug: "hydrate" });

    expect(result.name).toBe("Hydrate");
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("hydrate");
    expect(mockRepo.create).toHaveBeenCalledWith({ name: "Hydrate", slug: "hydrate" });
  });

  it("should throw TagAlreadyExistsError when slug exists", async () => {
    const existing = new TagEntity({ id: "1", name: "Hydrate", slug: "hydrate", createdAt: new Date() });
    mockRepo.findBySlug.mockResolvedValue(existing);

    await expect(useCase.execute({ name: "Hydrate", slug: "hydrate" }))
      .rejects.toThrow(TagAlreadyExistsError);
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
