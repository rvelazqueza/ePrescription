/**
 * EJEMPLO PRÁCTICO DE INTEGRACIÓN
 * Sistema de Alertas Clínicas - ePrescription
 * 
 * Este archivo demuestra cómo integrar:
 * 1. Tipos de Alertas
 * 2. Reglas de Interacciones
 * 3. Configuración de Notificaciones
 * 4. Envío Multi-canal
 */

// ============================================
// 1. DEFINICIÓN DE TIPOS DE DATOS
// ============================================

interface TipoAlerta {
  id: string;
  code: string;
  name: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  behavior: "block" | "warn" | "info";
  requiresAcknowledgment: boolean;
  requiresJustification: boolean;
  notifyPharmacy: boolean;
  autoLog: boolean;
  status: "active" | "inactive";
}

interface ReglaInteraccion {
  id: string;
  alertTypeId: string;  // FK -> TipoAlerta.id
  name: string;
  medicine1: string;
  medicine2: string;
  severity: "critical" | "high" | "medium";
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  status: "active" | "inactive";
  evidenceLevel: "A" | "B" | "C" | "D";
}

interface ConfiguracionNotificacion {
  id: string;
  alertTypeId?: string;  // FK -> TipoAlerta.id (opcional)
  codigo: string;
  nombre: string;
  destinatarios: {
    roles: string[];
    usuarios: string[];
    emails: string[];
  };
  canales: ("Correo" | "SMS" | "Interna" | "WhatsApp" | "Push")[];
  asunto: string;
  cuerpoMensaje: string;  // Soporta variables: {{paciente}}, {{medicamento}}
  prioridad: "alta" | "media" | "baja";
  enviarInmediato: boolean;
  estado: "activa" | "inactiva";
}

interface AlertaGenerada {
  id: string;
  alertTypeId: string;   // FK -> TipoAlerta.id
  ruleId?: string;       // FK -> ReglaInteraccion.id
  type: "interaction" | "allergy" | "contraindication" | "duplicate" | "dose";
  severity: "critical" | "high" | "medium";
  status: "active" | "acknowledged" | "resolved" | "dismissed";
  patientId: string;
  prescriptionId: string;
  doctorId: string;
  medicine1: string;
  medicine2?: string;
  description: string;
  recommendation: string;
  action: "pending" | "modified" | "cancelled" | "overridden";
  acknowledgedBy?: string;
  justification?: string;
  createdAt: Date;
}

// ============================================
// 2. DATOS DE EJEMPLO (SIMULAN BASE DE DATOS)
// ============================================

// Catálogo: Tipos de Alertas
const tiposAlertas: TipoAlerta[] = [
  {
    id: "TYPE-001",
    code: "INTERACTION_CRITICAL",
    name: "Interacción medicamentosa crítica",
    description: "Combinación con riesgo severo para la vida",
    severity: "critical",
    behavior: "block",
    requiresAcknowledgment: true,
    requiresJustification: true,
    notifyPharmacy: true,
    autoLog: true,
    status: "active"
  },
  {
    id: "TYPE-002",
    code: "ALLERGY_ABSOLUTE",
    name: "Alergia registrada",
    description: "Medicamento al que el paciente tiene alergia",
    severity: "critical",
    behavior: "block",
    requiresAcknowledgment: true,
    requiresJustification: true,
    notifyPharmacy: true,
    autoLog: true,
    status: "active"
  },
  {
    id: "TYPE-003",
    code: "DOSE_MAX_EXCEEDED",
    name: "Dosis máxima excedida",
    description: "Dosis prescrita supera el límite máximo",
    severity: "high",
    behavior: "warn",
    requiresAcknowledgment: true,
    requiresJustification: true,
    notifyPharmacy: true,
    autoLog: true,
    status: "active"
  }
];

// Catálogo: Reglas de Interacciones
const reglasInteracciones: ReglaInteraccion[] = [
  {
    id: "RULE-001",
    alertTypeId: "TYPE-001",  // ← VINCULACIÓN
    name: "Warfarina + Antiagregantes plaquetarios",
    medicine1: "Warfarina",
    medicine2: "Ácido acetilsalicílico, Clopidogrel",
    severity: "critical",
    mechanism: "Efecto aditivo anticoagulante/antiagregante",
    clinicalEffect: "Riesgo aumentado de sangrado mayor",
    recommendation: "Evitar combinación o usar con extrema precaución",
    status: "active",
    evidenceLevel: "A"
  },
  {
    id: "RULE-002",
    alertTypeId: "TYPE-001",  // ← VINCULACIÓN
    name: "Estatinas + Gemfibrozil",
    medicine1: "Atorvastatina, Simvastatina, Rosuvastatina",
    medicine2: "Gemfibrozil",
    severity: "critical",
    mechanism: "Gemfibrozil inhibe metabolismo de estatinas",
    clinicalEffect: "Riesgo severo de rabdomiólisis",
    recommendation: "Contraindicación absoluta. Usar fenofibrato",
    status: "active",
    evidenceLevel: "A"
  }
];

