import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';

export type HelpCategory =
  | "prescripciones"
  | "dispensacion"
  | "pacientes"
  | "inventario"
  | "seguridad"
  | "reportes"
  | "firma-digital"
  | "interoperabilidad"
  | "alertas"
  | "configuracion"
  | "general";

export type ContentType = "faq" | "guide" | "tutorial" | "video" | "article";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: HelpCategory;
  tags: string[];
  popularity: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: HelpCategory;
  contentType: ContentType;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  author: string;
  views: number;
  helpful: number;
  notHelpful: number;
  relatedArticles: string[];
  steps?: Array<{
    title: string;
    description: string;
    imageUrl?: string;
  }>;
  videoUrl?: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}

export interface SearchResult {
  id: string;
  type: "faq" | "article";
  title: string;
  snippet: string;
  relevance: number;
  category: HelpCategory;
}

export interface FavoriteItem {
  id: string;
  type: "faq" | "article";
  title: string;
  category: HelpCategory;
  addedAt: string;
}

export interface RecentItem {
  id: string;
  type: "faq" | "article";
  title: string;
  category: HelpCategory;
  viewedAt: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  relatedTerms: string[];
  category: HelpCategory;
}

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
  level: "beginner" | "intermediate" | "advanced";
  views: number;
  tags: string[];
  youtubeId?: string;
}

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "pending" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  category?: HelpCategory;
  attachments?: string[];
}

export interface HelpStats {
  totalArticles: number;
  totalFAQs: number;
  totalGlossaryTerms: number;
  avgHelpfulRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private favoritesSubject = new BehaviorSubject<FavoriteItem[]>([]);
  private recentsSubject = new BehaviorSubject<RecentItem[]>([]);
  private supportMessagesSubject = new BehaviorSubject<SupportMessage[]>([]);

  public favorites$ = this.favoritesSubject.asObservable();
  public recents$ = this.recentsSubject.asObservable();
  public supportMessages$ = this.supportMessagesSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const favorites = localStorage.getItem('help-favorites');
    const recents = localStorage.getItem('help-recents');
    const supportMessages = localStorage.getItem('help-support-messages');

    if (favorites) {
      this.favoritesSubject.next(JSON.parse(favorites));
    }

    if (recents) {
      this.recentsSubject.next(JSON.parse(recents));
    }

    if (supportMessages) {
      this.supportMessagesSubject.next(JSON.parse(supportMessages));
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('help-favorites', JSON.stringify(this.favoritesSubject.value));
    localStorage.setItem('help-recents', JSON.stringify(this.recentsSubject.value));
    localStorage.setItem('help-support-messages', JSON.stringify(this.supportMessagesSubject.value));
  }

