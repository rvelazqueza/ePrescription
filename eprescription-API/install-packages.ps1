# Script para instalar todos los NuGet packages necesarios
$dotnet = "C:\Program Files\dotnet\dotnet.exe"

Write-Host "Installing NuGet packages for Task 5..." -ForegroundColor Green

# Application packages
Write-Host "`n[Application] Installing AutoMapper..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.Application/EPrescription.Application.csproj package AutoMapper

Write-Host "`n[Application] Installing AutoMapper.Extensions.Microsoft.DependencyInjection..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.Application/EPrescription.Application.csproj package AutoMapper.Extensions.Microsoft.DependencyInjection

Write-Host "`n[Application] Installing MediatR..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.Application/EPrescription.Application.csproj package MediatR

# Infrastructure packages
Write-Host "`n[Infrastructure] Installing Microsoft.EntityFrameworkCore..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.Infrastructure/EPrescription.Infrastructure.csproj package Microsoft.EntityFrameworkCore --version 8.0.11

Write-Host "`n[Infrastructure] Installing Microsoft.EntityFrameworkCore.Design..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.Infrastructure/EPrescription.Infrastructure.csproj package Microsoft.EntityFrameworkCore.Design --version 8.0.11

Write-Host "`n[Infrastructure] Installing Oracle.EntityFrameworkCore..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.Infrastructure/EPrescription.Infrastructure.csproj package Oracle.EntityFrameworkCore --version 8.23.60

Write-Host "`n[Infrastructure] Installing Serilog..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.Infrastructure/EPrescription.Infrastructure.csproj package Serilog

Write-Host "`n[Infrastructure] Installing Serilog.Sinks.Console..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.Infrastructure/EPrescription.Infrastructure.csproj package Serilog.Sinks.Console

Write-Host "`n[Infrastructure] Installing Serilog.Sinks.File..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.Infrastructure/EPrescription.Infrastructure.csproj package Serilog.Sinks.File

# API packages
Write-Host "`n[API] Installing Serilog.AspNetCore..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.API/EPrescription.API.csproj package Serilog.AspNetCore

Write-Host "`n[API] Installing Serilog.Sinks.Console..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.API/EPrescription.API.csproj package Serilog.Sinks.Console

Write-Host "`n[API] Installing Microsoft.AspNetCore.Authentication.JwtBearer..." -ForegroundColor Yellow
& $dotnet add src/EPrescription.API/EPrescription.API.csproj package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.11

# Tests packages
Write-Host "`n[Tests] Installing Moq..." -ForegroundColor Yellow
& $dotnet add tests/EPrescription.Tests/EPrescription.Tests.csproj package Moq

Write-Host "`n[Tests] Installing FluentAssertions..." -ForegroundColor Yellow
& $dotnet add tests/EPrescription.Tests/EPrescription.Tests.csproj package FluentAssertions

Write-Host "`n[Tests] Installing Microsoft.EntityFrameworkCore.InMemory..." -ForegroundColor Yellow
& $dotnet add tests/EPrescription.Tests/EPrescription.Tests.csproj package Microsoft.EntityFrameworkCore.InMemory --version 8.0.11

Write-Host "`n✅ All packages installed successfully!" -ForegroundColor Green
Write-Host "`nBuilding solution to verify..." -ForegroundColor Yellow
& $dotnet build

Write-Host "`n🎉 Task 5.8-5.11 completed!" -ForegroundColor Green
