import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { FileText, Download, Copy, CheckCircle2, ExternalLink, BookOpen } from "lucide-react";
import { toast } from "sonner";

// Contenido de la documentación (importado como string)
const MANUAL_LOGIN_CONTENT = `# 🔐 Manual de Usuario - Sistema de Autenticación

## 📖 Guía Rápida: Activar/Desactivar Pantalla de Login

Esta guía explica cómo configurar el sistema ePrescription para acceder directamente al dashboard sin pasar por la pantalla de autenticación, útil para desarrollo y pruebas.

---

## 🎯 Opción 1: Desactivar Login (Acceso Directo)

### ¿Cuándo usar esto?
- Durante desarrollo y pruebas
- Cuando necesitas acceso rápido sin autenticación
- Para demostraciones del sistema
- En entornos de desarrollo local

### Pasos para desactivar el login:

1. **Abrir el archivo App.tsx**
   - Ubicación: \`/App.tsx\`
   - Línea aproximada: 23

2. **Buscar la línea de autenticación:**
   \`\`\`typescript
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   \`\`\`

3. **Cambiar \`false\` por \`true\`:**
   \`\`\`typescript
   const [isAuthenticated, setIsAuthenticated] = useState(true); // ✅ Acceso directo
   \`\`\`

4. **Guardar el archivo**
   - El sistema se recargará automáticamente
   - Accederás directamente al dashboard
   - No se mostrará la pantalla de login

### Resultado:
✅ El sistema iniciará directamente en el dashboard  
✅ No se solicitará usuario ni contraseña  
✅ Tendrás acceso completo a todas las funcionalidades  

⚠️ **Importante:** Esta configuración es SOLO para desarrollo. En producción siempre debe estar en \`false\`.

---

## 🔒 Opción 2: Activar Login (Modo Seguro)

### ¿Cuándo usar esto?
- En producción
- Cuando necesitas autenticación real
- Para probar el flujo completo de login
- En entornos compartidos o públicos

### Pasos para activar el login:

1. **Abrir el archivo App.tsx**
   - Ubicación: \`/App.tsx\`
   - Línea aproximada: 23

2. **Buscar la línea de autenticación:**
   \`\`\`typescript
   const [isAuthenticated, setIsAuthenticated] = useState(true);
   \`\`\`

3. **Cambiar \`true\` por \`false\`:**
   \`\`\`typescript
   const [isAuthenticated, setIsAuthenticated] = useState(false); // ✅ Login requerido
   \`\`\`

4. **Guardar el archivo**
   - El sistema se recargará automáticamente
   - Se mostrará la pantalla de login
   - Se requerirá autenticación para acceder

### Resultado:
✅ Se muestra pantalla de login al iniciar  
✅ Se validan credenciales de usuario  
✅ Se puede probar el flujo de MFA (si está activado)  
✅ Experiencia de usuario completa  

---

## 📍 Ubicación Exacta del Cambio

### Archivo: \`/App.tsx\`

\`\`\`typescript
export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 👈 CAMBIAR AQUÍ
  const [authView, setAuthView] = useState<'login' | 'mfa' | 'recovery' | 'onboarding' | 'registration-success'>('login');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  // ... resto del código
}
\`\`\`

### Cambio específico:
\`\`\`typescript
// OPCIÓN A: Login desactivado (acceso directo)
const [isAuthenticated, setIsAuthenticated] = useState(true);

// OPCIÓN B: Login activado (modo seguro)
const [isAuthenticated, setIsAuthenticated] = useState(false);
\`\`\`

---

## 🔄 Comparación de Modos

| Característica | Login Desactivado | Login Activado |
|---------------|-------------------|----------------|
| **Pantalla inicial** | Dashboard | Login |
| **Requiere credenciales** | No | Sí |
| **MFA** | No aplica | Puede activarse |
| **Sesión de usuario** | Automática | Manual |
| **Velocidad de acceso** | Inmediata | Requiere login |
| **Seguridad** | Baja (solo desarrollo) | Alta (producción) |
| **Uso recomendado** | Desarrollo/pruebas | Producción |

---

## 👤 Usuarios de Prueba (cuando login está activado)

### Administrador
\`\`\`
Usuario: admin@eprescription.com
Contraseña: admin123
Rol: Administrador del sistema
\`\`\`

### Médico
\`\`\`
Usuario: dr.juanperez@hospital.com
Contraseña: medico123
Rol: Médico prescriptor
\`\`\`

### Farmacéutico
\`\`\`
Usuario: ana.garcia@farmacia.com
Contraseña: farmacia123
Rol: Farmacéutico dispensador
\`\`\`

### Auditor
\`\`\`
Usuario: carlos.lopez@auditoria.com
Contraseña: auditor123
Rol: Auditor del sistema
\`\`\`

---

## 🎓 Casos de Uso Comunes

### Caso 1: Desarrollador trabajando en nueva funcionalidad
**Recomendación:** Login DESACTIVADO
- Acceso rápido al dashboard
- No pierde tiempo en login repetitivo
- Puede probar funcionalidades directamente

### Caso 2: Demo para cliente
**Recomendación:** Login DESACTIVADO
- Acceso inmediato sin interrupciones
- Flujo de presentación más ágil
- Cliente ve directamente las funcionalidades

### Caso 3: Pruebas de integración completas
**Recomendación:** Login ACTIVADO
- Prueba el flujo completo de autenticación
- Valida permisos y roles
- Verifica MFA si está configurado

### Caso 4: Despliegue en producción
**Recomendación:** Login ACTIVADO (OBLIGATORIO)
- Seguridad máxima
- Autenticación real de usuarios
- Cumplimiento normativo (HIPAA, FDA)

---

## ⚙️ Configuración Avanzada

### Cambiar usuario por defecto (modo sin login)

Cuando el login está desactivado, el sistema inicia con el primer usuario del store. Para cambiar esto:

1. **Ubicar la inicialización de sesión en App.tsx:**
   \`\`\`typescript
   const user = getUserById(userId) || getAllUsers()[0]; // 👈 Usuario por defecto
   \`\`\`

2. **Cambiar a un usuario específico:**
   \`\`\`typescript
   // Ejemplo: Iniciar siempre como Dr. Juan Pérez
   const user = getUserById('USR-0001'); // ID específico
   
   // O por email
   const user = getAllUsers().find(u => u.email === 'dr.juanperez@hospital.com');
   \`\`\`

### Forzar un rol específico al iniciar

\`\`\`typescript
initializeSession(
  user.userId,
  user.username,
  user.fullName,
  'ROLE-002', // 👈 Forzar rol específico (Médico)
  user.assignedRoles
);
\`\`\`

---

## 🔍 Verificación del Cambio

### Cómo verificar que el cambio funcionó:

#### Con login DESACTIVADO:
1. Recargar la página
2. ✅ Deberías ver el dashboard directamente
3. ✅ No se muestra pantalla de login
4. ✅ El menú lateral está disponible
5. ✅ Usuario activo en la esquina superior derecha

#### Con login ACTIVADO:
1. Recargar la página
2. ✅ Deberías ver la pantalla de login
3. ✅ Se solicita usuario y contraseña
4. ✅ Puedes hacer clic en "Registrarse"
5. ✅ Puedes hacer clic en "¿Olvidaste tu contraseña?"

---

## 🛡️ Seguridad y Mejores Prácticas

### ⚠️ ADVERTENCIAS IMPORTANTES

1. **NUNCA desactives el login en producción**
   - Violación de seguridad crítica
   - Incumplimiento de HIPAA
   - Incumplimiento de FDA 21 CFR Part 11
   - Datos de pacientes expuestos

2. **Variables de entorno (recomendado)**
   En lugar de cambiar el código, usa variables de entorno:
   
   \`\`\`typescript
   // Ejemplo mejorado (futuro)
   const isDevelopment = import.meta.env.DEV;
   const [isAuthenticated, setIsAuthenticated] = useState(!isDevelopment);
   \`\`\`

3. **Git: No hagas commit del cambio**
   - Mantén \`false\` en el repositorio
   - Cambia solo en tu ambiente local
   - Usa .gitignore si creas un archivo de configuración

---

## 📊 Diagrama de Flujo de Autenticación

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Inicio de App                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ isAuthenticated?     │
            └──────────┬───────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
   [true]                        [false]
        │                             │
        │                             ▼
        │              ┌─────────────────────────┐
        │              │ Mostrar LoginPage       │
        │              └──────────┬──────────────┘
        │                         │
        │                         ▼
        │              ┌─────────────────────────┐
        │              │ Usuario ingresa datos   │
        │              └──────────┬──────────────┘
        │                         │
        │                         ▼
        │              ┌─────────────────────────┐
        │              │ ¿MFA requerido?         │
        │              └──────┬────────┬─────────┘
        │                     │        │
        │               [Sí]  │        │  [No]
        │                     │        │
        │                     ▼        ▼
        │        ┌────────────────┐   │
        │        │ MFAVerification│   │
        │        └────────┬───────┘   │
        │                 │           │
        │                 └───────┬───┘
        │                         │
        │                         ▼
        │              ┌─────────────────────────┐
        │              │ Validación exitosa      │
        │              │ setIsAuthenticated(true)│
        │              └──────────┬──────────────┘
        │                         │
        └─────────────────────────┴──────────────┐
                                                  │
                                                  ▼
                                   ┌──────────────────────────┐
                                   │ Renderizar <NewLayout>   │
                                   │ + Dashboard/Páginas      │
                                   └──────────────────────────┘
\`\`\`

---

## 🎬 Video Tutorial (Próximamente)

Estamos preparando un video tutorial que muestra:
- Cómo cambiar entre modos
- Demostraciones prácticas
- Casos de uso comunes
- Mejores prácticas de seguridad

---

## 📞 Soporte

¿Tienes dudas sobre la configuración?

1. **Revisa esta documentación**
2. **Consulta los archivos de ejemplo:**
   - \`/COMO_USAR_AUTH.md\`
   - \`/AUTH_MFA_GUIDE.md\`
3. **Verifica que el cambio se guardó correctamente**
4. **Recarga el navegador con Ctrl+F5**

---

## 📝 Checklist de Verificación

Antes de desplegar a producción, verifica:

- [ ] \`isAuthenticated\` está en \`false\`
- [ ] Las credenciales de prueba NO están en el código de producción
- [ ] MFA está activado para usuarios críticos
- [ ] Logs de auditoría están habilitados
- [ ] Certificados SSL están configurados
- [ ] Variables de entorno están configuradas
- [ ] No hay credenciales hardcodeadas
- [ ] El sistema cumple con HIPAA
- [ ] El sistema cumple con FDA 21 CFR Part 11

---

## 🎓 Conceptos Clave

### isAuthenticated
- **Tipo:** Boolean
- **Ubicación:** Estado de React en App.tsx
- **Función:** Controla si el usuario está autenticado
- **Valores:** 
  - \`true\` = Acceso concedido (sin login)
  - \`false\` = Requiere autenticación

### authView
- **Tipo:** String
- **Valores posibles:**
  - \`'login'\` = Pantalla de inicio de sesión
  - \`'mfa'\` = Verificación de autenticación multifactor
  - \`'recovery'\` = Recuperación de contraseña
  - \`'onboarding'\` = Registro de nuevo usuario
  - \`'registration-success'\` = Confirmación de registro

### currentUserId
- **Tipo:** String | null
- **Función:** Almacena el ID del usuario actual
- **Uso:** Identificación y permisos

---

## 🔄 Historial de Cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-01-14 | 1.0 | Creación del documento |
| 2025-01-14 | 1.1 | Agregado diagrama de flujo |
| 2025-01-14 | 1.2 | Agregados usuarios de prueba |

---

**Última actualización:** 14 de enero de 2025  
**Autor:** Sistema ePrescription  
**Categoría:** Manual de Usuario  
**Nivel:** Básico  
**Tiempo de lectura:** ~10 minutos

---

## 💡 Tip Final

Para desarrollo ágil, puedes crear dos archivos de configuración:

\`\`\`typescript
// config.dev.ts
export const AUTH_CONFIG = {
  requireLogin: false
};

// config.prod.ts
export const AUTH_CONFIG = {
  requireLogin: true
};
\`\`\`

Y luego importar según el entorno. Esto evita modificar App.tsx repetidamente.

---

**¿Listo para empezar?** Sigue los pasos de la Opción 1 o 2 según tu necesidad. ¡Es muy fácil!
`;

