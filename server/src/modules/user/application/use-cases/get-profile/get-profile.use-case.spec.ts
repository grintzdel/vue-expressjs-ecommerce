import { GetProfileUseCase } from "./get-profile.use-case";
import { IUserRepository } from "../../../../auth/domain/repository/user.repository.interface";
import { UserEntity } from "../../../../auth/domain/entity/user.entity";
import { ProfileNotFoundError } from "../../../domain/errors/user.error";

describe("GetProfileUseCase", () => {
  let useCase: GetProfileUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepo = { findByEmail: jest.fn(), findById: jest.fn(), findAll: jest.fn(), create: jest.fn(), update: jest.fn() };
    useCase = new GetProfileUseCase(mockRepo);
  });

  it("should return user profile", async () => {
    const user = new UserEntity({ id: "1", email: "a@b.com", password: "h", role: "customer", createdAt: new Date() });
    mockRepo.findById.mockResolvedValue(user);

    const result = await useCase.execute("1");

    expect(result.id).toBe("1");
    expect(result.email).toBe("a@b.com");
    expect(result.role).toBe("customer");
  });

  it("should throw ProfileNotFoundError if user not found", async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("999")).rejects.toThrow(ProfileNotFoundError);
  });
});
