FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install root dependencies
COPY package.json pnpm-lock.yaml ./
COPY client/package.json client/pnpm-lock.yaml ./client/
COPY server/package.json server/pnpm-lock.yaml ./server/

RUN cd client && pnpm install --frozen-lockfile
RUN cd server && pnpm install --frozen-lockfile

# Copy source
COPY client/ ./client/
COPY server/ ./server/

# Build client
RUN cd client && pnpm build

# Build server
RUN cd server && pnpm build

EXPOSE 3001

# Start server (serves API + client static files)
CMD ["node", "server/dist/main.js"]
