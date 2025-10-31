# 📚 Manual de Usuario - ePrescription

## Sistema Hospitalario de Prescripción Médica Electrónica

**Versión:** 1.0.0  
**Fecha:** Octubre 2025  
**Público objetivo:** Usuarios finales (Médicos, Farmacéuticos, Enfermeras, Administradores)

---

## 🎯 Bienvenida

Bienvenido al sistema **ePrescription**, una plataforma profesional de prescripción médica electrónica diseñada específicamente para el sector salud. Este manual le guiará paso a paso en el uso de todas las funcionalidades del sistema.

### ¿Qué es ePrescription?

ePrescription es un sistema hospitalario integral que permite:
- ✅ Prescribir medicamentos de forma digital y segura
- ✅ Dispensar recetas con verificación automática
- ✅ Gestionar pacientes y su historial médico
- ✅ Controlar inventarios de farmacia
- ✅ Generar reportes y analítica médica
- ✅ Garantizar cumplimiento normativo (HIPAA, FDA 21 CFR Part 11, HL7, FHIR)

---

## 📖 Estructura de este Manual

Este manual está organizado en **módulos independientes** que puede consultar según su necesidad. Cada módulo contiene:

- 📋 Descripción general del módulo
- 🎯 Para quién está diseñado (roles)
- 📝 Guías paso a paso con ejemplos
- 💡 Consejos y mejores prácticas
- ⚠️ Advertencias importantes
- 🔗 Enlaces a módulos relacionados

---

## 🗂️ Módulos del Sistema

### **1. Dashboard y Navegación** 📊
[Manual Dashboard](./MANUAL_01_DASHBOARD.md)

**¿Qué encontrarás?**
- Primeros pasos en el sistema
- Entender el panel de inicio
- Navegación por el menú
- Selector de roles (multi-rol)
- Accesos rápidos
- KPIs según tu rol

**Roles:** Todos los usuarios

---

### **2. Prescripciones Médicas** 💊
[Manual Prescripciones](./MANUAL_02_PRESCRIPCIONES.md)

**¿Qué encontrarás?**
- Crear una receta nueva
- Seleccionar paciente
- Agregar medicamentos
- Configurar dosis y frecuencia
- Guardar borradores
- Emitir recetas
- Buscar recetas emitidas
- Duplicar recetas
- Gestionar centros médicos

**Roles:** Médicos, Médicos Jefes

**Páginas incluidas:**
- Nueva receta
- Mis borradores
- Recetas emitidas
- Buscar receta
- Duplicar receta
- Centros médicos

---

### **3. Dispensación de Medicamentos** 🏥
[Manual Dispensación](./MANUAL_03_DISPENSACION.md)

**¿Qué encontrarás?**
- Verificar receta por código QR
- Verificar receta por número
- Validar firma digital
- Registrar dispensación
- Marcar medicamentos entregados
- Gestionar rechazos
- Motivos de rechazo

**Roles:** Farmacéuticos, Técnicos de Farmacia

**Páginas incluidas:**
- Verificar receta
- Registrar dispensación
- Rechazos y motivos

---

### **4. Gestión de Pacientes** 👥
[Manual Pacientes](./MANUAL_04_PACIENTES.md)

**¿Qué encontrarás?**
- Ver listado de pacientes
- Buscar y filtrar pacientes
- Ver perfil completo del paciente
- Historial médico
- Recetas del paciente
- Alergias y condiciones crónicas
- Contactar al paciente
- Crear receta desde perfil

**Roles:** Médicos, Farmacéuticos, Enfermeras

**Páginas incluidas:**
- Listado de pacientes
- Perfil del paciente
- Recetas del paciente

---

### **5. Directorio de Médicos** 👨‍⚕️
[Manual Médicos](./MANUAL_05_MEDICOS.md)

**¿Qué encontrarás?**
- Ver listado de médicos
- Buscar médicos por especialidad
- Ver perfil del médico
- Estadísticas de prescripción
- Dar de alta nuevo médico
- Editar información del médico
- Ver recetas por médico

