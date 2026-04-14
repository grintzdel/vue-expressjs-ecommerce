import { NewsletterController } from "./newsletter.controller";
import { NewsletterService } from "../../application/services/newsletter.service";
import { NewsletterSubscriptionEntity } from "../../domain/entity/newsletter-subscription.entity";
import { AlreadySubscribedError, SubscriptionNotFoundError } from "../../domain/errors/newsletter.error";
import { Request, Response, NextFunction } from "express";

describe("NewsletterController", () => {
  let controller: NewsletterController;
  let mockService: jest.Mocked<NewsletterService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockSubscription = new NewsletterSubscriptionEntity({
    id: "1",
    email: "test@example.com",
    subscribedAt: new Date(),
    isActive: true,
    discountCode: "WELCOME10-ABC123",
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockService = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      getAllSubscriptions: jest.fn(),
    } as any;

    controller = new NewsletterController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("subscribe", () => {
    it("should return 201 on successful subscription", async () => {
      const mockReq = { body: { email: "test@example.com" } } as Request;
      mockService.subscribe.mockResolvedValue(mockSubscription);

      await controller.subscribe(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ email: "test@example.com", isActive: true }),
      });
    });

    it("should call next with AlreadySubscribedError when already subscribed", async () => {
      const mockReq = { body: { email: "test@example.com" } } as Request;
      const error = new AlreadySubscribedError();
      mockService.subscribe.mockRejectedValue(error);

      await controller.subscribe(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("unsubscribe", () => {
    it("should return 200 on successful unsubscription", async () => {
      const inactiveSubscription = new NewsletterSubscriptionEntity({
        id: "1",
        email: "test@example.com",
        subscribedAt: new Date(),
        isActive: false,
        discountCode: "WELCOME10-ABC123",
        createdAt: new Date(),
      });
      const mockReq = { body: { email: "test@example.com" } } as Request;
      mockService.unsubscribe.mockResolvedValue(inactiveSubscription);

      await controller.unsubscribe(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ email: "test@example.com", isActive: false }),
      });
    });

    it("should call next with SubscriptionNotFoundError when not found", async () => {
      const mockReq = { body: { email: "unknown@example.com" } } as Request;
      const error = new SubscriptionNotFoundError();
      mockService.unsubscribe.mockRejectedValue(error);

      await controller.unsubscribe(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return 200 with all subscriptions", async () => {
      const mockReq = {} as Request;
      mockService.getAllSubscriptions.mockResolvedValue([mockSubscription]);

      await controller.getAll(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ email: "test@example.com" })]),
      });
    });

    it("should call next on error", async () => {
      const mockReq = {} as Request;
      const error = new Error("unexpected error");
      mockService.getAllSubscriptions.mockRejectedValue(error);

      await controller.getAll(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
