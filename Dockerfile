FROM node:20.9-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Common dependencies for build
FROM base AS build
WORKDIR /usr/src/app
COPY . .
RUN apt-get update && apt-get install -y python3 make g++ git python3-pip pkg-config libsecret-1-dev && rm -rf /var/lib/apt/lists/*

# Install dependencies (filtered by app)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Build and deploy each app
ENV NODE_ENV=production
RUN pnpm --filter=@dockly/server build
RUN pnpm --filter=./apps/dockly run build && pnpm --filter=./apps/dockly --prod deploy /prod/dockly
RUN pnpm --filter=./apps/schedules run build && pnpm --filter=./apps/schedules --prod deploy /prod/schedules
RUN pnpm --filter=./apps/api run build && pnpm --filter=./apps/api --prod deploy /prod/api

# Copy built artifacts
RUN cp -R /usr/src/app/apps/dockly/.next /prod/dockly/.next \
    && cp -R /usr/src/app/apps/dockly/dist /prod/dockly/dist \
    && cp -R /usr/src/app/apps/schedules/dist /prod/schedules/dist \
    && cp -R /usr/src/app/apps/api/dist /prod/api/dist

# Go application build stage
FROM golang:1.21-alpine3.19 AS golang-builder
WORKDIR /app
RUN apk add --no-cache gcc musl-dev sqlite-dev
COPY . .
WORKDIR /app/apps/monitoring
RUN go mod download && CGO_ENABLED=1 GOOS=linux go build -o main main.go

# Final production image
FROM base AS production
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y curl unzip apache2-utils iproute2 docker-cli sqlite-libs && rm -rf /var/lib/apt/lists/*

# Copy built applications
COPY --from=build /prod/dockly /app/dockly
COPY --from=build /prod/schedules /app/schedules
COPY --from=build /prod/api /app/api
COPY --from=golang-builder /app/apps/monitoring/main /app/monitoring/main

# Install utilities
RUN curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && rm get-docker.sh
RUN curl https://rclone.org/install.sh | bash
RUN pnpm install -g tsx
RUN curl -sSL https://nixpacks.com/install.sh -o install.sh && chmod +x install.sh && ./install.sh
RUN curl -sSL https://railpack.com/install.sh | bash

# Expose necessary ports
EXPOSE 3000 3001
CMD ["pnpm", "start"]
