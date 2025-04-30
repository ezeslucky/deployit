# ---------- Base Layer ----------
    FROM node:20.9-slim AS base

    ENV PNPM_HOME="/pnpm"
    ENV PATH="$PNPM_HOME:$PATH"
    
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    
    # ---------- Build Layer ----------
    FROM base AS build
    
    WORKDIR /usr/src/app
    COPY . .
    
    # Install build dependencies
    RUN apt-get update && apt-get install -y \
        python3 make g++ git python3-pip pkg-config libsecret-1-dev \
        && rm -rf /var/lib/apt/lists/*
    
    # Install dependencies with cache
    RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
        pnpm install --frozen-lockfile
    
    # Set environment variables
    ENV NODE_ENV=production
    
    # Build filtered apps
    RUN pnpm --filter=@deployit/server build \
        && pnpm --filter=./apps/deployit run build
    
    # Create deploy directory
    RUN mkdir -p /prod/deployit \
        && cp -R apps/deployit/.next /prod/deployit/.next \
        && cp -R apps/deployit/dist /prod/deployit/dist \
        && cp -R apps/deployit/public /prod/deployit/public \
        && cp apps/deployit/package.json /prod/deployit/package.json \
        && cp apps/deployit/next.config.mjs /prod/deployit/next.config.mjs \
        && cp -R apps/deployit/drizzle /prod/deployit/drizzle \
        && cp apps/deployit/components.json /prod/deployit/components.json \
        && cp -R apps/deployit/node_modules /prod/deployit/node_modules
    
    
    # ---------- Runtime Layer ----------
    FROM base AS deployit
    
    WORKDIR /app
    ENV NODE_ENV=production
    
    # Install minimal runtime tools
    RUN apt-get update && apt-get install -y \
        curl unzip apache2-utils iproute2 \
        && rm -rf /var/lib/apt/lists/*
    
    # Copy production build artifacts
    COPY --from=build /prod/deployit .
    
    # Optional: Load production env
    COPY .env.production ./.env
    
    # Optional CLI tools
    RUN curl https://rclone.org/install.sh | bash \
        && pnpm install -g tsx
    
    # Optional: Nixpacks & Railpack
    ARG NIXPACKS_VERSION=1.29.1
    RUN curl -sSL https://nixpacks.com/install.sh -o install.sh \
        && chmod +x install.sh && ./install.sh
    
    ARG RAILPACK_VERSION=0.0.37
    RUN curl -sSL https://railpack.com/install.sh | bash
    
    # Optional: Buildpacks (if needed)
    COPY --from=buildpacksio/pack:0.35.0 /usr/local/bin/pack /usr/local/bin/pack
    
    EXPOSE 3000
    CMD ["pnpm", "start"]
    