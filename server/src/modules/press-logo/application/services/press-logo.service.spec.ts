import { PressLogoService } from "./press-logo.service";
import { CreatePressLogoUseCase } from "../use-cases/create-press-logo/create-press-logo.use-case";
import { GetAllPressLogosUseCase } from "../use-cases/get-all-press-logos/get-all-press-logos.use-case";
import { UpdatePressLogoUseCase } from "../use-cases/update-press-logo/update-press-logo.use-case";
import { DeletePressLogoUseCase } from "../use-cases/delete-press-logo/delete-press-logo.use-case";
import { PressLogoEntity } from "../../domain/entity/press-logo.entity";

describe("PressLogoService", () => {
  let service: PressLogoService;
  let mockCreate: jest.Mocked<CreatePressLogoUseCase>;
  let mockGetAll: jest.Mocked<GetAllPressLogosUseCase>;
  let mockUpdate: jest.Mocked<UpdatePressLogoUseCase>;
  let mockDelete: jest.Mocked<DeletePressLogoUseCase>;

  const mockPressLogo = new PressLogoEntity({
    id: "1",
    name: "VOGUE",
    logoUrl: "https://example.com/vogue.png",
    link: "https://vogue.com",
    position: 1,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockCreate = { execute: jest.fn() } as any;
    mockGetAll = { execute: jest.fn() } as any;
    mockUpdate = { execute: jest.fn() } as any;
    mockDelete = { execute: jest.fn() } as any;

    service = new PressLogoService(mockCreate, mockGetAll, mockUpdate, mockDelete);
  });

  it("should delegate createPressLogo to CreatePressLogoUseCase", async () => {
    mockCreate.execute.mockResolvedValue(mockPressLogo);

    const result = await service.createPressLogo({
      name: "VOGUE",
      logoUrl: "https://example.com/vogue.png",
      link: "https://vogue.com",
      position: 1,
    });

    expect(result).toEqual(mockPressLogo);
    expect(mockCreate.execute).toHaveBeenCalledWith({
      name: "VOGUE",
      logoUrl: "https://example.com/vogue.png",
      link: "https://vogue.com",
      position: 1,
    });
  });

  it("should delegate getAllPressLogos to GetAllPressLogosUseCase", async () => {
    mockGetAll.execute.mockResolvedValue([mockPressLogo]);

    const result = await service.getAllPressLogos();

    expect(result).toHaveLength(1);
    expect(mockGetAll.execute).toHaveBeenCalled();
  });

  it("should delegate updatePressLogo to UpdatePressLogoUseCase", async () => {
    mockUpdate.execute.mockResolvedValue(mockPressLogo);

    const result = await service.updatePressLogo("1", { name: "Updated" });

    expect(result).toEqual(mockPressLogo);
    expect(mockUpdate.execute).toHaveBeenCalledWith("1", { name: "Updated" });
  });

  it("should delegate deletePressLogo to DeletePressLogoUseCase", async () => {
    mockDelete.execute.mockResolvedValue(undefined);

    await service.deletePressLogo("1");

    expect(mockDelete.execute).toHaveBeenCalledWith("1");
  });
});
