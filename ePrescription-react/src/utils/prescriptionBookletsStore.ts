/**
 * Store para Control de Talonarios de Recetas Médicas
 * Gestiona la compra, asignación y control de boletas por profesional
 * 
 * REGLAS:
 * - Una receta = Una boleta
 * - Control estricto de saldo
 * - Máximo de talonarios parametrizable
 * - TIPOS DE TALONARIOS:
 *   * Estupefacientes: Solo 1 medicamento por boleta
 *   * Psicotrópicos: Solo 1 medicamento por boleta
 *   * Antimicrobianos: Hasta 3 medicamentos por boleta
 *   * Receta libre: Múltiples medicamentos (sin mezclar con los anteriores)
 * - Cada talonario específico SOLO puede usarse para su tipo de medicamento
 * 
 * Actualizado: 03/12/2025 - v4.0 - REINICIO COMPLETO - Solo DOC-007
 */

export type BookletType = "estupefaciente" | "psicotropico" | "antimicrobiano" | "libre";

export interface PrescriptionBooklet {
  id: string;
  bookletNumber: string; // Número del talonario (ej: "TAL-2025-001")
  bookletType: BookletType; // TIPO DE TALONARIO
  purchaseDate: string;
  doctorId: string;
  doctorName: string;
  doctorLicense: string;
  totalSlips: number; // Total de boletas en el talonario
  usedSlips: number; // Boletas usadas
  availableSlips: number; // Boletas disponibles
  status: "active" | "completed" | "cancelled";
  slips: BookletSlip[];
}

export interface BookletSlip {
  slipNumber: string; // Número de boleta (ej: "0001")
  fullSlipNumber: string; // Número completo (ej: "TAL-2025-001-0001")
  status: "available" | "used" | "cancelled";
  usedDate?: string;
  prescriptionNumber?: string; // Número de receta asociada
}

export interface BookletPurchase {
  id: string;
  purchaseDate: string;
  doctorId: string;
  doctorName: string;
  doctorLicense: string;
  bookletType: BookletType; // TIPO DE TALONARIO
  quantity: number; // Cantidad de talonarios comprados
  slipsPerBooklet: number; // Boletas por talonario
  totalCost: number;
  paymentMethod: string;
  status: "pending" | "completed" | "cancelled";
  bookletsGenerated: string[]; // IDs de talonarios generados
  invoiceNumber: string; // Número de factura generado
}

// Store en memoria
const bookletsStore: Record<string, PrescriptionBooklet> = {};
const purchasesStore: Record<string, BookletPurchase> = {};

// Contador global para talonarios
let bookletCounter = 1;

// Contadores globales de boletas por tipo de talonario
// Cada tipo de talonario tiene su propia numeración consecutiva única
const slipCounters: Record<BookletType, number> = {
  estupefaciente: 0,
  psicotropico: 0,
  antimicrobiano: 0,
  libre: 0
};

// VERSIÓN DEL SISTEMA DE DATOS
const STORE_VERSION = "4.0.0-FINAL";

// Función de limpieza forzada
const resetAllStores = () => {
  // Limpiar todos los stores
  Object.keys(bookletsStore).forEach(key => delete bookletsStore[key]);
  Object.keys(purchasesStore).forEach(key => delete purchasesStore[key]);
  
  // Resetear contadores
  bookletCounter = 1;
  slipCounters.estupefaciente = 0;
  slipCounters.psicotropico = 0;
  slipCounters.antimicrobiano = 0;
  slipCounters.libre = 0;
  
  console.log('🧹 Stores limpiados completamente');
};

/**
 * API de Talonarios
 */
