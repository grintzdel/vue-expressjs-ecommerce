import { Request, Response, NextFunction } from "express";
import { CartService } from "../../application/services/cart.service";
import { AddToCartRequestDto } from "../dto/add-to-cart.request.dto";
import { UpdateCartItemRequestDto } from "../dto/update-cart-item.request.dto";
import { CartItemResponseDto } from "../dto/cart-item.response.dto";

export class CartController {
  constructor(private readonly cartService: CartService) {}

  async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new AddToCartRequestDto(req.body);
      const cartItem = await this.cartService.addToCart(dto);
      const response = new CartItemResponseDto(cartItem);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params["sessionId"] as string;
      const cartItems = await this.cartService.getCart(sessionId);
      const response = cartItems.map((item) => new CartItemResponseDto(item));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      const dto = new UpdateCartItemRequestDto(req.body);
      const cartItem = await this.cartService.updateCartItem(id, dto.quantity);
      const response = new CartItemResponseDto(cartItem);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async removeCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      await this.cartService.removeCartItem(id);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}
