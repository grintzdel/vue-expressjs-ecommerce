import { DeletePressLogoUseCase } from "./delete-press-logo.use-case";
import { IPressLogoRepository } from "../../../domain/repository/press-logo.repository.interface";
import { PressLogoNotFoundError } from "../../../domain/errors/press-logo.error";

describe("DeletePressLogoUseCase", () => {
  let useCase: DeletePressLogoUseCase;
  let mockRepo: jest.Mocked<IPressLogoRepository>;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeletePressLogoUseCase(mockRepo);
  });

  it("should delete a press logo successfully", async () => {
    mockRepo.delete.mockResolvedValue(true);

    await expect(useCase.execute("1")).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw PressLogoNotFoundError when press logo does not exist", async () => {
    mockRepo.delete.mockResolvedValue(false);

    await expect(useCase.execute("999")).rejects.toThrow(PressLogoNotFoundError);
  });
});
