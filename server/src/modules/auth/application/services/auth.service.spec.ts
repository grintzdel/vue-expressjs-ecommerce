import { AuthService } from "./auth.service";
import { RegisterUseCase } from "../use-cases/register/register.use-case";
import { LoginUseCase } from "../use-cases/login/login.use-case";

describe("AuthService", () => {
  let service: AuthService;
  let mockRegister: jest.Mocked<RegisterUseCase>;
  let mockLogin: jest.Mocked<LoginUseCase>;

  beforeEach(() => {
    mockRegister = { execute: jest.fn() } as any;
    mockLogin = { execute: jest.fn() } as any;
    service = new AuthService(mockRegister, mockLogin);
  });

  it("should delegate register to RegisterUseCase", async () => {
    const expected = { token: "t", user: { id: "1", email: "a@b.com", role: "customer" } };
    mockRegister.execute.mockResolvedValue(expected);

    const result = await service.register({ email: "a@b.com", password: "p" });

    expect(result).toEqual(expected);
    expect(mockRegister.execute).toHaveBeenCalledWith({ email: "a@b.com", password: "p" });
  });

  it("should delegate login to LoginUseCase", async () => {
    const expected = { token: "t", user: { id: "1", email: "a@b.com", role: "customer" } };
    mockLogin.execute.mockResolvedValue(expected);

    const result = await service.login({ email: "a@b.com", password: "p" });

    expect(result).toEqual(expected);
    expect(mockLogin.execute).toHaveBeenCalledWith({ email: "a@b.com", password: "p" });
  });
});
