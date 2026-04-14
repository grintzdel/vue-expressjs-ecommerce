import { CreateSkinTypeUseCase } from "./create-skin-type.use-case";
import { ISkinTypeRepository } from "../../../domain/repository/skin-type.repository.interface";
import { SkinTypeAlreadyExistsError } from "../../../domain/errors/skin-type.error";
import { SkinTypeEntity } from "../../../domain/entity/skin-type.entity";

describe("CreateSkinTypeUseCase", () => {
  let useCase: CreateSkinTypeUseCase;
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
    useCase = new CreateSkinTypeUseCase(mockRepo);
  });

  it("should create a skin type when slug does not exist", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);
    const entity = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() });
    mockRepo.create.mockResolvedValue(entity);

    const result = await useCase.execute({ name: "Oily", slug: "oily" });

    expect(result).toBe(entity);
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("oily");
    expect(mockRepo.create).toHaveBeenCalledWith({ name: "Oily", slug: "oily" });
  });

  it("should throw SkinTypeAlreadyExistsError when slug already exists", async () => {
    const entity = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() });
    mockRepo.findBySlug.mockResolvedValue(entity);

    await expect(useCase.execute({ name: "Oily", slug: "oily" }))
      .rejects.toThrow(SkinTypeAlreadyExistsError);
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
