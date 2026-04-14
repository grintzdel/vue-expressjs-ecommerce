import { RegisterUseCase } from "./register.use-case";
import { IUserRepository } from "../../../domain/repository/user.repository.interface";
import { HashServiceSecurity } from "../../services/security/hash.service-security";
import { JwtServiceSecurity } from "../../services/security/jwt.service-security";
import { UserAlreadyExistsError } from "../../../domain/errors/auth.error";
import { UserEntity } from "../../../domain/entity/user.entity";

describe("RegisterUseCase", () => {
  let useCase: RegisterUseCase;
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
    useCase = new RegisterUseCase(mockRepo, mockHash, mockJwt);
  });

  it("should register a new user and return token", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockHash.hash.mockResolvedValue("hashedPwd");
    mockRepo.create.mockResolvedValue(
      new UserEntity({ id: "1", email: "test@test.com", password: "hashedPwd", role: "customer", createdAt: new Date() })
    );
    mockJwt.generate.mockReturnValue("token123");

    const result = await useCase.execute({ email: "test@test.com", password: "pass" });

    expect(result.token).toBe("token123");
    expect(result.user.email).toBe("test@test.com");
    expect(mockHash.hash).toHaveBeenCalledWith("pass");
  });

  it("should throw UserAlreadyExistsError if email taken", async () => {
    mockRepo.findByEmail.mockResolvedValue(
      new UserEntity({ id: "1", email: "test@test.com", password: "h", role: "customer", createdAt: new Date() })
    );

    await expect(useCase.execute({ email: "test@test.com", password: "pass" }))
      .rejects.toThrow(UserAlreadyExistsError);
  });
});
