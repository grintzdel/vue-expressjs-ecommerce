# Plan 1 : Setup Monorepo + Shared Infra + Auth + User

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en place le monorepo (server/client), l'infrastructure partagee (DB, middlewares, AppError), les modules Auth et User avec JWT, hash, et middleware d'authentification.

**Architecture:** Clean architecture modulaire par module (application/domain/infrastructure/presentation). Injection de dependances manuelle via constructeurs. Repository pattern avec Mongoose/MongoDB.

**Tech Stack:** Node.js, Express, TypeScript, MongoDB, Mongoose, bcryptjs, jsonwebtoken, Jest, ts-jest, mongodb-memory-server, Vue 3, Vite

---

## File Structure

```
vue-node-2/
├── server/
│   ├── src/
│   │   ├── main.ts
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── shared/
│   │   │   ├── middlewares/
│   │   │   │   ├── error-handler.middleware.ts
│   │   │   │   ├── logger.middleware.ts
│   │   │   │   └── auth.middleware.ts
│   │   │   └── types/
│   │   │       └── express.d.ts
│   │   └── modules/
│   │       ├── auth/
│   │       │   ├── auth.module.ts
│   │       │   ├── application/
│   │       │   │   ├── services/
│   │       │   │   │   ├── auth.service.ts
│   │       │   │   │   └── security/
│   │       │   │   │       ├── hash.service-security.ts
│   │       │   │   │       └── jwt.service-security.ts
│   │       │   │   └── use-cases/
│   │       │   │       ├── register/register.use-case.ts
│   │       │   │       └── login/login.use-case.ts
│   │       │   ├── domain/
│   │       │   │   ├── constants/auth.constant.ts
│   │       │   │   ├── entity/user.entity.ts
│   │       │   │   ├── errors/auth.error.ts
│   │       │   │   └── repository/user.repository.interface.ts
│   │       │   ├── infrastructure/
│   │       │   │   ├── repository/user.repository.mongoose-mongo.ts
│   │       │   │   └── schema/user.schema.ts
│   │       │   └── presentation/
│   │       │       ├── controllers/auth.controller.ts
│   │       │       └── dto/
│   │       │           ├── register.request.dto.ts
│   │       │           ├── register.response.dto.ts
│   │       │           ├── login.request.dto.ts
│   │       │           └── login.response.dto.ts
│   │       └── user/
│   │           ├── user.module.ts
│   │           ├── application/
│   │           │   ├── services/user.service.ts
│   │           │   └── use-cases/
│   │           │       ├── get-profile/get-profile.use-case.ts
│   │           │       ├── update-profile/update-profile.use-case.ts
│   │           │       └── get-all-users/get-all-users.use-case.ts
│   │           ├── domain/
│   │           │   └── errors/user.error.ts
│   │           └── presentation/
│   │               ├── controllers/user.controller.ts
│   │               └── dto/
│   │                   ├── update-profile.request.dto.ts
│   │                   └── user.response.dto.ts
│   ├── tests/
│   │   └── modules/
│   │       ├── auth/
│   │       │   ├── application/
│   │       │   │   ├── services/auth.service.spec.ts
│   │       │   │   └── use-cases/
│   │       │   │       ├── register.use-case.spec.ts
│   │       │   │       └── login.use-case.spec.ts
│   │       │   ├── domain/entity/user.entity.spec.ts
│   │       │   ├── infrastructure/repository/user.repository.mongoose-mongo.spec.ts
│   │       │   └── presentation/controllers/auth.controller.spec.ts
│   │       └── user/
│   │           ├── application/
│   │           │   ├── services/user.service.spec.ts
│   │           │   └── use-cases/
│   │           │       ├── get-profile.use-case.spec.ts
│   │           │       ├── update-profile.use-case.spec.ts
│   │           │       └── get-all-users.use-case.spec.ts
│   │           └── presentation/controllers/user.controller.spec.ts
│   ├── docker-compose.yml
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   └── .env
├── client/
│   ├── src/
│   │   ├── main.ts
│   │   ├── App.vue
│   │   └── router/index.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── package.json (root)
```

**Note importante :** Le module User reutilise l'entite `UserEntity`, le schema `UserModel` et l'interface `IUserRepository` du module Auth (le user est la meme entite). Le module User n'a pas sa propre couche domain/entity ni infrastructure — il importe depuis auth. Cela evite la duplication. Le module User ajoute seulement ses propres use-cases, service, controller et DTOs.

---

### Task 1: Initialisation du monorepo et configs

**Files:**
- Create: `package.json` (root)
- Create: `.gitignore`
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/jest.config.ts`
- Create: `server/.env`
- Create: `server/docker-compose.yml`
- Create: `client/package.json`
- Create: `client/tsconfig.json`
- Create: `client/vite.config.ts`
- Create: `client/index.html`
- Create: `client/src/main.ts`
- Create: `client/src/App.vue`

- [ ] **Step 1: Creer le package.json racine**

```json
{
  "name": "vue-node-2",
  "private": true,
  "scripts": {
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "test:server": "cd server && npm test"
  }
}
```

- [ ] **Step 2: Creer le .gitignore**

```
node_modules/
dist/
.env
*.log
.vite/
```

- [ ] **Step 3: Creer server/docker-compose.yml**

Copie exacte du fichier de reference :

```yaml
services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

- [ ] **Step 4: Creer server/package.json**

```json
{
  "name": "ecommerce-server",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.6",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.8.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.14",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.9.0",
    "jest": "^29.7.0",
    "mongodb-memory-server": "^10.4.0",
    "ts-jest": "^29.2.5",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 5: Creer server/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": "./src",
    "paths": {
      "@modules/*": ["modules/*"],
      "@shared/*": ["shared/*"],
      "@config/*": ["config/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 6: Creer server/jest.config.ts**

```typescript
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  moduleNameMapper: {
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
  },
};

export default config;
```

- [ ] **Step 7: Creer server/.env**

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

- [ ] **Step 8: Scaffolder le client Vue**

`client/package.json` :

```json
{
  "name": "ecommerce-client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.30",
    "vue-router": "^4.6.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.5",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "^5.6.0",
    "vite": "^8.0.0"
  }
}
```

`client/tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