export const PrescriptionBookletsAPI = {
  
  /**
   * Obtener todos los talonarios de un doctor
   */
  getDoctorBooklets: (doctorId: string): PrescriptionBooklet[] => {
    return Object.values(bookletsStore).filter(b => b.doctorId === doctorId);
  },

  /**
   * Obtener saldo total de boletas disponibles para un doctor
   */
  getDoctorAvailableSlips: (doctorId: string): number => {
    const booklets = PrescriptionBookletsAPI.getDoctorBooklets(doctorId);
    return booklets
      .filter(b => b.status === "active")
      .reduce((sum, b) => sum + b.availableSlips, 0);
  },

  /**
   * Obtener saldo de boletas por tipo de talonario
   */
  getDoctorAvailableSlipsByType: (doctorId: string): Record<BookletType, number> => {
    const booklets = PrescriptionBookletsAPI.getDoctorBooklets(doctorId);
    
    // Inicializar con 0 para todos los tipos
    const result: Record<BookletType, number> = {
      estupefaciente: 0,
      psicotropico: 0,
      antimicrobiano: 0,
      libre: 0
    };
    
    // Sumar boletas disponibles por tipo
    booklets
      .filter(b => b.status === "active")
      .forEach(b => {
        result[b.bookletType] += b.availableSlips;
      });
    
    return result;
  },

  /**
   * Obtener estadísticas de talonarios por doctor
   */
  getDoctorStatistics: (doctorId: string) => {
    const booklets = PrescriptionBookletsAPI.getDoctorBooklets(doctorId);
    const activeBooklets = booklets.filter(b => b.status === "active");
    const completedBooklets = booklets.filter(b => b.status === "completed");
    
    const totalSlips = booklets.reduce((sum, b) => sum + b.totalSlips, 0);
    const usedSlips = booklets.reduce((sum, b) => sum + b.usedSlips, 0);
    const availableSlips = booklets.reduce((sum, b) => sum + b.availableSlips, 0);

    return {
      totalBooklets: booklets.length,
      activeBooklets: activeBooklets.length,
      completedBooklets: completedBooklets.length,
      totalSlips,
      usedSlips,
      availableSlips,
      usagePercentage: totalSlips > 0 ? (usedSlips / totalSlips) * 100 : 0
    };
  },

  /**
   * Comprar talonarios (genera nuevos talonarios)
   */
  purchaseBooklets: (
    doctorId: string,
    doctorName: string,
    doctorLicense: string,
    quantity: number,
    slipsPerBooklet: number,
    paymentMethod: string,
    bookletType: BookletType
  ): { success: boolean; purchase?: BookletPurchase; error?: string } => {
    
    // Validar límite máximo (se obtiene de configuración)
    const maxBooklets = ConfigurationAPI.getMaxBookletsPerPurchase();
    if (quantity > maxBooklets) {
      return {
        success: false,
        error: `No se pueden comprar más de ${maxBooklets} talonarios por transacción`
      };
    }

    const purchaseId = `PUR-${Date.now()}`;
    const invoiceNumber = `INV-${Date.now()}`;
    const year = new Date().getFullYear();
    const bookletsGenerated: string[] = [];

    // Generar los talonarios
    for (let i = 0; i < quantity; i++) {
      const bookletId = `BKL-${Date.now()}-${i}`;
      const bookletNumber = `TAL-${year}-${String(bookletCounter).padStart(6, '0')}`;
      bookletCounter++;

      // Generar boletas con numeración consecutiva global por tipo
      const slips: BookletSlip[] = [];
      const startSlipNumber = slipCounters[bookletType]; // Número inicial para este talonario
      
      for (let j = 0; j < slipsPerBooklet; j++) {
        const currentSlipNumber = startSlipNumber + j + 1; // Numeración consecutiva global
        const slipNumber = String(currentSlipNumber).padStart(5, '0'); // Formato: 00001, 00002, etc.
        slips.push({
          slipNumber,
          fullSlipNumber: `${bookletNumber}-${slipNumber}`,
          status: "available"
        });
      }
      
      // Incrementar el contador global para el siguiente talonario de este tipo
      slipCounters[bookletType] += slipsPerBooklet;

      // Crear talonario
      const booklet: PrescriptionBooklet = {
        id: bookletId,
        bookletNumber,
        bookletType,
        purchaseDate: new Date().toISOString(),
        doctorId,
        doctorName,
        doctorLicense,
        totalSlips: slipsPerBooklet,
        usedSlips: 0,
        availableSlips: slipsPerBooklet,
        status: "active",
        slips
      };

      bookletsStore[bookletId] = booklet;
      bookletsGenerated.push(bookletId);
    }

    // Registrar compra
    const purchase: BookletPurchase = {
      id: purchaseId,
      purchaseDate: new Date().toISOString(),
      doctorId,
      doctorName,
      doctorLicense,
      bookletType,
      quantity,
      slipsPerBooklet,
      totalCost: quantity * slipsPerBooklet * 1000, // Simulado: $1000 por boleta
      paymentMethod,
      status: "completed",
      bookletsGenerated,
      invoiceNumber
    };

    purchasesStore[purchaseId] = purchase;

    return { success: true, purchase };
  },

  /**
   * Asignar próxima boleta disponible a una receta
   */
  assignSlipToPrescription: (
    doctorId: string,
    prescriptionNumber: string,
    bookletType?: BookletType // NUEVO: Parámetro opcional para especificar tipo
  ): { success: boolean; slip?: { bookletNumber: string; slipNumber: string; fullSlipNumber: string }; error?: string } => {
    
    // Buscar talonario activo con boletas disponibles
    let activeBooklets = Object.values(bookletsStore)
      .filter(b => b.doctorId === doctorId && b.status === "active" && b.availableSlips > 0)
      .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()); // Usar el más antiguo primero

    // Si se especificó un tipo, filtrar solo ese tipo
    if (bookletType) {
      activeBooklets = activeBooklets.filter(b => b.bookletType === bookletType);
    }

    if (activeBooklets.length === 0) {
      const errorMsg = bookletType 
        ? `No hay boletas de ${BookletUtils.getBookletTypeLabel(bookletType)} disponibles. Por favor, compre más talonarios.`
        : "No hay boletas disponibles. Por favor, compre más talonarios.";
      
      return {
        success: false,
        error: errorMsg
      };
    }

    const booklet = activeBooklets[0];
    
    // Buscar primera boleta disponible
    const availableSlip = booklet.slips.find(s => s.status === "available");
    
    if (!availableSlip) {
      return {
        success: false,
        error: "Error interno: Talonario sin boletas disponibles"
      };
    }

    // Marcar boleta como usada
    availableSlip.status = "used";
    availableSlip.usedDate = new Date().toISOString();
    availableSlip.prescriptionNumber = prescriptionNumber;

    // Actualizar contadores del talonario
    booklet.usedSlips++;
    booklet.availableSlips--;

    // Si se terminaron todas las boletas, marcar talonario como completado
    if (booklet.availableSlips === 0) {
      booklet.status = "completed";
    }

    return {
      success: true,
      slip: {
        bookletNumber: booklet.bookletNumber,
        slipNumber: availableSlip.slipNumber,
        fullSlipNumber: availableSlip.fullSlipNumber
      }
    };
  },

  /**
   * Obtener información de una boleta específica
   */
  getSlipInfo: (fullSlipNumber: string): { booklet?: PrescriptionBooklet; slip?: BookletSlip } | null => {
    for (const booklet of Object.values(bookletsStore)) {
      const slip = booklet.slips.find(s => s.fullSlipNumber === fullSlipNumber);
      if (slip) {
        return { booklet, slip };
      }
    }
    return null;
  },

  /**
   * Cancelar una boleta (liberar si no se usó)
   */
  cancelSlip: (fullSlipNumber: string): boolean => {
    const info = PrescriptionBookletsAPI.getSlipInfo(fullSlipNumber);
    if (!info) return false;

    const { booklet, slip } = info;
    
    if (slip.status === "available") {
      slip.status = "cancelled";
      booklet.availableSlips--;
      return true;
    }
    
    return false;
  },

  /**
   * Obtener historial de compras de un doctor
   */
  getDoctorPurchases: (doctorId: string): BookletPurchase[] => {
    return Object.values(purchasesStore)
      .filter(p => p.doctorId === doctorId)
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
  },

  /**
   * Obtener todas las compras (admin)
   */
  getAllPurchases: (): BookletPurchase[] => {
    return Object.values(purchasesStore)
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
  },

  /**
   * Obtener contadores globales de numeración de boletas por tipo
   * Útil para auditoría y depuración
   */
  getSlipCounters: (): Record<BookletType, number> => {
    return { ...slipCounters };
  },

  /**
   * Obtener estadísticas de numeración global
   * Muestra el rango total de boletas emitidas por tipo
   */
  getSlipNumerationStats: (): Record<BookletType, { totalIssued: number; nextNumber: number; range: string }> => {
    return {
      estupefaciente: {
        totalIssued: slipCounters.estupefaciente,
        nextNumber: slipCounters.estupefaciente + 1,
        range: slipCounters.estupefaciente === 0 
          ? 'Sin boletas emitidas' 
          : `00001 - ${String(slipCounters.estupefaciente).padStart(5, '0')}`
      },
      psicotropico: {
        totalIssued: slipCounters.psicotropico,
        nextNumber: slipCounters.psicotropico + 1,
        range: slipCounters.psicotropico === 0 
          ? 'Sin boletas emitidas' 
          : `00001 - ${String(slipCounters.psicotropico).padStart(5, '0')}`
      },
      antimicrobiano: {
        totalIssued: slipCounters.antimicrobiano,
        nextNumber: slipCounters.antimicrobiano + 1,
        range: slipCounters.antimicrobiano === 0 
          ? 'Sin boletas emitidas' 
          : `00001 - ${String(slipCounters.antimicrobiano).padStart(5, '0')}`
      },
      libre: {
        totalIssued: slipCounters.libre,
        nextNumber: slipCounters.libre + 1,
        range: slipCounters.libre === 0 
          ? 'Sin boletas emitidas' 
          : `00001 - ${String(slipCounters.libre).padStart(5, '0')}`
      }
    };
  }
};

