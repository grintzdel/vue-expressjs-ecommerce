import { DeleteTagUseCase } from "./delete-tag.use-case";
import { ITagRepository } from "../../../domain/repository/tag.repository.interface";
import { TagNotFoundError } from "../../../domain/errors/tag.error";
import { TagEntity } from "../../../domain/entity/tag.entity";

describe("DeleteTagUseCase", () => {
  let useCase: DeleteTagUseCase;
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
    useCase = new DeleteTagUseCase(mockRepo);
  });

  it("should delete tag when found", async () => {
    const existing = new TagEntity({ id: "1", name: "Hydrate", slug: "hydrate", createdAt: new Date() });
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.delete.mockResolvedValue(true);

    await expect(useCase.execute("1")).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw TagNotFoundError when tag does not exist", async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("999")).rejects.toThrow(TagNotFoundError);
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});