`client/vite.config.ts` :

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
```

`client/index.html` :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>E-Commerce</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`client/src/main.ts` :

```typescript
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.mount("#app");
```

`client/src/App.vue` :

```vue
<template>
  <div>
    <h1>E-Commerce</h1>
    <router-view />
  </div>
</template>
```

- [ ] **Step 9: Installer les dependances**

```bash
cd server && npm install
cd ../client && npm install
```

- [ ] **Step 10: Verifier la compilation TypeScript**

```bash
cd server && npx tsc --noEmit
```

Expected: aucune erreur (il n'y a pas encore de fichiers src).

- [ ] **Step 11: Commit**

```bash
git init
git add .
git commit -m "chore: init monorepo with server and client configs"
```

---

### Task 2: Infrastructure partagee (DB, middlewares, AppError)

**Files:**
- Create: `server/src/config/database.ts`
- Create: `server/src/shared/middlewares/error-handler.middleware.ts`
- Create: `server/src/shared/middlewares/logger.middleware.ts`

- [ ] **Step 1: Creer server/src/config/database.ts**

```typescript
import mongoose from "mongoose";

export async function connectDatabase(uri: string): Promise<void> {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}
```

- [ ] **Step 2: Creer server/src/shared/middlewares/error-handler.middleware.ts**

```typescript
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export function errorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  console.error("Unexpected error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}
```

- [ ] **Step 3: Creer server/src/shared/middlewares/logger.middleware.ts**

```typescript
import { Request, Response, NextFunction } from "express";

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });

  next();
}
```

- [ ] **Step 4: Verifier la compilation**

```bash
cd server && npx tsc --noEmit
```

Expected: PASS (aucune erreur)

- [ ] **Step 5: Commit**

```bash
git add server/src/config/ server/src/shared/
git commit -m "feat: add database config and shared middlewares"
```

---

### Task 3: Module Auth — Domain (entity, errors, constants, repository interface)

**Files:**
- Create: `server/src/modules/auth/domain/entity/user.entity.ts`
- Create: `server/src/modules/auth/domain/errors/auth.error.ts`
- Create: `server/src/modules/auth/domain/constants/auth.constant.ts`
- Create: `server/src/modules/auth/domain/repository/user.repository.interface.ts`
- Test: `server/tests/modules/auth/domain/entity/user.entity.spec.ts`

- [ ] **Step 1: Ecrire le test pour UserEntity**

`server/tests/modules/auth/domain/entity/user.entity.spec.ts` :

```typescript
import { UserEntity } from "../../../../src/modules/auth/domain/entity/user.entity";