// Configuración: Notificaciones de Alertas
const configuracionesNotificaciones: ConfiguracionNotificacion[] = [
  {
    id: "NOTIF-001",
    alertTypeId: "TYPE-001",  // ← VINCULACIÓN: Se dispara para TYPE-001
    codigo: "NOTIF-INTERACTION-CRITICAL",
    nombre: "Notificación de Interacción Crítica",
    destinatarios: {
      roles: ["Médico", "Farmacéutico", "Supervisor Clínico"],
      usuarios: [],  // Se resuelve dinámicamente (médico prescriptor)
      emails: ["alertas@hospital.com"]
    },
    canales: ["Correo", "SMS", "Interna"],
    asunto: "⚠️ ALERTA CRÍTICA: Interacción medicamentosa en {{prescriptionId}}",
    cuerpoMensaje: `
      ALERTA DE SEGURIDAD CLÍNICA
      
      Paciente: {{patientName}}
      Receta: {{prescriptionId}}
      Médico: {{doctorName}}
      
      INTERACCIÓN DETECTADA:
      {{medicine1}} + {{medicine2}}
      
      RIESGO: {{clinicalEffect}}
      
      RECOMENDACIÓN: {{recommendation}}
      
      Esta alerta requiere acción inmediata.
    `,
    prioridad: "alta",
    enviarInmediato: true,
    estado: "activa"
  },
  {
    id: "NOTIF-002",
    alertTypeId: "TYPE-002",  // ← VINCULACIÓN: Se dispara para TYPE-002
    codigo: "NOTIF-ALLERGY",
    nombre: "Notificación de Alergia",
    destinatarios: {
      roles: ["Médico", "Farmacéutico"],
      usuarios: [],
      emails: []
    },
    canales: ["Correo", "Interna", "Push"],
    asunto: "🚫 ALERTA: Alergia registrada - {{patientName}}",
    cuerpoMensaje: `
      ALERTA DE ALERGIA
      
      Paciente: {{patientName}}
      Medicamento prescrito: {{medicine1}}
      
      El paciente tiene alergia registrada a este medicamento.
      La prescripción ha sido bloqueada.
    `,
    prioridad: "alta",
    enviarInmediato: true,
    estado: "activa"
  },
  {
    id: "NOTIF-003",
    alertTypeId: "TYPE-003",  // ← VINCULACIÓN: Se dispara para TYPE-003
    codigo: "NOTIF-DOSE-EXCEEDED",
    nombre: "Notificación de Dosis Excedida",
    destinatarios: {
      roles: ["Farmacéutico"],
      usuarios: [],
      emails: []
    },
    canales: ["Interna", "Correo"],
    asunto: "⚠️ Dosis máxima excedida - {{prescriptionId}}",
    cuerpoMensaje: `
      ADVERTENCIA DE DOSIFICACIÓN
      
      Receta: {{prescriptionId}}
      Medicamento: {{medicine1}}
      
      La dosis prescrita excede el límite máximo recomendado.
      Requiere verificación farmacéutica.
    `,
    prioridad: "media",
    enviarInmediato: true,
    estado: "activa"
  }
];

// ============================================
// 3. SERVICIO DE EVALUACIÓN DE ALERTAS
// ============================================

class AlertEvaluationService {
  
  /**
   * Evalúa una prescripción y genera alertas
   */
  async evaluatePrescription(prescription: any): Promise<AlertaGenerada[]> {
    const alertas: AlertaGenerada[] = [];
    
    console.log("🔍 Evaluando prescripción:", prescription.id);
    
    // 1. Verificar interacciones medicamentosas
    const interactionAlerts = await this.checkDrugInteractions(
      prescription.medications,
      prescription
    );
    alertas.push(...interactionAlerts);
    
    // 2. Verificar alergias (simulado)
    const allergyAlerts = await this.checkAllergies(
      prescription.patientId,
      prescription.medications,
      prescription
    );
    alertas.push(...allergyAlerts);
    
    // 3. Verificar dosis máximas (simulado)
    const doseAlerts = await this.checkDoseLimits(
      prescription.medications,
      prescription
    );
    alertas.push(...doseAlerts);
    
    return alertas;
  }
  
