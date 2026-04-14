import { Request, Response, NextFunction } from "express";

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  // Capture response body
  const originalJson = res.json.bind(res);
  let responseBody: unknown;

  res.json = (body: unknown) => {
    responseBody = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;

    // Color status code
    const statusColor =
      status >= 500 ? "\x1b[31m" : // red
      status >= 400 ? "\x1b[33m" : // yellow
      status >= 300 ? "\x1b[36m" : // cyan
      "\x1b[32m"; // green
    const reset = "\x1b[0m";

    console.log(
      `${method.padEnd(7)} ${statusColor}${status}${reset} ${url} ${duration}ms`
    );

    // Log request body for POST/PATCH/PUT (hide password)
    if (["POST", "PATCH", "PUT"].includes(method) && req.body) {
      const sanitized = { ...req.body };
      if (sanitized.password) sanitized.password = "***";
      if (sanitized.confirmPassword) sanitized.confirmPassword = "***";
      console.log(`  ↳ req:`, JSON.stringify(sanitized));
    }

    // Log response body (truncated)
    if (responseBody) {
      const str = JSON.stringify(responseBody);
      const truncated = str.length > 200 ? str.slice(0, 200) + "..." : str;
      console.log(`  ↳ res:`, truncated);
    }
  });

  next();
}
