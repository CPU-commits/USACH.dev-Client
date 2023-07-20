# STAGE 0 -> Builder
FROM node:16.18.1-alpine3.16 as installer

WORKDIR /app

COPY package*.json ./

RUN npm install
# STAGE 1 -> Nuxt build
FROM node:16.18.1-alpine3.16 as builder

WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules

COPY . .

ENV IS_BUILDING=building

RUN npx nuxi build

# STAGE 2 -> Nuxt entrypoint
FROM node:16.18.1-alpine3.16

WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT [ "node", ".output/server/index.mjs" ]
