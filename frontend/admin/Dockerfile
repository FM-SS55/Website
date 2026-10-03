# Build context must be ./frontend (so ../shared is available):
#   docker build -f admin/Dockerfile ./frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY shared ./shared
WORKDIR /app/admin
COPY admin/package*.json ./
RUN npm install
COPY admin ./
RUN npm run build

FROM nginx:1.27-alpine
COPY admin/nginx.conf /etc/nginx/conf.d/default.conf
# build output is dist/admin -> served under /admin/
COPY --from=build /app/admin/dist /usr/share/nginx/html
EXPOSE 80