describe("UserEntity", () => {
  const props = {
    id: "123",
    email: "test@test.com",
    password: "hashed",
    role: "customer" as const,
    createdAt: new Date("2024-01-01"),
  };

  it("should create entity with correct properties", () => {
    const user = new UserEntity(props);
    expect(user.id).toBe("123");
    expect(user.email).toBe("test@test.com");
    expect(user.password).toBe("hashed");
    expect(user.role).toBe("customer");
    expect(user.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should allow updating email", () => {
    const user = new UserEntity(props);
    user.email = "new@test.com";
    expect(user.email).toBe("new@test.com");
  });

  it("should allow updating password", () => {
    const user = new UserEntity(props);
    user.password = "newHash";
    expect(user.password).toBe("newHash");
  });

  it("should not allow changing id", () => {
    const user = new UserEntity(props);
    expect(user.id).toBe("123");
    // id has no setter
  });
});
```

- [ ] **Step 2: Lancer le test pour verifier qu'il echoue**

```bash
cd server && npx jest tests/modules/auth/domain/entity/user.entity.spec.ts
```

Expected: FAIL (module not found)

- [ ] **Step 3: Creer user.entity.ts**

```typescript
export interface UserEntityProps {
  id: string;
  email: string;
  password: string;
  role: "admin" | "customer";
  createdAt: Date;
}

export class UserEntity {
  private _id: string;
  private _email: string;
  private _password: string;
  private _role: "admin" | "customer";
  private _createdAt: Date;

  constructor(props: UserEntityProps) {
    this._id = props.id;
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get role(): "admin" | "customer" {
    return this._role;
  }

  set role(value: "admin" | "customer") {
    this._role = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
```

- [ ] **Step 4: Creer auth.error.ts**

```typescript
import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super(409, "User already exists");
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(401, "Invalid credentials");
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super(404, "User not found");
  }
}
```

- [ ] **Step 5: Creer auth.constant.ts**

```typescript
export const AUTH_CONSTANTS = {
  SALT_ROUNDS: 10,
  JWT_DEFAULT_EXPIRATION: "24h",
  ROLES: {
    ADMIN: "admin",
    CUSTOMER: "customer",
  },
} as const;
```

- [ ] **Step 6: Creer user.repository.interface.ts**

```typescript
import { UserEntity } from "../entity/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(data: { email: string; password: string; role: "admin" | "customer" }): Promise<UserEntity>;
  update(id: string, data: Partial<{ email: string; password: string; role: "admin" | "customer" }>): Promise<UserEntity | null>;
}
```

- [ ] **Step 7: Lancer le test**

```bash
cd server && npx jest tests/modules/auth/domain/entity/user.entity.spec.ts
```

Expected: PASS (4 tests)

- [ ] **Step 8: Commit**

```bash
git add server/src/modules/auth/domain/ server/tests/modules/auth/domain/
git commit -m "feat(auth): add domain layer - entity, errors, constants, repository interface"
```

---

### Task 4: Module Auth — Infrastructure (schema + repository)

**Files:**
- Create: `server/src/modules/auth/infrastructure/schema/user.schema.ts`
- Create: `server/src/modules/auth/infrastructure/repository/user.repository.mongoose-mongo.ts`
- Test: `server/tests/modules/auth/infrastructure/repository/user.repository.mongoose-mongo.spec.ts`

- [ ] **Step 1: Ecrire le test du repository**

`server/tests/modules/auth/infrastructure/repository/user.repository.mongoose-mongo.spec.ts` :

```typescript
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserRepositoryMongooseMongo } from "../../../../src/modules/auth/infrastructure/repository/user.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: UserRepositoryMongooseMongo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new UserRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("UserRepositoryMongooseMongo", () => {
  it("should create a user and return entity", async () => {
    const user = await repository.create({
      email: "test@test.com",
      password: "hashed",
      role: "customer",
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("test@test.com");
    expect(user.password).toBe("hashed");
    expect(user.role).toBe("customer");
  });

  it("should find user by email", async () => {
    await repository.create({ email: "test@test.com", password: "hashed", role: "customer" });

    const found = await repository.findByEmail("test@test.com");
    expect(found).not.toBeNull();
    expect(found!.email).toBe("test@test.com");
  });

  it("should return null for unknown email", async () => {
    const found = await repository.findByEmail("unknown@test.com");
    expect(found).toBeNull();
  });

  it("should find user by id", async () => {
    const created = await repository.create({ email: "test@test.com", password: "hashed", role: "customer" });

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.email).toBe("test@test.com");
  });

  it("should find all users", async () => {
    await repository.create({ email: "a@test.com", password: "h", role: "customer" });
    await repository.create({ email: "b@test.com", password: "h", role: "admin" });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it("should update a user", async () => {
    const created = await repository.create({ email: "test@test.com", password: "hashed", role: "customer" });

    const updated = await repository.update(created.id, { email: "new@test.com" });
    expect(updated).not.toBeNull();
    expect(updated!.email).toBe("new@test.com");
  });
});
```

- [ ] **Step 2: Lancer le test pour verifier qu'il echoue**

```bash
cd server && npx jest tests/modules/auth/infrastructure/repository/user.repository.mongoose-mongo.spec.ts
```

Expected: FAIL

- [ ] **Step 3: Creer user.schema.ts**

```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: "admin" | "customer";
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
```

- [ ] **Step 4: Creer user.repository.mongoose-mongo.ts**

```typescript
import { IUserRepository } from "../../domain/repository/user.repository.interface";
import { UserEntity } from "../../domain/entity/user.entity";
import { UserModel } from "../schema/user.schema";

export class UserRepositoryMongooseMongo implements IUserRepository {
  private toEntity(doc: any): UserEntity {
    return new UserEntity({
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      role: doc.role,
      createdAt: doc.createdAt,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findAll(): Promise<UserEntity[]> {
    const docs = await UserModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async create(data: { email: string; password: string; role: "admin" | "customer" }): Promise<UserEntity> {
    const doc = await UserModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<{ email: string; password: string; role: "admin" | "customer" }>): Promise<UserEntity | null> {
    const doc = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }
}
```

- [ ] **Step 5: Lancer le test**

```bash
cd server && npx jest tests/modules/auth/infrastructure/repository/user.repository.mongoose-mongo.spec.ts
```

Expected: PASS (6 tests)

- [ ] **Step 6: Commit**

```bash
git add server/src/modules/auth/infrastructure/ server/tests/modules/auth/infrastructure/
git commit -m "feat(auth): add infrastructure layer - mongoose schema and repository"
```

---

### Task 5: Module Auth — Security services (hash + jwt)

**Files:**
- Create: `server/src/modules/auth/application/services/security/hash.service-security.ts`
- Create: `server/src/modules/auth/application/services/security/jwt.service-security.ts`

- [ ] **Step 1: Creer hash.service-security.ts**

```typescript
import bcrypt from "bcryptjs";
import { AUTH_CONSTANTS } from "../../../domain/constants/auth.constant";

export class HashServiceSecurity {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, AUTH_CONSTANTS.SALT_ROUNDS);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
```

- [ ] **Step 2: Creer jwt.service-security.ts**

```typescript
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export class JwtServiceSecurity {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: StringValue
  ) {}

  generate(payload: Record<string, unknown>): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): Record<string, unknown> {
    return jwt.verify(token, this.secret) as Record<string, unknown>;
  }
}
```

- [ ] **Step 3: Verifier la compilation**

```bash
cd server && npx tsc --noEmit
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add server/src/modules/auth/application/services/security/
git commit -m "feat(auth): add security services - hash and jwt"
```

---

### Task 6: Module Auth — Use-cases (register + login)

**Files:**
- Create: `server/src/modules/auth/application/use-cases/register/register.use-case.ts`
- Create: `server/src/modules/auth/application/use-cases/login/login.use-case.ts`
- Test: `server/tests/modules/auth/application/use-cases/register.use-case.spec.ts`
- Test: `server/tests/modules/auth/application/use-cases/login.use-case.spec.ts`

- [ ] **Step 1: Ecrire le test du RegisterUseCase**

```typescript
import { RegisterUseCase } from "../../../../../src/modules/auth/application/use-cases/register/register.use-case";
import { IUserRepository } from "../../../../../src/modules/auth/domain/repository/user.repository.interface";
import { HashServiceSecurity } from "../../../../../src/modules/auth/application/services/security/hash.service-security";
import { JwtServiceSecurity } from "../../../../../src/modules/auth/application/services/security/jwt.service-security";
import { UserAlreadyExistsError } from "../../../../../src/modules/auth/domain/errors/auth.error";
import { UserEntity } from "../../../../../src/modules/auth/domain/entity/user.entity";

describe("RegisterUseCase", () => {
  let useCase: RegisterUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;
  let mockHash: jest.Mocked<HashServiceSecurity>;
  let mockJwt: jest.Mocked<JwtServiceSecurity>;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockHash = { hash: jest.fn(), compare: jest.fn() } as any;
    mockJwt = { generate: jest.fn(), verify: jest.fn() } as any;
    useCase = new RegisterUseCase(mockRepo, mockHash, mockJwt);
  });

  it("should register a new user and return token", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockHash.hash.mockResolvedValue("hashedPwd");
    mockRepo.create.mockResolvedValue(
      new UserEntity({ id: "1", email: "test@test.com", password: "hashedPwd", role: "customer", createdAt: new Date() })
    );
    mockJwt.generate.mockReturnValue("token123");

    const result = await useCase.execute({ email: "test@test.com", password: "pass" });

    expect(result.token).toBe("token123");
    expect(result.user.email).toBe("test@test.com");
    expect(mockHash.hash).toHaveBeenCalledWith("pass");
  });

  it("should throw UserAlreadyExistsError if email taken", async () => {
    mockRepo.findByEmail.mockResolvedValue(
      new UserEntity({ id: "1", email: "test@test.com", password: "h", role: "customer", createdAt: new Date() })
    );

    await expect(useCase.execute({ email: "test@test.com", password: "pass" }))
      .rejects.toThrow(UserAlreadyExistsError);
  });
});
```

- [ ] **Step 2: Lancer le test pour verifier qu'il echoue**

```bash
cd server && npx jest tests/modules/auth/application/use-cases/register.use-case.spec.ts
```

Expected: FAIL

- [ ] **Step 3: Creer register.use-case.ts**

```typescript
import { IUserRepository } from "../../../domain/repository/user.repository.interface";
import { HashServiceSecurity } from "../../services/security/hash.service-security";
import { JwtServiceSecurity } from "../../services/security/jwt.service-security";
import { UserAlreadyExistsError } from "../../../domain/errors/auth.error";

