import { GetAllUsersUseCase } from "./get-all-users.use-case";
import { IUserRepository } from "../../../../auth/domain/repository/user.repository.interface";
import { UserEntity } from "../../../../auth/domain/entity/user.entity";

describe("GetAllUsersUseCase", () => {
  let useCase: GetAllUsersUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepo = { findByEmail: jest.fn(), findById: jest.fn(), findAll: jest.fn(), create: jest.fn(), update: jest.fn() };
    useCase = new GetAllUsersUseCase(mockRepo);
  });

  it("should return all users", async () => {
    const users = [
      new UserEntity({ id: "1", email: "a@b.com", password: "h", role: "customer", createdAt: new Date() }),
      new UserEntity({ id: "2", email: "c@d.com", password: "h", role: "admin", createdAt: new Date() }),
    ];
    mockRepo.findAll.mockResolvedValue(users);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].email).toBe("a@b.com");
  });
});
