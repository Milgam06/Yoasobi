# Builder stage
FROM node:24-alpine AS builder
WORKDIR /apps/server

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build

# Runner stage
FROM node:24-alpine AS runner
WORKDIR /apps/server
ENV NODE_ENV=production

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

COPY --from=builder /app/dist ./dist

ENV PORT=8686
EXPOSE 8686

CMD ["node", "dist/main.js"]