**Roles:** Administradores, Médicos Jefes

**Páginas incluidas:**
- Listado de médicos
- Alta/Edición de médico

---

### **6. Farmacia e Inventario** 📦
[Manual Farmacia Inventario](./MANUAL_06_FARMACIA_INVENTARIO.md)

**¿Qué encontrarás?**
- Consultar stock de medicamentos
- Alertas de stock bajo
- Realizar ajustes de inventario
- Gestionar lotes y vencimientos
- Ver farmacias registradas
- Consulta de inventario multi-farmacia
- Solicitar reposición

**Roles:** Farmacéuticos, Administradores

**Páginas incluidas:**
- Stock de medicamentos
- Alertas de stock bajo
- Ajustes de stock
- Lotes y vencimientos
- Farmacias registradas
- Consulta de inventario

---

### **7. Talonarios de Recetas** 📋
[Manual Talonarios](./MANUAL_07_TALONARIOS.md)

**¿Qué encontrarás?**
- Comprar talonarios
- Ver mis talonarios
- Estado de talonarios (activos, agotados)
- Numeración de recetas
- Solicitar nuevos talonarios

**Roles:** Médicos, Administradores

**Páginas incluidas:**
- Comprar talonarios
- Mis talonarios

---

### **8. Alertas Clínicas** ⚠️
[Manual Alertas Clinicas](./MANUAL_08_ALERTAS_CLINICAS.md)

**¿Qué encontrarás?**
- Bandeja de alertas
- Tipos de alertas (interacciones, alergias, contraindicaciones)
- Reglas de alertas
- Base de datos de interacciones
- Historial de interacciones detectadas
- Configurar alertas

**Roles:** Médicos, Farmacéuticos, Administradores

**Páginas incluidas:**
- Bandeja de alertas
- Reglas e interacciones
- Tipos de alertas
- Historial de interacciones

---

### **9. Firma y Verificación Digital** ✍️
[Manual Firma Verificacion](./MANUAL_09_FIRMA_VERIFICACION.md)

**¿Qué encontrarás?**
- Firmar receta digitalmente
- Generar código QR
- Verificar QR/Token
- Trazabilidad de firmas
- Certificados digitales
- Cumplimiento FDA 21 CFR Part 11

**Roles:** Médicos, Farmacéuticos, Auditores

**Páginas incluidas:**
- Firmar receta
- Generar/Ver QR
- Verificación de QR/Token
- Trazabilidad de firmas

---

### **10. Reportes y Analítica** 📈
[Manual Reportes](./MANUAL_10_REPORTES.md)

**¿Qué encontrarás?**
- Actividad por médico
- Actividad de farmacia
- Medicamentos más prescritos
- Estadísticas de dispensación
- Exportar reportes (PDF, Excel, CSV)
- Reportes programados

**Roles:** Administradores, Médicos Jefes, Directores de Farmacia

**Páginas incluidas:**
- Actividad por médico
- Actividad de farmacia
- Exportaciones

---

### **11. Interoperabilidad** 🔗
[Manual Interoperabilidad](./MANUAL_11_INTEROPERABILIDAD.md)

**¿Qué encontrarás?**
- IDs FHIR (identificadores estándar)
- Exportar receta en formato FHIR
- Importar datos externos
- Eventos HL7
- Integración con sistemas externos
- APIs REST

**Roles:** Administradores, Integradores TI

**Páginas incluidas:**
- IDs FHIR
- Exportar receta (FHIR)
- Importar datos externos
- Registro HL7 eventos

---

### **12. Seguridad y Usuarios** 🔐
[Manual Seguridad Usuarios](./MANUAL_12_SEGURIDAD_USUARIOS.md)

**¿Qué encontrarás?**
- Gestión de usuarios
- Roles y permisos
- Parámetros de seguridad
- Bloqueos/Desbloqueos
- Sesiones de usuario
- Registro de nuevos usuarios
- Aprobación de usuarios
- Mis sesiones activas
- Autenticación de dos factores (2FA)

**Roles:** Administradores

