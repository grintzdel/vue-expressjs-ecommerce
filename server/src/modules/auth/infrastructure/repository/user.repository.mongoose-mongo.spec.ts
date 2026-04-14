import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserRepositoryMongooseMongo } from "./user.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: UserRepositoryMongooseMongo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new UserRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("UserRepositoryMongooseMongo", () => {
  it("should create a user and return entity", async () => {
    const user = await repository.create({
      email: "test@test.com",
      password: "hashed",
      role: "customer",
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("test@test.com");
    expect(user.password).toBe("hashed");
    expect(user.role).toBe("customer");
  });

  it("should find user by email", async () => {
    await repository.create({ email: "test@test.com", password: "hashed", role: "customer" });

    const found = await repository.findByEmail("test@test.com");
    expect(found).not.toBeNull();
    expect(found!.email).toBe("test@test.com");
  });

  it("should return null for unknown email", async () => {
    const found = await repository.findByEmail("unknown@test.com");
    expect(found).toBeNull();
  });

  it("should find user by id", async () => {
    const created = await repository.create({ email: "test@test.com", password: "hashed", role: "customer" });

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.email).toBe("test@test.com");
  });

  it("should find all users", async () => {
    await repository.create({ email: "a@test.com", password: "h", role: "customer" });
    await repository.create({ email: "b@test.com", password: "h", role: "admin" });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it("should update a user", async () => {
    const created = await repository.create({ email: "test@test.com", password: "hashed", role: "customer" });

    const updated = await repository.update(created.id, { email: "new@test.com" });
    expect(updated).not.toBeNull();
    expect(updated!.email).toBe("new@test.com");
  });
});
