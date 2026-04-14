import { LoginUseCase } from "./login.use-case";
import { IUserRepository } from "../../../domain/repository/user.repository.interface";
import { HashServiceSecurity } from "../../services/security/hash.service-security";
import { JwtServiceSecurity } from "../../services/security/jwt.service-security";
import { InvalidCredentialsError } from "../../../domain/errors/auth.error";
import { UserEntity } from "../../../domain/entity/user.entity";

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;
  let mockHash: jest.Mocked<HashServiceSecurity>;
  let mockJwt: jest.Mocked<JwtServiceSecurity>;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockHash = { hash: jest.fn(), compare: jest.fn() } as any;
    mockJwt = { generate: jest.fn(), verify: jest.fn() } as any;
    useCase = new LoginUseCase(mockRepo, mockHash, mockJwt);
  });

  it("should login and return token", async () => {
    const user = new UserEntity({ id: "1", email: "test@test.com", password: "hashed", role: "customer", createdAt: new Date() });
    mockRepo.findByEmail.mockResolvedValue(user);
    mockHash.compare.mockResolvedValue(true);
    mockJwt.generate.mockReturnValue("token123");

    const result = await useCase.execute({ email: "test@test.com", password: "pass" });

    expect(result.token).toBe("token123");
    expect(result.user.email).toBe("test@test.com");
  });

  it("should throw InvalidCredentialsError if user not found", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: "test@test.com", password: "pass" }))
      .rejects.toThrow(InvalidCredentialsError);
  });

  it("should throw InvalidCredentialsError if password wrong", async () => {
    const user = new UserEntity({ id: "1", email: "test@test.com", password: "hashed", role: "customer", createdAt: new Date() });
    mockRepo.findByEmail.mockResolvedValue(user);
    mockHash.compare.mockResolvedValue(false);

    await expect(useCase.execute({ email: "test@test.com", password: "wrong" }))
      .rejects.toThrow(InvalidCredentialsError);
  });
});
