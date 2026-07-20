FROM node:22-alpine AS build

WORKDIR /app

COPY app/package*.json ./
RUN npm ci --omit=dev

COPY app/ ./

FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app /app

USER node

EXPOSE 3000

CMD ["node", "server.js"]