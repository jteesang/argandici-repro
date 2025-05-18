# syntax=docker/dockerfile:1
ARG NODE_IMAGE=node:18.20.8-alpine3.21

##################################
#      1) DEPS DE BASE          #
##################################
FROM ${NODE_IMAGE} AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

##################################
#      2) STAGE DEV             #
##################################
FROM base AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 4000
CMD ["npm","run","start","--","--host","0.0.0.0","--port","4000"]

##################################
#      3) STAGE BUILD           #
##################################
FROM base AS builder
COPY . .
RUN npm run build:ssr

##################################
#      4) STAGE PROD            #
##################################
FROM ${NODE_IMAGE} AS prod
WORKDIR /app
COPY --from=builder /app/dist/ui/browser ./browser
COPY --from=builder /app/dist/ui/server  ./server
COPY package*.json ./
RUN npm ci --omit=dev
EXPOSE 4000
CMD ["node","server/main.js"]
