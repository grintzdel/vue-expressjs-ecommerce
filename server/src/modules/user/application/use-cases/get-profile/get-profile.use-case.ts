import { IUserRepository } from "../../../../auth/domain/repository/user.repository.interface";
import { ProfileNotFoundError } from "../../../domain/errors/user.error";

export interface GetProfileOutput {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export class GetProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<GetProfileOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ProfileNotFoundError();
    }
    return { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt };
  }
}
