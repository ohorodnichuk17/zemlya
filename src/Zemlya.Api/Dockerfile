# Етап 1: збірка бекенду (.NET)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src/Zemlya.Api
COPY . .
RUN dotnet publish Zemlya.sln -c Release -o /app/publish

# Етап 2: фінальний образ
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=backend-build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Zemlya.Api.dll"]
