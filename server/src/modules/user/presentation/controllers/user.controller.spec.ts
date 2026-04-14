import { UserController } from "./user.controller";
import { UserService } from "../../application/services/user.service";
import { Request, Response, NextFunction } from "express";

describe("UserController", () => {
  let controller: UserController;
  let mockService: jest.Mocked<UserService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockService = { getProfile: jest.fn(), updateProfile: jest.fn(), getAllUsers: jest.fn() } as any;
    controller = new UserController(mockService);
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    mockNext = jest.fn();
  });

  it("should return 200 on getProfile", async () => {
    const profile = { id: "1", email: "a@b.com", role: "customer", createdAt: new Date() };
    mockService.getProfile.mockResolvedValue(profile);
    const mockReq = { user: { userId: "1", role: "customer" } } as any;

    await controller.getProfile(mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 on updateProfile", async () => {
    const profile = { id: "1", email: "new@b.com", role: "customer", createdAt: new Date() };
    mockService.updateProfile.mockResolvedValue(profile);
    const mockReq = { user: { userId: "1", role: "customer" }, body: { email: "new@b.com" } } as any;

    await controller.updateProfile(mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 on getAllUsers", async () => {
    mockService.getAllUsers.mockResolvedValue([]);
    const mockReq = {} as any;

    await controller.getAllUsers(mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should call next on error", async () => {
    const error = new Error("fail");
    mockService.getProfile.mockRejectedValue(error);
    const mockReq = { user: { userId: "1", role: "customer" } } as any;

    await controller.getProfile(mockReq, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
