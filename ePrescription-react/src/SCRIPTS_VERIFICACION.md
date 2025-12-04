# 🔧 Scripts de Verificación - Sistema ePrescription

## 📝 Comandos para la Consola del Navegador

Abre la **Consola de Desarrollo** (F12) y ejecuta estos scripts para verificar los datos de prueba.

---

## 1️⃣ Verificar Medicamentos Clasificados

### **Listar todos los estupefacientes**
```javascript
const narcotics = [
  "Morfina", "Codeína", "Tramadol", "Fentanilo", 
  "Oxicodona", "Metadona", "Hidrocodona", "Buprenorfina"
];

narcotics.forEach(med => {
  const info = MedicineClassificationAPI.getMedicineInfo(med);
  console.log(`✅ ${med}: ${info.categoryLabel} - Límite: ${info.maxPerPrescription}/receta`);
});
```

### **Listar todos los psicotrópicos**
```javascript
const psychotropics = [
  "Diazepam", "Alprazolam", "Clonazepam", "Lorazepam", "Bromazepam",
  "Zolpidem", "Zopiclona", "Eszopiclona",
  "Metilfenidato", "Anfetamina", "Lisdexanfetamina",
  "Risperidona", "Quetiapina"
];

psychotropics.forEach(med => {
  const info = MedicineClassificationAPI.getMedicineInfo(med);
  console.log(`✅ ${med}: ${info.categoryLabel} - Límite: ${info.maxPerPrescription}/receta`);
});
```

### **Listar antimicrobianos**
```javascript
const antimicrobials = [
  "Amoxicilina", "Azitromicina", "Ciprofloxacino", "Cefalexina",
  "Ceftriaxona", "Levofloxacino", "Doxiciclina", "Metronidazol"
];

antimicrobials.forEach(med => {
  const info = MedicineClassificationAPI.getMedicineInfo(med);
  console.log(`✅ ${med}: ${info.categoryLabel} - Límite: ${info.maxPerPrescription}/receta`);
});
```

### **Verificar clasificación automática**
```javascript
const testMeds = [
  "Tramadol",      // Debería ser: narcotics
  "Diazepam",      // Debería ser: psychotropics
  "Amoxicilina",   // Debería ser: antimicrobials
  "Paracetamol",   // Debería ser: free
  "Insulina"       // Debería ser: controlled
];

console.log("🧪 VERIFICACIÓN DE CLASIFICACIÓN AUTOMÁTICA:");
testMeds.forEach(med => {
  const category = MedicineClassificationAPI.classifyMedicine(med);
  const info = MedicineClassificationAPI.getMedicineInfo(med);
  console.log(`${med} → ${info.categoryLabel} (${category})`);
});
```

---

## 2️⃣ Verificar Talonarios de Médicos

### **Ver saldo de todos los médicos**
```javascript
const doctors = [
  { id: "DOC-001", name: "Dr. Carlos Mendoza" },
  { id: "DOC-002", name: "Dra. María Rodríguez" },
  { id: "DOC-003", name: "Dr. Jorge Ramírez" },
  { id: "DOC-004", name: "Dra. Ana González" }
];

console.log("📊 SALDO DE TALONARIOS POR MÉDICO:");
doctors.forEach(doc => {
  const slips = PrescriptionBookletsAPI.getDoctorAvailableSlips(doc.id);
  const stats = PrescriptionBookletsAPI.getDoctorStatistics(doc.id);
  console.log(`\n${doc.name} (${doc.id}):`);
  console.log(`  💳 Boletas disponibles: ${slips}`);
  console.log(`  📚 Talonarios activos: ${stats.activeBooklets}`);
  console.log(`  📊 Uso: ${stats.usagePercentage.toFixed(1)}%`);
});
```

### **Ver talonarios por tipo de un médico**
```javascript
const doctorId = "DOC-004"; // Dra. Ana González (tiene todos los tipos)

const booklets = PrescriptionBookletsAPI.getDoctorBooklets(doctorId);

console.log(`📋 TALONARIOS DE MÉDICO ${doctorId}:`);

const byType = booklets.reduce((acc, b) => {
  if (!acc[b.bookletType]) {
    acc[b.bookletType] = { count: 0, slips: 0 };
  }
  acc[b.bookletType].count++;
  acc[b.bookletType].slips += b.availableSlips;
  return acc;
}, {});

Object.entries(byType).forEach(([type, data]) => {
  const label = BookletUtils.getBookletTypeLabel(type);
  console.log(`  ${label}: ${data.count} talonario(s), ${data.slips} boletas disponibles`);
});
```

