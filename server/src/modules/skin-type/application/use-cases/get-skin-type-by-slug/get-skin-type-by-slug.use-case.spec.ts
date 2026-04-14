import { GetSkinTypeBySlugUseCase } from "./get-skin-type-by-slug.use-case";
import { ISkinTypeRepository } from "../../../domain/repository/skin-type.repository.interface";
import { SkinTypeNotFoundError } from "../../../domain/errors/skin-type.error";
import { SkinTypeEntity } from "../../../domain/entity/skin-type.entity";

describe("GetSkinTypeBySlugUseCase", () => {
  let useCase: GetSkinTypeBySlugUseCase;
  let mockRepo: jest.Mocked<ISkinTypeRepository>;

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
    useCase = new GetSkinTypeBySlugUseCase(mockRepo);
  });

  it("should return skin type when found by slug", async () => {
    const entity = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() });
    mockRepo.findBySlug.mockResolvedValue(entity);

    const result = await useCase.execute("oily");

    expect(result).toBe(entity);
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("oily");
  });

  it("should throw SkinTypeNotFoundError when not found", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute("unknown")).rejects.toThrow(SkinTypeNotFoundError);
  });
});