/**
 * API de Configuración de Talonarios
 */
export const ConfigurationAPI = {
  // Configuración en memoria (en producción vendría de base de datos)
  config: {
    maxBookletsPerPurchase: 10, // Máximo de talonarios por compra
    slipsPerBooklet: 50, // Boletas por talonario
    costPerSlip: 1000, // Costo por boleta en pesos
    allowPurchaseWithZeroBalance: true // Permitir compra cuando saldo = 0
  },

  getMaxBookletsPerPurchase: (): number => {
    return ConfigurationAPI.config.maxBookletsPerPurchase;
  },

  setMaxBookletsPerPurchase: (max: number): void => {
    ConfigurationAPI.config.maxBookletsPerPurchase = max;
  },

  getSlipsPerBooklet: (): number => {
    return ConfigurationAPI.config.slipsPerBooklet;
  },

  setSlipsPerBooklet: (slips: number): void => {
    ConfigurationAPI.config.slipsPerBooklet = slips;
  },

  getCostPerSlip: (): number => {
    return ConfigurationAPI.config.costPerSlip;
  },

  setCostPerSlip: (cost: number): void => {
    ConfigurationAPI.config.costPerSlip = cost;
  },

  getAllConfig: () => {
    return { ...ConfigurationAPI.config };
  }
};

