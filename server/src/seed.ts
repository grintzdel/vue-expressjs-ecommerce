import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config();

// Import all models
import { UserModel } from "./modules/auth/infrastructure/schema/user.schema";
import { CategoryModel } from "./modules/category/infrastructure/schema/category.schema";
import { TagModel } from "./modules/tag/infrastructure/schema/tag.schema";
import { SkinTypeModel } from "./modules/skin-type/infrastructure/schema/skin-type.schema";
import { ProductModel } from "./modules/product/infrastructure/schema/product.schema";
import { PageModel } from "./modules/page/infrastructure/schema/page.schema";
import { BlogPostModel } from "./modules/blog-post/infrastructure/schema/blog-post.schema";
import { TestimonialModel } from "./modules/testimonial/infrastructure/schema/testimonial.schema";
import { NewsletterSubscriptionModel } from "./modules/newsletter/infrastructure/schema/newsletter-subscription.schema";
import { SkinDiagnosisModel } from "./modules/skin-diagnosis/infrastructure/schema/skin-diagnosis.schema";
import { CartItemModel } from "./modules/cart/infrastructure/schema/cart-item.schema";
import { PressLogoModel } from "./modules/press-logo/infrastructure/schema/press-logo.schema";
import { OrderModel } from "./modules/order/infrastructure/schema/order.schema";

