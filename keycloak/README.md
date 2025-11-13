# Keycloak con Oracle JDBC Driver

## Instrucciones de configuración

Para que Keycloak funcione con Oracle, necesitas descargar el driver JDBC de Oracle manualmente:

1. Descarga el driver JDBC de Oracle desde:
   https://download.oracle.com/otn-pub/otn_software/jdbc/233/ojdbc11.jar

2. Coloca el archivo `ojdbc11.jar` en la carpeta `keycloak/providers/`

3. Ejecuta `docker-compose build keycloak` para construir la imagen

4. Ejecuta `docker-compose up -d` para iniciar los servicios

## Alternativa: Usar PostgreSQL

Si prefieres evitar la complejidad del driver de Oracle, puedes configurar Keycloak para usar PostgreSQL en su lugar.
