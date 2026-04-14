import { GetAllTagsUseCase } from "./get-all-tags.use-case";
import { ITagRepository } from "../../../domain/repository/tag.repository.interface";
import { TagEntity } from "../../../domain/entity/tag.entity";

describe("GetAllTagsUseCase", () => {
  let useCase: GetAllTagsUseCase;
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
    useCase = new GetAllTagsUseCase(mockRepo);
  });

  it("should return all tags", async () => {
    const tags = [
      new TagEntity({ id: "1", name: "Hydrate", slug: "hydrate", createdAt: new Date() }),
      new TagEntity({ id: "2", name: "Protect", slug: "protect", createdAt: new Date() }),
    ];
    mockRepo.findAll.mockResolvedValue(tags);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no tags", async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
