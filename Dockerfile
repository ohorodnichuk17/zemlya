# Етап 1: збірка фронтенду
FROM node:18-alpine AS frontend-build
WORKDIR /src/Zemlya.Web/
COPY src/Zemlya.Web/package*.json ./
RUN npm install
COPY src/Zemlya.Web/ .
RUN npm run build

# Етап 2: збірка бекенду (.NET)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src/Zemlya.Api
COPY . .
RUN dotnet publish Zemlya.sln -c Release -o /app/publish

# Етап 3: фінальний образ
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=backend-build /app/publish .
COPY --from=frontend-build /src/Zemlya.Web/build ./wwwroot
EXPOSE 8080
ENTRYPOINT ["dotnet", "Zemlya.Api.dll"]
