import { GetProfileUseCase } from "../use-cases/get-profile/get-profile.use-case";
import { UpdateProfileUseCase } from "../use-cases/update-profile/update-profile.use-case";
import { GetAllUsersUseCase } from "../use-cases/get-all-users/get-all-users.use-case";

export class UserService {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase
  ) {}

  async getProfile(userId: string) {
    return this.getProfileUseCase.execute(userId);
  }

  async updateProfile(userId: string, input: { email?: string }) {
    return this.updateProfileUseCase.execute(userId, input);
  }

  async getAllUsers() {
    return this.getAllUsersUseCase.execute();
  }
}
