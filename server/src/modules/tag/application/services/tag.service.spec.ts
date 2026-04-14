import { TagService } from "./tag.service";
import { CreateTagUseCase } from "../use-cases/create-tag/create-tag.use-case";
import { GetAllTagsUseCase } from "../use-cases/get-all-tags/get-all-tags.use-case";
import { GetTagBySlugUseCase } from "../use-cases/get-tag-by-slug/get-tag-by-slug.use-case";
import { UpdateTagUseCase } from "../use-cases/update-tag/update-tag.use-case";
import { DeleteTagUseCase } from "../use-cases/delete-tag/delete-tag.use-case";
import { TagEntity } from "../../domain/entity/tag.entity";

describe("TagService", () => {
  let service: TagService;
  let mockCreate: jest.Mocked<CreateTagUseCase>;
  let mockGetAll: jest.Mocked<GetAllTagsUseCase>;
  let mockGetBySlug: jest.Mocked<GetTagBySlugUseCase>;
  let mockUpdate: jest.Mocked<UpdateTagUseCase>;
  let mockDelete: jest.Mocked<DeleteTagUseCase>;

  const sampleTag = new TagEntity({ id: "1", name: "Hydrate", slug: "hydrate", createdAt: new Date() });

  beforeEach(() => {
    mockCreate = { execute: jest.fn() } as any;
    mockGetAll = { execute: jest.fn() } as any;
    mockGetBySlug = { execute: jest.fn() } as any;
    mockUpdate = { execute: jest.fn() } as any;
    mockDelete = { execute: jest.fn() } as any;

    service = new TagService(mockCreate, mockGetAll, mockGetBySlug, mockUpdate, mockDelete);
  });

  it("should delegate createTag to CreateTagUseCase", async () => {
    mockCreate.execute.mockResolvedValue(sampleTag);

    const result = await service.createTag({ name: "Hydrate", slug: "hydrate" });

    expect(result).toEqual(sampleTag);
    expect(mockCreate.execute).toHaveBeenCalledWith({ name: "Hydrate", slug: "hydrate" });
  });

  it("should delegate getAllTags to GetAllTagsUseCase", async () => {
    mockGetAll.execute.mockResolvedValue([sampleTag]);

    const result = await service.getAllTags();

    expect(result).toHaveLength(1);
    expect(mockGetAll.execute).toHaveBeenCalled();
  });

  it("should delegate getTagBySlug to GetTagBySlugUseCase", async () => {
    mockGetBySlug.execute.mockResolvedValue(sampleTag);

    const result = await service.getTagBySlug("hydrate");

    expect(result).toEqual(sampleTag);
    expect(mockGetBySlug.execute).toHaveBeenCalledWith("hydrate");
  });

  it("should delegate updateTag to UpdateTagUseCase", async () => {
    const updatedTag = new TagEntity({ id: "1", name: "Protect", slug: "hydrate", createdAt: new Date() });
    mockUpdate.execute.mockResolvedValue(updatedTag);

    const result = await service.updateTag("1", { name: "Protect" });

    expect(result.name).toBe("Protect");
    expect(mockUpdate.execute).toHaveBeenCalledWith("1", { name: "Protect" });
  });

  it("should delegate deleteTag to DeleteTagUseCase", async () => {
    mockDelete.execute.mockResolvedValue(undefined);

    await expect(service.deleteTag("1")).resolves.toBeUndefined();
    expect(mockDelete.execute).toHaveBeenCalledWith("1");
  });
});
