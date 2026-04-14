import { IUserRepository } from "../../../domain/repository/user.repository.interface";
import { HashServiceSecurity } from "../../services/security/hash.service-security";
import { JwtServiceSecurity } from "../../services/security/jwt.service-security";
import { UserAlreadyExistsError } from "../../../domain/errors/auth.error";

interface RegisterInput {
  email: string;
  password: string;
}

export interface RegisterOutput {
  token: string;
  user: { id: string; email: string; role: string };
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashServiceSecurity,
    private readonly jwtService: JwtServiceSecurity
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const user = await this.userRepository.create({
      email: input.email,
      password: hashedPassword,
      role: "customer",
    });

    const token = this.jwtService.generate({ userId: user.id, role: user.role });

    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
