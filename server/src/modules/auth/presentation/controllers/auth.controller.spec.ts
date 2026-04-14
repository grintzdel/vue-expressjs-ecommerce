import { AuthController } from "./auth.controller";
import { AuthService } from "../../application/services/auth.service";
import { Request, Response, NextFunction } from "express";

describe("AuthController", () => {
  let controller: AuthController;
  let mockService: jest.Mocked<AuthService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockService = { register: jest.fn(), login: jest.fn() } as any;
    controller = new AuthController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it("should return 201 on register", async () => {
    mockReq = { body: { email: "a@b.com", password: "p" } };
    const result = { token: "t", user: { id: "1", email: "a@b.com", role: "customer" } };
    mockService.register.mockResolvedValue(result);

    await controller.register(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: expect.objectContaining({ token: "t" }) });
  });

  it("should return 200 on login", async () => {
    mockReq = { body: { email: "a@b.com", password: "p" } };
    const result = { token: "t", user: { id: "1", email: "a@b.com", role: "customer" } };
    mockService.login.mockResolvedValue(result);

    await controller.login(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should call next on error", async () => {
    mockReq = { body: { email: "a@b.com", password: "p" } };
    const error = new Error("fail");
    mockService.register.mockRejectedValue(error);

    await controller.register(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