  /**
   * Verifica interacciones entre medicamentos
   */
  private async checkDrugInteractions(
    medications: any[],
    prescription: any
  ): Promise<AlertaGenerada[]> {
    const alertas: AlertaGenerada[] = [];
    
    console.log("💊 Verificando interacciones entre medicamentos...");
    
    // Comparar cada par de medicamentos
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];
        
        console.log(`  → Comparando: ${med1.name} vs ${med2.name}`);
        
        // Buscar regla activa que coincida
        const reglaCoincidente = this.findMatchingRule(med1.name, med2.name);
        
        if (reglaCoincidente) {
          console.log(`    ✓ Regla encontrada: ${reglaCoincidente.id}`);
          
          // Obtener tipo de alerta asociado
          const tipoAlerta = this.getTipoAlerta(reglaCoincidente.alertTypeId);
          
          if (tipoAlerta && tipoAlerta.status === "active") {
            console.log(`    ✓ Tipo de alerta: ${tipoAlerta.code}`);
            
            // GENERAR ALERTA
            const alerta = this.crearAlerta({
              ruleId: reglaCoincidente.id,
              alertTypeId: tipoAlerta.id,
              type: "interaction",
              severity: reglaCoincidente.severity,
              medicine1: med1.name,
              medicine2: med2.name,
              description: reglaCoincidente.clinicalEffect,
              recommendation: reglaCoincidente.recommendation,
              prescription
            });
            
            alertas.push(alerta);
            
            // DISPARAR NOTIFICACIONES
            await this.dispararNotificaciones(alerta, tipoAlerta, prescription);
          }
        }
      }
    }
    
    return alertas;
  }
  
  /**
   * Busca una regla que coincida con los medicamentos
   */
  private findMatchingRule(med1Name: string, med2Name: string): ReglaInteraccion | null {
    for (const regla of reglasInteracciones) {
      if (regla.status !== "active") continue;
      
      // Verificar si alguno de los medicamentos de la regla coincide
      const medicines1 = regla.medicine1.split(",").map(m => m.trim().toLowerCase());
      const medicines2 = regla.medicine2.split(",").map(m => m.trim().toLowerCase());
      
      const med1Lower = med1Name.toLowerCase();
      const med2Lower = med2Name.toLowerCase();
      
      const match1 = medicines1.some(m => med1Lower.includes(m) || m.includes(med1Lower));
      const match2 = medicines2.some(m => med2Lower.includes(m) || m.includes(med2Lower));
      
      const match1Reverse = medicines2.some(m => med1Lower.includes(m) || m.includes(med1Lower));
      const match2Reverse = medicines1.some(m => med2Lower.includes(m) || m.includes(med2Lower));
      
      if ((match1 && match2) || (match1Reverse && match2Reverse)) {
        return regla;
      }
    }
    
    return null;
  }
  
  /**
   * Obtiene un tipo de alerta por ID
   */
  private getTipoAlerta(id: string): TipoAlerta | null {
    return tiposAlertas.find(t => t.id === id) || null;
  }
  
  /**
   * Crea una alerta
   */
  private crearAlerta(data: any): AlertaGenerada {
    const alerta: AlertaGenerada = {
      id: `ALT-${Date.now()}`,
      alertTypeId: data.alertTypeId,
      ruleId: data.ruleId,
      type: data.type,
      severity: data.severity,
      status: "active",
      patientId: data.prescription.patientId,
      prescriptionId: data.prescription.id,
      doctorId: data.prescription.doctorId,
      medicine1: data.medicine1,
      medicine2: data.medicine2,
      description: data.description,
      recommendation: data.recommendation,
      action: "pending",
      createdAt: new Date()
    };
    
    console.log("🚨 Alerta generada:", alerta.id);
    
    return alerta;
  }
  
  /**
   * Dispara notificaciones para una alerta
   */
  private async dispararNotificaciones(
    alerta: AlertaGenerada,
    tipoAlerta: TipoAlerta,
    prescription: any
  ): Promise<void> {
    console.log("📢 Disparando notificaciones para alerta:", alerta.id);
    
    // Buscar configuraciones de notificación para este tipo de alerta
    const configs = configuracionesNotificaciones.filter(
      c => c.alertTypeId === tipoAlerta.id && c.estado === "activa"
    );
    
    console.log(`   Configuraciones encontradas: ${configs.length}`);
    
    for (const config of configs) {
      console.log(`   → Procesando: ${config.codigo}`);
      
      // Resolver destinatarios
      const destinatarios = this.resolverDestinatarios(config, prescription);
      
      // Reemplazar variables en plantillas
      const asuntoFinal = this.reemplazarVariables(config.asunto, alerta, prescription);
      const mensajeFinal = this.reemplazarVariables(config.cuerpoMensaje, alerta, prescription);
      
      // Enviar por cada canal
      for (const canal of config.canales) {
        await this.enviarNotificacion({
          alertaId: alerta.id,
          configId: config.id,
          canal,
          destinatarios,
          asunto: asuntoFinal,
          mensaje: mensajeFinal,
          prioridad: config.prioridad
        });
      }
    }
  }
  
  /**
   * Resuelve destinatarios dinámicamente
   */
  private resolverDestinatarios(config: ConfiguracionNotificacion, prescription: any): string[] {
    const destinatarios: string[] = [];
    
    // Agregar médico prescriptor
    destinatarios.push(prescription.doctorId);
    
    // Agregar farmacéutico de turno (simulado)
    if (config.destinatarios.roles.includes("Farmacéutico")) {
      destinatarios.push("FARM-001");
    }
    
    // Agregar emails externos
    destinatarios.push(...config.destinatarios.emails);
    
    return destinatarios;
  }
  
  /**
   * Reemplaza variables en plantillas
   */
  private reemplazarVariables(
    plantilla: string,
    alerta: AlertaGenerada,
    prescription: any
  ): string {
    return plantilla
      .replace(/\{\{patientName\}\}/g, prescription.patientName || "N/A")
      .replace(/\{\{prescriptionId\}\}/g, alerta.prescriptionId)
      .replace(/\{\{doctorName\}\}/g, prescription.doctorName || "N/A")
      .replace(/\{\{medicine1\}\}/g, alerta.medicine1)
      .replace(/\{\{medicine2\}\}/g, alerta.medicine2 || "")
      .replace(/\{\{clinicalEffect\}\}/g, alerta.description)
      .replace(/\{\{recommendation\}\}/g, alerta.recommendation);
  }
  
  /**
   * Envía una notificación por un canal
   */
  private async enviarNotificacion(params: any): Promise<void> {
    console.log(`   📨 Enviando por canal: ${params.canal}`);
    console.log(`      Destinatarios: ${params.destinatarios.join(", ")}`);
    
    switch (params.canal) {
      case "Correo":
        await this.enviarEmail(params);
        break;
      case "SMS":
        await this.enviarSMS(params);
        break;
      case "Interna":
        await this.crearNotificacionInterna(params);
        break;
      case "WhatsApp":
        await this.enviarWhatsApp(params);
        break;
      case "Push":
        await this.enviarPush(params);
        break;
    }
    
    // Registrar en base de datos (simulado)
    console.log(`      ✓ Notificación enviada y registrada`);
  }
  
  private async enviarEmail(params: any): Promise<void> {
    console.log(`      📧 Email enviado`);
    // await emailService.send({ to: params.destinatarios, subject: params.asunto, body: params.mensaje });
  }
  
  private async enviarSMS(params: any): Promise<void> {
    console.log(`      📱 SMS enviado`);
    // await smsService.send({ to: params.destinatarios, message: params.mensaje });
  }
  
  private async crearNotificacionInterna(params: any): Promise<void> {
    console.log(`      🔔 Notificación interna creada en bandeja`);
    // await notificationStore.create({ userId: params.destinatarios, message: params.mensaje });
  }
  
  private async enviarWhatsApp(params: any): Promise<void> {
    console.log(`      💬 WhatsApp enviado`);
    // await whatsappService.send({ to: params.destinatarios, message: params.mensaje });
  }
  
  private async enviarPush(params: any): Promise<void> {
    console.log(`      📲 Push notification enviada`);
    // await pushService.send({ to: params.destinatarios, message: params.mensaje });
  }
  
  /**
   * Verifica alergias (simulado)
   */
  private async checkAllergies(
    patientId: string,
    medications: any[],
    prescription: any
  ): Promise<AlertaGenerada[]> {
    // Simulación: sin alergias detectadas
    return [];
  }
  
  /**
   * Verifica límites de dosis (simulado)
   */
  private async checkDoseLimits(
    medications: any[],
    prescription: any
  ): Promise<AlertaGenerada[]> {
    // Simulación: sin dosis excedidas
    return [];
  }
}

