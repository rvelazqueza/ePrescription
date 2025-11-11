# ePrescription Frontend

Frontend de la aplicación ePrescription desarrollado en Angular 18.

## Tecnologías

- Angular 18
- TypeScript
- Tailwind CSS
- RxJS

## Requisitos Previos

- Node.js 18+ 
- npm 9+

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## Build

```bash
npm run build
```

Los archivos de producción se generarán en `dist/`

## Integración con Backend

El frontend se conecta al backend API en:
- Desarrollo: `http://localhost:5000`
- Producción: Configurar en `src/environments/environment.prod.ts`

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas de la aplicación
│   ├── services/       # Servicios de Angular
│   ├── guards/         # Guards de autenticación
│   ├── interfaces/     # Interfaces TypeScript
│   └── styles/         # Estilos globales
├── assets/             # Recursos estáticos
└── environments/       # Configuración de entornos
```

## Características Principales

- Gestión de prescripciones médicas
- Asistente de IA para diagnósticos (integrado con backend)
- Búsqueda de pacientes y médicos
- Dispensación de medicamentos
- Gestión de inventario
- Sistema de auditoría
- Autenticación con Keycloak

## Notas

- El asistente de IA ahora funciona desde el backend
- Todas las API keys están en el backend (no en frontend)
- Autenticación mediante Keycloak JWT tokens
