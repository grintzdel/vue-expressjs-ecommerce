import { UpdateTestimonialUseCase } from "./update-testimonial.use-case";
import { ITestimonialRepository } from "../../../domain/repository/testimonial.repository.interface";
import { TestimonialNotFoundError } from "../../../domain/errors/testimonial.error";
import { TestimonialEntity } from "../../../domain/entity/testimonial.entity";

describe("UpdateTestimonialUseCase", () => {
  let useCase: UpdateTestimonialUseCase;
  let mockRepo: jest.Mocked<ITestimonialRepository>;

  const mockTestimonial = new TestimonialEntity({
    id: "1",
    authorName: "Updated Author",
    content: "Updated content",
    rating: 4,
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
    useCase = new UpdateTestimonialUseCase(mockRepo);
  });

  it("should update testimonial and return updated entity", async () => {
    mockRepo.update.mockResolvedValue(mockTestimonial);

    const result = await useCase.execute("1", { authorName: "Updated Author", rating: 4 });

    expect(result).toEqual(mockTestimonial);
    expect(mockRepo.update).toHaveBeenCalledWith("1", { authorName: "Updated Author", rating: 4 });
  });

  it("should throw TestimonialNotFoundError when testimonial not found", async () => {
    mockRepo.update.mockResolvedValue(null);

    await expect(useCase.execute("999", { authorName: "X" }))
      .rejects.toThrow(TestimonialNotFoundError);
  });
});
