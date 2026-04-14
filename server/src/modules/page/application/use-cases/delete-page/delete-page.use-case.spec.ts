import { DeletePageUseCase } from "./delete-page.use-case";
import { IPageRepository } from "../../../domain/repository/page.repository.interface";
import { PageNotFoundError } from "../../../domain/errors/page.error";

describe("DeletePageUseCase", () => {
  let useCase: DeletePageUseCase;
  let mockRepo: jest.Mocked<IPageRepository>;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeletePageUseCase(mockRepo);
  });

  it("should delete a page successfully", async () => {
    mockRepo.delete.mockResolvedValue(true);

    await expect(useCase.execute("1")).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw PageNotFoundError when page not found", async () => {
    mockRepo.delete.mockResolvedValue(false);

    await expect(useCase.execute("999")).rejects.toThrow(PageNotFoundError);
  });
});
