import { UpdatePageUseCase } from "./update-page.use-case";
import { IPageRepository } from "../../../domain/repository/page.repository.interface";
import { PageNotFoundError } from "../../../domain/errors/page.error";
import { PageEntity } from "../../../domain/entity/page.entity";

describe("UpdatePageUseCase", () => {
  let useCase: UpdatePageUseCase;
  let mockRepo: jest.Mocked<IPageRepository>;

  const mockPage = new PageEntity({
    id: "1",
    title: "About Us",
    slug: "about-us",
    content: "Welcome",
    seoMeta: { title: "About | Site", description: "About page" },
    isPublished: true,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new UpdatePageUseCase(mockRepo);
  });

  it("should update a page and return the updated entity", async () => {
    mockRepo.update.mockResolvedValue(mockPage);

    const result = await useCase.execute("1", { title: "Updated About" });

    expect(result).toEqual(mockPage);
    expect(mockRepo.update).toHaveBeenCalledWith("1", { title: "Updated About" });
  });

  it("should throw PageNotFoundError when page not found", async () => {
    mockRepo.update.mockResolvedValue(null);

    await expect(useCase.execute("999", { title: "X" })).rejects.toThrow(PageNotFoundError);
  });
});
