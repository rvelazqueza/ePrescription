---
inclusion: always
---

# Docker Development Workflow - OBLIGATORIO

**IMPORTANTE:** Todos los tasks de REST API deben desarrollarse y probarse usando Docker, NO desarrollo local.

## Por qué Docker

- ✅ Conexión a Oracle funciona correctamente
- ✅ Todas las dependencias configuradas
- ✅ Entorno consistente
- ✅ No hay problemas de PATH o .NET
- ❌ Desarrollo local tiene problemas de startup y conexión

## Workflow para Tasks REST

### 1. Hacer cambios en código
Edita archivos normalmente en tu IDE.

### 2. Rebuild imagen del API
```powershell
docker-compose build eprescription-api
```

### 3. Reiniciar contenedor
```powershell
docker-compose up -d eprescription-api
```

### 4. Ver logs
```powershell
docker logs -f eprescription-api
```

### 5. Probar endpoints
- Swagger: http://localhost:8000/swagger
- API: http://localhost:8000/api/

### 6. Si hay errores
```powershell
# Ver logs completos
docker logs eprescription-api

# Entrar al contenedor
docker exec -it eprescription-api bash

# Reiniciar todo
docker-compose restart
```

## Comandos Rápidos

```powershell
# Rebuild y reiniciar
docker-compose build eprescription-api ; docker-compose up -d eprescription-api

# Ver logs en tiempo real
docker logs -f eprescription-api

# Verificar que está corriendo
docker ps

# Probar health
curl http://localhost:8000/swagger/index.html
```

## NO hacer desarrollo local

- ❌ NO usar `dotnet run` local
- ❌ NO intentar conectar a Oracle desde host
- ❌ NO perder tiempo con problemas de PATH
- ✅ SIEMPRE usar Docker para REST API

## Excepciones

Solo usa desarrollo local para:
- Compilar y verificar errores: `dotnet build`
- Ejecutar tests unitarios: `dotnet test`
- Nada más

## Para el agente

Cuando implementes tasks REST:
1. Escribe el código
2. Compila localmente para verificar: `dotnet build`
3. Rebuild Docker: `docker-compose build eprescription-api`
4. Inicia Docker: `docker-compose up -d eprescription-api`
5. Verifica logs: `docker logs eprescription-api`
6. Prueba endpoints en http://localhost:8000/swagger
