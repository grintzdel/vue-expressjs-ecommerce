import { CreatePressLogoUseCase } from "./create-press-logo.use-case";
import { IPressLogoRepository } from "../../../domain/repository/press-logo.repository.interface";
import { PressLogoEntity } from "../../../domain/entity/press-logo.entity";

describe("CreatePressLogoUseCase", () => {
  let useCase: CreatePressLogoUseCase;
  let mockRepo: jest.Mocked<IPressLogoRepository>;

  const mockPressLogo = new PressLogoEntity({
    id: "1",
    name: "VOGUE",
    logoUrl: "https://example.com/vogue.png",
    link: "https://vogue.com",
    position: 1,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreatePressLogoUseCase(mockRepo);
  });

  it("should create a press logo and return entity", async () => {
    mockRepo.create.mockResolvedValue(mockPressLogo);

    const result = await useCase.execute({
      name: "VOGUE",
      logoUrl: "https://example.com/vogue.png",
      link: "https://vogue.com",
      position: 1,
    });

    expect(result).toEqual(mockPressLogo);
    expect(mockRepo.create).toHaveBeenCalledWith({
      name: "VOGUE",
      logoUrl: "https://example.com/vogue.png",
      link: "https://vogue.com",
      position: 1,
    });
  });
});
