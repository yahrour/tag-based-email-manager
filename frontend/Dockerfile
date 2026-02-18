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
FROM nginxinc/nginx-unprivileged:trixie
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
