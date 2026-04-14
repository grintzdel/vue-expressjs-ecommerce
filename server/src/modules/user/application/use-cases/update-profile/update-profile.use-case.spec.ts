import { UpdateProfileUseCase } from "./update-profile.use-case";
import { IUserRepository } from "../../../../auth/domain/repository/user.repository.interface";
import { UserEntity } from "../../../../auth/domain/entity/user.entity";
import { ProfileNotFoundError } from "../../../domain/errors/user.error";

describe("UpdateProfileUseCase", () => {
  let useCase: UpdateProfileUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepo = { findByEmail: jest.fn(), findById: jest.fn(), findAll: jest.fn(), create: jest.fn(), update: jest.fn() };
    useCase = new UpdateProfileUseCase(mockRepo);
  });

  it("should update and return user", async () => {
    const updated = new UserEntity({ id: "1", email: "new@b.com", password: "h", role: "customer", createdAt: new Date() });
    mockRepo.update.mockResolvedValue(updated);

    const result = await useCase.execute("1", { email: "new@b.com" });

    expect(result.email).toBe("new@b.com");
    expect(mockRepo.update).toHaveBeenCalledWith("1", { email: "new@b.com" });
  });

  it("should throw ProfileNotFoundError if user not found", async () => {
    mockRepo.update.mockResolvedValue(null);

    await expect(useCase.execute("999", { email: "x@y.com" })).rejects.toThrow(ProfileNotFoundError);
  });
});
