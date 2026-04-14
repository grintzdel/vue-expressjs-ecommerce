import { UserService } from "./user.service";
import { GetProfileUseCase } from "../use-cases/get-profile/get-profile.use-case";
import { UpdateProfileUseCase } from "../use-cases/update-profile/update-profile.use-case";
import { GetAllUsersUseCase } from "../use-cases/get-all-users/get-all-users.use-case";

describe("UserService", () => {
  let service: UserService;
  let mockGetProfile: jest.Mocked<GetProfileUseCase>;
  let mockUpdateProfile: jest.Mocked<UpdateProfileUseCase>;
  let mockGetAllUsers: jest.Mocked<GetAllUsersUseCase>;

  beforeEach(() => {
    mockGetProfile = { execute: jest.fn() } as any;
    mockUpdateProfile = { execute: jest.fn() } as any;
    mockGetAllUsers = { execute: jest.fn() } as any;
    service = new UserService(mockGetProfile, mockUpdateProfile, mockGetAllUsers);
  });

  it("should delegate getProfile", async () => {
    const expected = { id: "1", email: "a@b.com", role: "customer", createdAt: new Date() };
    mockGetProfile.execute.mockResolvedValue(expected);

    const result = await service.getProfile("1");
    expect(result).toEqual(expected);
  });

  it("should delegate updateProfile", async () => {
    const expected = { id: "1", email: "new@b.com", role: "customer", createdAt: new Date() };
    mockUpdateProfile.execute.mockResolvedValue(expected);

    const result = await service.updateProfile("1", { email: "new@b.com" });
    expect(result).toEqual(expected);
  });

  it("should delegate getAllUsers", async () => {
    mockGetAllUsers.execute.mockResolvedValue([]);

    const result = await service.getAllUsers();
    expect(result).toEqual([]);
  });
});
