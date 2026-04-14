import { PressLogoEntity } from "../entity/press-logo.entity";

export interface IPressLogoRepository {
  findAll(): Promise<PressLogoEntity[]>;
  findById(id: string): Promise<PressLogoEntity | null>;
  create(data: { name: string; logoUrl: string; link: string; position: number }): Promise<PressLogoEntity>;
  update(id: string, data: Partial<{ name: string; logoUrl: string; link: string; position: number }>): Promise<PressLogoEntity | null>;
  delete(id: string): Promise<boolean>;
}
