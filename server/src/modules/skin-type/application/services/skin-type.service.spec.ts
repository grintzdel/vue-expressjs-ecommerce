import { SkinTypeService } from "./skin-type.service";
import { CreateSkinTypeUseCase } from "../use-cases/create-skin-type/create-skin-type.use-case";
import { GetAllSkinTypesUseCase } from "../use-cases/get-all-skin-types/get-all-skin-types.use-case";
import { GetSkinTypeBySlugUseCase } from "../use-cases/get-skin-type-by-slug/get-skin-type-by-slug.use-case";
import { UpdateSkinTypeUseCase } from "../use-cases/update-skin-type/update-skin-type.use-case";
import { DeleteSkinTypeUseCase } from "../use-cases/delete-skin-type/delete-skin-type.use-case";
import { SkinTypeEntity } from "../../domain/entity/skin-type.entity";

describe("SkinTypeService", () => {
  let service: SkinTypeService;
  let mockCreate: jest.Mocked<CreateSkinTypeUseCase>;
  let mockGetAll: jest.Mocked<GetAllSkinTypesUseCase>;
  let mockGetBySlug: jest.Mocked<GetSkinTypeBySlugUseCase>;
  let mockUpdate: jest.Mocked<UpdateSkinTypeUseCase>;
  let mockDelete: jest.Mocked<DeleteSkinTypeUseCase>;

  beforeEach(() => {
    mockCreate = { execute: jest.fn() } as any;
    mockGetAll = { execute: jest.fn() } as any;
    mockGetBySlug = { execute: jest.fn() } as any;
    mockUpdate = { execute: jest.fn() } as any;
    mockDelete = { execute: jest.fn() } as any;
    service = new SkinTypeService(mockCreate, mockGetAll, mockGetBySlug, mockUpdate, mockDelete);
  });

  it("should delegate create to CreateSkinTypeUseCase", async () => {
    const entity = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() });
    mockCreate.execute.mockResolvedValue(entity);

    const result = await service.create({ name: "Oily", slug: "oily" });

    expect(result).toBe(entity);
    expect(mockCreate.execute).toHaveBeenCalledWith({ name: "Oily", slug: "oily" });
  });

  it("should delegate getAll to GetAllSkinTypesUseCase", async () => {
    const entities = [new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() })];
    mockGetAll.execute.mockResolvedValue(entities);

    const result = await service.getAll();

    expect(result).toEqual(entities);
    expect(mockGetAll.execute).toHaveBeenCalled();
  });

  it("should delegate getBySlug to GetSkinTypeBySlugUseCase", async () => {
    const entity = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date() });
    mockGetBySlug.execute.mockResolvedValue(entity);

    const result = await service.getBySlug("oily");

    expect(result).toBe(entity);
    expect(mockGetBySlug.execute).toHaveBeenCalledWith("oily");
  });

  it("should delegate update to UpdateSkinTypeUseCase", async () => {
    const entity = new SkinTypeEntity({ id: "1", name: "Dry", slug: "dry", createdAt: new Date() });
    mockUpdate.execute.mockResolvedValue(entity);

    const result = await service.update("1", { name: "Dry", slug: "dry" });

    expect(result).toBe(entity);
    expect(mockUpdate.execute).toHaveBeenCalledWith({ id: "1", name: "Dry", slug: "dry" });
  });

  it("should delegate delete to DeleteSkinTypeUseCase", async () => {
    mockDelete.execute.mockResolvedValue(undefined);

    await service.delete("1");

    expect(mockDelete.execute).toHaveBeenCalledWith("1");
  });
});
