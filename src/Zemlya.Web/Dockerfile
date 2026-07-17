# Етап 1: збірка фронтенду
FROM node:18-alpine AS frontend-build
WORKDIR /src/Zemlya.Web/
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Етап 2: фінальний образ
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=frontend-build /src/Zemlya.Web/build .
EXPOSE 80
