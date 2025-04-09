# Builder stage
FROM node:23-slim AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Speed up repeated builds
ENV PNPM_STORE_PATH=/app/.pnpm-store

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN pnpm install

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma/
RUN pnpx prisma generate

# Copy source code and build the app
COPY . .
RUN pnpm run build

# Production stage
FROM node:23-slim AS production

# Install pnpm globally
RUN npm install -g pnpm

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN pnpm install --prod

# Copy schema and generated Prisma client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma 

# Copy built app
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
