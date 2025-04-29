FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app


RUN apt-get update && apt-get install -y python3 make g++ git && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build only the deployit app
RUN pnpm run deployit:build 

# Deploy only the deployit app
RUN pnpm deploy --filter=deployit --prod /prod/deployit

FROM base AS deployit
COPY --from=build /prod/deployit /prod/deployit
WORKDIR /prod/deployit
EXPOSE 3000
CMD [ "pnpm", "start" ]