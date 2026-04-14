import { UpdatePressLogoUseCase } from "./update-press-logo.use-case";
import { IPressLogoRepository } from "../../../domain/repository/press-logo.repository.interface";
import { PressLogoEntity } from "../../../domain/entity/press-logo.entity";
import { PressLogoNotFoundError } from "../../../domain/errors/press-logo.error";

describe("UpdatePressLogoUseCase", () => {
  let useCase: UpdatePressLogoUseCase;
  let mockRepo: jest.Mocked<IPressLogoRepository>;

  const mockPressLogo = new PressLogoEntity({
    id: "1",
    name: "VOGUE Updated",
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
    useCase = new UpdatePressLogoUseCase(mockRepo);
  });

  it("should update a press logo and return entity", async () => {
    mockRepo.update.mockResolvedValue(mockPressLogo);

    const result = await useCase.execute("1", { name: "VOGUE Updated" });

    expect(result).toEqual(mockPressLogo);
    expect(mockRepo.update).toHaveBeenCalledWith("1", { name: "VOGUE Updated" });
  });

  it("should throw PressLogoNotFoundError when press logo does not exist", async () => {
    mockRepo.update.mockResolvedValue(null);

    await expect(useCase.execute("999", { name: "X" })).rejects.toThrow(PressLogoNotFoundError);
  });
});
