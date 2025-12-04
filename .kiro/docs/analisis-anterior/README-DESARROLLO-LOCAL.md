# 🚀 Desarrollo Local - Guía Rápida

## TL;DR (Inicio Rápido)

```powershell
# Ejecuta esto y listo
.\quick-start-local.ps1
```

Abre http://localhost:5000/swagger y empieza a desarrollar.

---

## ¿Qué es esto?

Configuración completa para desarrollar el API de ePrescription localmente en tu máquina, con:
- ✅ Hot reload automático
- ✅ Debug con breakpoints
- ✅ Compilación rápida
- ✅ Logs en tiempo real

---

## Requisitos

- ✅ Windows
- ✅ Docker Desktop (corriendo)
- ✅ .NET SDK 8+ (se instala automáticamente si no lo tienes)

---

## Primer Uso

### 1. Verificar que todo está listo
```powershell
.\test-local-api.ps1
```

### 2. Iniciar desarrollo local
```powershell
.\quick-start-local.ps1
```

### 3. Abrir Swagger
http://localhost:5000/swagger

---

## Uso Diario

```powershell
# Cada vez que quieras desarrollar
.\quick-start-local.ps1
```

Eso es todo. El script:
1. Verifica .NET y Docker
2. Inicia Oracle y Keycloak
3. Compila el proyecto
4. Inicia el API con hot reload

---

## URLs

- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **Health**: http://localhost:5000/health
- **Keycloak**: http://localhost:8080

---

## Hot Reload

Los cambios en el código se ven **inmediatamente** sin reiniciar:

1. Edita un controller
2. Guarda el archivo (Ctrl+S)
3. Refresca Swagger
4. ¡Listo!

---

## Debug con Breakpoints

### Visual Studio
1. Abrir `eprescription-API/EPrescription.sln`
2. F5 para debug

### VS Code
1. Abrir carpeta `eprescription-API`
2. F5 para debug

---

## Problemas Comunes

### .NET no se encuentra
```powershell
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH
```

### Puerto ocupado
```powershell
docker stop eprescription-backend-api
```

### Oracle no conecta
```powershell
docker restart eprescription-oracle-db
```

**Más problemas:** Ver [TROUBLESHOOTING-LOCAL.md](TROUBLESHOOTING-LOCAL.md)

---

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `quick-start-local.ps1` | Inicio rápido (recomendado) |
| `start-dev-local.ps1` | Inicio con más detalles |
| `test-local-api.ps1` | Verificar configuración |
| `start-dev-docker.ps1` | Volver a Docker |

---

## Documentación Completa

- **[GUIA-DESARROLLO.md](GUIA-DESARROLLO.md)** - Guía completa
- **[RESUMEN-DESARROLLO-LOCAL.md](RESUMEN-DESARROLLO-LOCAL.md)** - Resumen detallado
- **[TROUBLESHOOTING-LOCAL.md](TROUBLESHOOTING-LOCAL.md)** - Solución de problemas
- **[DESARROLLO-LOCAL-LISTO.md](DESARROLLO-LOCAL-LISTO.md)** - Documentación técnica

---

## Workflow Recomendado

### Desarrollo
```powershell
.\quick-start-local.ps1
# Desarrolla con hot reload
```

### Testing Final
```powershell
.\start-dev-docker.ps1
# Prueba en Docker antes de commit
```

---

## Ventajas

| Característica | Beneficio |
|---|---|
| Hot Reload | Cambios instantáneos |
| Debug | Breakpoints funcionan |
| Velocidad | Compilación en 2-3 segundos |
| Logs | En tiempo real en consola |

---

## Comandos Útiles

```powershell
# Ver estado
docker ps

# Reiniciar Oracle
docker restart eprescription-oracle-db

# Reiniciar Keycloak
docker restart eprescription-keycloak

# Compilar manualmente
cd eprescription-API
dotnet build
```

---

## ¿Necesitas Ayuda?

1. Ejecuta `.\test-local-api.ps1` para diagnosticar
2. Revisa [TROUBLESHOOTING-LOCAL.md](TROUBLESHOOTING-LOCAL.md)
3. Verifica que Docker Desktop esté corriendo

---

## Estado Actual

✅ .NET 10.0.100 instalado
✅ Proyecto compila sin errores
✅ Configuración local lista
✅ Scripts funcionando
✅ Infraestructura corriendo

**¡Listo para desarrollar!** 🎉
