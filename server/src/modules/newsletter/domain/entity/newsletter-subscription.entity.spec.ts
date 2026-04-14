import { NewsletterSubscriptionEntity } from "./newsletter-subscription.entity";

describe("NewsletterSubscriptionEntity", () => {
  const props = {
    id: "sub-1",
    email: "test@example.com",
    subscribedAt: new Date("2024-01-01"),
    isActive: true,
    discountCode: "WELCOME10-ABC123",
    createdAt: new Date("2024-01-01"),
  };

  it("should create a newsletter subscription entity with correct props", () => {
    const entity = new NewsletterSubscriptionEntity(props);

    expect(entity.id).toBe("sub-1");
    expect(entity.email).toBe("test@example.com");
    expect(entity.subscribedAt).toEqual(new Date("2024-01-01"));
    expect(entity.isActive).toBe(true);
    expect(entity.discountCode).toBe("WELCOME10-ABC123");
    expect(entity.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should accept null discountCode", () => {
    const entity = new NewsletterSubscriptionEntity({ ...props, discountCode: null });
    expect(entity.discountCode).toBeNull();
  });

  it("should update isActive via setter", () => {
    const entity = new NewsletterSubscriptionEntity(props);
    entity.isActive = false;
    expect(entity.isActive).toBe(false);
  });

  it("should update discountCode via setter", () => {
    const entity = new NewsletterSubscriptionEntity(props);
    entity.discountCode = "NEWCODE-XYZ";
    expect(entity.discountCode).toBe("NEWCODE-XYZ");
  });

  it("should update subscribedAt via setter", () => {
    const entity = new NewsletterSubscriptionEntity(props);
    const newDate = new Date("2025-01-01");
    entity.subscribedAt = newDate;
    expect(entity.subscribedAt).toEqual(newDate);
  });

  it("should not allow setting id directly (no setter)", () => {
    const entity = new NewsletterSubscriptionEntity(props);
    expect(entity.id).toBe("sub-1");
  });
});
