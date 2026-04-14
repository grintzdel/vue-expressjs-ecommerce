import { IUserRepository } from "../../../../auth/domain/repository/user.repository.interface";
import { ProfileNotFoundError } from "../../../domain/errors/user.error";

interface UpdateProfileInput {
  email?: string;
}

export interface UpdateProfileOutput {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, input: UpdateProfileInput): Promise<UpdateProfileOutput> {
    const user = await this.userRepository.update(userId, input);
    if (!user) {
      throw new ProfileNotFoundError();
    }
    return { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt };
  }
}
