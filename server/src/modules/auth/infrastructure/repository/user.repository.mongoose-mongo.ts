import { IUserRepository } from "../../domain/repository/user.repository.interface";
import { UserEntity } from "../../domain/entity/user.entity";
import { UserModel } from "../schema/user.schema";

export class UserRepositoryMongooseMongo implements IUserRepository {
  private toEntity(doc: any): UserEntity {
    return new UserEntity({
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      role: doc.role,
      createdAt: doc.createdAt,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findAll(): Promise<UserEntity[]> {
    const docs = await UserModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async create(data: { email: string; password: string; role: "admin" | "customer" }): Promise<UserEntity> {
    const doc = await UserModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<{ email: string; password: string; role: "admin" | "customer" }>): Promise<UserEntity | null> {
    const doc = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }
}
