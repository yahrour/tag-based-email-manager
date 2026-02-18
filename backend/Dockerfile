# Install Deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json .
RUN npm ci

# Build App
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Run App
FROM node:20-alpine AS run
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env ./.env
COPY --from=build /app/dist ./dist
EXPOSE 3333
USER node
CMD [ "node", "/app/dist/server.js" ]
