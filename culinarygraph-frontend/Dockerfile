# Build (VITE_* must be set at build time for Vite)
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_KEYCLOAK_URL=http://localhost:8180
ARG VITE_API_BASE=/api
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_API_BASE=$VITE_API_BASE

COPY package.json package-lock.json* .npmrc* ./
RUN npm config set strict-ssl false && npm ci
COPY . .
RUN npm run build

# Serve + proxy /api → backend
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
