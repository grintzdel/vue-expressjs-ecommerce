import { PressLogoEntity } from "../../domain/entity/press-logo.entity";

export class PressLogoResponseDto {
  id: string;
  name: string;
  logoUrl: string;
  link: string;
  position: number;
  createdAt: Date;

  constructor(entity: PressLogoEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.logoUrl = entity.logoUrl;
    this.link = entity.link;
    this.position = entity.position;
    this.createdAt = entity.createdAt;
  }
}