  // Mock Data - FAQs
  private mockFAQs: FAQ[] = [
    {
      id: "faq-001",
      question: "¿Cómo creo una nueva receta médica?",
      answer: "Para crear una nueva receta: 1) Ve al menú 'Prescripciones' > 'Nueva receta'. 2) Busca y selecciona el paciente. 3) Agrega medicamentos haciendo doble clic en la tabla. 4) Completa dosis, frecuencia y duración en el panel lateral. 5) Firma digitalmente y emite la receta. La receta queda registrada en el sistema y se genera un código QR para verificación.",
      category: "prescripciones",
      tags: ["receta", "prescripcion", "nueva", "crear"],
      popularity: 150,
      helpful: 142,
      notHelpful: 8,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "faq-002",
      question: "¿Qué debo hacer si olvidé mi contraseña?",
      answer: "Si olvidaste tu contraseña: 1) En la pantalla de login, haz clic en '¿Olvidaste tu contraseña?'. 2) Ingresa tu correo electrónico registrado. 3) Recibirás un email con un link de recuperación. 4) Haz clic en el link (válido por 1 hora). 5) Crea una nueva contraseña segura (mínimo 12 caracteres, mayúsculas, minúsculas, números y símbolos). 6) Confirma y accede con tu nueva contraseña.",
      category: "seguridad",
      tags: ["contraseña", "password", "recuperar", "olvidé", "reset"],
      popularity: 120,
      helpful: 115,
      notHelpful: 5,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "faq-003",
      question: "¿Cómo verifico una receta con código QR?",
      answer: "Para verificar una receta con QR: 1) Ve a 'Dispensación' > 'Verificar receta'. 2) Usa la cámara de tu dispositivo o scanner para escanear el código QR de la receta. 3) El sistema mostrará toda la información de la receta incluyendo medicamentos, dosis, paciente y médico. 4) Verifica que la firma digital sea válida (badge verde). 5) Si todo es correcto, procede con la dispensación.",
      category: "dispensacion",
      tags: ["qr", "verificar", "receta", "escanear", "codigo"],
      popularity: 95,
      helpful: 90,
      notHelpful: 5,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "faq-004",
      question: "¿Cómo agrego un nuevo paciente al sistema?",
      answer: "Para agregar un nuevo paciente: 1) Ve a 'Pacientes' > 'Listado de pacientes'. 2) Haz clic en el botón '+ Nuevo paciente'. 3) Completa todos los datos obligatorios: nombre completo, tipo y número de identificación, fecha de nacimiento, género, teléfono, email y dirección. 4) Opcionalmente agrega información clínica como alergias, condiciones crónicas, medicamentos actuales, tipo de sangre, etc. 5) Guarda el paciente. El sistema validará que no exista duplicado por cédula/pasaporte.",
      category: "pacientes",
      tags: ["paciente", "nuevo", "agregar", "registrar", "alta"],
      popularity: 88,
      helpful: 85,
      notHelpful: 3,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "faq-005",
      question: "¿Qué hago si el sistema muestra una alerta de interacción medicamentosa?",
      answer: "Si aparece una alerta de interacción: 1) LEE CUIDADOSAMENTE la alerta. El sistema muestra el nivel de severidad (baja, moderada, alta, crítica). 2) Revisa qué medicamentos están interactuando. 3) Evalúa clínicamente si el beneficio supera el riesgo. 4) Opciones: a) Cambiar uno de los medicamentos por una alternativa, b) Ajustar dosis, c) Documentar justificación clínica y continuar. 5) NUNCA ignores alertas críticas sin evaluación. 6) Consulta literatura médica o servicio de farmacología clínica si tienes dudas.",
      category: "alertas",
      tags: ["alerta", "interaccion", "medicamento", "advertencia", "cds"],
      popularity: 110,
      helpful: 105,
      notHelpful: 5,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "faq-006",
      question: "¿Cómo exporto mis recetas emitidas a Excel?",
      answer: "Para exportar recetas a Excel: 1) Ve a 'Prescripciones' > 'Recetas emitidas'. 2) Usa los filtros para seleccionar el período deseado (fecha inicio/fin, paciente, estado, etc.). 3) Haz clic en el botón 'Exportar' en la esquina superior derecha. 4) Selecciona formato 'Excel (.xlsx)'. 5) El archivo se descargará automáticamente con todas las recetas del período incluyendo: número, fecha, paciente, medicamentos, estado, etc. El archivo cumple con formatos de auditoría HIPAA.",
      category: "reportes",
      tags: ["exportar", "excel", "recetas", "emitidas", "descargar"],
      popularity: 75,
      helpful: 70,
      notHelpful: 5,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "faq-007",
      question: "¿Puedo editar una receta después de emitida?",
      answer: "NO. Una vez que una receta es emitida y firmada digitalmente, NO puede editarse. Esto cumple con regulaciones FDA 21 CFR Part 11 y HIPAA que requieren inmutabilidad de registros médicos firmados. Si necesitas corregir algo: 1) Anula la receta incorrecta (queda en log de auditoría). 2) Crea una nueva receta con los datos correctos. 3) Documenta el motivo de la anulación. Sin embargo, SÍ puedes editar borradores antes de firmarlos y emitirlos.",
      category: "prescripciones",
      tags: ["editar", "receta", "emitida", "modificar", "cambiar"],
      popularity: 92,
      helpful: 88,
      notHelpful: 4,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "faq-008",
      question: "¿Cómo actualizo el stock de medicamentos en la farmacia?",
      answer: "Para actualizar stock: 1) Ve a 'Farmacia e Inventario' > 'Stock de medicamentos'. 2) Busca el medicamento que deseas actualizar. 3) Haz doble clic en la fila para abrir el panel lateral. 4) Actualiza las cantidades por presentación (cajas, unidades, etc.). 5) Si agregas stock nuevo, registra: número de lote, fecha de vencimiento, proveedor, costo unitario. 6) Guarda los cambios. El sistema registra quién y cuándo realizó el ajuste para auditoría. También puedes usar 'Ajustes de stock' para movimientos masivos.",
      category: "inventario",
      tags: ["stock", "inventario", "actualizar", "farmacia", "medicamentos"],
      popularity: 68,
      helpful: 65,
      notHelpful: 3,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "faq-009",
      question: "¿Qué es la firma digital y cómo la uso?",
      answer: "La firma digital es un mecanismo criptográfico que garantiza autenticidad e integridad de las recetas. Para firmar: 1) Una vez completada tu receta, haz clic en 'Firmar y Emitir'. 2) El sistema pedirá tu contraseña o certificado digital (dependiendo configuración). 3) Se genera un hash criptográfico único de la receta. 4) Se crea un código QR que contiene la firma. 5) La receta queda inmutable y verificable. La firma cumple con estándares PKI, FDA 21 CFR Part 11 y normativas de firma electrónica avanzada.",
      category: "firma-digital",
      tags: ["firma", "digital", "certificado", "qr", "autenticidad"],
      popularity: 82,
      helpful: 78,
      notHelpful: 4,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "faq-010",
      question: "¿Cómo cambio mi rol activo en el sistema?",
      answer: "Si tienes múltiples roles asignados: 1) Haz clic en el selector de roles en la esquina superior derecha (al lado de tu nombre). 2) Verás todos tus roles disponibles con badges de color. 3) Selecciona el rol con el que deseas trabajar. 4) El sistema recarga y muestra solo las opciones de menú permitidas para ese rol. 5) Puedes cambiar de rol en cualquier momento sin cerrar sesión. Nota: El cambio de rol queda registrado en auditoría por seguridad y trazabilidad.",
      category: "seguridad",
      tags: ["rol", "cambiar", "multi-rol", "permisos", "acceso"],
      popularity: 65,
      helpful: 62,
      notHelpful: 3,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    }
  ];

