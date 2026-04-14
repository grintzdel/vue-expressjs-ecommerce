import { UpdateTagUseCase } from "./update-tag.use-case";
import { ITagRepository } from "../../../domain/repository/tag.repository.interface";
import { TagNotFoundError } from "../../../domain/errors/tag.error";
import { TagEntity } from "../../../domain/entity/tag.entity";

describe("UpdateTagUseCase", () => {
  let useCase: UpdateTagUseCase;
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
    useCase = new UpdateTagUseCase(mockRepo);
  });

  it("should update and return tag when found", async () => {
    const existing = new TagEntity({ id: "1", name: "Hydrate", slug: "hydrate", createdAt: new Date() });
    const updated = new TagEntity({ id: "1", name: "Revitalizes", slug: "hydrate", createdAt: new Date() });
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.update.mockResolvedValue(updated);

    const result = await useCase.execute("1", { name: "Revitalizes" });

    expect(result.name).toBe("Revitalizes");
    expect(mockRepo.update).toHaveBeenCalledWith("1", { name: "Revitalizes" });
  });

  it("should throw TagNotFoundError when tag does not exist", async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("999", { name: "X" })).rejects.toThrow(TagNotFoundError);
    expect(mockRepo.update).not.toHaveBeenCalled();
  });
});
