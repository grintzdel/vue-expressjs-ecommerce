FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3001

# Wait for MongoDB to be ready, then seed and start
CMD ["sh", "-c", "sleep 5 && node dist/seed.js; node dist/main.js"]
