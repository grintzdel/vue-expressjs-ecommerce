import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { NewsletterSubscriptionRepositoryMongooseMongo } from "./newsletter-subscription.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: NewsletterSubscriptionRepositoryMongooseMongo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new NewsletterSubscriptionRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("NewsletterSubscriptionRepositoryMongooseMongo", () => {
  const testEmail = "test@example.com";

  it("should create a subscription and return entity", async () => {
    const subscription = await repository.create({
      email: testEmail,
      subscribedAt: new Date(),
      isActive: true,
      discountCode: "WELCOME10-ABC123",
    });

    expect(subscription.id).toBeDefined();
    expect(subscription.email).toBe(testEmail);
    expect(subscription.isActive).toBe(true);
    expect(subscription.discountCode).toBe("WELCOME10-ABC123");
    expect(subscription.createdAt).toBeInstanceOf(Date);
  });

  it("should find all subscriptions", async () => {
    await repository.create({ email: "a@example.com", subscribedAt: new Date(), isActive: true, discountCode: null });
    await repository.create({ email: "b@example.com", subscribedAt: new Date(), isActive: true, discountCode: null });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it("should find subscription by email", async () => {
    await repository.create({ email: testEmail, subscribedAt: new Date(), isActive: true, discountCode: null });

    const found = await repository.findByEmail(testEmail);
    expect(found).not.toBeNull();
    expect(found!.email).toBe(testEmail);
  });

  it("should return null for unknown email", async () => {
    const found = await repository.findByEmail("unknown@example.com");
    expect(found).toBeNull();
  });

  it("should update subscription by email", async () => {
    await repository.create({ email: testEmail, subscribedAt: new Date(), isActive: true, discountCode: null });

    const updated = await repository.updateByEmail(testEmail, { isActive: false });
    expect(updated).not.toBeNull();
    expect(updated!.isActive).toBe(false);
  });

  it("should return null when updating non-existent email", async () => {
    const updated = await repository.updateByEmail("nonexistent@example.com", { isActive: false });
    expect(updated).toBeNull();
  });
});