const POLITICAS_ROLES_CONTENT = `# 📋 Políticas de Restricción de Roles Personalizados

## 🎯 Resumen Ejecutivo

El sistema ePrescription implementa un **modelo de roles personalizados con asignación específica por usuario**, basado en principios de seguridad de HIPAA, FDA 21 CFR Part 11 y estándares HL7 FHIR.

**Estado actual:**
- ✅ 3 roles personalizados creados
- ⚠️ Problema: Roles NO se muestran al editar otros usuarios
- 🔍 Causa: Filtrado restrictivo basado en \`userId\`

---

## 📊 Roles Personalizados Actuales

### 1. Admin Respaldo TI
\`\`\`typescript
ID: CUSTOM-001
Usuario asignado: USR-0042 (Carlos Rojas Méndez)
Basado en: Administrador (ROLE-001)
Permisos removidos:
  - users.delete (No puede eliminar usuarios)
  - system.restore (No puede restaurar sistema)
Justificación: "Administrador de soporte técnico nivel 2. No requiere 
                acceso a funciones críticas de eliminación"
Estado: Activo, Permanente
\`\`\`

### 2. Médico Jefe ER
\`\`\`typescript
ID: CUSTOM-002
Usuario asignado: USR-0089 (Dra. Ana Vargas Solís)
Basado en: Médico Jefe (ROLE-004)
Permisos agregados:
  - clinical_alerts.override (Puede anular alertas críticas)
Justificación: "Médico jefe de sala de emergencias requiere capacidad 
                de anular alertas en situaciones de vida o muerte"
Estado: Activo, Permanente
Requiere aprobación: SÍ (Aprobado por Director Médico)
\`\`\`

### 3. Farmacéutico Investigador
\`\`\`typescript
ID: CUSTOM-003
Usuario asignado: USR-0123 (Lic. Marco Solís Castro)
Basado en: Farmacéutico (ROLE-003)
Permisos agregados:
  - reports.export (Exportar reportes completos)
  - interoperability.export (Exportar datos FHIR)
Permisos removidos:
  - prescriptions.dispense (No dispensa medicamentos)
  - inventory.adjust (No ajusta inventario)
Justificación: "Farmacéutico de investigación clínica. No dispensa 
                pero requiere exportación para estudios"
Estado: Activo, Temporal (hasta 2025-12-31)
Requiere aprobación: SÍ (Aprobado por Director de Investigación)
\`\`\`

---

## 🔐 Modelo de Seguridad Actual

### Arquitectura: **Asignación Específica por Usuario**

\`\`\`
┌─────────────────────────────────────────────────────┐
│         ROLES BASE (Predefinidos, Inmutables)       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │Administrador│  │   Médico    │  │Farmacéutico ││
│  │  (ROLE-001) │  │  (ROLE-002) │  │  (ROLE-003) ││
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘│
│         │                │                │        │
└─────────┼────────────────┼────────────────┼────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────┐
│      ROLES PERSONALIZADOS (Derivados + Específicos) │
│  ┌──────────────────────────────────────────────┐  │
│  │ Admin Respaldo TI (CUSTOM-001)               │  │
│  │ ├─ Basado en: Administrador                  │  │
│  │ ├─ Usuario: USR-0042 (Carlos Rojas)          │  │
│  │ └─ Permisos: Base - {delete, restore}        │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Médico Jefe ER (CUSTOM-002)                  │  │
│  │ ├─ Basado en: Médico Jefe                    │  │
│  │ ├─ Usuario: USR-0089 (Dra. Ana Vargas)       │  │
│  │ └─ Permisos: Base + {override alerts}        │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Farmacéutico Investigador (CUSTOM-003)       │  │
│  │ ├─ Basado en: Farmacéutico                   │  │
│  │ ├─ Usuario: USR-0123 (Marco Solís)           │  │
│  │ └─ Permisos: Base + {export} - {dispense}    │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
\`\`\`

**Característica clave:** Cada rol personalizado tiene un \`userId\` específico.

---

## 🚀 Tres Opciones de Implementación

### Opción A: **Mantener Modelo Actual (Exclusivo)**

**Política:** Roles personalizados son SIEMPRE específicos de un usuario.

✅ **Pros:**
- Cumplimiento total de regulaciones
- Máxima seguridad
- No requiere cambios de código

❌ **Contras:**
- Requiere crear rol nuevo para cada usuario
- Más trabajo administrativo

---

### Opción B: **Migrar a Compartido**

**Política:** Roles personalizados pueden asignarse a múltiples usuarios.

✅ **Pros:**
- Roles reutilizables
- Menos duplicación
- Gestión más simple

❌ **Contras:**
- Requiere refactorización significativa
- Puede NO cumplir FDA 21 CFR Part 11 estrictamente
- Auditoría menos granular

---

### Opción C: **Modelo Híbrido** ⭐ **RECOMENDADO**

**Política:** Roles críticos son exclusivos, roles no críticos son compartibles.

✅ **Pros:**
- Mejor de ambos mundos
- Cumplimiento regulatorio para lo crítico
- Flexibilidad para lo no crítico
- Escalable y mantenible

⚠️ **Contras:**
- Requiere refactorización moderada
- Lógica más compleja
- Necesita documentación clara

---

## 📚 Fundamentos Legales y Estándares

### 1. **HIPAA** (Health Insurance Portability and Accountability Act)
- **Principio:** Minimum Necessary Rule
- **Referencia:** 45 CFR § 164.514(d)(3)
- ✅ Aplicación: Roles personalizados específicos por usuario

### 2. **FDA 21 CFR Part 11** (Electronic Records; Electronic Signatures)
- **Principio:** Individual Accountability
- **Referencia:** 21 CFR § 11.10 y 21 CFR § 11.300
- ✅ Aplicación: Asignación 1:1 (Usuario → Rol Personalizado)

### 3. **HL7 FHIR Security**
- **Estándar:** SMART on FHIR Authorization
- ✅ Aplicación: Roles personalizados con etiquetas únicas (security labels)

### 4. **ISO 27001** (Information Security Management)
- **Control:** A.9.2.3 Management of privileged access rights
- ✅ Aplicación: Asignación individual de privilegios especiales

### 5. **NIST 800-53** (Security and Privacy Controls)
- **Control:** AC-2 Account Management
- ✅ Aplicación: Roles base + roles derivados con revisión periódica

---

## 🎯 Recomendación Final

**Implementar Modelo C (Híbrido)** para:

**ROLES CRÍTICOS (exclusivos):**
- clinical_alerts.override
- users.delete
- system.restore
- patients.delete
- prescriptions.delete
- audit.configure

**ROLES NO CRÍTICOS (compartidos):**
- reports.export
- interoperability.export
- prescriptions.update
- inventory.read (ampliado)

---

## 📞 Decisión Requerida

**¿Qué modelo prefieres implementar?**

- **A** - Mantener actual (exclusivo siempre)
- **B** - Migrar a compartido (siempre reutilizable)
- **C** - Híbrido (críticos exclusivos, normales compartidos) ⭐

**Tiempo estimado de implementación (Modelo C):** ~12 horas

---

**Fecha:** 2025-10-10  
**Versión:** 1.0  
**Autor:** Sistema ePrescription  
**Referencias:** HIPAA, FDA 21 CFR Part 11, HL7 FHIR R4, ISO 27001, NIST 800-53
`;

