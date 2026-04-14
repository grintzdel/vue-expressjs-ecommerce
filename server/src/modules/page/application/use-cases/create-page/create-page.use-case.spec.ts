import { CreatePageUseCase } from "./create-page.use-case";
import { IPageRepository } from "../../../domain/repository/page.repository.interface";
import { PageAlreadyExistsError } from "../../../domain/errors/page.error";
import { PageEntity } from "../../../domain/entity/page.entity";

describe("CreatePageUseCase", () => {
  let useCase: CreatePageUseCase;
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
    useCase = new CreatePageUseCase(mockRepo);
  });

  it("should create a page when slug is unique", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(mockPage);

    const result = await useCase.execute({
      title: "About Us",
      slug: "about-us",
      content: "Welcome",
      seoMeta: { title: "About | Site", description: "About page" },
      isPublished: true,
    });

    expect(result).toEqual(mockPage);
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("about-us");
    expect(mockRepo.create).toHaveBeenCalledWith({
      title: "About Us",
      slug: "about-us",
      content: "Welcome",
      seoMeta: { title: "About | Site", description: "About page" },
      isPublished: true,
    });
  });

  it("should throw PageAlreadyExistsError when slug is taken", async () => {
    mockRepo.findBySlug.mockResolvedValue(mockPage);

    await expect(useCase.execute({
      title: "About Us",
      slug: "about-us",
      content: "Welcome",
      seoMeta: { title: "About | Site", description: "About page" },
      isPublished: true,
    })).rejects.toThrow(PageAlreadyExistsError);

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
