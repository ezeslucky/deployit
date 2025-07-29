
FROM node:22.17.0-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# --- Build Stage ---
FROM base AS build

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    python3 make g++ git python3-pip pkg-config libsecret-1-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies with cache
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile

# Build server and app
ENV NODE_ENV=production
RUN pnpm --filter=@deployi/server build
RUN pnpm --filter=./apps/deployi run build

# Deploy using legacy flag to avoid pnpm v10 workspace error
RUN pnpm --filter=./apps/deployi --prod deploy --legacy /prod/deployi

# Copy build artifacts
RUN cp -R /usr/src/app/apps/deployi/.next /prod/deployi/.next
RUN cp -R /usr/src/app/apps/deployi/dist /prod/deployi/dist

# --- Runtime Stage ---
FROM base AS deployi
WORKDIR /app

ENV NODE_ENV=production

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl unzip zip apache2-utils iproute2 rsync git-lfs \
    && git lfs install \
    && rm -rf /var/lib/apt/lists/*

# Copy only production files
COPY --from=build /prod/deployi/.next ./.next
COPY --from=build /prod/deployi/dist ./dist
COPY --from=build /prod/deployi/next.config.mjs ./next.config.mjs
COPY --from=build /prod/deployi/public ./public
COPY --from=build /prod/deployi/package.json ./package.json
COPY --from=build /prod/deployi/drizzle ./drizzle
COPY .env.production ./.env
COPY --from=build /prod/deployi/components.json ./components.json
COPY --from=build /prod/deployi/node_modules ./node_modules

# Install Docker CLI and rclone
RUN curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && rm get-docker.sh \
    && curl https://rclone.org/install.sh | bash

# Install Nixpacks and tsx
ARG NIXPACKS_VERSION=1.39.0
RUN curl -sSL https://nixpacks.com/install.sh -o install.sh \
    && chmod +x install.sh \
    && ./install.sh \
    && pnpm install -g tsx

# Install Railpack
ARG RAILPACK_VERSION=0.0.64
RUN curl -sSL https://railpack.com/install.sh | bash

# Install buildpacks CLI
COPY --from=buildpacksio/pack:0.35.0 /usr/local/bin/pack /usr/local/bin/pack

EXPOSE 3000
CMD [ "pnpm", "start" ]