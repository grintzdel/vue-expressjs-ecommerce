import { SubscribeUseCase } from "../use-cases/subscribe/subscribe.use-case";
import { UnsubscribeUseCase } from "../use-cases/unsubscribe/unsubscribe.use-case";
import { GetAllSubscriptionsUseCase } from "../use-cases/get-all-subscriptions/get-all-subscriptions.use-case";

export class NewsletterService {
  constructor(
    private readonly subscribeUseCase: SubscribeUseCase,
    private readonly unsubscribeUseCase: UnsubscribeUseCase,
    private readonly getAllSubscriptionsUseCase: GetAllSubscriptionsUseCase
  ) {}

  async subscribe(email: string) {
    return this.subscribeUseCase.execute(email);
  }

  async unsubscribe(email: string) {
    return this.unsubscribeUseCase.execute(email);
  }

  async getAllSubscriptions() {
    return this.getAllSubscriptionsUseCase.execute();
  }
}
