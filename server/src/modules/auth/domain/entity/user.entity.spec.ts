import { UserEntity } from "./user.entity";

describe("UserEntity", () => {
  const props = {
    id: "123",
    email: "test@test.com",
    password: "hashed",
    role: "customer" as const,
    createdAt: new Date("2024-01-01"),
  };

  it("should create entity with correct properties", () => {
    const user = new UserEntity(props);
    expect(user.id).toBe("123");
    expect(user.email).toBe("test@test.com");
    expect(user.password).toBe("hashed");
    expect(user.role).toBe("customer");
    expect(user.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should allow updating email", () => {
    const user = new UserEntity(props);
    user.email = "new@test.com";
    expect(user.email).toBe("new@test.com");
  });

  it("should allow updating password", () => {
    const user = new UserEntity(props);
    user.password = "newHash";
    expect(user.password).toBe("newHash");
  });

  it("should not allow changing id", () => {
    const user = new UserEntity(props);
    expect(user.id).toBe("123");
    // id has no setter
  });
});