interface RegisterInput {
  email: string;
  password: string;
}

export interface RegisterOutput {
  token: string;
  user: { id: string; email: string; role: string };
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashServiceSecurity,
    private readonly jwtService: JwtServiceSecurity
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const user = await this.userRepository.create({
      email: input.email,
      password: hashedPassword,
      role: "customer",
    });

    const token = this.jwtService.generate({ userId: user.id, role: user.role });

    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
```

- [ ] **Step 4: Lancer le test register**

```bash
cd server && npx jest tests/modules/auth/application/use-cases/register.use-case.spec.ts
```

Expected: PASS (2 tests)

- [ ] **Step 5: Ecrire le test du LoginUseCase**

```typescript
import { LoginUseCase } from "../../../../../src/modules/auth/application/use-cases/login/login.use-case";
import { IUserRepository } from "../../../../../src/modules/auth/domain/repository/user.repository.interface";
import { HashServiceSecurity } from "../../../../../src/modules/auth/application/services/security/hash.service-security";
import { JwtServiceSecurity } from "../../../../../src/modules/auth/application/services/security/jwt.service-security";
import { InvalidCredentialsError } from "../../../../../src/modules/auth/domain/errors/auth.error";
import { UserEntity } from "../../../../../src/modules/auth/domain/entity/user.entity";

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;
  let mockHash: jest.Mocked<HashServiceSecurity>;
  let mockJwt: jest.Mocked<JwtServiceSecurity>;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockHash = { hash: jest.fn(), compare: jest.fn() } as any;
    mockJwt = { generate: jest.fn(), verify: jest.fn() } as any;
    useCase = new LoginUseCase(mockRepo, mockHash, mockJwt);
  });

  it("should login and return token", async () => {
    const user = new UserEntity({ id: "1", email: "test@test.com", password: "hashed", role: "customer", createdAt: new Date() });
    mockRepo.findByEmail.mockResolvedValue(user);
    mockHash.compare.mockResolvedValue(true);
    mockJwt.generate.mockReturnValue("token123");

    const result = await useCase.execute({ email: "test@test.com", password: "pass" });

    expect(result.token).toBe("token123");
    expect(result.user.email).toBe("test@test.com");
  });

  it("should throw InvalidCredentialsError if user not found", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: "test@test.com", password: "pass" }))
      .rejects.toThrow(InvalidCredentialsError);
  });

  it("should throw InvalidCredentialsError if password wrong", async () => {
    const user = new UserEntity({ id: "1", email: "test@test.com", password: "hashed", role: "customer", createdAt: new Date() });
    mockRepo.findByEmail.mockResolvedValue(user);
    mockHash.compare.mockResolvedValue(false);

    await expect(useCase.execute({ email: "test@test.com", password: "wrong" }))
      .rejects.toThrow(InvalidCredentialsError);
  });
});
```

- [ ] **Step 6: Lancer le test pour verifier qu'il echoue**

```bash
cd server && npx jest tests/modules/auth/application/use-cases/login.use-case.spec.ts
```

Expected: FAIL

- [ ] **Step 7: Creer login.use-case.ts**

```typescript
import { IUserRepository } from "../../../domain/repository/user.repository.interface";
import { HashServiceSecurity } from "../../services/security/hash.service-security";
import { JwtServiceSecurity } from "../../services/security/jwt.service-security";
import { InvalidCredentialsError } from "../../../domain/errors/auth.error";

interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  token: string;
  user: { id: string; email: string; role: string };
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashServiceSecurity,
    private readonly jwtService: JwtServiceSecurity
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.hashService.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.jwtService.generate({ userId: user.id, role: user.role });

    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
```

- [ ] **Step 8: Lancer les deux tests**

```bash
cd server && npx jest tests/modules/auth/application/use-cases/
```

Expected: PASS (5 tests)

- [ ] **Step 9: Commit**

```bash
git add server/src/modules/auth/application/use-cases/ server/tests/modules/auth/application/use-cases/
git commit -m "feat(auth): add register and login use-cases with tests"
```

---

### Task 7: Module Auth — Service + Controller + DTOs

**Files:**
- Create: `server/src/modules/auth/application/services/auth.service.ts`
- Create: `server/src/modules/auth/presentation/controllers/auth.controller.ts`
- Create: `server/src/modules/auth/presentation/dto/register.request.dto.ts`
- Create: `server/src/modules/auth/presentation/dto/register.response.dto.ts`
- Create: `server/src/modules/auth/presentation/dto/login.request.dto.ts`
- Create: `server/src/modules/auth/presentation/dto/login.response.dto.ts`
- Test: `server/tests/modules/auth/application/services/auth.service.spec.ts`
- Test: `server/tests/modules/auth/presentation/controllers/auth.controller.spec.ts`

- [ ] **Step 1: Ecrire le test du AuthService**

```typescript
import { AuthService } from "../../../../../src/modules/auth/application/services/auth.service";
import { RegisterUseCase } from "../../../../../src/modules/auth/application/use-cases/register/register.use-case";
import { LoginUseCase } from "../../../../../src/modules/auth/application/use-cases/login/login.use-case";

