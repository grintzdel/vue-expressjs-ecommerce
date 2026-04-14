import { GetAllTestimonialsUseCase } from "./get-all-testimonials.use-case";
import { ITestimonialRepository } from "../../../domain/repository/testimonial.repository.interface";
import { TestimonialEntity } from "../../../domain/entity/testimonial.entity";

describe("GetAllTestimonialsUseCase", () => {
  let useCase: GetAllTestimonialsUseCase;
  let mockRepo: jest.Mocked<ITestimonialRepository>;

  const mockTestimonial = new TestimonialEntity({
    id: "1",
    authorName: "Jane Doe",
    content: "Great product!",
    rating: 5,
    featuredProductIds: [],
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
    useCase = new GetAllTestimonialsUseCase(mockRepo);
  });

  it("should return all testimonials", async () => {
    mockRepo.findAll.mockResolvedValue([mockTestimonial]);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockTestimonial);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no testimonials", async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
