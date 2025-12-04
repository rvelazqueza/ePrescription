#!/bin/bash

# =====================================================
# Script: backup.sh
# Descripción: Script de backup para Oracle Database
# Autor: ePrescription Team
# Fecha: 2024
# =====================================================

# Configuración
CONTAINER_NAME="eprescription-oracle-db"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="eprescription_backup_${TIMESTAMP}.dmp"

# Crear directorio de backups si no existe
mkdir -p ${BACKUP_DIR}

echo "=========================================="
echo "Iniciando backup de Oracle Database"
echo "Fecha: $(date)"
echo "=========================================="

# Verificar que el contenedor esté corriendo
if ! docker ps | grep -q ${CONTAINER_NAME}; then
    echo "ERROR: El contenedor ${CONTAINER_NAME} no está corriendo"
    exit 1
fi

# Realizar backup del esquema EPRESCRIPTION
echo "Realizando backup del esquema EPRESCRIPTION..."
docker exec ${CONTAINER_NAME} sh -c "expdp eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1 \
    schemas=EPRESCRIPTION_USER \
    directory=DATA_PUMP_DIR \
    dumpfile=${BACKUP_FILE} \
    logfile=backup_${TIMESTAMP}.log"

# Copiar archivo de backup del contenedor al host
echo "Copiando archivo de backup al host..."
docker cp ${CONTAINER_NAME}:/opt/oracle/admin/XE/dpdump/${BACKUP_FILE} ${BACKUP_DIR}/

# Realizar backup del esquema KEYCLOAK
echo "Realizando backup del esquema KEYCLOAK..."
KEYCLOAK_BACKUP_FILE="keycloak_backup_${TIMESTAMP}.dmp"
docker exec ${CONTAINER_NAME} sh -c "expdp keycloak_user/KeycloakPass123!@localhost:1521/XEPDB1 \
    schemas=KEYCLOAK_USER \
    directory=DATA_PUMP_DIR \
    dumpfile=${KEYCLOAK_BACKUP_FILE} \
    logfile=keycloak_backup_${TIMESTAMP}.log"

# Copiar archivo de backup de Keycloak
docker cp ${CONTAINER_NAME}:/opt/oracle/admin/XE/dpdump/${KEYCLOAK_BACKUP_FILE} ${BACKUP_DIR}/

echo "=========================================="
echo "Backup completado exitosamente"
echo "Archivos guardados en: ${BACKUP_DIR}"
echo "  - ${BACKUP_FILE}"
echo "  - ${KEYCLOAK_BACKUP_FILE}"
echo "=========================================="

# Listar backups existentes
echo ""
echo "Backups disponibles:"
ls -lh ${BACKUP_DIR}

exit 0