  // Mock Data - Knowledge Articles
  private mockArticles: KnowledgeArticle[] = [
    {
      id: "art-001",
      title: "Guía completa: Prescripción segura de medicamentos",
      summary: "Aprende el flujo completo de prescripción desde la selección del paciente hasta la firma digital, incluyendo mejores prácticas de seguridad.",
      content: `# Guía completa: Prescripción segura de medicamentos

## Introducción
Esta guía te llevará paso a paso por el proceso completo de prescripción de medicamentos en ePrescription, siguiendo las mejores prácticas internacionales.

## Antes de comenzar
✅ Verifica que el paciente esté registrado en el sistema
✅ Revisa el historial médico del paciente
✅ Confirma alergias y medicamentos actuales
✅ Ten a mano tu certificado de firma digital

## Paso 1: Acceder al módulo de prescripciones
- Desde el menú lateral, selecciona **Prescripciones**
- Haz clic en **Nueva receta**
- El sistema abrirá el formulario de prescripción

## Paso 2: Seleccionar el paciente
- Usa el buscador de pacientes (por nombre, cédula o pasaporte)
- Selecciona el paciente correcto
- Verifica que los datos sean correctos (edad, género, etc.)
- El sistema cargará automáticamente alergias y medicamentos actuales

## Paso 3: Agregar medicamentos
- Busca el medicamento en la tabla principal
- Puedes filtrar por: nombre comercial, principio activo, categoría
- **DOBLE CLIC** en la fila del medicamento para abrir el panel lateral
- NO uses click simple, debe ser doble clic

## Mejores prácticas de seguridad

### ✅ HACER:
- Verificar identidad del paciente antes de prescribir
- Revisar todas las alertas clínicas
- Documentar justificación si ignoras una alerta
- Usar nomenclatura estándar (DCI/INN cuando sea posible)
- Firmar inmediatamente después de completar
- Imprimir copia para el expediente físico

### ❌ NO HACER:
- Prescribir sin ver al paciente (salvo telemedicina autorizada)
- Ignorar alertas críticas sin evaluación
- Dejar recetas sin firmar al final del día
- Compartir tu contraseña o certificado digital
- Prescribir medicamentos no registrados en el catálogo
- Modificar recetas ya emitidas (debes anular y crear nueva)`,
      category: "prescripciones",
      contentType: "guide",
      tags: ["prescripcion", "receta", "guia", "paso-a-paso", "tutorial"],
      difficulty: "beginner",
      estimatedTime: "15 min",
      author: "Dr. Carlos Méndez - Capacitación ePrescription",
      views: 450,
      helpful: 425,
      notHelpful: 25,
      relatedArticles: ["art-002", "art-009", "art-010"],
      featured: true,
      steps: [
        { title: "Acceder al módulo", description: "Menú > Prescripciones > Nueva receta" },
        { title: "Seleccionar paciente", description: "Buscar y confirmar datos del paciente" },
        { title: "Agregar medicamentos", description: "Doble clic en medicamento para configurar" },
        { title: "Revisar alertas", description: "Evaluar interacciones y contraindicaciones" },
        { title: "Firmar y emitir", description: "Firma digital y generación de QR" }
      ],
      videoUrl: "https://help.eprescription.cr/videos/prescripcion-segura",
      createdAt: "2024-12-15T10:00:00Z",
      updatedAt: "2025-01-12T10:00:00Z"
    },
    {
      id: "art-002",
      title: "Gestión de borradores: Guardar y recuperar recetas incompletas",
      summary: "Aprende a usar el sistema de borradores para guardar recetas que no puedes completar inmediatamente y continuarlas después.",
      content: `Contenido completo del artículo sobre gestión de borradores...`,
      category: "prescripciones",
      contentType: "guide",
      tags: ["borradores", "guardar", "recuperar", "recetas"],
      difficulty: "beginner",
      estimatedTime: "5 min",
      author: "Equipo ePrescription",
      views: 280,
      helpful: 265,
      notHelpful: 15,
      relatedArticles: ["art-001", "art-003"],
      featured: false,
      createdAt: "2024-12-20T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "art-003",
      title: "Alertas clínicas: Interpretación y manejo de interacciones",
      summary: "Entiende los diferentes niveles de alertas, cómo interpretarlas y qué hacer en cada caso según severidad.",
      content: `Contenido sobre alertas clínicas...`,
      category: "alertas",
      contentType: "guide",
      tags: ["alertas", "interacciones", "cds", "seguridad"],
      difficulty: "intermediate",
      estimatedTime: "12 min",
      author: "Dr. Ana Fernández - Farmacología Clínica",
      views: 320,
      helpful: 305,
      notHelpful: 15,
      relatedArticles: ["art-001", "art-011"],
      featured: true,
      createdAt: "2025-01-05T10:00:00Z",
      updatedAt: "2025-01-12T10:00:00Z"
    },
    {
      id: "art-009",
      title: "Firma digital: Certificados, PKI y verificación",
      summary: "Todo sobre la infraestructura de firma digital, cómo funciona PKI, certificados y verificación de autenticidad.",
      content: `Contenido técnico sobre firma digital...`,
      category: "firma-digital",
      contentType: "article",
      tags: ["firma", "digital", "pki", "certificado", "seguridad"],
      difficulty: "advanced",
      estimatedTime: "20 min",
      author: "Ing. Roberto Salas - Seguridad de la Información",
      views: 180,
      helpful: 165,
      notHelpful: 15,
      relatedArticles: ["art-001", "art-010"],
      featured: false,
      createdAt: "2024-12-10T10:00:00Z",
      updatedAt: "2025-01-08T10:00:00Z"
    },
    {
      id: "art-010",
      title: "Verificación de recetas con código QR: Guía para farmacéuticos",
      summary: "Proceso completo de verificación de recetas usando códigos QR, incluyendo validación de firma y autenticidad.",
      content: `Contenido para farmacéuticos...`,
      category: "dispensacion",
      contentType: "guide",
      tags: ["qr", "verificacion", "farmacia", "dispensacion"],
      difficulty: "beginner",
      estimatedTime: "8 min",
      author: "Dra. Patricia Rojas - Farmacia Clínica",
      views: 390,
      helpful: 375,
      notHelpful: 15,
      relatedArticles: ["art-001", "art-009"],
      featured: true,
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z"
    }
  ];

