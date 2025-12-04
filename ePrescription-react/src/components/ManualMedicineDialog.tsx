import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, Trash2, Pill, Package, Check, X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { MedicineClassificationAPI, PRESCRIPTION_RULES, type MedicineCategory } from "../utils/medicineClassificationStore";

export interface ManualMedicineEntry {
  genericName: string;
  dose: string;
  frequency: string;
  via: string;
  duration: string;
  instructions: string;
  category?: MedicineCategory;
}

interface ManualMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMedicationsAdded: (medications: ManualMedicineEntry[]) => void;
}

// Medicamentos organizados por categoría
const MEDICINES_BY_CATEGORY = {
  narcotics: {
    label: "Estupefacientes",
    color: "bg-red-100 text-red-800 border-red-300",
    medicines: [
      "Morfina",
      "Fentanilo",
      "Oxicodona",
      "Metadona",
      "Hidromorfona",
      "Buprenorfina",
    ]
  },
  psychotropics: {
    label: "Psicotrópicos",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    medicines: [
      "Diazepam",
      "Alprazolam",
      "Lorazepam",
      "Clonazepam",
      "Zolpidem",
      "Metilfenidato",
    ]
  },
  antimicrobials: {
    label: "Antimicrobianos",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    medicines: [
      "Amoxicilina",
      "Amoxicilina + Ácido Clavulánico",
      "Azitromicina",
      "Ciprofloxacino",
      "Levofloxacino",
      "Cefalexina",
      "Ceftriaxona",
      "Cefazolina",
      "Cefotaxima",
      "Cefuroxima",
      "Claritromicina",
      "Penicilina",
      "Eritromicina",
      "Metronidazol",
      "Trimetoprim + Sulfametoxazol",
      "Doxiciclina",
      "Nitrofurantoína",
      "Fosfomicina",
    ]
  },
  free: {
    label: "Medicamentos Libres",
    color: "bg-green-100 text-green-800 border-green-300",
    medicines: [
      // Analgésicos y Antiinflamatorios
      "Paracetamol",
      "Ibuprofeno",
      "Naproxeno",
      "Diclofenaco",
      "Ketorolaco",
      "Celecoxib",
      "Meloxicam",
      "Aspirina",
      "Tramadol",
      "Codeína",
      "Tapentadol",
      
      // Antihistamínicos
      "Loratadina",
      "Cetirizina",
      "Desloratadina",
      "Fexofenadina",
      "Difenhidramina",
      
      // Antihipertensivos
      "Losartán",
      "Enalapril",
      "Amlodipino",
      "Hidroclorotiazida",
      "Valsartán",
      "Olmesartán",
      "Atenolol",
      "Metoprolol",
      
      // Antidiabéticos
      "Metformina",
      "Glibenclamida",
      "Insulina NPH",
      "Insulina Rápida",
      "Sitagliptina",
      "Empagliflozina",
      
      // Gastrointestinales
      "Omeprazol",
      "Esomeprazol",
      "Ranitidina",
      "Pantoprazol",
      "Sucralfato",
      "Loperamida",
      "Metoclopramida",
      "Ondansetrón",
      "Domperidona",
      
      // Respiratorios
      "Salbutamol",
      "Budesonida",
      "Montelukast",
      "Dextrometorfano",
      "Ambroxol",
      "Acetilcisteína",
      
      // Corticosteroides
      "Prednisona",
      "Dexametasona",
      "Hidrocortisona",
      "Betametasona",
      
      // Cardiovasculares
      "Atorvastatina",
      "Simvastatina",
      "Warfarina",
      "Clopidogrel",
      "Isosorbida",
      
      // Otros
      "Levotiroxina",
      "Vitamina D",
      "Complejo B",
      "Ácido Fólico",
      "Hierro",
    ]
  }
};

// Dosis comunes
const COMMON_DOSES = [
  "250 mg",
  "500 mg",
  "1 g",
  "1 tableta",
  "2 tabletas",
  "1 cápsula",
  "2 cápsulas",
  "5 ml",
  "10 ml",
  "15 ml",
  "20 ml",
  "20 mg",
  "40 mg",
  "80 mg",
  "100 mg",
  "200 mg",
  "400 mg",
  "800 mg",
  "1000 mg",
  "2.5 mg",
  "5 mg",
  "10 mg",
  "25 mg",
  "50 mg",
  "75 mg",
  "150 mg",
];

// Frecuencias comunes
const COMMON_FREQUENCIES = [
  "Cada 4 horas",
  "Cada 6 horas",
  "Cada 8 horas",
  "Cada 12 horas",
  "Cada 24 horas",
  "1 vez al día",
  "2 veces al día",
  "3 veces al día",
  "4 veces al día",
  "Antes de dormir",
  "En ayunas",
  "Con las comidas",
  "Después de las comidas",
  "Según necesidad",
  "Por razón necesaria (PRN)",
];