// ============================================
// 4. EJEMPLO DE USO COMPLETO
// ============================================

async function ejemploCompleto() {
  console.log("\n" + "=".repeat(60));
  console.log("DEMO: Sistema de Alertas Clínicas - ePrescription");
  console.log("=".repeat(60) + "\n");
  
  // PASO 1: Médico crea una prescripción
  const prescripcion = {
    id: "RX-2024-0156",
    patientId: "PAT-0012",
    patientName: "María González Rodríguez",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Andrés Martínez López",
    medications: [
      {
        id: "MED-001",
        name: "Warfarina",
        dose: "5mg",
        frequency: "1 vez al día"
      },
      {
        id: "MED-002",
        name: "Ácido acetilsalicílico",
        dose: "100mg",
        frequency: "1 vez al día"
      }
    ]
  };
  
  console.log("📝 PRESCRIPCIÓN CREADA:");
  console.log(`   ID: ${prescripcion.id}`);
  console.log(`   Paciente: ${prescripcion.patientName}`);
  console.log(`   Médico: ${prescripcion.doctorName}`);
  console.log(`   Medicamentos:`);
  prescripcion.medications.forEach(med => {
    console.log(`     - ${med.name} ${med.dose} (${med.frequency})`);
  });
  console.log("");
  
  // PASO 2: Sistema evalúa la prescripción
  const alertService = new AlertEvaluationService();
  const alertas = await alertService.evaluatePrescription(prescripcion);
  
  console.log("\n" + "=".repeat(60));
  console.log(`RESULTADO: ${alertas.length} alerta(s) generada(s)`);
  console.log("=".repeat(60) + "\n");
  
  // PASO 3: Mostrar alertas generadas
  if (alertas.length > 0) {
    alertas.forEach((alerta, index) => {
      console.log(`ALERTA ${index + 1}:`);
      console.log(`   ID: ${alerta.id}`);
      console.log(`   Tipo: ${alerta.type}`);
      console.log(`   Severidad: ${alerta.severity}`);
      console.log(`   Medicamentos: ${alerta.medicine1} + ${alerta.medicine2}`);
      console.log(`   Descripción: ${alerta.description}`);
      console.log(`   Recomendación: ${alerta.recommendation}`);
      console.log(`   Estado: ${alerta.status}`);
      console.log(`   Acción requerida: ${alerta.action}`);
      console.log("");
    });
    
    // PASO 4: Obtener comportamiento del tipo de alerta
    const primeraAlerta = alertas[0];
    const tipoAlerta = tiposAlertas.find(t => t.id === primeraAlerta.alertTypeId);
    
    if (tipoAlerta) {
      console.log("🎯 COMPORTAMIENTO DE LA ALERTA:");
      console.log(`   Código: ${tipoAlerta.code}`);
      console.log(`   Comportamiento: ${tipoAlerta.behavior}`);
      
      if (tipoAlerta.behavior === "block") {
        console.log("   🚫 Esta alerta BLOQUEA la prescripción");
        console.log("   ⚠️  El médico debe justificar para continuar");
      }
      
      console.log(`   Requiere confirmación: ${tipoAlerta.requiresAcknowledgment ? "Sí" : "No"}`);
      console.log(`   Requiere justificación: ${tipoAlerta.requiresJustification ? "Sí" : "No"}`);
      console.log(`   Notificar a farmacia: ${tipoAlerta.notifyPharmacy ? "Sí" : "No"}`);
      console.log("");
    }
  } else {
    console.log("✅ No se detectaron alertas. Prescripción segura.");
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("FIN DEL DEMO");
  console.log("=".repeat(60) + "\n");
}

// Ejecutar demo
ejemploCompleto().catch(console.error);

// ============================================
// 5. EXPORTACIONES PARA USO EN LA APLICACIÓN
// ============================================

export {
  AlertEvaluationService,
  tiposAlertas,
  reglasInteracciones,
  configuracionesNotificaciones
};

export type {
  TipoAlerta,
  ReglaInteraccion,
  ConfiguracionNotificacion,
  AlertaGenerada
};
