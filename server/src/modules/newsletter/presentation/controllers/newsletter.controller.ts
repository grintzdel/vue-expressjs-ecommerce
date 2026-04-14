import { Request, Response, NextFunction } from "express";
import { NewsletterService } from "../../application/services/newsletter.service";
import { SubscribeRequestDto } from "../dto/subscribe.request.dto";
import { NewsletterSubscriptionResponseDto } from "../dto/newsletter-subscription.response.dto";

export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  async subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new SubscribeRequestDto(req.body);
      const subscription = await this.newsletterService.subscribe(dto.email);
      const response = new NewsletterSubscriptionResponseDto(subscription);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async unsubscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new SubscribeRequestDto(req.body);
      const subscription = await this.newsletterService.unsubscribe(dto.email);
      const response = new NewsletterSubscriptionResponseDto(subscription);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscriptions = await this.newsletterService.getAllSubscriptions();
      const response = subscriptions.map((s) => new NewsletterSubscriptionResponseDto(s));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }
}
