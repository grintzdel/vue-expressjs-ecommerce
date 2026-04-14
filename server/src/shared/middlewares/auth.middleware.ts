import { Request, Response, NextFunction } from "express";
import { AppError } from "./error-handler.middleware";
import { JwtServiceSecurity } from "../../modules/auth/application/services/security/jwt.service-security";

export function createAuthMiddleware(jwtService: JwtServiceSecurity) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      next(new AppError(401, "Missing or invalid token"));
      return;
    }

    try {
      const token = header.split(" ")[1];
      const payload = jwtService.verify(token);
      req.user = { userId: payload.userId as string, role: payload.role as string };
      next();
    } catch {
      next(new AppError(401, "Invalid or expired token"));
    }
  };
}
