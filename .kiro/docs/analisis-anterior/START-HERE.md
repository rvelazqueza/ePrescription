# 🚀 START HERE - Desarrollo Local ePrescription

## ¿Primera vez aquí?

### Inicio en 2 pasos:

```powershell
# 1. Verificar
.\test-local-api.ps1

# 2. Iniciar
.\quick-start-local.ps1
```

Abre http://localhost:5000/swagger y empieza a desarrollar.

---

## ¿Qué tengo disponible?

### 🎯 Menú Interactivo (Recomendado)
```powershell
.\dev-menu.ps1
```

Menú con todas las opciones:
- Desarrollo local
- Desarrollo Docker
- Verificar configuración
- Reiniciar servicios
- Ver logs
- Ayuda

### ⚡ Scripts Rápidos

```powershell
# Desarrollo local (hot reload)
.\quick-start-local.ps1

# Desarrollo Docker
.\start-dev-docker.ps1

# Verificar configuración
.\test-local-api.ps1
```

---

## 📚 Documentación

### Empezar
- **[README-DESARROLLO-LOCAL.md](README-DESARROLLO-LOCAL.md)** - Guía rápida

### Desarrollar
- **[GUIA-DESARROLLO.md](GUIA-DESARROLLO.md)** - Guía completa

### Problemas
- **[TROUBLESHOOTING-LOCAL.md](TROUBLESHOOTING-LOCAL.md)** - Solución de problemas

### Detalles
- **[SOLUCION-COMPLETA.md](SOLUCION-COMPLETA.md)** - Resumen de todo lo configurado

---

## 🎯 Uso Diario

```powershell
# Opción 1: Menú interactivo
.\dev-menu.ps1

# Opción 2: Inicio directo
.\quick-start-local.ps1
```

---

## 🌐 URLs

- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **Health**: http://localhost:5000/health
- **Keycloak**: http://localhost:8080

---

## ❓ Ayuda Rápida

### .NET no se encuentra
```powershell
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH
```

### Puerto ocupado
```powershell
docker stop eprescription-backend-api
```

### Más ayuda
```powershell
.\dev-menu.ps1
# Opción 7: Ayuda / Documentación
```

---

## ✅ Todo Listo

- ✅ .NET instalado
- ✅ Proyecto compila
- ✅ Scripts funcionando
- ✅ Documentación completa

**¡Empieza a desarrollar!** 🎉
