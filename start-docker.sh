#!/bin/bash
# ePrescription - Script de Inicio Rápido con Docker
# Este script inicia todos los servicios del sistema usando Docker Compose

echo "========================================"
echo "  ePrescription - Inicio con Docker"
echo "========================================"
echo ""

# Verificar que Docker esté corriendo
echo "Verificando Docker..."
if ! docker ps > /dev/null 2>&1; then
    echo "✗ Docker no está corriendo. Por favor inicia Docker."
    exit 1
fi
echo "✓ Docker está corriendo"

# Verificar que existe el archivo .env
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  Archivo .env no encontrado"
    echo "Creando .env desde .env.example..."
    cp .env.example .env
    echo ""
    echo "✓ Archivo .env creado"
    echo ""
    echo "IMPORTANTE: Edita el archivo .env y configura tus API keys antes de continuar."
    echo "Presiona Enter cuando hayas configurado el archivo .env..."
    read
fi

echo ""
echo "Iniciando servicios con Docker Compose..."
echo ""

# Iniciar servicios
docker-compose up -d

echo ""
echo "Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado de los servicios
echo ""
echo "Estado de los servicios:"
docker-compose ps

echo ""
echo "========================================"
echo "  Servicios Disponibles"
echo "========================================"
echo ""
echo "Oracle Database:"
echo "  Host: localhost:1521"
echo "  Service: XEPDB1"
echo "  Usuario: eprescription_user"
echo "  Password: EprescriptionPass123!"
echo ""
echo "Keycloak Admin Console:"
echo "  URL: http://localhost:8080"
echo "  Usuario: admin"
echo "  Password: admin123"
echo ""
echo "Backend API:"
echo "  URL: http://localhost:8000"
echo "  Swagger: http://localhost:8000/swagger"
echo ""
echo "========================================"
echo "  Comandos Útiles"
echo "========================================"
echo ""
echo "Ver logs de todos los servicios:"
echo "  docker-compose logs -f"
echo ""
echo "Ver logs de un servicio específico:"
echo "  docker-compose logs -f oracle-db"
echo "  docker-compose logs -f keycloak"
echo "  docker-compose logs -f eprescription-api"
echo ""
echo "Detener todos los servicios:"
echo "  docker-compose down"
echo ""
echo "Reiniciar un servicio:"
echo "  docker-compose restart eprescription-api"
echo ""
echo "Reconstruir y reiniciar:"
echo "  docker-compose build eprescription-api"
echo "  docker-compose up -d eprescription-api"
echo ""
echo "========================================"
echo "✓ Sistema iniciado correctamente"
echo "========================================"
echo ""