describe("AuthService", () => {
  let service: AuthService;
  let mockRegister: jest.Mocked<RegisterUseCase>;
  let mockLogin: jest.Mocked<LoginUseCase>;

  beforeEach(() => {
    mockRegister = { execute: jest.fn() } as any;
    mockLogin = { execute: jest.fn() } as any;
    service = new AuthService(mockRegister, mockLogin);
  });

  it("should delegate register to RegisterUseCase", async () => {
    const expected = { token: "t", user: { id: "1", email: "a@b.com", role: "customer" } };
    mockRegister.execute.mockResolvedValue(expected);

    const result = await service.register({ email: "a@b.com", password: "p" });

    expect(result).toEqual(expected);
    expect(mockRegister.execute).toHaveBeenCalledWith({ email: "a@b.com", password: "p" });
  });

  it("should delegate login to LoginUseCase", async () => {
    const expected = { token: "t", user: { id: "1", email: "a@b.com", role: "customer" } };
    mockLogin.execute.mockResolvedValue(expected);

    const result = await service.login({ email: "a@b.com", password: "p" });

    expect(result).toEqual(expected);
    expect(mockLogin.execute).toHaveBeenCalledWith({ email: "a@b.com", password: "p" });
  });
});
```

- [ ] **Step 2: Creer auth.service.ts**

```typescript
import { RegisterUseCase } from "../use-cases/register/register.use-case";
import { LoginUseCase } from "../use-cases/login/login.use-case";

export class AuthService {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  async register(input: { email: string; password: string }) {
    return this.registerUseCase.execute(input);
  }

  async login(input: { email: string; password: string }) {
    return this.loginUseCase.execute(input);
  }
}
```

- [ ] **Step 3: Lancer le test service**

```bash
cd server && npx jest tests/modules/auth/application/services/auth.service.spec.ts
```

Expected: PASS (2 tests)

- [ ] **Step 4: Creer les DTOs**

`server/src/modules/auth/presentation/dto/register.request.dto.ts` :

```typescript
export class RegisterRequestDto {
  email: string;
  password: string;

  constructor(body: Record<string, unknown>) {
    this.email = body.email as string;
    this.password = body.password as string;
  }
}
```

`server/src/modules/auth/presentation/dto/register.response.dto.ts` :

```typescript
export class RegisterResponseDto {
  token: string;
  user: { id: string; email: string; role: string };

  constructor(data: { token: string; user: { id: string; email: string; role: string } }) {
    this.token = data.token;
    this.user = data.user;
  }
}
```

`server/src/modules/auth/presentation/dto/login.request.dto.ts` :

```typescript
export class LoginRequestDto {
  email: string;
  password: string;

  constructor(body: Record<string, unknown>) {
    this.email = body.email as string;
    this.password = body.password as string;
  }
}
```

`server/src/modules/auth/presentation/dto/login.response.dto.ts` :

```typescript
export class LoginResponseDto {
  token: string;
  user: { id: string; email: string; role: string };

  constructor(data: { token: string; user: { id: string; email: string; role: string } }) {
    this.token = data.token;
    this.user = data.user;
  }
}
```

- [ ] **Step 5: Ecrire le test du AuthController**

```typescript
import { AuthController } from "../../../../../src/modules/auth/presentation/controllers/auth.controller";
import { AuthService } from "../../../../../src/modules/auth/application/services/auth.service";
import { Request, Response, NextFunction } from "express";

describe("AuthController", () => {
  let controller: AuthController;
  let mockService: jest.Mocked<AuthService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockService = { register: jest.fn(), login: jest.fn() } as any;
    controller = new AuthController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it("should return 201 on register", async () => {
    mockReq = { body: { email: "a@b.com", password: "p" } };
    const result = { token: "t", user: { id: "1", email: "a@b.com", role: "customer" } };
    mockService.register.mockResolvedValue(result);

    await controller.register(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: expect.objectContaining({ token: "t" }) });
  });

  it("should return 200 on login", async () => {
    mockReq = { body: { email: "a@b.com", password: "p" } };
    const result = { token: "t", user: { id: "1", email: "a@b.com", role: "customer" } };
    mockService.login.mockResolvedValue(result);

    await controller.login(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should call next on error", async () => {
    mockReq = { body: { email: "a@b.com", password: "p" } };
    const error = new Error("fail");
    mockService.register.mockRejectedValue(error);

    await controller.register(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
```

- [ ] **Step 6: Creer auth.controller.ts**

```typescript
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../application/services/auth.service";
import { RegisterRequestDto } from "../dto/register.request.dto";
import { RegisterResponseDto } from "../dto/register.response.dto";
import { LoginRequestDto } from "../dto/login.request.dto";
import { LoginResponseDto } from "../dto/login.response.dto";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new RegisterRequestDto(req.body);
      const result = await this.authService.register(dto);
      const response = new RegisterResponseDto(result);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new LoginRequestDto(req.body);
      const result = await this.authService.login(dto);
      const response = new LoginResponseDto(result);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }
}
```

- [ ] **Step 7: Lancer tous les tests auth**

```bash
cd server && npx jest tests/modules/auth/
```

Expected: PASS (tous les tests)

- [ ] **Step 8: Commit**

```bash
git add server/src/modules/auth/application/services/auth.service.ts server/src/modules/auth/presentation/ server/tests/modules/auth/application/services/ server/tests/modules/auth/presentation/
git commit -m "feat(auth): add service, controller and DTOs with tests"
```

---

### Task 8: Module Auth — Module file + Auth middleware

**Files:**
- Create: `server/src/modules/auth/auth.module.ts`
- Create: `server/src/shared/middlewares/auth.middleware.ts`
- Create: `server/src/shared/types/express.d.ts`

- [ ] **Step 1: Creer le type augmente Express pour req.user**

`server/src/shared/types/express.d.ts` :

```typescript
declare namespace Express {
  interface Request {
    user?: {
      userId: string;
      role: string;
    };
  }
}
```

- [ ] **Step 2: Creer auth.middleware.ts**

```typescript
import { Request, Response, NextFunction } from "express";
import { AppError } from "./error-handler.middleware";
import { JwtServiceSecurity } from "../../modules/auth/application/services/security/jwt.service-security";

export function createAuthMiddleware(jwtService: JwtServiceSecurity) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      next(new AppError(401, "Missing or invalid token"));
      return;
    }

    try {
      const token = header.split(" ")[1];
      const payload = jwtService.verify(token);
      req.user = { userId: payload.userId as string, role: payload.role as string };
      next();
    } catch {
      next(new AppError(401, "Invalid or expired token"));
    }
  };
}
```

- [ ] **Step 3: Creer auth.module.ts**

```typescript
import { Router } from "express";
import type { StringValue } from "ms";
import { UserRepositoryMongooseMongo } from "./infrastructure/repository/user.repository.mongoose-mongo";
import { HashServiceSecurity } from "./application/services/security/hash.service-security";
import { JwtServiceSecurity } from "./application/services/security/jwt.service-security";
import { RegisterUseCase } from "./application/use-cases/register/register.use-case";
import { LoginUseCase } from "./application/use-cases/login/login.use-case";
import { AuthService } from "./application/services/auth.service";
import { AuthController } from "./presentation/controllers/auth.controller";

