# ✅ Desarrollo Local Configurado

## Estado Actual

.NET está instalado y funcionando correctamente en tu máquina.

### Versiones Instaladas
- **.NET SDK**: 10.0.100 (compatible con .NET 8)
- **Docker**: Funcionando
- **Proyecto**: Compila sin errores

## Problema Resuelto

El problema era que .NET no estaba en el PATH de Windows. Lo solucionamos:

1. Instalamos .NET usando `winget install Microsoft.DotNet.SDK.8`
2. Agregamos `C:\Program Files\dotnet` al PATH del usuario
3. El proyecto ahora compila correctamente

## Dos Opciones de Desarrollo

### Opción A: Desarrollo Local (.NET local + Docker para infraestructura)

**Ventajas**: Hot reload, debug con breakpoints, compilación rápida

```powershell
.\start-dev-local.ps1
```

Este script:
- Detiene el API en Docker si está corriendo
- Inicia Oracle y Keycloak en Docker
- Compila el proyecto
- Inicia el API localmente con hot reload

### Opción B: Todo en Docker

**Ventajas**: Ambiente consistente, no requiere .NET local

```powershell
.\start-dev-docker.ps1
```

Este script inicia todo en Docker (Oracle + Keycloak + API)

### Opción C: Manual (Desarrollo Local)

```powershell
# 1. Arreglar PATH (solo necesario una vez por sesión)
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH

# 2. Iniciar infraestructura
docker-compose up -d oracle-db keycloak

# 3. Compilar y ejecutar
cd eprescription-API
dotnet watch run --project src/ePrescription.API --urls http://localhost:5000
```

## URLs Disponibles

Una vez iniciado:

- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/health
- **Keycloak**: http://localhost:8080

## Notas Importantes

### PATH Temporal vs Permanente

El PATH se arregló permanentemente en Windows, pero PowerShell necesita ser reiniciado para verlo. Los scripts incluyen el fix automático para que funcione sin reiniciar.

### Hot Reload

Usando `dotnet watch run`, los cambios en el código se recargan automáticamente sin reiniciar el API.

### Infraestructura Docker

Oracle y Keycloak siguen corriendo en Docker. Solo el API .NET corre localmente.

## Ventajas del Desarrollo Local

✅ Hot reload automático
✅ Debug con breakpoints en Visual Studio
✅ Compilación más rápida
✅ IntelliSense completo
✅ Mejor experiencia de desarrollo

## Próximos Pasos

Ahora puedes:

1. Abrir el proyecto en Visual Studio
2. Establecer `ePrescription.API` como proyecto de inicio
3. Presionar F5 para debug
4. O usar `.\start-dev-local.ps1` desde PowerShell

## Troubleshooting

### Si .NET no se encuentra

```powershell
# Arreglar PATH en esta sesión
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH

# Verificar
dotnet --version
```

### Si Docker no inicia

```powershell
# Verificar estado
docker ps

# Reiniciar servicios
docker-compose restart oracle-db keycloak
```

### Si el API no compila

```powershell
cd eprescription-API
dotnet clean
dotnet restore
dotnet build
```
