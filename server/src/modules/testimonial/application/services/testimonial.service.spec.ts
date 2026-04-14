import { TestimonialService } from "./testimonial.service";
import { CreateTestimonialUseCase } from "../use-cases/create-testimonial/create-testimonial.use-case";
import { GetAllTestimonialsUseCase } from "../use-cases/get-all-testimonials/get-all-testimonials.use-case";
import { GetFeaturedTestimonialsUseCase } from "../use-cases/get-featured-testimonials/get-featured-testimonials.use-case";
import { UpdateTestimonialUseCase } from "../use-cases/update-testimonial/update-testimonial.use-case";
import { DeleteTestimonialUseCase } from "../use-cases/delete-testimonial/delete-testimonial.use-case";
import { TestimonialEntity } from "../../domain/entity/testimonial.entity";

describe("TestimonialService", () => {
  let service: TestimonialService;
  let mockCreate: jest.Mocked<CreateTestimonialUseCase>;
  let mockGetAll: jest.Mocked<GetAllTestimonialsUseCase>;
  let mockGetFeatured: jest.Mocked<GetFeaturedTestimonialsUseCase>;
  let mockUpdate: jest.Mocked<UpdateTestimonialUseCase>;
  let mockDelete: jest.Mocked<DeleteTestimonialUseCase>;

  const mockTestimonial = new TestimonialEntity({
    id: "1",
    authorName: "Jane Doe",
    content: "Great!",
    rating: 5,
    featuredProductIds: [],
    isFeatured: false,
    createdAt: new Date(),
  });

  const mockFeaturedTestimonial = new TestimonialEntity({
    id: "2",
    authorName: "John Smith",
    content: "Excellent!",
    rating: 5,
    featuredProductIds: ["prod-1"],
    isFeatured: true,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockCreate = { execute: jest.fn() } as any;
    mockGetAll = { execute: jest.fn() } as any;
    mockGetFeatured = { execute: jest.fn() } as any;
    mockUpdate = { execute: jest.fn() } as any;
    mockDelete = { execute: jest.fn() } as any;

    service = new TestimonialService(mockCreate, mockGetAll, mockGetFeatured, mockUpdate, mockDelete);
  });

  it("should delegate createTestimonial to CreateTestimonialUseCase", async () => {
    mockCreate.execute.mockResolvedValue(mockTestimonial);

    const result = await service.createTestimonial({
      authorName: "Jane Doe",
      content: "Great!",
      rating: 5,
      featuredProductIds: [],
      isFeatured: false,
    });

    expect(result).toEqual(mockTestimonial);
    expect(mockCreate.execute).toHaveBeenCalledWith({
      authorName: "Jane Doe",
      content: "Great!",
      rating: 5,
      featuredProductIds: [],
      isFeatured: false,
    });
  });

  it("should delegate getAllTestimonials to GetAllTestimonialsUseCase", async () => {
    mockGetAll.execute.mockResolvedValue([mockTestimonial]);

    const result = await service.getAllTestimonials();

    expect(result).toHaveLength(1);
    expect(mockGetAll.execute).toHaveBeenCalled();
  });

  it("should delegate getFeaturedTestimonials to GetFeaturedTestimonialsUseCase", async () => {
    mockGetFeatured.execute.mockResolvedValue([mockFeaturedTestimonial]);

    const result = await service.getFeaturedTestimonials();

    expect(result).toHaveLength(1);
    expect(result[0].isFeatured).toBe(true);
    expect(mockGetFeatured.execute).toHaveBeenCalled();
  });

  it("should delegate updateTestimonial to UpdateTestimonialUseCase", async () => {
    mockUpdate.execute.mockResolvedValue(mockTestimonial);

    const result = await service.updateTestimonial("1", { authorName: "Updated" });

    expect(result).toEqual(mockTestimonial);
    expect(mockUpdate.execute).toHaveBeenCalledWith("1", { authorName: "Updated" });
  });

  it("should delegate deleteTestimonial to DeleteTestimonialUseCase", async () => {
    mockDelete.execute.mockResolvedValue(undefined);

    await service.deleteTestimonial("1");

    expect(mockDelete.execute).toHaveBeenCalledWith("1");
  });
});
