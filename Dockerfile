FROM node:20-bookworm AS base

RUN yarn global add prisma

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apt-get update && apt-get install -y \
#     libcairo2-dev \
#     libpango1.0-dev \
#     libjpeg-dev \
#     libgif-dev \
#     librsvg2-dev \
#     && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
COPY prisma/ ./prisma/
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
#   else echo "Lockfile not found." && exit 1; \
#   fi
RUN yarn install

#   elif [ -f package-lock.json ]; then npm run build; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
#   else echo "Lockfile not found." && exit 1; \
#   fi
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=deps /app/prisma ./prisma

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["sh","-c", "npm run migrate && npm run start:prod"]