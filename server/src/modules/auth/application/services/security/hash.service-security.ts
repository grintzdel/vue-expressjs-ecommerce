import bcrypt from "bcryptjs";
import { AUTH_CONSTANTS } from "../../../domain/constants/auth.constant";

export class HashServiceSecurity {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, AUTH_CONSTANTS.SALT_ROUNDS);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