  // Mock Data - Glossary
  private mockGlossary: GlossaryTerm[] = [
    {
      id: "glos-001",
      term: "HIPAA",
      definition: "Health Insurance Portability and Accountability Act - Ley federal de EE.UU. que establece estándares para proteger la información médica sensible de los pacientes.",
      relatedTerms: ["FDA", "PHI", "Privacidad"],
      category: "seguridad"
    },
    {
      id: "glos-002",
      term: "FDA 21 CFR Part 11",
      definition: "Regulación de la FDA que establece criterios para registros electrónicos y firmas electrónicas en la industria de salud y farmacéutica.",
      relatedTerms: ["HIPAA", "Firma Digital", "Auditoría"],
      category: "seguridad"
    },
    {
      id: "glos-003",
      term: "FHIR",
      definition: "Fast Healthcare Interoperability Resources - Estándar para el intercambio electrónico de información de salud.",
      relatedTerms: ["HL7", "Interoperabilidad", "API"],
      category: "interoperabilidad"
    },
    {
      id: "glos-004",
      term: "DCI",
      definition: "Denominación Común Internacional - Nombre genérico oficial de un principio activo farmacéutico según la OMS.",
      relatedTerms: ["INN", "Principio Activo", "OMS"],
      category: "prescripciones"
    },
    {
      id: "glos-005",
      term: "CDS",
      definition: "Clinical Decision Support - Sistema de apoyo a la decisión clínica que ayuda a los profesionales con alertas e información relevante.",
      relatedTerms: ["Alertas", "Interacciones", "IA"],
      category: "alertas"
    },
    {
      id: "glos-006",
      term: "PKI",
      definition: "Public Key Infrastructure - Infraestructura de clave pública para gestionar certificados digitales y firmas electrónicas.",
      relatedTerms: ["Firma Digital", "Certificado", "Criptografía"],
      category: "firma-digital"
    },
    {
      id: "glos-007",
      term: "QR",
      definition: "Quick Response Code - Código de barras bidimensional que almacena información para verificación rápida de recetas.",
      relatedTerms: ["Verificación", "Token", "Dispensación"],
      category: "dispensacion"
    }
  ];

