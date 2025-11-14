# Dockerfile personalizado para Keycloak con soporte Oracle
FROM quay.io/keycloak/keycloak:latest as builder

# Habilitar health y metrics
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configurar Oracle como base de datos
ENV KC_DB=oracle

# Copiar el driver JDBC de Oracle desde el directorio local
# Ejecuta primero: ./download-oracle-driver.ps1
USER root
COPY providers/ojdbc11.jar /opt/keycloak/providers/ojdbc11.jar
RUN chown keycloak:keycloak /opt/keycloak/providers/ojdbc11.jar

USER keycloak

# Build optimizado de Keycloak con Oracle
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Configuración de entorno
ENV KC_DB=oracle
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
