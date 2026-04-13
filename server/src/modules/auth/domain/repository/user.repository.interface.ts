import { UserEntity } from "../entity/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(data: { email: string; password: string; role: "admin" | "customer" }): Promise<UserEntity>;
  update(id: string, data: Partial<{ email: string; password: string; role: "admin" | "customer" }>): Promise<UserEntity | null>;
}
