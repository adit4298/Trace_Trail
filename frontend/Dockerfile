# syntax=docker/dockerfile:1

# --- Install dependencies ---
FROM node:20-alpine AS deps
# optional but often needed for some npm packages
RUN apk add --no-cache libc6-compat
WORKDIR /app

# copy lockfile + package json for reproducible installs
COPY package.json package-lock.json ./

# install all deps (dev + prod) for build stage
RUN npm ci

# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# reuse node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
# copy the rest of the app
COPY . .

# if you have .env.production, Next will use it here
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# only copy what we need to run the built app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY package.json package-lock.json ./

# install only production deps
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
