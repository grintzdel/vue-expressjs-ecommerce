import express, { type Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import { loggerMiddleware } from "./shared/middlewares/logger.middleware";
import { errorHandlerMiddleware } from "./shared/middlewares/error-handler.middleware";
import { createAuthModule } from "./modules/auth/auth.module";
import { createUserModule } from "./modules/user/user.module";
import { createCategoryModule } from "./modules/category/category.module";
import { createTagModule } from "./modules/tag/tag.module";
import { createSkinTypeModule } from "./modules/skin-type/skin-type.module";
import { createProductModule } from "./modules/product/product.module";
import { createPageModule } from "./modules/page/page.module";
import { createBlogPostModule } from "./modules/blog-post/blog-post.module";
import { createTestimonialModule } from "./modules/testimonial/testimonial.module";
import { createNewsletterModule } from "./modules/newsletter/newsletter.module";
import { createSkinDiagnosisModule } from "./modules/skin-diagnosis/skin-diagnosis.module";
import { createCartModule } from "./modules/cart/cart.module";
import { createPressLogoModule } from "./modules/press-logo/press-logo.module";
import { createOrderModule } from "./modules/order/order.module";
import { createAnalyticsModule } from "./modules/analytics/analytics.module";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(loggerMiddleware);

// Modules
const { router: authRouter, jwtService, userRepository } = createAuthModule();
app.use("/api/auth", authRouter);
app.use("/api/users", createUserModule(userRepository, jwtService));
app.use("/api/categories", createCategoryModule());
app.use("/api/tags", createTagModule());
app.use("/api/skin-types", createSkinTypeModule());
app.use("/api/products", createProductModule());
app.use("/api/pages", createPageModule());
app.use("/api/blog-posts", createBlogPostModule());
app.use("/api/testimonials", createTestimonialModule());
app.use("/api/newsletter", createNewsletterModule());
app.use("/api/skin-diagnosis", createSkinDiagnosisModule());
app.use("/api/cart", createCartModule());
app.use("/api/press-logos", createPressLogoModule());
app.use("/api/orders", createOrderModule());
app.use("/api/analytics", createAnalyticsModule());

app.use(errorHandlerMiddleware);

async function bootstrap(): Promise<void> {
  await connectDatabase(process.env.MONGODB_URI!);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch(console.error);

export { app };
