import { Request, Response, NextFunction } from "express";
import { UserService } from "../../application/services/user.service";
import { UpdateProfileRequestDto } from "../dto/update-profile.request.dto";
import { UserResponseDto } from "../dto/user.response.dto";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.userService.getProfile(req.user!.userId);
      const response = new UserResponseDto(result);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new UpdateProfileRequestDto(req.body);
      const result = await this.userService.updateProfile(req.user!.userId, dto);
      const response = new UserResponseDto(result);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.userService.getAllUsers();
      const response = result.map((u) => new UserResponseDto(u));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }
}