// Duraciones comunes
const COMMON_DURATIONS = [
  "3 días",
  "5 días",
  "7 días",
  "10 días",
  "14 días",
  "15 días",
  "21 días",
  "30 días",
  "1 mes",
  "2 meses",
  "3 meses",
  "6 meses",
  "Continuo",
  "Hasta nueva orden",
];

// Función para obtener el color del badge según la categoría
const getCategoryBadgeColor = (category: MedicineCategory): string => {
  const categoryInfo = Object.values(MEDICINES_BY_CATEGORY).find(
    cat => PRESCRIPTION_RULES[category as keyof typeof PRESCRIPTION_RULES]?.label === cat.label
  );
  return categoryInfo?.color || "bg-gray-100 text-gray-800 border-gray-300";
};

export function ManualMedicineDialog({
  open,
  onOpenChange,
  onMedicationsAdded
}: ManualMedicineDialogProps) {
  const [medications, setMedications] = useState<ManualMedicineEntry[]>([]);
  const [currentMedicine, setCurrentMedicine] = useState<ManualMedicineEntry>({
    genericName: "",
    dose: "",
    frequency: "",
    via: "",
    duration: "",
    instructions: ""
  });

  // Determinar si los campos deben estar habilitados
  const isFieldsEnabled = currentMedicine.genericName.trim() !== "";

  const handleAddToList = () => {
    // Validar campos requeridos
    if (!currentMedicine.genericName.trim()) {
      toast.error("Nombre del medicamento requerido");
      return;
    }
    if (!currentMedicine.dose.trim()) {
      toast.error("Dosis requerida");
      return;
    }
    if (!currentMedicine.frequency.trim()) {
      toast.error("Frecuencia requerida");
      return;
    }
    if (!currentMedicine.via.trim()) {
      toast.error("Vía de administración requerida");
      return;
    }
    if (!currentMedicine.duration.trim()) {
      toast.error("Duración requerida");
      return;
    }

    // Clasificar el medicamento
    const category = MedicineClassificationAPI.classifyMedicine(currentMedicine.genericName);
    const medicineWithCategory = { ...currentMedicine, category };

    setMedications(prev => [...prev, medicineWithCategory]);
    
    // Limpiar formulario
    setCurrentMedicine({
      genericName: "",
      dose: "",
      frequency: "",
      via: "",
      duration: "",
      instructions: ""
    });

    toast.success(`Medicamento agregado a la lista`, {
      description: `${currentMedicine.genericName} - Total: ${medications.length + 1}`,
      duration: 2000
    });
  };

  const handleRemoveFromList = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (medications.length === 0) {
      toast.error("Debe agregar al menos un medicamento");
      return;
    }

    onMedicationsAdded(medications);
    
    // Limpiar y cerrar
    setMedications([]);
    setCurrentMedicine({
      genericName: "",
      dose: "",
      frequency: "",
      via: "",
      duration: "",
      instructions: ""
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (medications.length > 0) {
      const confirmCancel = confirm(
        `Tiene ${medications.length} medicamento(s) en la lista.\n\n¿Está seguro de cancelar? Se perderán los datos.`
      );
      if (!confirmCancel) return;
    }

    setMedications([]);
    setCurrentMedicine({
      genericName: "",
      dose: "",
      frequency: "",
      via: "",
      duration: "",
      instructions: ""
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Pill className="w-6 h-6 text-primary" />
            Agregar Medicamentos Manualmente
          </DialogTitle>
          <DialogDescription>
            Agregue uno o más medicamentos. El sistema generará automáticamente las recetas necesarias según las categorías y límites de cada talonario.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulario para agregar medicamento */}
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Medicamento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="genericName">
                  Nombre del Medicamento (Genérico o Comercial) *
                </Label>
                <select
                  id="genericName"
                  value={currentMedicine.genericName}
                  onChange={(e) => setCurrentMedicine(prev => ({ ...prev, genericName: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccione un medicamento...</option>
                  
                  {/* Estupefacientes */}
                  <optgroup label="🔴 Estupefacientes (1 por receta)">
                    {MEDICINES_BY_CATEGORY.narcotics.medicines.map((medicine) => (
                      <option key={medicine} value={medicine}>
                        {medicine}
                      </option>
                    ))}
                  </optgroup>

                  {/* Psicotrópicos */}
                  <optgroup label="🟠 Psicotrópicos (1 por receta)">
                    {MEDICINES_BY_CATEGORY.psychotropics.medicines.map((medicine) => (
                      <option key={medicine} value={medicine}>
                        {medicine}
                      </option>
                    ))}
                  </optgroup>

                  {/* Antimicrobianos */}
                  <optgroup label="🟡 Antimicrobianos (hasta 3 por receta)">
                    {MEDICINES_BY_CATEGORY.antimicrobials.medicines.map((medicine) => (
                      <option key={medicine} value={medicine}>
                        {medicine}
                      </option>
                    ))}
                  </optgroup>

                  {/* Medicamentos Libres */}
                  <optgroup label="🟢 Medicamentos Libres (sin límite)">
                    {MEDICINES_BY_CATEGORY.free.medicines.map((medicine) => (
                      <option key={medicine} value={medicine}>
                        {medicine}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <Label htmlFor="dose" className={!isFieldsEnabled ? "text-gray-400" : ""}>
                  Dosis *
                </Label>
                <select
                  id="dose"
                  value={currentMedicine.dose}
                  onChange={(e) => setCurrentMedicine(prev => ({ ...prev, dose: e.target.value }))}
                  disabled={!isFieldsEnabled}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  <option value="">Seleccione una dosis...</option>
                  {COMMON_DOSES.map((dose) => (
                    <option key={dose} value={dose}>
                      {dose}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="frequency" className={!isFieldsEnabled ? "text-gray-400" : ""}>
                  Frecuencia *
                </Label>
                <select
                  id="frequency"
                  value={currentMedicine.frequency}
                  onChange={(e) => setCurrentMedicine(prev => ({ ...prev, frequency: e.target.value }))}
                  disabled={!isFieldsEnabled}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  <option value="">Seleccione una frecuencia...</option>
                  {COMMON_FREQUENCIES.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="via" className={!isFieldsEnabled ? "text-gray-400" : ""}>
                  Vía de Administración *
                </Label>
                <select
                  id="via"
                  value={currentMedicine.via}
                  onChange={(e) => setCurrentMedicine(prev => ({ ...prev, via: e.target.value }))}
                  disabled={!isFieldsEnabled}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  <option value="">Seleccione una vía...</option>
                  <option>Vía Oral</option>
                  <option>Vía Intravenosa</option>
                  <option>Vía Intramuscular</option>
                  <option>Vía Subcutánea</option>
                  <option>Vía Tópica</option>
                  <option>Vía Oftálmica</option>
                  <option>Vía Ótica</option>
                  <option>Vía Nasal</option>
                  <option>Vía Rectal</option>
                  <option>Vía Vaginal</option>
                  <option>Inhalatoria</option>
                </select>
              </div>

              <div>
                <Label htmlFor="duration" className={!isFieldsEnabled ? "text-gray-400" : ""}>
                  Duración del Tratamiento *
                </Label>
                <select
                  id="duration"
                  value={currentMedicine.duration}
                  onChange={(e) => setCurrentMedicine(prev => ({ ...prev, duration: e.target.value }))}
                  disabled={!isFieldsEnabled}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  <option value="">Seleccione una duración...</option>
                  {COMMON_DURATIONS.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="instructions" className={!isFieldsEnabled ? "text-gray-400" : ""}>
                  Instrucciones/Observaciones
                </Label>
                <Textarea
                  id="instructions"
                  value={currentMedicine.instructions}
                  onChange={(e) => setCurrentMedicine(prev => ({ ...prev, instructions: e.target.value }))}
                  disabled={!isFieldsEnabled}
                  placeholder="Ej: Tomar con alimentos, No conducir después de tomar, etc."
                  className="mt-1 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                  rows={2}
                />
              </div>
            </div>

            <Button
              onClick={handleAddToList}
              className="mt-4 w-full md:w-auto"
              variant="default"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar a la Lista
            </Button>
          </div>

          {/* Lista de medicamentos agregados */}
          {medications.length > 0 && (
            <div className="border border-green-200 rounded-lg p-4 bg-green-50/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="w-4 h-4 text-green-600" />
                  Medicamentos a Agregar
                </h3>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  {medications.length} medicamento{medications.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="space-y-3">
                {medications.map((med, index) => {
                  const categoryRules = PRESCRIPTION_RULES[med.category!];
                  const badgeColor = getCategoryBadgeColor(med.category!);
                  
                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              #{index + 1}
                            </Badge>
                            <p className="font-semibold text-gray-900">{med.genericName}</p>
                            {med.category && (
                              <Badge variant="outline" className={badgeColor}>
                                {categoryRules.label}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Dosis:</span> {med.dose}
                            </div>
                            <div>
                              <span className="font-medium">Frecuencia:</span> {med.frequency}
                            </div>
                            <div>
                              <span className="font-medium">Vía:</span> {med.via}
                            </div>
                            <div>
                              <span className="font-medium">Duración:</span> {med.duration}
                            </div>
                            {med.instructions && (
                              <div className="md:col-span-2">
                                <span className="font-medium">Observaciones:</span> {med.instructions}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRemoveFromList(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Información:</strong> El sistema analizará automáticamente estos medicamentos y generará las recetas necesarias según sus categorías (Estupefacientes, Psicotrópicos, Antimicrobianos, Receta Libre), respetando los límites de cada tipo de talonario.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={handleCancel} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={medications.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            <Check className="w-4 h-4 mr-2" />
            Agregar {medications.length > 0 ? `${medications.length} Medicamento${medications.length !== 1 ? 's' : ''}` : 'Medicamentos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