export function createAuthModule(): { router: Router; jwtService: JwtServiceSecurity; userRepository: UserRepositoryMongooseMongo } {
  const router = Router();

  const userRepository = new UserRepositoryMongooseMongo();
  const hashService = new HashServiceSecurity();
  const jwtService = new JwtServiceSecurity(
    process.env.JWT_SECRET!,
    (process.env.JWT_EXPIRES_IN || "24h") as StringValue
  );

  const registerUseCase = new RegisterUseCase(userRepository, hashService, jwtService);
  const loginUseCase = new LoginUseCase(userRepository, hashService, jwtService);

  const authService = new AuthService(registerUseCase, loginUseCase);
  const controller = new AuthController(authService);

  router.post("/register", (req, res, next) => controller.register(req, res, next));
  router.post("/login", (req, res, next) => controller.login(req, res, next));

  return { router, jwtService, userRepository };
}
```

**Note :** `createAuthModule` retourne aussi `jwtService` et `userRepository` pour que d'autres modules (user, etc.) puissent les reutiliser.

- [ ] **Step 4: Verifier la compilation**

```bash
cd server && npx tsc --noEmit
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/src/modules/auth/auth.module.ts server/src/shared/middlewares/auth.middleware.ts server/src/shared/types/
git commit -m "feat(auth): add module factory and auth middleware"
```

---

### Task 9: Module User — Use-cases + Service + Controller + DTOs

**Files:**
- Create: `server/src/modules/user/domain/errors/user.error.ts`
- Create: `server/src/modules/user/application/use-cases/get-profile/get-profile.use-case.ts`
- Create: `server/src/modules/user/application/use-cases/update-profile/update-profile.use-case.ts`
- Create: `server/src/modules/user/application/use-cases/get-all-users/get-all-users.use-case.ts`
- Create: `server/src/modules/user/application/services/user.service.ts`
- Create: `server/src/modules/user/presentation/controllers/user.controller.ts`
- Create: `server/src/modules/user/presentation/dto/update-profile.request.dto.ts`
- Create: `server/src/modules/user/presentation/dto/user.response.dto.ts`
- Test: `server/tests/modules/user/application/use-cases/get-profile.use-case.spec.ts`
- Test: `server/tests/modules/user/application/use-cases/update-profile.use-case.spec.ts`
- Test: `server/tests/modules/user/application/use-cases/get-all-users.use-case.spec.ts`
- Test: `server/tests/modules/user/application/services/user.service.spec.ts`
- Test: `server/tests/modules/user/presentation/controllers/user.controller.spec.ts`

- [ ] **Step 1: Creer user.error.ts**

```typescript
import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class ProfileNotFoundError extends AppError {
  constructor() {
    super(404, "User profile not found");
  }
}
```

- [ ] **Step 2: Ecrire le test get-profile.use-case.spec.ts**

```typescript
import { GetProfileUseCase } from "../../../../../src/modules/user/application/use-cases/get-profile/get-profile.use-case";
import { IUserRepository } from "../../../../../src/modules/auth/domain/repository/user.repository.interface";
import { UserEntity } from "../../../../../src/modules/auth/domain/entity/user.entity";
import { ProfileNotFoundError } from "../../../../../src/modules/user/domain/errors/user.error";

describe("GetProfileUseCase", () => {
  let useCase: GetProfileUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepo = { findByEmail: jest.fn(), findById: jest.fn(), findAll: jest.fn(), create: jest.fn(), update: jest.fn() };
    useCase = new GetProfileUseCase(mockRepo);
  });

  it("should return user profile", async () => {
    const user = new UserEntity({ id: "1", email: "a@b.com", password: "h", role: "customer", createdAt: new Date() });
    mockRepo.findById.mockResolvedValue(user);

    const result = await useCase.execute("1");

    expect(result.id).toBe("1");
    expect(result.email).toBe("a@b.com");
    expect(result.role).toBe("customer");
  });

  it("should throw ProfileNotFoundError if user not found", async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("999")).rejects.toThrow(ProfileNotFoundError);
  });
});
```

- [ ] **Step 3: Creer get-profile.use-case.ts**

```typescript
import { IUserRepository } from "../../../../auth/domain/repository/user.repository.interface";
import { ProfileNotFoundError } from "../../../domain/errors/user.error";

interface GetProfileOutput {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export class GetProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<GetProfileOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ProfileNotFoundError();
    }
    return { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt };
  }
}
```

- [ ] **Step 4: Lancer le test get-profile**

```bash
cd server && npx jest tests/modules/user/application/use-cases/get-profile.use-case.spec.ts
```

Expected: PASS (2 tests)

- [ ] **Step 5: Ecrire le test update-profile.use-case.spec.ts**

```typescript
import { UpdateProfileUseCase } from "../../../../../src/modules/user/application/use-cases/update-profile/update-profile.use-case";
import { IUserRepository } from "../../../../../src/modules/auth/domain/repository/user.repository.interface";
import { UserEntity } from "../../../../../src/modules/auth/domain/entity/user.entity";
import { ProfileNotFoundError } from "../../../../../src/modules/user/domain/errors/user.error";

describe("UpdateProfileUseCase", () => {
  let useCase: UpdateProfileUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepo = { findByEmail: jest.fn(), findById: jest.fn(), findAll: jest.fn(), create: jest.fn(), update: jest.fn() };
    useCase = new UpdateProfileUseCase(mockRepo);
  });

  it("should update and return user", async () => {
    const updated = new UserEntity({ id: "1", email: "new@b.com", password: "h", role: "customer", createdAt: new Date() });
    mockRepo.update.mockResolvedValue(updated);

    const result = await useCase.execute("1", { email: "new@b.com" });

    expect(result.email).toBe("new@b.com");
    expect(mockRepo.update).toHaveBeenCalledWith("1", { email: "new@b.com" });
  });

  it("should throw ProfileNotFoundError if user not found", async () => {
    mockRepo.update.mockResolvedValue(null);

    await expect(useCase.execute("999", { email: "x@y.com" })).rejects.toThrow(ProfileNotFoundError);
  });
});
```

- [ ] **Step 6: Creer update-profile.use-case.ts**

```typescript
import { IUserRepository } from "../../../../auth/domain/repository/user.repository.interface";
import { ProfileNotFoundError } from "../../../domain/errors/user.error";

