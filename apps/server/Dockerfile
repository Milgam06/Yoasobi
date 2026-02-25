# Builder stage
FROM node:24-alpine AS builder
WORKDIR /repo

RUN corepack enable

COPY package.json yarn.lock ./
COPY apps/server/package.json ./apps/server/package.json

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn workspace server build

# Runner stage
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

COPY package.json yarn.lock ./
COPY apps/server/package.json ./apps/server/package.json
RUN yarn install --frozen-lockfile --production=true

COPY --from=builder /repo/apps/server/dist ./dist

ENV PORT=8686
EXPOSE 8686

CMD ["node", "dist/main.js"]