/**
 * Utilidades de Talonarios
 */
export const BookletUtils = {
  /**
   * Obtener etiqueta legible del tipo de talonario
   */
  getBookletTypeLabel: (type: BookletType): string => {
    const labels: Record<BookletType, string> = {
      estupefaciente: "Estupefacientes",
      psicotropico: "Psicotrópicos",
      antimicrobiano: "Antimicrobianos",
      libre: "Receta Libre"
    };
    return labels[type];
  },

  /**
   * Obtener límite de medicamentos por tipo de talonario
   */
  getMedicationLimit: (type: BookletType): number | string => {
    const limits: Record<BookletType, number | string> = {
      estupefaciente: 1,
      psicotropico: 1,
      antimicrobiano: 3,
      libre: "Sin límite"
    };
    return limits[type];
  },

  /**
   * Obtener color del badge según tipo de talonario
   */
  getBookletTypeColor: (type: BookletType): string => {
    const colors: Record<BookletType, string> = {
      estupefaciente: "bg-red-100 text-red-800 border-red-300",
      psicotropico: "bg-orange-100 text-orange-800 border-orange-300",
      antimicrobiano: "bg-purple-100 text-purple-800 border-purple-300",
      libre: "bg-green-100 text-green-800 border-green-300"
    };
    return colors[type];
  },

  /**
   * Validar si se puede agregar medicamento según tipo de talonario
   */
  canAddMedication: (bookletType: BookletType, currentMedicationCount: number): { allowed: boolean; message?: string } => {
    const limit = BookletUtils.getMedicationLimit(bookletType);
    
    if (limit === "Sin límite") {
      return { allowed: true };
    }
    
    if (currentMedicationCount >= (limit as number)) {
      return {
        allowed: false,
        message: `Talonario de ${BookletUtils.getBookletTypeLabel(bookletType)}: máximo ${limit} medicamento${limit === 1 ? '' : 's'} por receta`
      };
    }
    
    return { allowed: true };
  }
};

