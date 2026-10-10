# syntax=docker/dockerfile:1

# ---------- Stage 1: build the site ----------
FROM node:22-slim AS build
WORKDIR /app

# Install the project's pinned pnpm version without corepack
RUN npm install -g pnpm@12.9.1

# Husky is only needed during development
ENV HUSKY=0

# Cache dependencies until the manifest or lockfile changes
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the source and build the static site
COPY . .
RUN pnpm build

# ---------- Stage 2: serve the static output ----------
FROM nginx:alpine

COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Astro assets have hashed names, so they can be cached long term
    location /_astro/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
