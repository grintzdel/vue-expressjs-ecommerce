import { Router } from "express";
import { NewsletterSubscriptionRepositoryMongooseMongo } from "./infrastructure/repository/newsletter-subscription.repository.mongoose-mongo";
import { SubscribeUseCase } from "./application/use-cases/subscribe/subscribe.use-case";
import { UnsubscribeUseCase } from "./application/use-cases/unsubscribe/unsubscribe.use-case";
import { GetAllSubscriptionsUseCase } from "./application/use-cases/get-all-subscriptions/get-all-subscriptions.use-case";
import { NewsletterService } from "./application/services/newsletter.service";
import { NewsletterController } from "./presentation/controllers/newsletter.controller";

export function createNewsletterModule(): Router {
  const router = Router();

  const newsletterRepository = new NewsletterSubscriptionRepositoryMongooseMongo();

  const subscribeUseCase = new SubscribeUseCase(newsletterRepository);
  const unsubscribeUseCase = new UnsubscribeUseCase(newsletterRepository);
  const getAllSubscriptionsUseCase = new GetAllSubscriptionsUseCase(newsletterRepository);

  const newsletterService = new NewsletterService(
    subscribeUseCase,
    unsubscribeUseCase,
    getAllSubscriptionsUseCase
  );

  const controller = new NewsletterController(newsletterService);

  router.post("/subscribe", (req, res, next) => controller.subscribe(req, res, next));
  router.post("/unsubscribe", (req, res, next) => controller.unsubscribe(req, res, next));
  router.get("/", (req, res, next) => controller.getAll(req, res, next));

  return router;
}
