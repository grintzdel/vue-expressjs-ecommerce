import { IUserRepository } from "../../../../auth/domain/repository/user.repository.interface";

export interface UserOutput {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserOutput[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }));
  }
}