interface UpdateProfileInput {
  email?: string;
}

interface UpdateProfileOutput {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, input: UpdateProfileInput): Promise<UpdateProfileOutput> {
    const user = await this.userRepository.update(userId, input);
    if (!user) {
      throw new ProfileNotFoundError();
    }
    return { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt };
  }
}
```

- [ ] **Step 7: Lancer le test update-profile**

```bash
cd server && npx jest tests/modules/user/application/use-cases/update-profile.use-case.spec.ts
```

Expected: PASS (2 tests)

- [ ] **Step 8: Ecrire le test get-all-users.use-case.spec.ts**

```typescript
import { GetAllUsersUseCase } from "../../../../../src/modules/user/application/use-cases/get-all-users/get-all-users.use-case";
import { IUserRepository } from "../../../../../src/modules/auth/domain/repository/user.repository.interface";
import { UserEntity } from "../../../../../src/modules/auth/domain/entity/user.entity";

describe("GetAllUsersUseCase", () => {
  let useCase: GetAllUsersUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepo = { findByEmail: jest.fn(), findById: jest.fn(), findAll: jest.fn(), create: jest.fn(), update: jest.fn() };
    useCase = new GetAllUsersUseCase(mockRepo);
  });

  it("should return all users", async () => {
    const users = [
      new UserEntity({ id: "1", email: "a@b.com", password: "h", role: "customer", createdAt: new Date() }),
      new UserEntity({ id: "2", email: "c@d.com", password: "h", role: "admin", createdAt: new Date() }),
    ];
    mockRepo.findAll.mockResolvedValue(users);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].email).toBe("a@b.com");
  });
});
```

- [ ] **Step 9: Creer get-all-users.use-case.ts**

```typescript
import { IUserRepository } from "../../../../auth/domain/repository/user.repository.interface";

interface UserOutput {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserOutput[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }));
  }
}
```

- [ ] **Step 10: Lancer le test get-all-users**

```bash
cd server && npx jest tests/modules/user/application/use-cases/get-all-users.use-case.spec.ts
```

Expected: PASS (1 test)

- [ ] **Step 11: Ecrire le test user.service.spec.ts**

```typescript
import { UserService } from "../../../../../src/modules/user/application/services/user.service";
import { GetProfileUseCase } from "../../../../../src/modules/user/application/use-cases/get-profile/get-profile.use-case";
import { UpdateProfileUseCase } from "../../../../../src/modules/user/application/use-cases/update-profile/update-profile.use-case";
import { GetAllUsersUseCase } from "../../../../../src/modules/user/application/use-cases/get-all-users/get-all-users.use-case";

describe("UserService", () => {
  let service: UserService;
  let mockGetProfile: jest.Mocked<GetProfileUseCase>;
  let mockUpdateProfile: jest.Mocked<UpdateProfileUseCase>;
  let mockGetAllUsers: jest.Mocked<GetAllUsersUseCase>;

  beforeEach(() => {
    mockGetProfile = { execute: jest.fn() } as any;
    mockUpdateProfile = { execute: jest.fn() } as any;
    mockGetAllUsers = { execute: jest.fn() } as any;
    service = new UserService(mockGetProfile, mockUpdateProfile, mockGetAllUsers);
  });

  it("should delegate getProfile", async () => {
    const expected = { id: "1", email: "a@b.com", role: "customer", createdAt: new Date() };
    mockGetProfile.execute.mockResolvedValue(expected);

    const result = await service.getProfile("1");
    expect(result).toEqual(expected);
  });

  it("should delegate updateProfile", async () => {
    const expected = { id: "1", email: "new@b.com", role: "customer", createdAt: new Date() };
    mockUpdateProfile.execute.mockResolvedValue(expected);

    const result = await service.updateProfile("1", { email: "new@b.com" });
    expect(result).toEqual(expected);
  });

  it("should delegate getAllUsers", async () => {
    mockGetAllUsers.execute.mockResolvedValue([]);

    const result = await service.getAllUsers();
    expect(result).toEqual([]);
  });
});
```

- [ ] **Step 12: Creer user.service.ts**

```typescript
import { GetProfileUseCase } from "../use-cases/get-profile/get-profile.use-case";
import { UpdateProfileUseCase } from "../use-cases/update-profile/update-profile.use-case";
import { GetAllUsersUseCase } from "../use-cases/get-all-users/get-all-users.use-case";

export class UserService {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase
  ) {}

  async getProfile(userId: string) {
    return this.getProfileUseCase.execute(userId);
  }

  async updateProfile(userId: string, input: { email?: string }) {
    return this.updateProfileUseCase.execute(userId, input);
  }

  async getAllUsers() {
    return this.getAllUsersUseCase.execute();
  }
}
```

- [ ] **Step 13: Lancer le test service**

```bash
cd server && npx jest tests/modules/user/application/services/user.service.spec.ts
```

Expected: PASS (3 tests)

- [ ] **Step 14: Creer les DTOs**

`server/src/modules/user/presentation/dto/update-profile.request.dto.ts` :

```typescript
export class UpdateProfileRequestDto {
  email?: string;

  constructor(body: Record<string, unknown>) {
    if (body.email) this.email = body.email as string;
  }
}
```

`server/src/modules/user/presentation/dto/user.response.dto.ts` :

```typescript
export class UserResponseDto {
  id: string;
  email: string;
  role: string;
  createdAt: Date;

  constructor(data: { id: string; email: string; role: string; createdAt: Date }) {
    this.id = data.id;
    this.email = data.email;
    this.role = data.role;
    this.createdAt = data.createdAt;
  }
}
```

- [ ] **Step 15: Ecrire le test user.controller.spec.ts**

```typescript
import { UserController } from "../../../../../src/modules/user/presentation/controllers/user.controller";
import { UserService } from "../../../../../src/modules/user/application/services/user.service";
import { Request, Response, NextFunction } from "express";