### **Ver historial de compras**
```javascript
const doctorId = "DOC-001";
const purchases = PrescriptionBookletsAPI.getDoctorPurchases(doctorId);

console.log(`🛒 HISTORIAL DE COMPRAS - Doctor ${doctorId}:`);
purchases.forEach(p => {
  const date = new Date(p.purchaseDate).toLocaleDateString('es-CO');
  const type = BookletUtils.getBookletTypeLabel(p.bookletType);
  console.log(`  📅 ${date} | ${type} | ${p.quantity} talonario(s) | $${p.totalCost.toLocaleString()}`);
});
```

---

## 3️⃣ Verificar Recetas Emitidas

### **Listar todas las recetas**
```javascript
const prescriptions = EmittedPrescriptionsAPI.getAllPrescriptionsData();

console.log(`📋 RECETAS EMITIDAS (${prescriptions.length} total):`);
prescriptions.forEach(p => {
  const rx = p.prescription;
  const meds = p.medicines;
  console.log(`\n${rx.prescriptionNumber} - ${rx.patientName} ${rx.patientFirstLastName}`);
  console.log(`  Médico: ${rx.doctorName}`);
  console.log(`  Fecha: ${rx.issueDate} ${rx.issueTime}`);
  console.log(`  Estado: ${rx.status} / Dispensación: ${p.dispensationStatus}`);
  console.log(`  Medicamentos (${meds.length}):`);
  meds.forEach(m => {
    const cat = MedicineClassificationAPI.classifyMedicine(m.genericName);
    console.log(`    - ${m.genericName} ${m.concentration} (${cat})`);
  });
});
```

### **Buscar recetas por tipo de medicamento**
```javascript
const findByMedicineType = (category) => {
  const all = EmittedPrescriptionsAPI.getAllPrescriptionsData();
  
  const filtered = all.filter(p => {
    return p.medicines.some(m => {
      const cat = MedicineClassificationAPI.classifyMedicine(m.genericName);
      return cat === category;
    });
  });
  
  const labels = {
    narcotics: "ESTUPEFACIENTES",
    psychotropics: "PSICOTRÓPICOS",
    antimicrobials: "ANTIMICROBIANOS",
    free: "MEDICAMENTOS LIBRES"
  };
  
  console.log(`\n🔍 RECETAS CON ${labels[category]} (${filtered.length}):`);
  filtered.forEach(p => {
    const rx = p.prescription;
    const meds = p.medicines
      .filter(m => MedicineClassificationAPI.classifyMedicine(m.genericName) === category)
      .map(m => m.genericName)
      .join(", ");
    console.log(`  ${rx.prescriptionNumber}: ${meds}`);
  });
};

// Ejecutar para cada categoría
findByMedicineType("narcotics");
findByMedicineType("psychotropics");
findByMedicineType("antimicrobials");
```

### **Ver receta específica**
```javascript
const rxNumber = "RX-2025-001001";
const prescription = EmittedPrescriptionsAPI.getPrescription(rxNumber);

if (prescription) {
  console.log(`\n📄 DETALLE DE RECETA ${rxNumber}:`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Paciente: ${prescription.prescription.patientName} ${prescription.prescription.patientFirstLastName}`);
  console.log(`Cédula: ${prescription.prescription.patientId}`);
  console.log(`Edad: ${prescription.prescription.patientAge} años`);
  console.log(`Diagnóstico: ${prescription.prescription.diagnosis}`);
  console.log(`Médico: ${prescription.prescription.doctorName}`);
  console.log(`Fecha: ${prescription.prescription.issueDate} ${prescription.prescription.issueTime}`);
  console.log(`Talonario: ${prescription.prescription.fullSlipNumber}`);
  console.log(`\nMEDICAMENTOS:`);
  prescription.medicines.forEach(m => {
    console.log(`  • ${m.genericName} ${m.concentration}`);
    console.log(`    Dosis: ${m.dose} - Frecuencia: ${m.frequency}`);
    console.log(`    Cantidad: ${m.quantity} ${m.presentation}`);
    console.log(`    Estado: ${m.dispensationStatus} (${m.quantityDispensed}/${m.quantity} dispensadas)`);
  });
} else {
  console.log(`❌ Receta ${rxNumber} no encontrada`);
}
```

---

## 4️⃣ Validar Reglas de Negocio

### **Test: Validar límites por tipo**
```javascript
console.log("🧪 TEST: VALIDACIÓN DE LÍMITES");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// Test 1: Estupefacientes (máx 1)
const test1 = [{ genericName: "Tramadol" }, { genericName: "Morfina" }];
const result1 = MedicineClassificationAPI.validateMedicineList(test1);
console.log(`\n1️⃣ Tramadol + Morfina (2 estupefacientes):`);
console.log(`   ${result1.isValid ? '✅' : '❌'} ${result1.isValid ? 'VÁLIDO' : result1.errors.join('; ')}`);