export function DocumentacionPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(POLITICAS_ROLES_CONTENT);
    setCopied(true);
    toast.success("Documentación copiada al portapapeles");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadAsMarkdown = () => {
    const blob = new Blob([POLITICAS_ROLES_CONTENT], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'POLITICAS_ROLES_PERSONALIZADOS.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Descarga iniciada");
  };

  const handleDownloadAsTxt = () => {
    const blob = new Blob([POLITICAS_ROLES_CONTENT], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'POLITICAS_ROLES_PERSONALIZADOS.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Descarga iniciada");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          Centro de Documentación
        </h1>
        <p className="text-muted-foreground mt-2">
          Documentación técnica y políticas del sistema ePrescription
        </p>
      </div>

      {/* Tabs de documentos */}
      <Tabs defaultValue="user-manuals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user-manuals">
            <BookOpen className="w-4 h-4 mr-2" />
            Manuales de Usuario
          </TabsTrigger>
          <TabsTrigger value="login-manual">
            <FileText className="w-4 h-4 mr-2" />
            Manual de Login
          </TabsTrigger>
          <TabsTrigger value="roles-policies">
            <FileText className="w-4 h-4 mr-2" />
            Políticas de Roles
          </TabsTrigger>
        </TabsList>

        {/* Tab 0: Manuales de Usuario */}
        <TabsContent value="user-manuals" className="space-y-6 mt-6">
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="bg-blue-100/50">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Manuales de Usuario - Sistema ePrescription
              </CardTitle>
              <CardDescription className="mt-2">
                Documentación completa organizada por módulos para usuarios finales.
                Incluye guías paso a paso, casos de uso prácticos y mejores prácticas.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Índice General */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      📚 Índice General
                      <Badge variant="outline" className="ml-auto bg-green-100 text-green-700">Inicio aquí</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      Documento maestro con navegación completa a todos los módulos del sistema.
                      Ideal para nuevos usuarios.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => window.open('https://raw.githubusercontent.com/user/repo/main/docs/INDICE_GENERAL_USUARIO.md', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir Índice General
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/docs/INDICE_GENERAL_USUARIO.md';
                          link.download = 'INDICE_GENERAL_USUARIO.md';
                          link.click();
                          toast.success('Descarga iniciada');
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Manuales por Módulo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Módulo 1: Dashboard */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        📊 Módulo 1: Dashboard
                        <Badge variant="outline" className="ml-auto text-xs">Todos</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Navegación, KPIs, acciones rápidas y selector multi-rol
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/docs/MANUAL_01_DASHBOARD.md';
                          link.download = 'MANUAL_01_DASHBOARD.md';
                          link.click();
                          toast.success('Descargando manual...');
                        }}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Descargar Manual
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 2: Prescripciones */}
                  <Card className="hover:shadow-md transition-shadow border-green-200">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        💊 Módulo 2: Prescripciones
                        <Badge variant="default" className="ml-auto text-xs bg-green-600">Disponible</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Crear recetas, borradores, emisión y gestión completa
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/docs/MANUAL_02_PRESCRIPCIONES.md';
                          link.download = 'MANUAL_02_PRESCRIPCIONES.md';
                          link.click();
                          toast.success('Descargando manual...');
                        }}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Descargar Manual
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 3: Dispensación */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        🏥 Módulo 3: Dispensación
                        <Badge variant="outline" className="ml-auto text-xs">Farmacia</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Verificar recetas, registrar dispensación y rechazos
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/docs/MANUAL_03_DISPENSACION.md';
                          link.download = 'MANUAL_03_DISPENSACION.md';
                          link.click();
                          toast.success('Descargando manual...');
                        }}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Descargar Manual
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 4: Pacientes */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        👥 Módulo 4: Pacientes
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Gestión de pacientes, perfiles y historial médico
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 5: Médicos */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        👨‍⚕️ Módulo 5: Médicos
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Directorio de médicos, estadísticas y gestión
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 6: Inventario */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        📦 Módulo 6: Inventario
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Stock, lotes, vencimientos y farmacias
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 7: Talonarios */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        📋 Módulo 7: Talonarios
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Comprar talonarios y gestionar numeración
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 8: Alertas Clínicas */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        ⚠️ Módulo 8: Alertas Clínicas
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Interacciones, alergias y reglas de alertas
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 9: Firma Digital */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        ✍️ Módulo 9: Firma Digital
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Firmar recetas, QR y verificación
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 10: Reportes */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        📈 Módulo 10: Reportes
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Actividad médica, farmacia y exportaciones
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 11: Interoperabilidad */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        🔗 Módulo 11: Interoperabilidad
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        FHIR, HL7 y exportación de datos
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 12: Seguridad */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        🔐 Módulo 12: Seguridad
                        <Badge variant="outline" className="ml-auto text-xs">Admin</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Usuarios, roles, permisos y sesiones
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 13: Auditoría */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        📝 Módulo 13: Auditoría
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Logs, trazabilidad y cumplimiento
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 14: Catálogos */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        📚 Módulo 14: Catálogos
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Medicamentos, vías, especialidades
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 15: Configuración */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        ⚙️ Módulo 15: Configuración
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Políticas, parámetros y numeración
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 16: Notificaciones */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        🔔 Módulo 16: Notificaciones
                        <Badge variant="outline" className="ml-auto text-xs">Próximamente</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Crear, programar y gestionar notificaciones
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 17: Mi Perfil */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        👤 Módulo 17: Mi Perfil
                        <Badge variant="outline" className="ml-auto text-xs">Todos</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Información personal, foto y preferencias
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 18: Autoservicio */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        🛠️ Módulo 18: Autoservicio
                        <Badge variant="outline" className="ml-auto text-xs">Todos</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Cambiar contraseña, actualizar datos y mensajería
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Módulo 19: Centro de Ayuda */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        💬 Módulo 19: Centro de Ayuda
                        <Badge variant="outline" className="ml-auto text-xs">Todos</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        FAQ, tutoriales, soporte y chat en vivo
                      </p>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <FileText className="w-4 h-4 mr-2" />
                        En desarrollo
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Información adicional */}
                <Card className="border-purple-200 bg-purple-50/30 mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">📖 Sobre los Manuales de Usuario</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Organizados por módulos</p>
                        <p className="text-muted-foreground">Cada manual cubre un área específica del sistema</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Guías paso a paso</p>
                        <p className="text-muted-foreground">Instrucciones detalladas con ejemplos prácticos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Casos de uso reales</p>
                        <p className="text-muted-foreground">Escenarios del día a día con soluciones</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Filtrado por rol</p>
                        <p className="text-muted-foreground">Vea solo lo relevante para su función</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 1: Manual de Login */}
        <TabsContent value="login-manual" className="space-y-6 mt-6">
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader className="bg-green-100/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Manual de Usuario - Sistema de Autenticación
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Guía completa para activar y desactivar la pantalla de login.
                    Incluye instrucciones paso a paso, usuarios de prueba y mejores prácticas de seguridad.
                  </CardDescription>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Versión 1.2
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      14 Enero 2025
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      ~10 min lectura
                    </Badge>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Manual de Usuario
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">
                    <FileText className="w-4 h-4 mr-2" />
                    Vista Previa
                  </TabsTrigger>
                  <TabsTrigger value="metadata">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Información
                  </TabsTrigger>
                  <TabsTrigger value="download">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </TabsTrigger>
                </TabsList>

                {/* Preview */}
                <TabsContent value="preview" className="space-y-4">
                  <ScrollArea className="h-[600px] w-full rounded-md border p-6">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {MANUAL_LOGIN_CONTENT}
                      </pre>
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Metadata */}
                <TabsContent value="metadata" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Información del Documento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Nombre del archivo</p>
                          <p className="font-mono">MANUAL_LOGIN_AUTENTICACION.md</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tamaño</p>
                          <p>{(MANUAL_LOGIN_CONTENT.length / 1024).toFixed(2)} KB</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Formato</p>
                          <p>Markdown (.md)</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Líneas</p>
                          <p>{MANUAL_LOGIN_CONTENT.split('\n').length}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Contenido incluye:</p>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Guía rápida para activar/desactivar login
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Instrucciones paso a paso con código
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Usuarios de prueba del sistema
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Casos de uso comunes (desarrollo vs producción)
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Diagrama de flujo de autenticación
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Advertencias de seguridad y mejores prácticas
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Checklist de verificación para producción
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Configuración avanzada de usuarios
                          </li>
                        </ul>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Temas cubiertos:</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Autenticación</Badge>
                          <Badge variant="outline">Configuración</Badge>
                          <Badge variant="outline">Seguridad</Badge>
                          <Badge variant="outline">Desarrollo</Badge>
                          <Badge variant="outline">Producción</Badge>
                          <Badge variant="outline">Usuarios de prueba</Badge>
                          <Badge variant="outline">HIPAA</Badge>
                          <Badge variant="outline">FDA 21 CFR Part 11</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Download */}
                <TabsContent value="download" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Opciones de Descarga</CardTitle>
                      <CardDescription>
                        Descarga el manual en el formato que prefieras
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={() => {
                          const blob = new Blob([MANUAL_LOGIN_CONTENT], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'MANUAL_LOGIN_AUTENTICACION.md';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          toast.success("Descarga iniciada");
                        }}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar como Markdown (.md)
                        <Badge variant="secondary" className="ml-auto">Recomendado</Badge>
                      </Button>

                      <Button 
                        onClick={() => {
                          const blob = new Blob([MANUAL_LOGIN_CONTENT], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'MANUAL_LOGIN_AUTENTICACION.txt';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          toast.success("Descarga iniciada");
                        }}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar como Texto Plano (.txt)
                      </Button>

                      <Button 
                        onClick={() => {
                          navigator.clipboard.writeText(MANUAL_LOGIN_CONTENT);
                          toast.success("Manual copiado al portapapeles");
                        }}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar al portapapeles
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Inicio Rápido
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">
                        <strong>Para desactivar el login ahora mismo:</strong>
                      </p>
                      <ol className="text-sm space-y-2 list-decimal list-inside">
                        <li>Abre el archivo <code className="bg-gray-100 px-1 py-0.5 rounded">/App.tsx</code></li>
                        <li>Busca la línea 23 aproximadamente</li>
                        <li>Cambia <code className="bg-gray-100 px-1 py-0.5 rounded">useState(false)</code> a <code className="bg-green-100 px-1 py-0.5 rounded">useState(true)</code></li>
                        <li>Guarda el archivo</li>
                        <li>Recarga el navegador</li>
                      </ol>
                      <p className="text-sm mt-3 text-muted-foreground">
                        ✅ ¡Accederás directamente al dashboard sin login!
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Políticas de Roles */}
        <TabsContent value="roles-policies" className="space-y-6 mt-6">
          <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Políticas de Restricción de Roles Personalizados
                </CardTitle>
                <CardDescription className="mt-2">
                  Documento técnico completo sobre el sistema de roles personalizados,
                  fundamentos legales (HIPAA, FDA, FHIR) y opciones de implementación.
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Versión 1.0
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    2025-10-10
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    ~15 min lectura
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">
                  <FileText className="w-4 h-4 mr-2" />
                  Vista Previa
                </TabsTrigger>
                <TabsTrigger value="metadata">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Información
                </TabsTrigger>
                <TabsTrigger value="download">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </TabsTrigger>
              </TabsList>

              {/* Preview */}
              <TabsContent value="preview" className="space-y-4">
                <ScrollArea className="h-[600px] w-full rounded-md border p-6">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                      {POLITICAS_ROLES_CONTENT}
                    </pre>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Metadata */}
              <TabsContent value="metadata" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información del Documento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nombre del archivo</p>
                        <p className="font-mono">POLITICAS_ROLES_PERSONALIZADOS.md</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tamaño</p>
                        <p>{(POLITICAS_ROLES_CONTENT.length / 1024).toFixed(2)} KB</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Formato</p>
                        <p>Markdown (.md)</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Líneas</p>
                        <p>{POLITICAS_ROLES_CONTENT.split('\n').length}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Contenido incluye:</p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Resumen ejecutivo del problema actual
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Descripción de los 3 roles personalizados existentes
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Modelo de seguridad actual (diagrama)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          3 opciones de implementación (A, B, C)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Fundamentos legales (HIPAA, FDA, FHIR, ISO, NIST)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Matriz de comparación de modelos
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Plan de implementación detallado
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Recomendación final con justificación
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Referencias normativas:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">HIPAA</Badge>
                        <Badge variant="outline">FDA 21 CFR Part 11</Badge>
                        <Badge variant="outline">HL7 FHIR R4</Badge>
                        <Badge variant="outline">ISO 27001</Badge>
                        <Badge variant="outline">NIST 800-53</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Download */}
              <TabsContent value="download" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Opciones de Descarga</CardTitle>
                    <CardDescription>
                      Descarga el documento en el formato que prefieras
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={handleDownloadAsMarkdown}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar como Markdown (.md)
                      <Badge variant="secondary" className="ml-auto">Recomendado</Badge>
                    </Button>

                    <Button 
                      onClick={handleDownloadAsTxt}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar como Texto Plano (.txt)
                    </Button>

                    <Button 
                      onClick={handleCopyToClipboard}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copied ? "¡Copiado!" : "Copiar al portapapeles"}
                    </Button>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-3">
                        💡 <strong>Ubicación del archivo original:</strong>
                      </p>
                      <code className="block bg-muted p-3 rounded text-sm font-mono">
                        /POLITICAS_ROLES_PERSONALIZADOS.md
                      </code>
                      <p className="text-sm text-muted-foreground mt-2">
                        El archivo también está disponible en la raíz del proyecto.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Visualizador Externo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Para mejor visualización del formato Markdown, puedes:
                    </p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Abrir el archivo en <strong>Visual Studio Code</strong> con preview (Ctrl+Shift+V)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Usar herramientas online como <strong>Dillinger.io</strong> o <strong>StackEdit.io</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Visualizar en GitHub/GitLab después de hacer commit</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Otros documentos disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Guía de Sistema Híbrido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Implementación completa del sistema de roles híbrido.
              </p>
              <Badge variant="outline">Disponible en proyecto</Badge>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Tutorial Multi-Rol
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Guía paso a paso del sistema multi-rol dinámico.
              </p>
              <Badge variant="outline">Disponible en proyecto</Badge>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Guía de Autenticación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Documentación del sistema de autenticación y MFA.
              </p>
              <Badge variant="outline">Disponible en proyecto</Badge>
            </CardContent>
          </Card>
        </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
