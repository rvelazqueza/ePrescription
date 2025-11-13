#!/bin/bash

# Script para configurar Keycloak automáticamente
# Configura realm, client, roles y usuarios de prueba

KEYCLOAK_URL="http://localhost:8080"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin123"
REALM_NAME="eprescription"
CLIENT_ID="eprescription-api"

echo "🚀 Iniciando configuración automática de Keycloak..."

# Esperar a que Keycloak esté listo
echo "⏳ Esperando a que Keycloak esté disponible..."
until curl -s -f -o /dev/null "$KEYCLOAK_URL/health/ready"; do
    echo "   Keycloak no está listo aún, esperando..."
    sleep 5
done
echo "✅ Keycloak está listo"

# Obtener token de administrador
echo "🔑 Obteniendo token de administrador..."
TOKEN_RESPONSE=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$ADMIN_USER" \
  -d "password=$ADMIN_PASSWORD" \
  -d "grant_type=password" \
  -d "client_id=admin-cli")

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Error: No se pudo obtener el token de acceso"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi
echo "✅ Token obtenido"

# Crear Realm
echo "🏗️  Creando realm '$REALM_NAME'..."
REALM_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  "$KEYCLOAK_URL/admin/realms/$REALM_NAME")

if [ "$REALM_EXISTS" = "404" ]; then
    curl -s -X POST "$KEYCLOAK_URL/admin/realms" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "realm": "'$REALM_NAME'",
        "enabled": true,
        "displayName": "ePrescription System",
        "registrationAllowed": false,
        "loginWithEmailAllowed": true,
        "duplicateEmailsAllowed": false,
        "resetPasswordAllowed": true,
        "editUsernameAllowed": false,
        "bruteForceProtected": true
      }'
    echo "✅ Realm creado"
else
    echo "ℹ️  Realm ya existe"
fi

# Crear Client
echo "🔧 Creando client '$CLIENT_ID'..."
CLIENT_EXISTS=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
  "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" | grep -o "\"clientId\":\"$CLIENT_ID\"")

if [ -z "$CLIENT_EXISTS" ]; then
    curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "clientId": "'$CLIENT_ID'",
        "enabled": true,
        "protocol": "openid-connect",
        "publicClient": false,
        "directAccessGrantsEnabled": true,
        "serviceAccountsEnabled": false,
        "standardFlowEnabled": true,
        "implicitFlowEnabled": false,
        "redirectUris": ["http://localhost:5000/*", "http://localhost:4200/*"],
        "webOrigins": ["http://localhost:5000", "http://localhost:4200"],
        "attributes": {
          "access.token.lifespan": "300"
        }
      }'
    echo "✅ Client creado"
else
    echo "ℹ️  Client ya existe"
fi

# Obtener Client UUID y Secret
echo "🔍 Obteniendo Client Secret..."
CLIENT_UUID=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
  "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" | \
  grep -o "\"id\":\"[^\"]*\",\"clientId\":\"$CLIENT_ID\"" | \
  grep -o "\"id\":\"[^\"]*" | cut -d'"' -f4)

if [ -n "$CLIENT_UUID" ]; then
    CLIENT_SECRET=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
      "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients/$CLIENT_UUID/client-secret" | \
      grep -o "\"value\":\"[^\"]*" | cut -d'"' -f4)
    
    echo "✅ Client Secret obtenido"
    echo ""
    echo "📋 IMPORTANTE - Guarda este Client Secret:"
    echo "   $CLIENT_SECRET"
    echo ""
    echo "   Actualiza appsettings.json con este valor:"
    echo "   \"ClientSecret\": \"$CLIENT_SECRET\""
    echo ""
fi

# Crear Roles
echo "👥 Creando roles..."
ROLES=("admin" "doctor" "pharmacist" "patient" "auditor")
for ROLE in "${ROLES[@]}"; do
    ROLE_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles/$ROLE")
    
    if [ "$ROLE_EXISTS" = "404" ]; then
        curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles" \
          -H "Authorization: Bearer $ACCESS_TOKEN" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "'$ROLE'",
            "description": "Role for '$ROLE'"
          }'
        echo "   ✅ Rol '$ROLE' creado"
    else
        echo "   ℹ️  Rol '$ROLE' ya existe"
    fi
done

# Crear Usuarios de Prueba
echo "👤 Creando usuarios de prueba..."

# Usuario: admin.user
create_user() {
    local USERNAME=$1
    local EMAIL=$2
    local FIRSTNAME=$3
    local LASTNAME=$4
    local PASSWORD=$5
    local ROLE=$6
    
    USER_EXISTS=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
      "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=$USERNAME" | grep -o "\"username\":\"$USERNAME\"")
    
    if [ -z "$USER_EXISTS" ]; then
        # Crear usuario
        curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
          -H "Authorization: Bearer $ACCESS_TOKEN" \
          -H "Content-Type: application/json" \
          -d '{
            "username": "'$USERNAME'",
            "email": "'$EMAIL'",
            "firstName": "'$FIRSTNAME'",
            "lastName": "'$LASTNAME'",
            "enabled": true,
            "emailVerified": true,
            "credentials": [{
              "type": "password",
              "value": "'$PASSWORD'",
              "temporary": false
            }]
          }'
        
        # Obtener User ID
        USER_ID=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
          "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=$USERNAME" | \
          grep -o "\"id\":\"[^\"]*" | head -1 | cut -d'"' -f4)
        
        # Asignar rol
        if [ -n "$USER_ID" ]; then
            ROLE_DATA=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
              "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles/$ROLE")
            
            curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users/$USER_ID/role-mappings/realm" \
              -H "Authorization: Bearer $ACCESS_TOKEN" \
              -H "Content-Type: application/json" \
              -d "[$ROLE_DATA]"
        fi
        
        echo "   ✅ Usuario '$USERNAME' creado con rol '$ROLE'"
    else
        echo "   ℹ️  Usuario '$USERNAME' ya existe"
    fi
}

create_user "admin.user" "admin@eprescription.com" "Admin" "User" "Admin123!" "admin"
create_user "doctor.smith" "doctor.smith@eprescription.com" "John" "Smith" "Doctor123!" "doctor"
create_user "pharmacist.jones" "pharmacist.jones@eprescription.com" "Mary" "Jones" "Pharmacist123!" "pharmacist"
create_user "patient.doe" "patient.doe@eprescription.com" "Jane" "Doe" "Patient123!" "patient"

echo ""
echo "🎉 ¡Configuración de Keycloak completada!"
echo ""
echo "📋 Resumen:"
echo "   Realm: $REALM_NAME"
echo "   Client ID: $CLIENT_ID"
echo "   Client Secret: $CLIENT_SECRET"
echo ""
echo "👥 Usuarios creados:"
echo "   - admin.user / Admin123! (rol: admin)"
echo "   - doctor.smith / Doctor123! (rol: doctor)"
echo "   - pharmacist.jones / Pharmacist123! (rol: pharmacist)"
echo "   - patient.doe / Patient123! (rol: patient)"
echo ""
echo "🔗 Acceso:"
echo "   Admin Console: $KEYCLOAK_URL"
echo "   Username: $ADMIN_USER"
echo "   Password: $ADMIN_PASSWORD"
echo ""
