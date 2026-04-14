import { GetAllPressLogosUseCase } from "./get-all-press-logos.use-case";
import { IPressLogoRepository } from "../../../domain/repository/press-logo.repository.interface";
import { PressLogoEntity } from "../../../domain/entity/press-logo.entity";

describe("GetAllPressLogosUseCase", () => {
  let useCase: GetAllPressLogosUseCase;
  let mockRepo: jest.Mocked<IPressLogoRepository>;

  const mockPressLogos = [
    new PressLogoEntity({ id: "1", name: "VOGUE", logoUrl: "https://example.com/vogue.png", link: "https://vogue.com", position: 1, createdAt: new Date() }),
    new PressLogoEntity({ id: "2", name: "Forbes", logoUrl: "https://example.com/forbes.png", link: "https://forbes.com", position: 2, createdAt: new Date() }),
  ];

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetAllPressLogosUseCase(mockRepo);
  });

  it("should return all press logos", async () => {
    mockRepo.findAll.mockResolvedValue(mockPressLogos);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(mockPressLogos);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no press logos", async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
