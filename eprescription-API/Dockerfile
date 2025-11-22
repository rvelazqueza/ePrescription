# Multi-stage Dockerfile que compila dentro del contenedor

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /build

# Copy everything
COPY . .

# Restore dependencies
RUN dotnet restore "EPrescription.sln"

# Build and publish
WORKDIR "/build/src/ePrescription.API"
RUN dotnet build "EPrescription.API.csproj" -c Release -o /app/build
RUN dotnet publish "EPrescription.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published app from build stage
COPY --from=build /app/publish .

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/swagger/index.html || exit 1

# Entry point
ENTRYPOINT ["dotnet", "EPrescription.API.dll"]
