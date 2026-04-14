import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { PressLogoRepositoryMongooseMongo } from "./press-logo.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: PressLogoRepositoryMongooseMongo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new PressLogoRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("PressLogoRepositoryMongooseMongo", () => {
  it("should create a press logo and return entity", async () => {
    const pressLogo = await repository.create({
      name: "VOGUE",
      logoUrl: "https://example.com/vogue.png",
      link: "https://vogue.com",
      position: 1,
    });

    expect(pressLogo.id).toBeDefined();
    expect(pressLogo.name).toBe("VOGUE");
    expect(pressLogo.logoUrl).toBe("https://example.com/vogue.png");
    expect(pressLogo.link).toBe("https://vogue.com");
    expect(pressLogo.position).toBe(1);
    expect(pressLogo.createdAt).toBeInstanceOf(Date);
  });

  it("should find all press logos sorted by position ascending", async () => {
    await repository.create({ name: "Forbes", logoUrl: "https://example.com/forbes.png", link: "https://forbes.com", position: 3 });
    await repository.create({ name: "VOGUE", logoUrl: "https://example.com/vogue.png", link: "https://vogue.com", position: 1 });
    await repository.create({ name: "Elle", logoUrl: "https://example.com/elle.png", link: "https://elle.com", position: 2 });

    const all = await repository.findAll();
    expect(all).toHaveLength(3);
    expect(all[0].position).toBe(1);
    expect(all[1].position).toBe(2);
    expect(all[2].position).toBe(3);
  });

  it("should find press logo by id", async () => {
    const created = await repository.create({
      name: "VOGUE",
      logoUrl: "https://example.com/vogue.png",
      link: "https://vogue.com",
      position: 1,
    });

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
  });

  it("should return null for unknown id", async () => {
    const found = await repository.findById(new mongoose.Types.ObjectId().toString());
    expect(found).toBeNull();
  });

  it("should update a press logo", async () => {
    const created = await repository.create({
      name: "VOGUE",
      logoUrl: "https://example.com/vogue.png",
      link: "https://vogue.com",
      position: 1,
    });

    const updated = await repository.update(created.id, { name: "Vogue Updated", position: 5 });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe("Vogue Updated");
    expect(updated!.position).toBe(5);
  });

  it("should return null when updating non-existent press logo", async () => {
    const updated = await repository.update(new mongoose.Types.ObjectId().toString(), { name: "X" });
    expect(updated).toBeNull();
  });

  it("should delete a press logo and return true", async () => {
    const created = await repository.create({
      name: "VOGUE",
      logoUrl: "https://example.com/vogue.png",
      link: "https://vogue.com",
      position: 1,
    });

    const deleted = await repository.delete(created.id);
    expect(deleted).toBe(true);

    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  it("should return false when deleting non-existent press logo", async () => {
    const deleted = await repository.delete(new mongoose.Types.ObjectId().toString());
    expect(deleted).toBe(false);
  });
});