describe("UserController", () => {
  let controller: UserController;
  let mockService: jest.Mocked<UserService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockService = { getProfile: jest.fn(), updateProfile: jest.fn(), getAllUsers: jest.fn() } as any;
    controller = new UserController(mockService);
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    mockNext = jest.fn();
  });

  it("should return 200 on getProfile", async () => {
    const profile = { id: "1", email: "a@b.com", role: "customer", createdAt: new Date() };
    mockService.getProfile.mockResolvedValue(profile);
    const mockReq = { user: { userId: "1", role: "customer" } } as any;

    await controller.getProfile(mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 on updateProfile", async () => {
    const profile = { id: "1", email: "new@b.com", role: "customer", createdAt: new Date() };
    mockService.updateProfile.mockResolvedValue(profile);
    const mockReq = { user: { userId: "1", role: "customer" }, body: { email: "new@b.com" } } as any;

    await controller.updateProfile(mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 on getAllUsers", async () => {
    mockService.getAllUsers.mockResolvedValue([]);
    const mockReq = {} as any;

    await controller.getAllUsers(mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should call next on error", async () => {
    const error = new Error("fail");
    mockService.getProfile.mockRejectedValue(error);
    const mockReq = { user: { userId: "1", role: "customer" } } as any;

    await controller.getProfile(mockReq, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
```

- [ ] **Step 16: Creer user.controller.ts**

```typescript
import { Request, Response, NextFunction } from "express";
import { UserService } from "../../application/services/user.service";
import { UpdateProfileRequestDto } from "../dto/update-profile.request.dto";
import { UserResponseDto } from "../dto/user.response.dto";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.userService.getProfile(req.user!.userId);
      const response = new UserResponseDto(result);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new UpdateProfileRequestDto(req.body);
      const result = await this.userService.updateProfile(req.user!.userId, dto);
      const response = new UserResponseDto(result);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.userService.getAllUsers();
      const response = result.map((u) => new UserResponseDto(u));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }
}
```

- [ ] **Step 17: Lancer tous les tests user**

```bash
cd server && npx jest tests/modules/user/
```

Expected: PASS (tous les tests)

- [ ] **Step 18: Commit**

```bash
git add server/src/modules/user/ server/tests/modules/user/
git commit -m "feat(user): add user module - use-cases, service, controller, DTOs with tests"
```

---

### Task 10: Module User — Module file

**Files:**
- Create: `server/src/modules/user/user.module.ts`

- [ ] **Step 1: Creer user.module.ts**

```typescript
import { Router } from "express";
import { IUserRepository } from "../auth/domain/repository/user.repository.interface";
import { JwtServiceSecurity } from "../auth/application/services/security/jwt.service-security";
import { createAuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { GetProfileUseCase } from "./application/use-cases/get-profile/get-profile.use-case";
import { UpdateProfileUseCase } from "./application/use-cases/update-profile/update-profile.use-case";
import { GetAllUsersUseCase } from "./application/use-cases/get-all-users/get-all-users.use-case";
import { UserService } from "./application/services/user.service";
import { UserController } from "./presentation/controllers/user.controller";

export function createUserModule(userRepository: IUserRepository, jwtService: JwtServiceSecurity): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(jwtService);

  const getProfileUseCase = new GetProfileUseCase(userRepository);
  const updateProfileUseCase = new UpdateProfileUseCase(userRepository);
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

  const userService = new UserService(getProfileUseCase, updateProfileUseCase, getAllUsersUseCase);
  const controller = new UserController(userService);

  router.get("/profile", authMiddleware, (req, res, next) => controller.getProfile(req, res, next));
  router.patch("/profile", authMiddleware, (req, res, next) => controller.updateProfile(req, res, next));
  router.get("/", authMiddleware, (req, res, next) => controller.getAllUsers(req, res, next));

  return router;
}
```

- [ ] **Step 2: Verifier la compilation**

```bash
cd server && npx tsc --noEmit
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add server/src/modules/user/user.module.ts
git commit -m "feat(user): add user module factory with auth middleware"
```

---

### Task 11: Point d'entree main.ts et lancement

**Files:**
- Create: `server/src/main.ts`

- [ ] **Step 1: Creer main.ts**

```typescript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import { loggerMiddleware } from "./shared/middlewares/logger.middleware";
import { errorHandlerMiddleware } from "./shared/middlewares/error-handler.middleware";
import { createAuthModule } from "./modules/auth/auth.module";
import { createUserModule } from "./modules/user/user.module";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Modules
const { router: authRouter, jwtService, userRepository } = createAuthModule();
app.use("/api/auth", authRouter);
app.use("/api/users", createUserModule(userRepository, jwtService));

app.use(errorHandlerMiddleware);

async function bootstrap(): Promise<void> {
  await connectDatabase(process.env.MONGODB_URI!);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch(console.error);

export { app };
```

- [ ] **Step 2: Verifier la compilation**

```bash
cd server && npx tsc --noEmit
```

Expected: PASS

- [ ] **Step 3: Lancer tous les tests**

```bash
cd server && npx jest
```

Expected: PASS (tous les tests passent)

- [ ] **Step 4: Demarrer Docker et tester manuellement**

```bash
cd server && docker compose up -d
npm run dev
```

Tester avec curl :

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test123"}'

# Get profile (utiliser le token recu)
curl http://localhost:3001/api/users/profile -H "Authorization: Bearer <TOKEN>"
```

- [ ] **Step 5: Commit**

```bash
git add server/src/main.ts
git commit -m "feat: add main entry point with auth and user modules"
```

---

## Resume des endpoints

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/register` | Non | Inscription |
| POST | `/api/auth/login` | Non | Connexion |
| GET | `/api/users/profile` | Oui | Mon profil |
| PATCH | `/api/users/profile` | Oui | Modifier mon profil |
| GET | `/api/users/` | Oui | Liste des users (admin) |

---

## Plans suivants

- **Plan 2** : Core e-commerce — Product (avec ProductImage), Category, Tag, SkinType (CRUD complet avec admin)
- **Plan 3** : Content & engagement — Page, BlogPost, Testimonial, NewsletterSubscription, SkinDiagnosis, CartItem, PressLogo