async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  // ── Clear all collections ──────────────────────────────────────────────────
  console.log("\n🗑  Clearing all collections...");
  await Promise.all([
    UserModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    TagModel.deleteMany({}),
    SkinTypeModel.deleteMany({}),
    ProductModel.deleteMany({}),
    PageModel.deleteMany({}),
    BlogPostModel.deleteMany({}),
    TestimonialModel.deleteMany({}),
    NewsletterSubscriptionModel.deleteMany({}),
    SkinDiagnosisModel.deleteMany({}),
    CartItemModel.deleteMany({}),
    PressLogoModel.deleteMany({}),
    OrderModel.deleteMany({}),
  ]);
  console.log("✅ All collections cleared");

  // ── Users ─────────────────────────────────────────────────────────────────
  console.log("\n👤 Seeding users...");
  const adminPasswordHash = await bcrypt.hash("Admin1234!", 10);
  const customerPasswordHash = await bcrypt.hash("Customer123!", 10);

  const users = await UserModel.insertMany([
    {
      email: "admin@lumiere-beauty.com",
      password: adminPasswordHash,
      role: "admin",
    },
    {
      email: "sophie.martin@gmail.com",
      password: customerPasswordHash,
      role: "customer",
    },
    {
      email: "emma.leclerc@gmail.com",
      password: customerPasswordHash,
      role: "customer",
    },
    {
      email: "lucas.durand@gmail.com",
      password: customerPasswordHash,
      role: "customer",
    },
    {
      email: "chloe.bernard@outlook.fr",
      password: customerPasswordHash,
      role: "customer",
    },
    {
      email: "hugo.petit@gmail.com",
      password: customerPasswordHash,
      role: "customer",
    },
    {
      email: "lea.moreau@yahoo.fr",
      password: customerPasswordHash,
      role: "customer",
    },
    {
      email: "thomas.roux@gmail.com",
      password: customerPasswordHash,
      role: "customer",
    },
  ]);
  console.log(`✅ ${users.length} users created`);

  // ── Categories ────────────────────────────────────────────────────────────
  console.log("\n📂 Seeding categories...");
  const categories = await CategoryModel.insertMany([
    {
      name: "Facial",
      slug: "facial",
      description:
        "Luxurious facial care products crafted to restore radiance and youthful vitality to your skin.",
    },
    {
      name: "Body",
      slug: "body",
      description:
        "Indulgent body care essentials that nourish, firm and softens skin from head to toe.",
    },
    {
      name: "Hair",
      slug: "hair",
      description:
        "Premium hair care formulas that strengthen, hydrate and bring luminous shine to every strand.",
    },
    {
      name: "Skincare",
      slug: "skincare",
      description:
        "Advanced skincare solutions combining cutting-edge science with the finest botanical ingredients.",
    },
  ]);
  console.log(`✅ ${categories.length} categories created`);

  const [catFacial, catBody, catHair, catSkincare] = categories;

  // ── Tags ─────────────────────────────────────────────────────────────────
  console.log("\n🏷  Seeding tags...");
  const tags = await TagModel.insertMany([
    { name: "Protect", slug: "protect" },
    { name: "Regenerates", slug: "regenerates" },
    { name: "Revitalizes", slug: "revitalizes" },
    { name: "Feeds", slug: "feeds" },
    { name: "Purifies", slug: "purifies" },
    { name: "Hydrate", slug: "hydrate" },
    { name: "Soothes", slug: "soothes" },
  ]);
  console.log(`✅ ${tags.length} tags created`);

  const [tagProtect, tagRegenerates, tagRevitalizes, tagFeeds, tagPurifies, tagHydrate, tagSoothes] = tags;

  // ── Skin Types ────────────────────────────────────────────────────────────
  console.log("\n🧬 Seeding skin types...");
  const skinTypes = await SkinTypeModel.insertMany([
    { name: "Oily", slug: "oily" },
    { name: "Normal", slug: "normal" },
    { name: "Dry", slug: "dry" },
  ]);
  console.log(`✅ ${skinTypes.length} skin types created`);

  const [skinOily, skinNormal, skinDry] = skinTypes;

  // ── Products ──────────────────────────────────────────────────────────────
  console.log("\n🛍  Seeding products...");
  const products = await ProductModel.insertMany([
    {
      name: "Velvet Rose Serum",
      slug: "velvet-rose-serum",
      description:
        "A luxurious anti-aging serum infused with pure Bulgarian rose extract and hyaluronic acid. Visibly reduces fine lines, firms the skin and imparts an ethereal glow. Apply two drops morning and evening to cleansed skin.",
      price: 89.0,
      currency: "EUR",
      images: [
        {
          url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
          altText: "Velvet Rose Serum bottle on a marble surface",
          position: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
          altText: "Velvet Rose Serum texture close-up",
          position: 2,
        },
      ],
      categoryId: catFacial._id.toString(),
      tagIds: [tagRegenerates._id.toString(), tagHydrate._id.toString(), tagRevitalizes._id.toString()],
      skinTypeIds: [skinNormal._id.toString(), skinDry._id.toString()],
      rating: 4.8,
      stockQuantity: 120,
      isFeatured: true,
      ingredients: "Bulgarian Rose Extract — Rich in vitamins A, C and E, deeply nourishes and restores radiance.\nHyaluronic Acid — Attracts and retains moisture for plump, hydrated skin.\nRosehip Oil — Packed with essential fatty acids, helps reduce fine lines and improve skin texture.\nVitamin E — A powerful antioxidant that protects skin from environmental damage.",
      howToUse: "After cleansing and toning, dispense 2–3 drops onto fingertips. Gently press into face and neck using upward motions. Use morning and evening for best results. Follow with moisturiser and SPF in the morning.",
      shippingInfo: "Free standard shipping on orders over €50. Standard delivery 3–5 business days. Express delivery 1–2 business days (€5.90). We ship to all EU countries. 30-day return policy on unopened products.",
    },
    {
      name: "Aloevera Hydrating Cream",
      slug: "aloevera-hydrating-cream",
      description:
        "An ultra-rich moisturising cream made with 85% organic aloe vera, shea butter and vitamin E. Instantly soothes irritated skin, replenishes moisture barriers and leaves skin feeling velvety soft all day long.",
      price: 54.0,
      currency: "EUR",
      images: [
        {
          url: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=800",
          altText: "Aloevera Hydrating Cream jar on green leaves background",
          position: 1,
        },
      ],
      categoryId: catSkincare._id.toString(),
      tagIds: [tagHydrate._id.toString(), tagSoothes._id.toString(), tagFeeds._id.toString()],
      skinTypeIds: [skinDry._id.toString(), skinNormal._id.toString()],
      rating: 4.6,
      stockQuantity: 200,
      isFeatured: true,
      ingredients: "Organic Aloe Vera (85%) — Deeply hydrates, calms irritation and accelerates skin repair.\nShea Butter — Creates a protective moisture barrier while softening the skin.\nVitamin E — Antioxidant protection against free radicals and UV damage.\nCucumber Extract — Cools and soothes sensitive or sun-exposed skin.",
      howToUse: "Apply a generous amount to clean, dry skin. Massage in gentle circular motions until fully absorbed. Use twice daily — morning and evening. Can be layered under sunscreen for daytime protection.",
      shippingInfo: "Free standard shipping on orders over €50. Standard delivery 3–5 business days. Express delivery 1–2 business days (€5.90). We ship to all EU countries. 30-day return policy on unopened products.",
    },
    {
      name: "Glossy Vitamin C Mask",
      slug: "glossy-vitamin-c-mask",
      description:
        "A brightening clay mask enriched with stabilised vitamin C, turmeric and niacinamide. Unclogs pores, evens skin tone and delivers an instant lit-from-within radiance. Use twice a week for 10–15 minutes.",
      price: 42.0,
      currency: "EUR",
      images: [
        {
          url: "https://images.unsplash.com/photo-1570194065650-d99fb4abbd5e?w=800",
          altText: "Glossy Vitamin C Mask in a gold jar",
          position: 1,
        },
      ],
      categoryId: catFacial._id.toString(),
      tagIds: [tagPurifies._id.toString(), tagRevitalizes._id.toString(), tagProtect._id.toString()],
      skinTypeIds: [skinOily._id.toString(), skinNormal._id.toString()],
      rating: 4.5,
      stockQuantity: 85,
      isFeatured: false,
      ingredients: "Stabilised Vitamin C — Brightens skin tone and fades hyperpigmentation without oxidising.\nTurmeric Extract — Natural anti-inflammatory that evens skin tone and boosts radiance.\nNiacinamide — Minimises pores, controls sebum and strengthens the skin barrier.\nKaolin Clay — Gently draws out impurities and excess oil without over-drying.",
      howToUse: "Apply an even layer to clean, dry skin avoiding the eye area. Leave on for 10–15 minutes. Rinse with lukewarm water and pat dry. Use 2–3 times per week for optimal results.",
      shippingInfo: "Free standard shipping on orders over €50. Standard delivery 3–5 business days. Express delivery 1–2 business days (€5.90). We ship to all EU countries. 30-day return policy on unopened products.",
    },
    {
      name: "Midnight Pearl Eye Cream",
      slug: "midnight-pearl-eye-cream",
      description:
        "A precious eye cream powered by marine collagen, caffeine and pearl extract. Diminishes dark circles, depuffs and visibly lifts the delicate eye contour. Gently pat around the orbital bone morning and night.",
      price: 67.0,
      currency: "EUR",
      images: [
        {
          url: "https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=800",
          altText: "Midnight Pearl Eye Cream elegant packaging",
          position: 1,
        },
      ],
      categoryId: catFacial._id.toString(),
      tagIds: [tagRegenerates._id.toString(), tagHydrate._id.toString(), tagSoothes._id.toString()],
      skinTypeIds: [skinNormal._id.toString(), skinDry._id.toString(), skinOily._id.toString()],
      rating: 4.7,
      stockQuantity: 60,
      isFeatured: true,
      ingredients: "Marine Collagen — Firms and plumps the delicate eye area, reducing fine lines.\nCaffeine — Constricts blood vessels to diminish dark circles and puffiness.\nPearl Extract — Provides a luminous, light-reflecting finish to tired eyes.\nHyaluronic Acid — Deeply hydrates the thin under-eye skin for a smoother appearance.",
      howToUse: "Using your ring finger, gently pat a small amount around the orbital bone. Avoid pulling or rubbing the delicate eye area. Apply morning and night after serum but before moisturiser.",
      shippingInfo: "Free standard shipping on orders over €50. Standard delivery 3–5 business days. Express delivery 1–2 business days (€5.90). We ship to all EU countries. 30-day return policy on unopened products.",
    },
    {
      name: "Golden Argan Body Oil",
      slug: "golden-argan-body-oil",
      description:
        "A fast-absorbing dry body oil blending pure Moroccan argan, rosehip and jojoba oils. Deeply nourishes, firms the silhouette and leaves a satin-smooth finish with a subtle golden shimmer.",
      price: 48.0,
      currency: "EUR",
      images: [
        {
          url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800",
          altText: "Golden Argan Body Oil in an amber bottle",
          position: 1,
        },
      ],
      categoryId: catBody._id.toString(),
      tagIds: [tagFeeds._id.toString(), tagRevitalizes._id.toString(), tagHydrate._id.toString()],
      skinTypeIds: [skinDry._id.toString(), skinNormal._id.toString()],
      rating: 4.9,
      stockQuantity: 150,
      isFeatured: true,
      ingredients: "Pure Moroccan Argan Oil — Rich in omega fatty acids, deeply nourishes and repairs skin.\nRosehip Oil — Packed with vitamins A and C, helps improve skin tone and elasticity.\nJojoba Oil — Mimics skin's natural sebum for fast absorption without greasiness.\nGold Mica — Provides a subtle shimmer for a sun-kissed, radiant glow.",
      howToUse: "Warm 3–4 drops between palms and smooth over body immediately after showering while skin is still damp. Focus on dry areas like elbows, knees and shins. Can also be used on hair ends for added shine.",
      shippingInfo: "Free standard shipping on orders over €50. Standard delivery 3–5 business days. Express delivery 1–2 business days (€5.90). We ship to all EU countries. 30-day return policy on unopened products.",
    },
    {
      name: "Silk Protein Hair Mask",
      slug: "silk-protein-hair-mask",
      description:
        "An intensive repair mask fortified with hydrolysed silk proteins, keratin and argan oil. Restores elasticity to damaged or colour-treated hair, seals split ends and delivers mirror-like shine after just one application.",
      price: 36.0,
      currency: "EUR",
      images: [
        {
          url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
          altText: "Silk Protein Hair Mask in a white tub",
          position: 1,
        },
      ],
      categoryId: catHair._id.toString(),
      tagIds: [tagRegenerates._id.toString(), tagFeeds._id.toString(), tagHydrate._id.toString()],
      skinTypeIds: [skinDry._id.toString()],
      rating: 4.6,
      stockQuantity: 95,
      isFeatured: false,
      ingredients: "Hydrolysed Silk Proteins — Penetrate the hair shaft to restore strength and elasticity.\nKeratin Complex — Rebuilds damaged hair structure and seals split ends.\nArgan Oil — Provides deep conditioning and long-lasting shine.\nPanthenol (Vitamin B5) — Improves hair moisture retention and adds volume.",
      howToUse: "After shampooing, apply generously to damp hair from mid-lengths to ends. Leave on for 5–10 minutes (or 20 minutes for intensive repair). Rinse thoroughly with cool water. Use once or twice weekly.",
      shippingInfo: "Free standard shipping on orders over €50. Standard delivery 3–5 business days. Express delivery 1–2 business days (€5.90). We ship to all EU countries. 30-day return policy on unopened products.",
    },
    {
      name: "Pore Refining Botanical Toner",
      slug: "pore-refining-botanical-toner",
      description:
        "A balancing toner infused with witch hazel, green tea extract and zinc PCA. Minimises the appearance of enlarged pores, controls sebum and preps skin for the rest of your routine.",
      price: 32.0,
      currency: "EUR",
      images: [
        {
          url: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800",
          altText: "Pore Refining Botanical Toner in a glass bottle",
          position: 1,
        },
      ],
      categoryId: catSkincare._id.toString(),
      tagIds: [tagPurifies._id.toString(), tagProtect._id.toString()],
      skinTypeIds: [skinOily._id.toString(), skinNormal._id.toString()],
      rating: 4.4,
      stockQuantity: 130,
      isFeatured: false,
      ingredients: "Witch Hazel — Natural astringent that tightens pores and reduces inflammation.\nGreen Tea Extract — Powerful antioxidant that protects and calms the skin.\nZinc PCA — Regulates sebum production and prevents shine throughout the day.\nAloe Vera — Hydrates and soothes without clogging pores.",
      howToUse: "After cleansing, saturate a cotton pad and sweep across face and neck. Allow to absorb for 30 seconds before applying serum or moisturiser. Use morning and evening as the second step in your routine.",
      shippingInfo: "Free standard shipping on orders over €50. Standard delivery 3–5 business days. Express delivery 1–2 business days (€5.90). We ship to all EU countries. 30-day return policy on unopened products.",
    },
    {
      name: "Cocoon Nourishing Body Butter",
      slug: "cocoon-nourishing-body-butter",
      description:
        "A rich body butter whipped from shea, cocoa and mango butters blended with vanilla and sandalwood essential oils. Melts into skin on contact, providing 24-hour moisture and a deliciously warm fragrance.",
      price: 44.0,
      currency: "EUR",
      images: [
        {
          url: "https://images.unsplash.com/photo-1595348020949-87cdfbb44174?w=800",
          altText: "Cocoon Nourishing Body Butter in a cream jar",
          position: 1,
        },
      ],
      categoryId: catBody._id.toString(),
      tagIds: [tagFeeds._id.toString(), tagHydrate._id.toString(), tagSoothes._id.toString()],
      skinTypeIds: [skinDry._id.toString(), skinNormal._id.toString()],
      rating: 4.8,
      stockQuantity: 110,
      isFeatured: false,
      ingredients: "Shea Butter — Intensely moisturises and repairs dry, cracked skin.\nCocoa Butter — Locks in moisture and improves skin elasticity.\nMango Butter — Rich in vitamins A and E, softens and conditions skin.\nVanilla & Sandalwood Essential Oils — Provide a warm, comforting fragrance.",
      howToUse: "Scoop a generous amount and warm between palms. Massage into skin using long, sweeping strokes, focusing on particularly dry areas. Best applied after bathing when skin is slightly damp. Use daily for silky-soft skin.",
      shippingInfo: "Free standard shipping on orders over €50. Standard delivery 3–5 business days. Express delivery 1–2 business days (€5.90). We ship to all EU countries. 30-day return policy on unopened products.",
    },
  ]);
  console.log(`✅ ${products.length} products created`);

  // ── Pages ─────────────────────────────────────────────────────────────────
  console.log("\n📄 Seeding pages...");
  const pages = await PageModel.insertMany([
    {
      title: "About Lumière Beauty",
      slug: "about",
      content: `<h2>Our Story</h2>
<p>Founded in Paris in 2015, Lumière Beauty was born from a simple belief: that luxury skincare should be both effective and ethical. Our founders, Marie Dupont and Chloé Bernard, began in a small Parisian atelier combining pharmaceutical expertise with a passion for botanical ingredients.</p>
<h2>Our Philosophy</h2>
<p>Every formula is developed by our in-house team of cosmetic chemists and dermatologists. We source the finest raw materials—rose extracts from Bulgaria, argan oil from Morocco, aloe vera from Sicily—ensuring full traceability from farm to bottle.</p>
<h2>Clean Beauty Commitment</h2>
<p>We are proudly free from parabens, sulphates, mineral oils and artificial colourants. All our products are cruelty-free and packaged in recyclable glass and aluminium.</p>`,
      seoMeta: {
        title: "About Lumière Beauty | Our Story & Philosophy",
        description:
          "Discover the story behind Lumière Beauty—a Parisian luxury skincare brand committed to clean, effective and ethical beauty since 2015.",
      },
      isPublished: true,
    },
    {
      title: "Contact Us",
      slug: "contact",
      content: `<h2>Get in Touch</h2>
<p>We would love to hear from you. Whether you have a question about your order, need personalised skincare advice or want to explore a wholesale partnership, our team is here to help.</p>
<h3>Customer Service</h3>
<p>Email: hello@lumiere-beauty.com<br/>Phone: +33 1 42 86 55 70<br/>Monday–Friday, 9:00–18:00 CET</p>
<h3>Head Office</h3>
<p>14 Rue du Faubourg Saint-Honoré<br/>75008 Paris, France</p>`,
      seoMeta: {
        title: "Contact Lumière Beauty | Customer Support",
        description:
          "Reach out to the Lumière Beauty team for order support, skincare advice or wholesale enquiries. We are here Monday to Friday, 9–18 CET.",
      },
      isPublished: true,
    },
    {
      title: "Terms & Conditions",
      slug: "terms",
      content: `<h2>Terms & Conditions</h2>
<p>Last updated: 1 January 2025</p>
<h3>1. Acceptance of Terms</h3>
<p>By accessing and purchasing from Lumière Beauty, you agree to be bound by these Terms & Conditions. Please read them carefully before placing an order.</p>
<h3>2. Products & Pricing</h3>
<p>All prices are displayed in Euros (EUR) and include applicable VAT. We reserve the right to modify prices at any time without prior notice.</p>
<h3>3. Orders & Payment</h3>
<p>Orders are processed upon receipt of full payment. We accept Visa, Mastercard, American Express and PayPal. All transactions are secured with 256-bit SSL encryption.</p>
<h3>4. Returns & Refunds</h3>
<p>We offer a 30-day return policy on unopened products in their original packaging. To initiate a return, please contact our customer service team with your order reference.</p>`,
      seoMeta: {
        title: "Terms & Conditions | Lumière Beauty",
        description: "Read the Lumière Beauty Terms & Conditions governing purchases, returns and use of our website.",
      },
      isPublished: true,
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      content: `<h2>Privacy Policy</h2>
<p>Last updated: 1 January 2025</p>
<h3>1. Data We Collect</h3>
<p>We collect information you provide directly to us, such as your name, email address, postal address and payment details when you create an account or place an order.</p>
<h3>2. How We Use Your Data</h3>
<p>Your data is used to process orders, provide customer support, send transactional emails and—with your consent—personalised marketing communications.</p>
<h3>3. Data Sharing</h3>
<p>We do not sell or rent your personal data to third parties. We may share data with trusted service providers (payment processors, logistics partners) solely to fulfil your orders.</p>
<h3>4. Your Rights</h3>
<p>Under GDPR you have the right to access, rectify, erase or port your personal data. To exercise these rights, please contact: privacy@lumiere-beauty.com.</p>`,
      seoMeta: {
        title: "Privacy Policy | Lumière Beauty",
        description:
          "Understand how Lumière Beauty collects, uses and protects your personal data in accordance with GDPR.",
      },
      isPublished: true,
    },
  ]);
  console.log(`✅ ${pages.length} pages created`);

  // ── Blog Posts ────────────────────────────────────────────────────────────
  console.log("\n📝 Seeding blog posts...");
  const blogPosts = await BlogPostModel.insertMany([
    {
      title: "The Science Behind Vitamin C in Skincare",
      slug: "science-behind-vitamin-c-skincare",
      content: `<p>Vitamin C—also known as L-ascorbic acid—is one of the most researched and celebrated actives in modern skincare. As a potent antioxidant, it neutralises free radicals generated by UV exposure and pollution, helping to prevent premature ageing at a cellular level.</p>
<h3>How It Works</h3>
<p>L-ascorbic acid is integral to collagen biosynthesis. By stimulating fibroblast activity, it encourages the skin to produce more of its own collagen, which translates to firmer, plumper skin over time. Clinical studies show a measurable reduction in wrinkle depth after 12 weeks of consistent use.</p>
<h3>Choosing the Right Concentration</h3>
<p>Formulations typically range from 5% to 20%. Beginners should start at 10%, while those with experience can progress to 15–20% for maximum efficacy. Always store your vitamin C product away from direct light to prevent oxidation.</p>
<h3>Pairing Tips</h3>
<p>Vitamin C works synergistically with vitamin E and ferulic acid—this trio dramatically increases its photo-protective activity. Apply in the morning, followed by SPF 50 sunscreen for optimal protection.</p>`,
      excerpt:
        "Discover the dermatologist-approved science behind vitamin C serums—how they fight free radicals, boost collagen and deliver a visible glow.",
      featuredImage: "https://images.unsplash.com/photo-1542444592-ec21d3e7a21e?w=1200",
      author: "Dr. Chloé Bernard",
      publishedAt: new Date("2025-03-15"),
      tags: ["vitamin-c", "anti-aging", "skincare-science"],
    },
    {
      title: "Your Ultimate Guide to a Minimalist Skincare Routine",
      slug: "ultimate-guide-minimalist-skincare-routine",
      content: `<p>In an era of 10-step Korean beauty routines, the minimalist approach is having its moment—and for good reason. A well-curated three-step routine can be just as effective, less time-consuming and far kinder to your skin barrier.</p>
<h3>Step 1: Cleanse</h3>
<p>A gentle, pH-balanced cleanser removes impurities without stripping natural oils. Look for ingredients like glycerin, ceramides or micellar agents. Avoid harsh sulphates if you have sensitive or dry skin.</p>
<h3>Step 2: Treat</h3>
<p>This is where you address your primary skin concern—be it hyperpigmentation, acne or ageing. Choose one hero active (retinol, vitamin C or niacinamide) and apply it consistently. Consistency beats complexity every time.</p>
<h3>Step 3: Moisturise + Protect</h3>
<p>Seal your routine with a moisturiser that reinforces your skin barrier. In the morning, always finish with a broad-spectrum SPF 30 or higher—it remains the single most effective anti-ageing product available.</p>
<h3>When Less Really Is More</h3>
<p>Over-layering products can disrupt your skin microbiome and compromise barrier integrity. If you experience sensitivity, redness or breakouts, stripping back to the basics for two weeks often brings remarkable improvement.</p>`,
      excerpt:
        "Less is more when it comes to skincare. Learn how a thoughtful three-step routine can deliver better results than a cabinet full of products.",
      featuredImage: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200",
      author: "Marie Dupont",
      publishedAt: new Date("2025-02-28"),
      tags: ["routine", "minimalist", "skincare-tips"],
    },
    {
      title: "The Remarkable Benefits of Argan Oil for Skin & Hair",
      slug: "benefits-argan-oil-skin-hair",
      content: `<p>Often referred to as "liquid gold", argan oil is cold-pressed from the kernels of the Argania spinosa tree, native to the arid regions of Morocco. Its extraordinarily high content of oleic and linoleic fatty acids, combined with vitamin E tocopherols and squalene, makes it one of the most nutrient-dense botanical oils in the world.</p>
<h3>For the Skin</h3>
<p>Argan oil is rapidly absorbed by the epidermis without leaving a greasy residue. Its anti-inflammatory properties calm conditions such as eczema and psoriasis, while its lipid-rich profile strengthens the skin barrier and reduces transepidermal water loss—key to maintaining long-term hydration.</p>
<h3>For the Hair</h3>
<p>Applied to damp hair before heat styling, argan oil forms a protective coating around the hair shaft, reducing breakage and frizz. Used as an overnight treatment on dry or damaged lengths, it visibly restores elasticity and imparts extraordinary shine within weeks.</p>
<h3>How to Choose Quality Argan Oil</h3>
<p>Look for 100% pure, cold-pressed, unrefined argan oil packaged in dark glass. Cheap variants often contain mineral oil fillers. Our Golden Argan Body Oil uses certified organic argan sourced directly from a women's cooperative in Agadir—ensuring both quality and fair trade standards.</p>`,
      excerpt:
        "From skin barrier repair to hair shine restoration—explore the science-backed benefits of pure Moroccan argan oil and how to incorporate it into your routine.",
      featuredImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200",
      author: "Dr. Chloé Bernard",
      publishedAt: new Date("2025-01-20"),
      tags: ["argan-oil", "hair-care", "natural-ingredients"],
    },
  ]);
  console.log(`✅ ${blogPosts.length} blog posts created`);

  // ── Testimonials ──────────────────────────────────────────────────────────
  console.log("\n⭐ Seeding testimonials...");
  const testimonials = await TestimonialModel.insertMany([
    {
      authorName: "Sophie M.",
      content:
        "The Velvet Rose Serum has completely transformed my skin. After just three weeks my fine lines are noticeably softer and my complexion is radiant. I will never go back to my old routine!",
      rating: 5,
      featuredProductIds: [products[0]._id.toString()],
      isFeatured: true,
    },
    {
      authorName: "Isabelle R.",
      content:
        "I suffer from very dry, sensitive skin and the Aloevera Hydrating Cream is the only moisturiser that doesn't irritate me. It absorbs beautifully and keeps my skin comfortable all day. Absolutely love it.",
      rating: 5,
      featuredProductIds: [products[1]._id.toString()],
      isFeatured: true,
    },
    {
      authorName: "Lucas B.",
      content:
        "The Golden Argan Body Oil is incredible. My skin hasn't felt this soft since I was a child! The shimmer is subtle enough for everyday use and the scent is divine. A true luxury at a fair price.",
      rating: 5,
      featuredProductIds: [products[4]._id.toString()],
      isFeatured: true,
    },
    {
      authorName: "Camille T.",
      content:
        "I tried the Glossy Vitamin C Mask after reading the blog post and I'm so glad I did. My skin tone has evened out considerably and my pores look much smaller. I use it every Sunday as a self-care ritual.",
      rating: 4,
      featuredProductIds: [products[2]._id.toString()],
      isFeatured: false,
    },
    {
      authorName: "Nathalie G.",
      content:
        "The Midnight Pearl Eye Cream is worth every cent. I work long hours in front of screens and the puffiness I used to have every morning is almost completely gone. Packaging is gorgeous too—makes a perfect gift.",
      rating: 5,
      featuredProductIds: [products[3]._id.toString()],
      isFeatured: true,
    },
  ]);
  console.log(`✅ ${testimonials.length} testimonials created`);

  // ── Newsletter Subscriptions ───────────────────────────────────────────────
  console.log("\n📧 Seeding newsletter subscriptions...");
  const subscriptions = await NewsletterSubscriptionModel.insertMany([
    {
      email: "sophie.martin@gmail.com",
      subscribedAt: new Date("2025-01-10"),
      isActive: true,
      discountCode: "WELCOME15",
    },
    {
      email: "emma.leclerc@gmail.com",
      subscribedAt: new Date("2025-02-05"),
      isActive: true,
      discountCode: "WELCOME15",
    },
    {
      email: "juliette.moreau@hotmail.fr",
      subscribedAt: new Date("2025-03-22"),
      isActive: true,
      discountCode: null,
    },
  ]);
  console.log(`✅ ${subscriptions.length} newsletter subscriptions created`);

  // ── Skin Diagnoses ────────────────────────────────────────────────────────
  console.log("\n🔬 Seeding skin diagnoses...");
  const diagnoses = await SkinDiagnosisModel.insertMany([
    {
      sessionToken: "sess_diag_a1b2c3d4e5f6",
      answers: [
        { questionId: "q1", answer: "My skin feels tight and flaky by midday" },
        { questionId: "q2", answer: "I rarely experience breakouts" },
        { questionId: "q3", answer: "My pores are barely visible" },
        { questionId: "q4", answer: "I need to reapply moisturiser throughout the day" },
      ],
      result: "dry",
      recommendedProductIds: [
        products[1]._id.toString(),
        products[0]._id.toString(),
        products[4]._id.toString(),
      ],
    },
    {
      sessionToken: "sess_diag_z9y8x7w6v5u4",
      answers: [
        { questionId: "q1", answer: "My T-zone becomes shiny within a few hours of cleansing" },
        { questionId: "q2", answer: "I get frequent breakouts, especially around my forehead and nose" },
        { questionId: "q3", answer: "My pores are quite visible, especially on my nose" },
        { questionId: "q4", answer: "I prefer lightweight, gel-based moisturisers" },
      ],
      result: "oily",
      recommendedProductIds: [
        products[2]._id.toString(),
        products[6]._id.toString(),
      ],
    },
  ]);
  console.log(`✅ ${diagnoses.length} skin diagnoses created`);

  // ── Cart Items ────────────────────────────────────────────────────────────
  console.log("\n🛒 Seeding cart items...");
  const cartItems = await CartItemModel.insertMany([
    {
      sessionId: "cart_sess_abc123xyz",
      productId: products[0]._id.toString(),
      quantity: 1,
    },
    {
      sessionId: "cart_sess_abc123xyz",
      productId: products[4]._id.toString(),
      quantity: 2,
    },
    {
      sessionId: "cart_sess_def456uvw",
      productId: products[1]._id.toString(),
      quantity: 1,
    },
  ]);
  console.log(`✅ ${cartItems.length} cart items created`);

  // ── Press Logos ───────────────────────────────────────────────────────────
  console.log("\n📰 Seeding press logos...");
  const pressLogos = await PressLogoModel.insertMany([
    {
      name: "Vogue",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Vogue_logo.svg/320px-Vogue_logo.svg.png",
      link: "https://www.vogue.com",
      position: 1,
    },
    {
      name: "Forbes",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Forbes_logo.svg/320px-Forbes_logo.svg.png",
      link: "https://www.forbes.com",
      position: 2,
    },
    {
      name: "Women's Health",
      logoUrl: "https://www.womenshealthmag.com/assets/img/womenshealth-logo.svg",
      link: "https://www.womenshealthmag.com",
      position: 3,
    },
    {
      name: "WWD",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/WWD_logo.svg/320px-WWD_logo.svg.png",
      link: "https://wwd.com",
      position: 4,
    },
    {
      name: "Allure",
      logoUrl: "https://www.allure.com/verso/static/allure/assets/logo.svg",
      link: "https://www.allure.com",
      position: 5,
    },
  ]);
  console.log(`✅ ${pressLogos.length} press logos created`);

  // ── Orders ────────────────────────────────────────────────────────────────
  console.log("\n📦 Seeding orders...");
  const orders = await OrderModel.insertMany([
    {
      userId: users[1]._id.toString(),
      items: [
        { productId: products[0]._id.toString(), productName: "Velvet Rose Serum", quantity: 2, unitPrice: 89.0 },
        { productId: products[4]._id.toString(), productName: "Golden Argan Body Oil", quantity: 1, unitPrice: 48.0 },
      ],
      totalAmount: 226.0,
      currency: "EUR",
      status: "delivered",
      shippingAddress: "12 Rue de Rivoli, 75001 Paris, France",
      createdAt: new Date("2025-11-15"),
    },
    {
      userId: users[1]._id.toString(),
      items: [
        { productId: products[2]._id.toString(), productName: "Glossy Vitamin C Mask", quantity: 1, unitPrice: 42.0 },
      ],
      totalAmount: 42.0,
      currency: "EUR",
      status: "shipped",
      shippingAddress: "12 Rue de Rivoli, 75001 Paris, France",
      createdAt: new Date("2026-02-20"),
    },
    {
      userId: users[2]._id.toString(),
      items: [
        { productId: products[1]._id.toString(), productName: "Aloevera Hydrating Cream", quantity: 1, unitPrice: 54.0 },
        { productId: products[3]._id.toString(), productName: "Midnight Pearl Eye Cream", quantity: 1, unitPrice: 67.0 },
        { productId: products[6]._id.toString(), productName: "Pore Refining Botanical Toner", quantity: 2, unitPrice: 32.0 },
      ],
      totalAmount: 185.0,
      currency: "EUR",
      status: "confirmed",
      shippingAddress: "45 Boulevard Haussmann, 75009 Paris, France",
      createdAt: new Date("2026-03-10"),
    },
    {
      userId: users[3]._id.toString(),
      items: [
        { productId: products[5]._id.toString(), productName: "Silk Protein Hair Mask", quantity: 3, unitPrice: 36.0 },
      ],
      totalAmount: 108.0,
      currency: "EUR",
      status: "delivered",
      shippingAddress: "8 Place Bellecour, 69002 Lyon, France",
      createdAt: new Date("2025-12-03"),
    },
    {
      userId: users[3]._id.toString(),
      items: [
        { productId: products[0]._id.toString(), productName: "Velvet Rose Serum", quantity: 1, unitPrice: 89.0 },
        { productId: products[7]._id.toString(), productName: "Cocoon Nourishing Body Butter", quantity: 2, unitPrice: 44.0 },
      ],
      totalAmount: 177.0,
      currency: "EUR",
      status: "pending",
      shippingAddress: "8 Place Bellecour, 69002 Lyon, France",
      createdAt: new Date("2026-04-10"),
    },
    {
      userId: users[4]._id.toString(),
      items: [
        { productId: products[3]._id.toString(), productName: "Midnight Pearl Eye Cream", quantity: 1, unitPrice: 67.0 },
      ],
      totalAmount: 67.0,
      currency: "EUR",
      status: "cancelled",
      shippingAddress: "22 Quai des Chartrons, 33000 Bordeaux, France",
      createdAt: new Date("2026-01-18"),
    },
    {
      userId: users[4]._id.toString(),
      items: [
        { productId: products[1]._id.toString(), productName: "Aloevera Hydrating Cream", quantity: 2, unitPrice: 54.0 },
        { productId: products[4]._id.toString(), productName: "Golden Argan Body Oil", quantity: 1, unitPrice: 48.0 },
      ],
      totalAmount: 156.0,
      currency: "EUR",
      status: "delivered",
      shippingAddress: "22 Quai des Chartrons, 33000 Bordeaux, France",
      createdAt: new Date("2025-10-25"),
    },
    {
      userId: users[6]._id.toString(),
      items: [
        { productId: products[2]._id.toString(), productName: "Glossy Vitamin C Mask", quantity: 1, unitPrice: 42.0 },
        { productId: products[5]._id.toString(), productName: "Silk Protein Hair Mask", quantity: 1, unitPrice: 36.0 },
        { productId: products[6]._id.toString(), productName: "Pore Refining Botanical Toner", quantity: 1, unitPrice: 32.0 },
      ],
      totalAmount: 110.0,
      currency: "EUR",
      status: "shipped",
      shippingAddress: "3 Rue du Vieux-Port, 13001 Marseille, France",
      createdAt: new Date("2026-03-28"),
    },
  ]);
  console.log(`✅ ${orders.length} orders created`);
  // Users without orders: hugo.petit (users[5]) and thomas.roux (users[7])

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n🎉 Database seeded successfully!");
  console.log("─".repeat(40));
  console.log(`  Users:                   ${users.length}`);
  console.log(`  Categories:              ${categories.length}`);
  console.log(`  Tags:                    ${tags.length}`);
  console.log(`  Skin Types:              ${skinTypes.length}`);
  console.log(`  Products:                ${products.length}`);
  console.log(`  Pages:                   ${pages.length}`);
  console.log(`  Blog Posts:              ${blogPosts.length}`);
  console.log(`  Testimonials:            ${testimonials.length}`);
  console.log(`  Newsletter Subscriptions:${subscriptions.length}`);
  console.log(`  Skin Diagnoses:          ${diagnoses.length}`);
  console.log(`  Cart Items:              ${cartItems.length}`);
  console.log(`  Press Logos:             ${pressLogos.length}`);
  console.log(`  Orders:                  ${orders.length}`);
  console.log("─".repeat(40));

  await mongoose.disconnect();
  console.log("✅ Disconnected from MongoDB");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