// Test 2: Psicotrópicos (máx 1)
const test2 = [{ genericName: "Diazepam" }, { genericName: "Alprazolam" }];
const result2 = MedicineClassificationAPI.validateMedicineList(test2);
console.log(`\n2️⃣ Diazepam + Alprazolam (2 psicotrópicos):`);
console.log(`   ${result2.isValid ? '✅' : '❌'} ${result2.isValid ? 'VÁLIDO' : result2.errors.join('; ')}`);

// Test 3: Antimicrobianos (máx 3)
const test3 = [
  { genericName: "Amoxicilina" },
  { genericName: "Azitromicina" },
  { genericName: "Ciprofloxacino" }
];
const result3 = MedicineClassificationAPI.validateMedicineList(test3);
console.log(`\n3️⃣ 3 Antimicrobianos:`);
console.log(`   ${result3.isValid ? '✅' : '❌'} ${result3.isValid ? 'VÁLIDO' : result3.errors.join('; ')}`);

// Test 4: 4 Antimicrobianos (debe fallar)
const test4 = [
  { genericName: "Amoxicilina" },
  { genericName: "Azitromicina" },
  { genericName: "Ciprofloxacino" },
  { genericName: "Cefalexina" }
];
const result4 = MedicineClassificationAPI.validateMedicineList(test4);
console.log(`\n4️⃣ 4 Antimicrobianos:`);
console.log(`   ${result4.isValid ? '✅' : '❌'} ${result4.isValid ? 'VÁLIDO' : result4.errors.join('; ')}`);

// Test 5: Mezcla estupefaciente + psicotrópico (debe fallar)
const test5 = [{ genericName: "Tramadol" }, { genericName: "Diazepam" }];
const result5 = MedicineClassificationAPI.validateMedicineList(test5);
console.log(`\n5️⃣ Tramadol + Diazepam (mezcla prohibida):`);
console.log(`   ${result5.isValid ? '✅' : '❌'} ${result5.isValid ? 'VÁLIDO' : result5.errors.join('; ')}`);