**Páginas incluidas:**
- Usuarios
- Roles y permisos
- Parámetros de seguridad
- Bloqueos/Desbloqueos
- Sesiones de usuario
- Registro de usuarios
- Aprobación de usuarios
- Mis sesiones

---

### **13. Auditoría y Cumplimiento** 📝
[Manual Auditoria](./MANUAL_13_AUDITORIA.md)

**¿Qué encontrarás?**
- Log de auditoría
- Rastrear acciones de usuarios
- Buscar eventos
- Exportar logs
- Cumplimiento HIPAA
- Cumplimiento FDA 21 CFR Part 11
- Reportes de auditoría

**Roles:** Auditores, Administradores

**Páginas incluidas:**
- Log auditoría

---

### **14. Catálogos Clínicos** 📚
[Manual Catalogos](./MANUAL_14_CATALOGOS.md)

**¿Qué encontrarás?**
- Catálogo de medicamentos
- Vías de administración
- Especialidades médicas
- Unidades médicas
- Interacciones medicamentosas
- Tipos de alertas
- Países

**Roles:** Administradores, Directores Médicos

**Páginas incluidas:**
- Medicamentos
- Vías de administración
- Especialidades
- Unidades médicas
- Interacciones
- Tipos de alertas
- Países

---

### **15. Configuración del Sistema** ⚙️
[Manual Configuracion](./MANUAL_15_CONFIGURACION.md)

**¿Qué encontrarás?**
- Políticas de recetas
- Catálogos auxiliares
- Numeración de recetas
- Configuración general
- Parámetros del sistema

**Roles:** Administradores

**Páginas incluidas:**
- Políticas de recetas
- Catálogos auxiliares
- Numeración de recetas

---

### **16. Sistema de Notificaciones** 🔔
[Manual Notificaciones](./MANUAL_16_NOTIFICACIONES.md)

**¿Qué encontrarás?**
- Ver notificaciones
- Crear notificación
- Notificaciones programadas
- Plantillas de notificaciones
- Notificaciones por rol
- Marcar como leída
- Archivar notificaciones

**Roles:** Todos los usuarios (ver), Administradores (crear)

**Páginas incluidas:**
- Listado de notificaciones
- Nueva notificación
- Editar notificación

---

### **17. Mi Perfil** 👤
[Manual Mi Perfil](./MANUAL_17_MI_PERFIL.md)

**¿Qué encontrarás?**
- Ver mi información personal
- Actualizar datos de contacto
- Cambiar contraseña
- Subir foto de perfil
- Habilitar 2FA
- Ver sesiones activas
- Configurar preferencias

**Roles:** Todos los usuarios

**Páginas incluidas:**
- Mi perfil

---

### **18. Autoservicio del Usuario** 🛠️
[Manual Autoservicio](./MANUAL_18_AUTOSERVICIO.md)

**¿Qué encontrarás?**
- Cambiar mi contraseña
- Actualizar mis datos
- Mensajería con administración
- Solicitudes y tickets
- Historial de cambios

**Roles:** Todos los usuarios

**Páginas incluidas:**
- Autoservicio

---

### **19. Centro de Ayuda y Soporte** 💬
[Manual Centro Ayuda](./MANUAL_19_CENTRO_AYUDA.md)

**¿Qué encontrarás?**
- Preguntas frecuentes (FAQ)
- Tutoriales paso a paso
- Videos instructivos
- Base de conocimiento
- Contactar soporte
- Reportar un problema
- Chat en vivo

**Roles:** Todos los usuarios

**Páginas incluidas:**
- Centro de ayuda

---

## 🎭 Roles y Permisos

### Roles del Sistema

El sistema ePrescription maneja los siguientes roles principales:

