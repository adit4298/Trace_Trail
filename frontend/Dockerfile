# syntax=docker/dockerfile:1

# --- Install dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy lockfile + package for reproducible installs
COPY package.json package-lock.json ./

# Install all deps (dev + prod) for build
RUN npm ci

# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Reuse node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the app (including .env.production)
COPY . .

# Build Next.js app
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Only what we need to run the app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