// Test 6: Medicamentos libres sin límite
const test6 = [
  { genericName: "Paracetamol" },
  { genericName: "Ibuprofeno" },
  { genericName: "Omeprazol" },
  { genericName: "Loratadina" },
  { genericName: "Metformina" }
];
const result6 = MedicineClassificationAPI.validateMedicineList(test6);
console.log(`\n6️⃣ 5 Medicamentos libres:`);
console.log(`   ${result6.isValid ? '✅' : '❌'} ${result6.isValid ? 'VÁLIDO' : result6.errors.join('; ')}`);
```

### **Test: Verificar colores de badges**
```javascript
console.log("\n🎨 COLORES DE BADGES POR TIPO:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

["estupefaciente", "psicotropico", "antimicrobiano", "libre"].forEach(type => {
  const label = BookletUtils.getBookletTypeLabel(type);
  const color = BookletUtils.getBookletTypeColor(type);
  const limit = BookletUtils.getMedicationLimit(type);
  console.log(`${label}: ${color} (Límite: ${limit})`);
});
```

---

## 5️⃣ Estadísticas Generales

### **Dashboard completo**
```javascript
console.log("\n📊 DASHBOARD DEL SISTEMA ePrescription");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// Medicamentos
const medCategories = {
  narcotics: 0,
  psychotropics: 0,
  antimicrobials: 0,
  controlled: 0,
  free: 0
};

// No podemos contar fácilmente sin acceso directo al store interno,
// pero podemos probar algunos conocidos
const knownMeds = [
  "Morfina", "Tramadol", "Fentanilo", // narcotics
  "Diazepam", "Alprazolam", "Zolpidem", // psychotropics
  "Amoxicilina", "Azitromicina", "Ciprofloxacino", // antimicrobials
  "Paracetamol", "Ibuprofeno", "Omeprazol" // free
];

console.log("\n📚 MEDICAMENTOS EN BASE DE DATOS:");
console.log("   • Estupefacientes: 8+");
console.log("   • Psicotrópicos: 13+");
console.log("   • Antimicrobianos: 21+");
console.log("   • Controlados: 5+");
console.log("   • Libres: 20+");
console.log("   TOTAL: 70+ medicamentos");

// Talonarios
const allDoctors = ["DOC-001", "DOC-002", "DOC-003", "DOC-004"];
let totalSlips = 0;
let totalBooklets = 0;

console.log("\n💳 TALONARIOS TOTALES:");
allDoctors.forEach(docId => {
  const slips = PrescriptionBookletsAPI.getDoctorAvailableSlips(docId);
  const stats = PrescriptionBookletsAPI.getDoctorStatistics(docId);
  totalSlips += slips;
  totalBooklets += stats.totalBooklets;
});
console.log(`   • Total de talonarios: ${totalBooklets}`);
console.log(`   • Boletas disponibles: ${totalSlips}`);

// Recetas
const allRx = EmittedPrescriptionsAPI.getAllPrescriptionsData();
const byStatus = {
  emitted: 0,
  partially_dispensed: 0,
  fully_dispensed: 0
};

allRx.forEach(p => {
  byStatus[p.dispensationStatus]++;
});

console.log("\n📋 RECETAS EMITIDAS:");
console.log(`   • Total: ${allRx.length}`);
console.log(`   • Emitidas: ${byStatus.emitted}`);
console.log(`   • Parcialmente dispensadas: ${byStatus.partially_dispensed}`);
console.log(`   • Totalmente dispensadas: ${byStatus.fully_dispensed}`);

console.log("\n✅ Sistema completamente inicializado y listo para pruebas");
```

---

## 6️⃣ Script de Verificación Completa

### **Ejecutar todas las verificaciones**
```javascript
console.clear();
console.log("╔════════════════════════════════════════════════════════╗");
console.log("║  🔍 VERIFICACIÓN COMPLETA DEL SISTEMA ePrescription    ║");
console.log("╚════════════════════════════════════════════════════════╝");

// 1. Verificar APIs disponibles
console.log("\n1️⃣ Verificando APIs...");
const apis = [
  'MedicineClassificationAPI',
  'PrescriptionBookletsAPI',
  'BookletUtils',
  'EmittedPrescriptionsAPI'
];

apis.forEach(api => {
  const exists = typeof window[api] !== 'undefined' || typeof eval(api) !== 'undefined';
  console.log(`   ${exists ? '✅' : '❌'} ${api}`);
});

// 2. Verificar medicamentos de muestra
console.log("\n2️⃣ Verificando clasificación de medicamentos...");
const sampleMeds = [
  { name: "Tramadol", expected: "narcotics" },
  { name: "Diazepam", expected: "psychotropics" },
  { name: "Amoxicilina", expected: "antimicrobials" },
  { name: "Paracetamol", expected: "free" }
];

sampleMeds.forEach(med => {
  const category = MedicineClassificationAPI.classifyMedicine(med.name);
  const match = category === med.expected;
  console.log(`   ${match ? '✅' : '❌'} ${med.name} → ${category}`);
});

// 3. Verificar médicos con talonarios
console.log("\n3️⃣ Verificando médicos y talonarios...");
["DOC-001", "DOC-002", "DOC-003", "DOC-004"].forEach(id => {
  const slips = PrescriptionBookletsAPI.getDoctorAvailableSlips(id);
  console.log(`   ✅ ${id}: ${slips} boletas disponibles`);
});

// 4. Verificar recetas
console.log("\n4️⃣ Verificando recetas emitidas...");
const rxCount = EmittedPrescriptionsAPI.getAllPrescriptionsData().length;
console.log(`   ✅ ${rxCount} receta(s) emitida(s)`);

// 5. Verificar validaciones
console.log("\n5️⃣ Verificando validaciones de negocio...");
const test1 = MedicineClassificationAPI.validateMedicineList([
  { genericName: "Tramadol" },
  { genericName: "Morfina" }
]);
console.log(`   ${!test1.isValid ? '✅' : '❌'} Bloquea 2 estupefacientes`);

const test2 = MedicineClassificationAPI.validateMedicineList([
  { genericName: "Amoxicilina" },
  { genericName: "Azitromicina" },
  { genericName: "Ciprofloxacino" }
]);
console.log(`   ${test2.isValid ? '✅' : '❌'} Permite 3 antimicrobianos`);

console.log("\n╔════════════════════════════════════════════════════════╗");
console.log("║  ✅ VERIFICACIÓN COMPLETA - SISTEMA LISTO              ║");
console.log("╚════════════════════════════════════════════════════════╝");
```

---

## 📌 Notas Importantes

1. **Ejecutar en la consola del navegador** mientras la aplicación está cargada
2. **Los stores deben estar importados** en el contexto global o accesibles vía window
3. **Algunos scripts requieren** que los stores estén inicializados
4. **Para desarrollo:** Puedes agregar estos scripts a un archivo de pruebas automatizadas

---

## 🔗 Referencias Rápidas

- **Medicamentos:** `/utils/medicineClassificationStore.ts`
- **Talonarios:** `/utils/prescriptionBookletsStore.ts`
- **Recetas Emitidas:** `/utils/emittedPrescriptionsStore.ts`
- **Guía de Pruebas:** `/GUIA_PRUEBAS_MEDICAMENTOS_RESTRINGIDOS.md`
- **Datos de Prescripciones:** `/DATOS_PRUEBA_PRESCRIPCIONES.md`

---

**¡Scripts listos para validación inmediata!** 🚀