| Rol | Descripción | Acceso Principal |
|-----|-------------|------------------|
| **Administrador** | Control total del sistema | Todos los módulos |
| **Médico** | Prescripción de medicamentos | Prescripciones, Pacientes, Alertas |
| **Médico Jefe** | Médico + supervisión | Prescripciones, Reportes, Médicos |
| **Farmacéutico** | Dispensación de medicamentos | Dispensación, Inventario, Verificación |
| **Técnico Farmacia** | Asistente de farmacia | Dispensación, Consulta Inventario |
| **Enfermera** | Consulta de información | Pacientes, Recetas (solo lectura) |
| **Auditor** | Revisión y compliance | Auditoría, Reportes, Firma Digital |
| **Director Médico** | Dirección y estrategia | Reportes, Catálogos, Configuración |

### Sistema Multi-Rol

ePrescription soporta **múltiples roles por usuario**. Por ejemplo:
- Un usuario puede ser Médico + Médico Jefe
- Puede alternar entre roles usando el **selector "Ver como:"**
- El sistema ajusta automáticamente los permisos y vistas según el rol activo

---

## 🚀 Primeros Pasos

### 1. Iniciar Sesión

1. Abrir el navegador web
2. Ingresar a la URL del sistema
3. Introducir usuario y contraseña
4. Si tiene 2FA habilitado, ingresar código
5. Seleccionar rol (si tiene múltiples roles)

### 2. Navegar por el Dashboard

- **Sidebar izquierdo:** Menú principal con todos los módulos
- **Header superior:** Búsqueda rápida, notificaciones, perfil de usuario
- **Área central:** Contenido de la página actual
- **Breadcrumbs:** Ruta de navegación (parte superior)

### 3. Cambiar de Rol (Multi-Rol)

Si tiene múltiples roles asignados:
1. En el Dashboard, buscar el selector **"Ver como:"**
2. Click en el rol actual
3. Seleccionar el nuevo rol
4. El sistema recarga mostrando KPIs y opciones del nuevo rol

### 4. Acceder a Ayuda

Desde cualquier página:
- Click en **"Centro de ayuda"** en el menú
- O presionar **F1** (atajo de teclado)
- O click en el ícono **❓** en el header

---

## 🔍 Cómo Usar este Manual

### Búsqueda Rápida

**¿Necesitas saber cómo hacer algo específico?**

1. **Por módulo:** Ve al índice arriba y selecciona el módulo
2. **Por tarea:** Usa Ctrl+F y busca palabras clave
3. **Por rol:** Busca tu rol en la sección "Roles y Permisos"

### Convenciones de Documentación

Este manual usa los siguientes símbolos:

- 📋 **Descripción:** Información general
- 🎯 **Objetivo:** Para qué sirve la función
- 📝 **Paso a paso:** Instrucciones detalladas
- 💡 **Consejo:** Recomendación o mejor práctica
- ⚠️ **Advertencia:** Precaución importante
- ✅ **Resultado:** Lo que debería ver después de completar
- 🔗 **Relacionado:** Enlaces a otros módulos
- 🎭 **Rol requerido:** Permisos necesarios

### Ejemplos de Escenarios

Cada manual incluye **casos de uso reales**:
- ✅ "El Dr. Juan quiere prescribir un medicamento"
- ✅ "La farmacéutica Ana necesita verificar una receta"
- ✅ "El administrador debe dar de alta un nuevo médico"

---

## 📞 Soporte y Contacto

### ¿Necesitas Ayuda?

**Dentro del sistema:**
- Centro de Ayuda (menú principal)
- Chat en vivo (ícono 💬 en header)
- Notificaciones y anuncios

**Fuera del sistema:**
- Email: soporte@eprescription.hospital.com
- Teléfono: +506 2222-3333 (8am - 6pm)
- Tickets: https://soporte.eprescription.com

### Reportar un Problema

1. Ir a **Centro de Ayuda**
2. Click en **"Reportar un problema"**
3. Llenar el formulario con:
   - Descripción del problema
   - Pasos para reproducir
   - Capturas de pantalla (opcional)
4. Enviar
5. Recibirá número de ticket por email

---

## 📅 Actualizaciones del Sistema

Este manual se actualiza regularmente. Para ver las últimas novedades:

- **Versión actual:** 1.0.0 (Octubre 2025)
- **Última actualización:** 14 de Octubre 2025
- **Próxima actualización:** Noviembre 2025

