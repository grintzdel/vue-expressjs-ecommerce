import { CreateTestimonialUseCase } from "./create-testimonial.use-case";
import { ITestimonialRepository } from "../../../domain/repository/testimonial.repository.interface";
import { TestimonialEntity } from "../../../domain/entity/testimonial.entity";

describe("CreateTestimonialUseCase", () => {
  let useCase: CreateTestimonialUseCase;
  let mockRepo: jest.Mocked<ITestimonialRepository>;

  const mockTestimonial = new TestimonialEntity({
    id: "1",
    authorName: "Jane Doe",
    content: "Great product!",
    rating: 5,
    featuredProductIds: ["prod-1"],
    isFeatured: false,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findFeatured: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateTestimonialUseCase(mockRepo);
  });

  it("should create a testimonial and return entity", async () => {
    mockRepo.create.mockResolvedValue(mockTestimonial);

    const result = await useCase.execute({
      authorName: "Jane Doe",
      content: "Great product!",
      rating: 5,
      featuredProductIds: ["prod-1"],
      isFeatured: false,
    });

    expect(result).toEqual(mockTestimonial);
    expect(mockRepo.create).toHaveBeenCalledWith({
      authorName: "Jane Doe",
      content: "Great product!",
      rating: 5,
      featuredProductIds: ["prod-1"],
      isFeatured: false,
    });
  });
});
