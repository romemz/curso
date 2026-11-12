# =========================================================
# Etapa 1: CLONAR y COMPILAR la app Angular
# =========================================================
# Node 18: versión compatible con Angular 15
FROM node:18-alpine AS build

# URL del repo público de GitHub, rama y subcarpeta de la app (desde docker-compose.yml)
ARG REPO_URL
ARG BRANCH=main
ARG APP_DIR=.

RUN apk add --no-cache git

WORKDIR /src

# Clonar el repositorio (solo el último commit para que sea más rápido)
RUN test -n "$REPO_URL" || (echo "ERROR: falta REPO_URL" && exit 1) \
 && git clone --depth 1 --branch "$BRANCH" "$REPO_URL" app

WORKDIR /src/app/${APP_DIR}

# Instalar dependencias (npm ci si hay package-lock.json, si no npm install)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Compilar en modo producción
RUN npx ng build --configuration production

# Normalizar la salida: Angular >=17 genera dist/<proyecto>/browser,
# versiones anteriores generan dist/<proyecto>. Se copia a /out.
RUN INDEX=$(find dist -name index.html | head -n 1) \
 && test -n "$INDEX" || (echo "ERROR: no se encontró index.html en dist/" && exit 1) \
 && mkdir -p /out && cp -r "$(dirname "$INDEX")"/. /out/

# =========================================================
# Etapa 2: SERVIR el resultado con nginx
# =========================================================
FROM nginx:1.27-alpine

# Configuración para SPA: todas las rutas regresan index.html
RUN printf '%s\n' \
  'server {' \
  '  listen 80;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '  location / {' \
  '    try_files $uri $uri/ /index.html;' \
  '  }' \
  '}' > /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /out/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
