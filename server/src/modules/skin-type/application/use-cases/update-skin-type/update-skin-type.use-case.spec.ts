import { UpdateSkinTypeUseCase } from "./update-skin-type.use-case";
import { ISkinTypeRepository } from "../../../domain/repository/skin-type.repository.interface";
import { SkinTypeNotFoundError, SkinTypeAlreadyExistsError } from "../../../domain/errors/skin-type.error";
import { SkinTypeEntity } from "../../../domain/entity/skin-type.entity";

describe("UpdateSkinTypeUseCase", () => {
  let useCase: UpdateSkinTypeUseCase;
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
    useCase = new UpdateSkinTypeUseCase(mockRepo);
  });

  it("should update skin type when valid", async () => {
    const existing = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() });
    const updated = new SkinTypeEntity({ id: "1", name: "Very Oily", slug: "oily", createdAt: new Date() });
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.update.mockResolvedValue(updated);

    const result = await useCase.execute({ id: "1", name: "Very Oily" });

    expect(result).toBe(updated);
    expect(mockRepo.findById).toHaveBeenCalledWith("1");
  });

  it("should throw SkinTypeNotFoundError when entity does not exist", async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: "nonexistent", name: "X" }))
      .rejects.toThrow(SkinTypeNotFoundError);
  });

  it("should throw SkinTypeAlreadyExistsError when slug is taken by another entity", async () => {
    const existing = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() });
    const conflicting = new SkinTypeEntity({ id: "2", name: "Dry", slug: "dry", createdAt: new Date() });
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.findBySlug.mockResolvedValue(conflicting);

    await expect(useCase.execute({ id: "1", slug: "dry" }))
      .rejects.toThrow(SkinTypeAlreadyExistsError);
  });

  it("should allow updating slug to the same value (no conflict)", async () => {
    const existing = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() });
    const updated = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() });
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.update.mockResolvedValue(updated);

    const result = await useCase.execute({ id: "1", slug: "oily" });

    expect(result).toBe(updated);
    expect(mockRepo.findBySlug).not.toHaveBeenCalled();
  });
});
