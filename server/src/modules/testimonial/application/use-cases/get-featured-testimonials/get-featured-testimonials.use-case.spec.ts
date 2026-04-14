import { GetFeaturedTestimonialsUseCase } from "./get-featured-testimonials.use-case";
import { ITestimonialRepository } from "../../../domain/repository/testimonial.repository.interface";
import { TestimonialEntity } from "../../../domain/entity/testimonial.entity";

describe("GetFeaturedTestimonialsUseCase", () => {
  let useCase: GetFeaturedTestimonialsUseCase;
  let mockRepo: jest.Mocked<ITestimonialRepository>;

  const mockFeatured = new TestimonialEntity({
    id: "1",
    authorName: "Jane Doe",
    content: "Amazing!",
    rating: 5,
    featuredProductIds: ["prod-1"],
    isFeatured: true,
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
    useCase = new GetFeaturedTestimonialsUseCase(mockRepo);
  });

  it("should return only featured testimonials", async () => {
    mockRepo.findFeatured.mockResolvedValue([mockFeatured]);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].isFeatured).toBe(true);
    expect(mockRepo.findFeatured).toHaveBeenCalled();
  });

  it("should return empty array when no featured testimonials", async () => {
    mockRepo.findFeatured.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
