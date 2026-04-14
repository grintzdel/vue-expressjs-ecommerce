import { GetAllPagesUseCase } from "./get-all-pages.use-case";
import { IPageRepository } from "../../../domain/repository/page.repository.interface";
import { PageEntity } from "../../../domain/entity/page.entity";

describe("GetAllPagesUseCase", () => {
  let useCase: GetAllPagesUseCase;
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
    useCase = new GetAllPagesUseCase(mockRepo);
  });

  it("should return all pages", async () => {
    mockRepo.findAll.mockResolvedValue([mockPage]);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockPage);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no pages", async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
