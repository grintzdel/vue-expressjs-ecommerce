import { DeleteTestimonialUseCase } from "./delete-testimonial.use-case";
import { ITestimonialRepository } from "../../../domain/repository/testimonial.repository.interface";
import { TestimonialNotFoundError } from "../../../domain/errors/testimonial.error";

describe("DeleteTestimonialUseCase", () => {
  let useCase: DeleteTestimonialUseCase;
  let mockRepo: jest.Mocked<ITestimonialRepository>;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findFeatured: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteTestimonialUseCase(mockRepo);
  });

  it("should delete testimonial successfully", async () => {
    mockRepo.delete.mockResolvedValue(true);

    await expect(useCase.execute("1")).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw TestimonialNotFoundError when testimonial not found", async () => {
    mockRepo.delete.mockResolvedValue(false);

    await expect(useCase.execute("999")).rejects.toThrow(TestimonialNotFoundError);
  });
});