// ============================================================================
// INICIALIZACIÓN DE DATOS MOCK - VERSIÓN 4.0 DEFINITIVA
// ============================================================================
const initializeMockBooklets = () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`🏥 INICIALIZANDO TALONARIOS - VERSIÓN ${STORE_VERSION}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  
  // PASO 1: Limpiar stores completamente
  resetAllStores();
  console.log('');
  
  // Doctor único
  const doctorId = "DOC-007";
  const doctorName = "Dr. Miguel Ángel Torres Jiménez";
  const doctorLicense = "RM-78901-COL";

  console.log(`👨‍⚕️ Doctor: ${doctorName} (${doctorId})`);
  console.log(`📋 Licencia: ${doctorLicense}`);
  console.log('');
  console.log('──────────────────────────────────────────────────────────');
  console.log('📦 COMPRANDO TALONARIOS...');
  console.log('──────────────────────────────────────────────────────────');
  console.log('');

  // 1. ESTUPEFACIENTES - 2 talonarios de 25 boletas
  console.log('🔴 1. ESTUPEFACIENTES');
  const est = PrescriptionBookletsAPI.purchaseBooklets(
    doctorId, doctorName, doctorLicense,
    2, 25, "Transferencia", "estupefaciente"
  );
  console.log(`   ${est.success ? '✅' : '❌'} 2 talonarios × 25 boletas = 50 boletas`);
  if (est.error) console.log(`   ❌ ERROR: ${est.error}`);
  console.log('');

  // 2. PSICOTRÓPICOS - 1 talonario de 25 boletas
  console.log('🟠 2. PSICOTRÓPICOS');
  const psi = PrescriptionBookletsAPI.purchaseBooklets(
    doctorId, doctorName, doctorLicense,
    1, 25, "Transferencia", "psicotropico"
  );
  console.log(`   ${psi.success ? '✅' : '❌'} 1 talonario × 25 boletas = 25 boletas`);
  if (psi.error) console.log(`   ❌ ERROR: ${psi.error}`);
  console.log('');

  // 3. ANTIMICROBIANOS - 1 talonario de 50 boletas
  console.log('🔵 3. ANTIMICROBIANOS');
  const ant = PrescriptionBookletsAPI.purchaseBooklets(
    doctorId, doctorName, doctorLicense,
    1, 50, "Transferencia", "antimicrobiano"
  );
  console.log(`   ${ant.success ? '✅' : '❌'} 1 talonario × 50 boletas = 50 boletas`);
  if (ant.error) console.log(`   ❌ ERROR: ${ant.error}`);
  console.log('');

  // 4. RECETA LIBRE - 3 talonarios de 50 boletas
  console.log('🟢 4. RECETA LIBRE');
  const lib = PrescriptionBookletsAPI.purchaseBooklets(
    doctorId, doctorName, doctorLicense,
    3, 50, "Transferencia", "libre"
  );
  console.log(`   ${lib.success ? '✅' : '❌'} 3 talonarios × 50 boletas = 150 boletas`);
  if (lib.error) console.log(`   ❌ ERROR: ${lib.error}`);
  console.log('');

  // Verificar saldos
  console.log('──────────────────────────────────────────────────────────');
  console.log('📊 VERIFICACIÓN DE SALDOS');
  console.log('──────────────────────────────────────────────────────────');
  console.log('');
  
  const saldos = PrescriptionBookletsAPI.getDoctorAvailableSlipsByType(doctorId);
  const total = saldos.estupefaciente + saldos.psicotropico + saldos.antimicrobiano + saldos.libre;
  
  console.log(`   🔴 Estupefacientes:  ${String(saldos.estupefaciente).padStart(3)} boletas`);
  console.log(`   🟠 Psicotrópicos:    ${String(saldos.psicotropico).padStart(3)} boletas`);
  console.log(`   🔵 Antimicrobianos:  ${String(saldos.antimicrobiano).padStart(3)} boletas`);
  console.log(`   🟢 Receta Libre:     ${String(saldos.libre).padStart(3)} boletas`);
  console.log(`   ─────────────────────────────`);
  console.log(`   📋 TOTAL:            ${String(total).padStart(3)} boletas`);
  console.log('');
  
  // Verificar estado del store
  const allBooklets = PrescriptionBookletsAPI.getDoctorBooklets(doctorId);
  console.log('──────────────────────────────────────────────────────────');
  console.log('🔍 ESTADO DEL STORE');
  console.log('──────────────────────────────────────────────────────────');
  console.log('');
  console.log(`   Total de talonarios registrados: ${allBooklets.length}`);
  allBooklets.forEach(b => {
    console.log(`   - ${b.bookletNumber} | ${BookletUtils.getBookletTypeLabel(b.bookletType)} | ${b.availableSlips}/${b.totalSlips} disponibles`);
  });
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ INICIALIZACIÓN COMPLETADA CON ÉXITO');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
};

// Ejecutar inicialización
initializeMockBooklets();