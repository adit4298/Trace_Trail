# syntax=docker/dockerfile:1

# --- Install dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./

# Install all deps (dev + prod) for build, but relax peer deps
RUN npm ci --legacy-peer-deps

# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY package.json package-lock.json ./

# Only production deps, also relax peer deps
RUN npm ci --omit=dev --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "run", "start"]