### Historial de Cambios

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | Oct 2025 | Lanzamiento inicial |
| | | - Todos los módulos implementados |
| | | - Sistema multi-rol completo |
| | | - Cumplimiento normativo |

---

## 📚 Glosario de Términos

### Términos Médicos

- **Prescripción/Receta:** Documento médico que autoriza la dispensación de medicamentos
- **Dispensación:** Entrega de medicamentos al paciente
- **Interacción medicamentosa:** Efecto cuando dos medicamentos se combinan
- **Vía de administración:** Forma de tomar el medicamento (oral, intravenosa, etc.)
- **Posología:** Indicaciones de dosis y frecuencia

### Términos del Sistema

- **Dashboard:** Panel de inicio con resumen de información
- **KPI:** Indicador clave de desempeño (estadística importante)
- **Multi-rol:** Capacidad de tener varios roles y cambiar entre ellos
- **2FA/MFA:** Autenticación de dos factores (seguridad adicional)
- **QR:** Código de barras bidimensional para verificación
- **FHIR:** Estándar de interoperabilidad en salud
- **HL7:** Protocolo de comunicación entre sistemas médicos

---

## ✅ Checklist de Capacitación

### Para Nuevos Usuarios

Marque cuando complete cada módulo:

**Básico (Todos los roles):**
- [ ] Módulo 1: Dashboard y Navegación
- [ ] Módulo 17: Mi Perfil
- [ ] Módulo 18: Autoservicio
- [ ] Módulo 19: Centro de Ayuda

**Para Médicos:**
- [ ] Módulo 2: Prescripciones
- [ ] Módulo 4: Pacientes
- [ ] Módulo 7: Talonarios
- [ ] Módulo 8: Alertas Clínicas
- [ ] Módulo 9: Firma Digital

**Para Farmacéuticos:**
- [ ] Módulo 3: Dispensación
- [ ] Módulo 6: Farmacia e Inventario
- [ ] Módulo 8: Alertas Clínicas
- [ ] Módulo 9: Verificación

**Para Administradores:**
- [ ] Módulo 5: Médicos
- [ ] Módulo 10: Reportes
- [ ] Módulo 12: Seguridad y Usuarios
- [ ] Módulo 13: Auditoría
- [ ] Módulo 14: Catálogos
- [ ] Módulo 15: Configuración

---

## 🎓 Certificación de Usuarios

Al completar la capacitación en los módulos correspondientes a su rol, puede solicitar su certificación de usuario ePrescription.

**Beneficios:**
- ✅ Constancia oficial de capacitación
- ✅ Acceso a funcionalidades avanzadas
- ✅ Soporte prioritario

**Solicitar certificación:**
1. Completar todos los módulos de su rol
2. Pasar evaluación práctica
3. Contactar a capacitacion@eprescription.hospital.com

---

## 📖 Siguiente Paso

**Comience con el [Módulo 1: Dashboard y Navegación](./MANUAL_01_DASHBOARD.md)**

Este módulo le enseñará los fundamentos para navegar por todo el sistema.

---

## 📄 Información Legal

**ePrescription® - Sistema Hospitalario de Prescripción Médica Electrónica**

Copyright © 2025 Hospital General. Todos los derechos reservados.

**Cumplimiento normativo:**
- ✅ HIPAA (Health Insurance Portability and Accountability Act)
- ✅ FDA 21 CFR Part 11 (Electronic Records and Signatures)
- ✅ HL7 v2.x / FHIR R4 (Interoperabilidad)
- ✅ ISO 27001 (Seguridad de la información)
- ✅ NIST 800-63B (Autenticación digital)

Este sistema maneja información médica sensible (PHI - Protected Health Information) y debe ser utilizado de acuerdo con las políticas institucionales y regulaciones aplicables.

**Confidencialidad:** Toda información accedida a través de este sistema es confidencial y su uso no autorizado puede tener consecuencias legales.

---

**¡Bienvenido a ePrescription! Estamos aquí para ayudarle. 🏥💊**
