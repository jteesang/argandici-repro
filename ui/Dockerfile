FROM node:18-alpine AS builder
WORKDIR /app

COPY ui/package*.json ./
RUN npm ci

COPY ui/ ./
RUN npm run build:ssr

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist/ui/browser ./browser
COPY --from=builder /app/dist/ui/server ./server
COPY ui/package*.json ./

RUN npm ci --omit=dev

EXPOSE 4000
CMD ["node", "server/main.js"]
