# Docker Workflow Configurado ✅

## Cambios Realizados

1. ✅ Steering rule creada: `.kiro/steering/docker-development-workflow.md`
2. ✅ Script de rebuild: `docker-rebuild-api.ps1`
3. ✅ Docker-compose actualizado:
   - Servicio renombrado a `eprescription-api`
   - Puerto cambiado a 8000 (host) -> 8080 (container)
   - Healthcheck actualizado

## Workflow para Futuros Tasks

### Desarrollo
```powershell
# 1. Edita código en tu IDE

# 2. Compila para verificar errores
cd eprescription-API
dotnet build

# 3. Rebuild y reinicia Docker
cd ..
.\docker-rebuild-api.ps1
```

### Testing
```powershell
# Swagger UI
http://localhost:8000/swagger

# Ver logs
docker logs -f eprescription-api

# Reiniciar si es necesario
docker-compose restart eprescription-api
```

### Comandos Útiles
```powershell
# Ver todos los contenedores
docker ps

# Rebuild manual
docker-compose build eprescription-api
docker-compose up -d eprescription-api

# Ver logs
docker logs eprescription-api --tail 100

# Entrar al contenedor
docker exec -it eprescription-api bash

# Reiniciar todo
docker-compose restart
```

## Task 11 - Próximos Pasos

1. Rebuild imagen con Task 11:
```powershell
.\docker-rebuild-api.ps1
```

2. Probar endpoints en Swagger:
```
http://localhost:8000/swagger
```

3. Endpoints de Prescriptions:
- POST /api/prescriptions
- GET /api/prescriptions/{id}
- PUT /api/prescriptions/{id}
- DELETE /api/prescriptions/{id}
- POST /api/prescriptions/search

## Notas Importantes

- ✅ Docker es OBLIGATORIO para REST API
- ❌ NO usar desarrollo local (`dotnet run`)
- ✅ Solo compilar local para verificar errores
- ✅ Todas las pruebas en Docker

## Steering Rule

El archivo `.kiro/steering/docker-development-workflow.md` está configurado con `inclusion: always`, lo que significa que el agente SIEMPRE verá estas instrucciones en futuros tasks.