  // Videos tutoriales del sistema
  private mockVideos: VideoTutorial[] = [
    {
      id: "vid-001",
      title: "Introducción a ePrescription",
      description: "Conoce las funcionalidades principales del sistema, la navegación y cómo empezar a usar ePrescription.",
      duration: "5:30",
      category: "general",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop",
      level: "beginner",
      views: 1247,
      tags: ["Introducción", "Básico", "Tour guiado"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-002",
      title: "Cómo crear tu primera receta médica",
      description: "Paso a paso completo para crear una prescripción: seleccionar paciente, agregar medicamentos, configurar posología y emitir la receta.",
      duration: "8:45",
      category: "prescripciones",
      thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=225&fit=crop",
      level: "beginner",
      views: 2156,
      tags: ["Recetas", "Prescripciones", "Tutorial"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-003",
      title: "Gestión de pacientes: Crear y editar perfiles",
      description: "Aprende a registrar nuevos pacientes, actualizar información médica, agregar alergias y gestionar el historial clínico.",
      duration: "6:20",
      category: "pacientes",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
      level: "beginner",
      views: 987,
      tags: ["Pacientes", "Gestión", "Historial"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-004",
      title: "Firma digital y códigos QR",
      description: "Configuración de firma digital, generación de códigos QR y verificación de autenticidad de recetas.",
      duration: "7:15",
      category: "firma-digital",
      thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=225&fit=crop",
      level: "intermediate",
      views: 756,
      tags: ["Firma digital", "QR", "Seguridad"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-005",
      title: "Dispensación de medicamentos en farmacia",
      description: "Proceso completo de verificación de recetas, escaneo de QR, registro de dispensación y gestión de rechazos.",
      duration: "9:30",
      category: "dispensacion",
      thumbnail: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=225&fit=crop",
      level: "intermediate",
      views: 1423,
      tags: ["Farmacia", "Dispensación", "Verificación"],
      youtubeId: "dQw4w9WgXcQ"
    }
  ];

  // ============================================
  // FAQs
  // ============================================
  getAllFAQs(): FAQ[] {
    return this.mockFAQs.sort((a, b) => b.popularity - a.popularity);
  }

  getFAQsByCategory(category: HelpCategory): FAQ[] {
    return this.mockFAQs
      .filter(faq => faq.category === category)
      .sort((a, b) => b.popularity - a.popularity);
  }

  getPopularFAQs(limit: number = 5): FAQ[] {
    return this.mockFAQs
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }

  getFAQById(id: string): FAQ | undefined {
    return this.mockFAQs.find(faq => faq.id === id);
  }

  // ============================================
  // Knowledge Articles
  // ============================================
  getAllArticles(): KnowledgeArticle[] {
    return this.mockArticles.sort((a, b) => b.views - a.views);
  }

  getArticlesByCategory(category: HelpCategory): KnowledgeArticle[] {
    return this.mockArticles
      .filter(art => art.category === category)
      .sort((a, b) => b.views - a.views);
  }

  getFeaturedArticles(): KnowledgeArticle[] {
    return this.mockArticles.filter(art => art.featured);
  }

  getArticleById(id: string): KnowledgeArticle | undefined {
    return this.mockArticles.find(art => art.id === id);
  }

  getRelatedArticles(articleId: string): KnowledgeArticle[] {
    const article = this.mockArticles.find(art => art.id === articleId);
    if (!article) return [];

    return this.mockArticles.filter(art => 
      article.relatedArticles.includes(art.id)
    );
  }

  // ============================================
  // Videos
  // ============================================
  getAllVideos(): VideoTutorial[] {
    return this.mockVideos;
  }

  getVideosByCategory(category: string): VideoTutorial[] {
    return this.mockVideos.filter(video => video.category === category);
  }

  getVideoById(id: string): VideoTutorial | undefined {
    return this.mockVideos.find(video => video.id === id);
  }

  // ============================================
  // Búsqueda Inteligente
  // ============================================
  search(query: string): Observable<SearchResult[]> {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) return of([]);

    const results: SearchResult[] = [];

    // Buscar en FAQs
    this.mockFAQs.forEach(faq => {
      let relevance = 0;

      if (faq.question.toLowerCase().includes(normalizedQuery)) {
        relevance += 100;
      }

      if (faq.answer.toLowerCase().includes(normalizedQuery)) {
        relevance += 50;
      }

      faq.tags.forEach(tag => {
        if (tag.toLowerCase().includes(normalizedQuery)) {
          relevance += 30;
        }
      });

      const keywords = normalizedQuery.split(' ');
      keywords.forEach(keyword => {
        if (keyword.length > 3) {
          if (faq.question.toLowerCase().includes(keyword)) relevance += 20;
          if (faq.answer.toLowerCase().includes(keyword)) relevance += 10;
        }
      });

      if (relevance > 0) {
        const answerWords = faq.answer.split(' ');
        const snippet = answerWords.slice(0, 25).join(' ') + '...';

        results.push({
          id: faq.id,
          type: "faq",
          title: faq.question,
          snippet,
          relevance: relevance + faq.popularity / 10,
          category: faq.category
        });
      }
    });

    // Buscar en artículos
    this.mockArticles.forEach(article => {
      let relevance = 0;

      if (article.title.toLowerCase().includes(normalizedQuery)) {
        relevance += 100;
      }

      if (article.summary.toLowerCase().includes(normalizedQuery)) {
        relevance += 70;
      }

      if (article.content.toLowerCase().includes(normalizedQuery)) {
        relevance += 40;
      }

      article.tags.forEach(tag => {
        if (tag.toLowerCase().includes(normalizedQuery)) {
          relevance += 30;
        }
      });

      const keywords = normalizedQuery.split(' ');
      keywords.forEach(keyword => {
        if (keyword.length > 3) {
          if (article.title.toLowerCase().includes(keyword)) relevance += 20;
          if (article.summary.toLowerCase().includes(keyword)) relevance += 10;
        }
      });

      if (relevance > 0) {
        results.push({
          id: article.id,
          type: "article",
          title: article.title,
          snippet: article.summary,
          relevance: relevance + article.views / 10,
          category: article.category
        });
      }
    });

    return of(results.sort((a, b) => b.relevance - a.relevance).slice(0, 20)).pipe(delay(800));
  }

  getAISuggestions(query: string): Observable<string[]> {
    const suggestions: string[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    const commonSearches = [
      "cómo crear una receta",
      "olvidé mi contraseña",
      "verificar código QR",
      "agregar nuevo paciente",
      "alertas de interacción",
      "exportar recetas a Excel",
      "editar receta emitida",
      "actualizar stock de medicamentos",
      "qué es la firma digital",
      "cambiar mi rol en el sistema",
      "cómo guardar un borrador",
      "dispensar medicamentos",
      "generar reportes",
      "configurar notificaciones"
    ];

    commonSearches.forEach(search => {
      if (search.includes(normalizedQuery) && normalizedQuery.length > 2) {
        suggestions.push(search);
      }
    });

    return of(suggestions.slice(0, 5)).pipe(delay(400));
  }

  // ============================================
  // Glosario
  // ============================================
  getGlossaryTerms(): GlossaryTerm[] {
    return this.mockGlossary.sort((a, b) => a.term.localeCompare(b.term));
  }

  searchGlossary(query: string): GlossaryTerm[] {
    const normalized = query.toLowerCase();
    return this.mockGlossary.filter(term =>
      term.term.toLowerCase().includes(normalized) ||
      term.definition.toLowerCase().includes(normalized)
    );
  }

  // ============================================
  // Categorías
  // ============================================
  getCategories(): Array<{ value: HelpCategory; label: string; description: string; icon: string }> {
    return [
      {
        value: "prescripciones",
        label: "Prescripciones",
        description: "Crear, editar y gestionar recetas médicas",
        icon: "FileText"
      },
      {
        value: "dispensacion",
        label: "Dispensación",
        description: "Verificación y entrega de medicamentos",
        icon: "Pill"
      },
      {
        value: "pacientes",
        label: "Pacientes",
        description: "Gestión de datos de pacientes",
        icon: "Users"
      },
      {
        value: "inventario",
        label: "Inventario",
        description: "Stock y control de medicamentos",
        icon: "Package"
      },
      {
        value: "seguridad",
        label: "Seguridad",
        description: "Usuarios, roles y permisos",
        icon: "Shield"
      },
      {
        value: "reportes",
        label: "Reportes",
        description: "Análisis y exportación de datos",
        icon: "BarChart"
      },
      {
        value: "firma-digital",
        label: "Firma Digital",
        description: "Certificados y verificación",
        icon: "ShieldCheck"
      },
      {
        value: "interoperabilidad",
        label: "Interoperabilidad",
        description: "FHIR, HL7 y estándares",
        icon: "Network"
      },
      {
        value: "alertas",
        label: "Alertas Clínicas",
        description: "CDS e interacciones",
        icon: "AlertTriangle"
      },
      {
        value: "configuracion",
        label: "Configuración",
        description: "Ajustes del sistema",
        icon: "Settings"
      },
      {
        value: "general",
        label: "General",
        description: "Temas generales del sistema",
        icon: "Info"
      }
    ];
  }

  // ============================================
  // Estadísticas
  // ============================================
  getHelpStats(): HelpStats {
    const totalHelpful = this.mockFAQs.reduce((sum, faq) => sum + faq.helpful, 0) + 
                        this.mockArticles.reduce((sum, art) => sum + art.helpful, 0);
    const totalNotHelpful = this.mockFAQs.reduce((sum, faq) => sum + faq.notHelpful, 0) + 
                           this.mockArticles.reduce((sum, art) => sum + art.notHelpful, 0);
    
    return {
      totalArticles: this.mockArticles.length,
      totalFAQs: this.mockFAQs.length,
      totalGlossaryTerms: this.mockGlossary.length,
      avgHelpfulRate: Math.round((totalHelpful / (totalHelpful + totalNotHelpful)) * 100)
    };
  }

  // ============================================
  // Favoritos
  // ============================================
  getFavorites(): FavoriteItem[] {
    return this.favoritesSubject.value;
  }

  addFavorite(id: string, type: "faq" | "article"): void {
    const favorites = this.favoritesSubject.value;
    const exists = favorites.find(fav => fav.id === id && fav.type === type);
    
    if (!exists) {
      let title = '';
      let category: HelpCategory = 'general';

      if (type === 'faq') {
        const faq = this.getFAQById(id);
        if (faq) {
          title = faq.question;
          category = faq.category;
        }
      } else {
        const article = this.getArticleById(id);
        if (article) {
          title = article.title;
          category = article.category;
        }
      }

      const newFavorite: FavoriteItem = {
        id,
        type,
        title,
        category,
        addedAt: new Date().toISOString()
      };

      this.favoritesSubject.next([...favorites, newFavorite]);
      this.saveToLocalStorage();
    }
  }

  removeFavorite(id: string, type: "faq" | "article"): void {
    const favorites = this.favoritesSubject.value;
    const filtered = favorites.filter(fav => !(fav.id === id && fav.type === type));
    this.favoritesSubject.next(filtered);
    this.saveToLocalStorage();
  }

  isFavorite(id: string, type: "faq" | "article"): boolean {
    return this.favoritesSubject.value.some(fav => fav.id === id && fav.type === type);
  }

  // ============================================
  // Recientes
  // ============================================
  getRecents(): RecentItem[] {
    return this.recentsSubject.value.sort((a, b) => 
      new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    );
  }

  addRecent(id: string, type: "faq" | "article"): void {
    const recents = this.recentsSubject.value;
    
    // Remover si ya existe
    const filtered = recents.filter(rec => !(rec.id === id && rec.type === type));
    
    let title = '';
    let category: HelpCategory = 'general';

    if (type === 'faq') {
      const faq = this.getFAQById(id);
      if (faq) {
        title = faq.question;
        category = faq.category;
      }
    } else {
      const article = this.getArticleById(id);
      if (article) {
        title = article.title;
        category = article.category;
      }
    }

    const newRecent: RecentItem = {
      id,
      type,
      title,
      category,
      viewedAt: new Date().toISOString()
    };

    // Mantener solo los últimos 20
    const updated = [newRecent, ...filtered].slice(0, 20);
    this.recentsSubject.next(updated);
    this.saveToLocalStorage();
  }

  clearRecents(): void {
    this.recentsSubject.next([]);
    this.saveToLocalStorage();
  }

  // ============================================
  // Feedback
  // ============================================
  markAsHelpful(id: string, type: "faq" | "article"): Observable<{ success: boolean }> {
    if (type === "faq") {
      const faq = this.mockFAQs.find(f => f.id === id);
      if (faq) faq.helpful++;
    } else {
      const article = this.mockArticles.find(a => a.id === id);
      if (article) article.helpful++;
    }

    return of({ success: true }).pipe(delay(300));
  }

  markAsNotHelpful(id: string, type: "faq" | "article"): Observable<{ success: boolean }> {
    if (type === "faq") {
      const faq = this.mockFAQs.find(f => f.id === id);
      if (faq) faq.notHelpful++;
    } else {
      const article = this.mockArticles.find(a => a.id === id);
      if (article) article.notHelpful++;
    }

    return of({ success: true }).pipe(delay(300));
  }

  // ============================================
  // Mensajes de Soporte
  // ============================================
  getSupportMessages(): SupportMessage[] {
    return this.supportMessagesSubject.value.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getSupportMessageById(id: string): SupportMessage | undefined {
    return this.supportMessagesSubject.value.find(msg => msg.id === id);
  }

  getSupportMessagesByStatus(status: SupportMessage['status']): SupportMessage[] {
    return this.supportMessagesSubject.value
      .filter(msg => msg.status === status)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createSupportMessage(messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category?: HelpCategory;
  }): Observable<{ success: boolean; messageId: string }> {
    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject,
      message: messageData.message,
      status: "pending",
      priority: this.determinePriority(messageData.subject, messageData.message),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: messageData.category,
      attachments: []
    };

    const currentMessages = this.supportMessagesSubject.value;
    this.supportMessagesSubject.next([newMessage, ...currentMessages]);
    this.saveToLocalStorage();

    return of({ success: true, messageId: newMessage.id }).pipe(delay(500));
  }

  updateSupportMessageStatus(messageId: string, status: SupportMessage['status']): Observable<{ success: boolean }> {
    const messages = this.supportMessagesSubject.value;
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex !== -1) {
      messages[messageIndex] = {
        ...messages[messageIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      
      this.supportMessagesSubject.next([...messages]);
      this.saveToLocalStorage();
    }

    return of({ success: messageIndex !== -1 }).pipe(delay(300));
  }

  deleteSupportMessage(messageId: string): Observable<{ success: boolean }> {
    const messages = this.supportMessagesSubject.value;
    const filteredMessages = messages.filter(msg => msg.id !== messageId);
    
    this.supportMessagesSubject.next(filteredMessages);
    this.saveToLocalStorage();

    return of({ success: true }).pipe(delay(300));
  }

  getSupportStats(): {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
    byPriority: {
      low: number;
      medium: number;
      high: number;
      urgent: number;
    };
  } {
    const messages = this.supportMessagesSubject.value;
    
    return {
      total: messages.length,
      pending: messages.filter(m => m.status === 'pending').length,
      inProgress: messages.filter(m => m.status === 'in-progress').length,
      resolved: messages.filter(m => m.status === 'resolved').length,
      closed: messages.filter(m => m.status === 'closed').length,
      byPriority: {
        low: messages.filter(m => m.priority === 'low').length,
        medium: messages.filter(m => m.priority === 'medium').length,
        high: messages.filter(m => m.priority === 'high').length,
        urgent: messages.filter(m => m.priority === 'urgent').length,
      }
    };
  }

  private determinePriority(subject: string, message: string): SupportMessage['priority'] {
    const urgentKeywords = ['urgente', 'crítico', 'error crítico', 'sistema caído', 'no funciona', 'bloqueado'];
    const highKeywords = ['problema', 'error', 'fallo', 'bug', 'no puedo', 'ayuda'];
    const mediumKeywords = ['consulta', 'duda', 'pregunta', 'cómo', 'configurar'];
    
    const text = (subject + ' ' + message).toLowerCase();
    
    if (urgentKeywords.some(keyword => text.includes(keyword))) {
      return 'urgent';
    }
    
    if (highKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    }
    
    if (mediumKeywords.some(keyword => text.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  // Método para limpiar mensajes antiguos (opcional)
  cleanOldSupportMessages(daysOld: number = 30): Observable<{ success: boolean; deletedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const messages = this.supportMessagesSubject.value;
    const filteredMessages = messages.filter(msg => {
      const messageDate = new Date(msg.createdAt);
      return messageDate > cutoffDate || msg.status !== 'closed';
    });
    
    const deletedCount = messages.length - filteredMessages.length;
    
    this.supportMessagesSubject.next(filteredMessages);
    this.saveToLocalStorage();

    return of({ success: true, deletedCount }).pipe(delay(300));
  }
}