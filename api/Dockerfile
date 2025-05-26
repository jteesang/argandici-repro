# syntax=docker/dockerfile:1
ARG NODE_IMAGE=node:18-alpine

########################################
# 1) BASE (installe dev + prod deps)  #
########################################
FROM ${NODE_IMAGE} AS base
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
# Installe SWC globalement si nécessaire (optionnel)
# RUN npm install -g @swc/cli @swc/core

########################################
# 2) DEVELOPMENT (hot-reload)          #
########################################
FROM base AS development
USER root

WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npx prisma generate
# Génération des fichiers Prisma
USER node
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

########################################
# 3) BUILD (compilation prod)          #
########################################
FROM base AS build
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV=production

########################################
# 4) PRODUCTION (image finale)         #
########################################
FROM ${NODE_IMAGE} AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
