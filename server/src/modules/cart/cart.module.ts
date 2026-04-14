import { Router } from "express";
import { CartItemRepositoryMongooseMongo } from "./infrastructure/repository/cart-item.repository.mongoose-mongo";
import { AddToCartUseCase } from "./application/use-cases/add-to-cart/add-to-cart.use-case";
import { GetCartUseCase } from "./application/use-cases/get-cart/get-cart.use-case";
import { UpdateCartItemUseCase } from "./application/use-cases/update-cart-item/update-cart-item.use-case";
import { RemoveCartItemUseCase } from "./application/use-cases/remove-cart-item/remove-cart-item.use-case";
import { CartService } from "./application/services/cart.service";
import { CartController } from "./presentation/controllers/cart.controller";

export function createCartModule(): Router {
  const router = Router();

  const cartItemRepository = new CartItemRepositoryMongooseMongo();

  const addToCartUseCase = new AddToCartUseCase(cartItemRepository);
  const getCartUseCase = new GetCartUseCase(cartItemRepository);
  const updateCartItemUseCase = new UpdateCartItemUseCase(cartItemRepository);
  const removeCartItemUseCase = new RemoveCartItemUseCase(cartItemRepository);

  const cartService = new CartService(
    addToCartUseCase,
    getCartUseCase,
    updateCartItemUseCase,
    removeCartItemUseCase
  );

  const controller = new CartController(cartService);

  router.post("/", (req, res, next) => controller.addToCart(req, res, next));
  router.get("/:sessionId", (req, res, next) => controller.getCart(req, res, next));
  router.patch("/:id", (req, res, next) => controller.updateCartItem(req, res, next));
  router.delete("/:id", (req, res, next) => controller.removeCartItem(req, res, next));

  return router;
}
