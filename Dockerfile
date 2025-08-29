# ---------- Build (Node 18 LTS on patched Alpine) ----------
FROM node:18-alpine3.20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Adjust the build command if your script name differs
RUN npm run build -- --configuration production \
 && npm cache clean --force

# ---------- Runtime (Unprivileged NGINX) ----------
# Runs as non-root (UID 101) and listens on 8080
FROM nginxinc/nginx-unprivileged:1.27.1-alpine3.20

# Use our secure server config (added below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled Angular app (ensure the dist folder name matches your project)
# If your output is dist/appointment-frontend/, leave as-is.
# Otherwise change the path accordingly.
COPY --chown=101:101 --from=build /app/dist/appointment-frontend/ /usr/share/nginx/html/

EXPOSE 8080
