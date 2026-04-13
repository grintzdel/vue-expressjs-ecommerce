export const AUTH_CONSTANTS = {
  SALT_ROUNDS: 10,
  JWT_DEFAULT_EXPIRATION: "24h",
  ROLES: {
    ADMIN: "admin",
    CUSTOMER: "customer",
  },
} as const;
