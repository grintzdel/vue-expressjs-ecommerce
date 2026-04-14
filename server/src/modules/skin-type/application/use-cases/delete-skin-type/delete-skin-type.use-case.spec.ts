import { DeleteSkinTypeUseCase } from "./delete-skin-type.use-case";
import { ISkinTypeRepository } from "../../../domain/repository/skin-type.repository.interface";
import { SkinTypeNotFoundError } from "../../../domain/errors/skin-type.error";
import { SkinTypeEntity } from "../../../domain/entity/skin-type.entity";

describe("DeleteSkinTypeUseCase", () => {
  let useCase: DeleteSkinTypeUseCase;
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
    useCase = new DeleteSkinTypeUseCase(mockRepo);
  });

  it("should delete a skin type successfully", async () => {
    const entity = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() });
    mockRepo.findById.mockResolvedValue(entity);
    mockRepo.delete.mockResolvedValue(true);

    await expect(useCase.execute("1")).resolves.toBeUndefined();
    expect(mockRepo.findById).toHaveBeenCalledWith("1");
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw SkinTypeNotFoundError when entity does not exist", async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("nonexistent")).rejects.toThrow(SkinTypeNotFoundError);
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});
