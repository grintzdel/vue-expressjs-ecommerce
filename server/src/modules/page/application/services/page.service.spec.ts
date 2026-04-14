import { PageService } from "./page.service";
import { CreatePageUseCase } from "../use-cases/create-page/create-page.use-case";
import { GetAllPagesUseCase } from "../use-cases/get-all-pages/get-all-pages.use-case";
import { GetPageBySlugUseCase } from "../use-cases/get-page-by-slug/get-page-by-slug.use-case";
import { UpdatePageUseCase } from "../use-cases/update-page/update-page.use-case";
import { DeletePageUseCase } from "../use-cases/delete-page/delete-page.use-case";
import { PageEntity } from "../../domain/entity/page.entity";

describe("PageService", () => {
  let service: PageService;
  let mockCreate: jest.Mocked<CreatePageUseCase>;
  let mockGetAll: jest.Mocked<GetAllPagesUseCase>;
  let mockGetBySlug: jest.Mocked<GetPageBySlugUseCase>;
  let mockUpdate: jest.Mocked<UpdatePageUseCase>;
  let mockDelete: jest.Mocked<DeletePageUseCase>;

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
    mockCreate = { execute: jest.fn() } as any;
    mockGetAll = { execute: jest.fn() } as any;
    mockGetBySlug = { execute: jest.fn() } as any;
    mockUpdate = { execute: jest.fn() } as any;
    mockDelete = { execute: jest.fn() } as any;

    service = new PageService(mockCreate, mockGetAll, mockGetBySlug, mockUpdate, mockDelete);
  });

  it("should delegate createPage to CreatePageUseCase", async () => {
    mockCreate.execute.mockResolvedValue(mockPage);

    const result = await service.createPage({
      title: "About Us",
      slug: "about-us",
      content: "Welcome",
      seoMeta: { title: "About | Site", description: "About page" },
      isPublished: true,
    });

    expect(result).toEqual(mockPage);
    expect(mockCreate.execute).toHaveBeenCalledWith({
      title: "About Us",
      slug: "about-us",
      content: "Welcome",
      seoMeta: { title: "About | Site", description: "About page" },
      isPublished: true,
    });
  });

  it("should delegate getAllPages to GetAllPagesUseCase", async () => {
    mockGetAll.execute.mockResolvedValue([mockPage]);

    const result = await service.getAllPages();

    expect(result).toHaveLength(1);
    expect(mockGetAll.execute).toHaveBeenCalled();
  });

  it("should delegate getPageBySlug to GetPageBySlugUseCase", async () => {
    mockGetBySlug.execute.mockResolvedValue(mockPage);

    const result = await service.getPageBySlug("about-us");

    expect(result).toEqual(mockPage);
    expect(mockGetBySlug.execute).toHaveBeenCalledWith("about-us");
  });

  it("should delegate updatePage to UpdatePageUseCase", async () => {
    mockUpdate.execute.mockResolvedValue(mockPage);

    const result = await service.updatePage("1", { title: "Updated" });

    expect(result).toEqual(mockPage);
    expect(mockUpdate.execute).toHaveBeenCalledWith("1", { title: "Updated" });
  });

  it("should delegate deletePage to DeletePageUseCase", async () => {
    mockDelete.execute.mockResolvedValue(undefined);

    await service.deletePage("1");

    expect(mockDelete.execute).toHaveBeenCalledWith("1");
  });
});
