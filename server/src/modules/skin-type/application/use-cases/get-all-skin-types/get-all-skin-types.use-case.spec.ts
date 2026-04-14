import { GetAllSkinTypesUseCase } from "./get-all-skin-types.use-case";
import { ISkinTypeRepository } from "../../../domain/repository/skin-type.repository.interface";
import { SkinTypeEntity } from "../../../domain/entity/skin-type.entity";

describe("GetAllSkinTypesUseCase", () => {
  let useCase: GetAllSkinTypesUseCase;
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
    useCase = new GetAllSkinTypesUseCase(mockRepo);
  });

  it("should return all skin types", async () => {
    const entities = [
      new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() }),
      new SkinTypeEntity({ id: "2", name: "Dry", slug: "dry", createdAt: new Date() }),
    ];
    mockRepo.findAll.mockResolvedValue(entities);

    const result = await useCase.execute();

    expect(result).toEqual(entities);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no skin types exist", async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
