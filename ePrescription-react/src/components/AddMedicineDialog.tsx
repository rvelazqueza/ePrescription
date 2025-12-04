import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Medicine } from "./MedicineTable";
import { MedicineClassificationAPI } from "../utils/medicineClassificationStore";
import { Badge } from "./ui/badge";

interface AddMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (medicine: Omit<Medicine, 'id'>) => void;
}

// ============================================================================
// MEDICAMENTOS DE PRUEBA POR CATEGORÍA
// ============================================================================

// 🔴 ESTUPEFACIENTES (1 por receta)
const narcoticMedicines = [
  "Morfina",
  "Codeína", 
  "Tramadol",
  "Fentanilo",
  "Oxicodona",
  "Metadona",
  "Hidrocodona",
  "Buprenorfina"
];

// 🟠 PSICOTRÓPICOS (1 por receta)
const psychotropicMedicines = [
  "Diazepam",
  "Alprazolam",
  "Clonazepam",
  "Lorazepam",
  "Bromazepam",
  "Zolpidem",
  "Zopiclona",
  "Eszopiclona",
  "Metilfenidato",
  "Anfetamina",
  "Lisdexanfetamina",
  "Risperidona",
  "Quetiapina"
];

// 🟣 ANTIMICROBIANOS (hasta 3 por receta)
const antimicrobialMedicines = [
  // Penicilinas
  "Amoxicilina",
  "Amoxicilina/Ácido Clavulánico",
  "Penicilina G",
  "Ampicilina",
  // Cefalosporinas
  "Cefalexina",
  "Cefuroxima",
  "Ceftriaxona",
  "Cefepime",
  // Macrólidos
  "Azitromicina",
  "Claritromicina",
  "Eritromicina",
  // Fluoroquinolonas
  "Ciprofloxacino",
  "Levofloxacino",
  "Moxifloxacino",
  // Otros
  "Doxiciclina",
  "Minociclina",
  "Metronidazol",
  "Trimetoprim/Sulfametoxazol",
  "Clindamicina",
  "Vancomicina"
];

// 🔵 CONTROLADOS
const controlledMedicines = [
  "Insulina",
  "Warfarina",
  "Levotiroxina",
  "Isotretinoína",
  "Metotrexato"
];

// 🟢 MEDICAMENTOS LIBRES (sin límite)
const freeMedicines = [
  // Analgésicos
  "Paracetamol",
  "Acetaminofén",
  "Ibuprofeno",
  "Naproxeno",
  "Diclofenaco",
  "Ketoprofeno",
  // Gastroprotectores
  "Omeprazol",
  "Esomeprazol",
  "Pantoprazol",
  "Ranitidina",
  // Antihistamínicos
  "Loratadina",
  "Cetirizina",
  "Desloratadina",
  "Fexofenadina",
  // Otros comunes
  "Metformina",
  "Losartán",
  "Atorvastatina",
  "Salbutamol",
  "Amlodipino",
  "Simvastatina",
  "Aspirina"
];

// Todos los medicamentos para el selector
const allMedicines = [
  ...narcoticMedicines,
  ...psychotropicMedicines,
  ...antimicrobialMedicines,
  ...controlledMedicines,
  ...freeMedicines
].sort();

// Frecuencias comunes
const commonFrequencies = [
  "1 vez al día",
  "2 veces al día",
  "3 veces al día",
  "4 veces al día",
  "Cada 6 horas",
  "Cada 8 horas",
  "Cada 12 horas",
  "Cada 24 horas",
  "Cada 72 horas",
  "Según necesidad"
];

// Vías de administración
const administrationRoutes = [
  "Vía oral",
  "Vía sublingual",
  "Vía tópica",
  "Intramuscular",
  "Intravenosa",
  "Subcutánea",
  "Transdérmica",
  "Oftálmica",
  "Ótica",
  "Nasal",
  "Rectal"
];

export function AddMedicineDialog({ isOpen, onClose, onAdd }: AddMedicineDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    dose: "",
    frequency: "",
    administration: "",
    duration: "",
    observations: ""
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Obtener información de clasificación del medicamento seleccionado
  const selectedMedicineInfo = formData.name 
    ? MedicineClassificationAPI.getMedicineInfo(formData.name)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "El medicamento es requerido";
    }
    if (!formData.quantity.trim()) {
      newErrors.quantity = "La cantidad es requerida";
    }
    if (!formData.dose.trim()) {
      newErrors.dose = "La dosis es requerida";
    }
    if (!formData.frequency.trim()) {
      newErrors.frequency = "La frecuencia es requerida";
    }
    if (!formData.administration.trim()) {
      newErrors.administration = "La vía de administración es requerida";
    }
    if (!formData.duration.trim()) {
      newErrors.duration = "La duración es requerida";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onAdd(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      quantity: "",
      dose: "",
      frequency: "",
      administration: "",
      duration: "",
      observations: ""
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Obtener color del badge según categoría
  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      narcotics: "bg-red-100 text-red-800",
      psychotropics: "bg-orange-100 text-orange-800",
      antimicrobials: "bg-purple-100 text-purple-800",
      controlled: "bg-blue-100 text-blue-800",
      free: "bg-green-100 text-green-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Medicamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="medicine">Medicamento *</Label>
            <Select
              value={formData.name}
              onValueChange={(value) => handleChange('name', value)}
            >
              <SelectTrigger className={errors.name ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccione un medicamento" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 sticky top-0 bg-white">
                  🔴 Estupefacientes (1 por receta)
                </div>
                {narcoticMedicines.map((med) => (
                  <SelectItem key={med} value={med}>
                    <span className="flex items-center gap-2">
                      {med}
                      <span className="text-xs text-red-600">●</span>
                    </span>
                  </SelectItem>
                ))}
                
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 sticky top-0 bg-white border-t mt-1">
                  🟠 Psicotrópicos (1 por receta)
                </div>
                {psychotropicMedicines.map((med) => (
                  <SelectItem key={med} value={med}>
                    <span className="flex items-center gap-2">
                      {med}
                      <span className="text-xs text-orange-600">●</span>
                    </span>
                  </SelectItem>
                ))}
                
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 sticky top-0 bg-white border-t mt-1">
                  🟣 Antimicrobianos (hasta 3 por receta)
                </div>
                {antimicrobialMedicines.map((med) => (
                  <SelectItem key={med} value={med}>
                    <span className="flex items-center gap-2">
                      {med}
                      <span className="text-xs text-purple-600">●</span>
                    </span>
                  </SelectItem>
                ))}
                
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 sticky top-0 bg-white border-t mt-1">
                  🔵 Controlados
                </div>
                {controlledMedicines.map((med) => (
                  <SelectItem key={med} value={med}>
                    <span className="flex items-center gap-2">
                      {med}
                      <span className="text-xs text-blue-600">●</span>
                    </span>
                  </SelectItem>
                ))}
                
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 sticky top-0 bg-white border-t mt-1">
                  🟢 Medicamentos Libres
                </div>
                {freeMedicines.map((med) => (
                  <SelectItem key={med} value={med}>
                    <span className="flex items-center gap-2">
                      {med}
                      <span className="text-xs text-green-600">●</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            
            {/* Mostrar información de clasificación */}
            {selectedMedicineInfo && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryBadgeColor(selectedMedicineInfo.category)}>
                    {selectedMedicineInfo.categoryLabel}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Límite: {selectedMedicineInfo.maxPerPrescription === Infinity 
                      ? "Sin límite" 
                      : `${selectedMedicineInfo.maxPerPrescription} medicamento(s)`} por receta
                  </span>
                </div>
                {selectedMedicineInfo.requiresSpecialControl && (
                  <p className="text-xs text-amber-700 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Medicamento controlado - Requiere talonario específico</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="quantity">Cantidad *</Label>
            <Input
              id="quantity"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="ej. 15 tabletas"
              className={errors.quantity ? "border-red-500" : ""}
            />
            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <Label htmlFor="dose">Dosis *</Label>
            <Input
              id="dose"
              value={formData.dose}
              onChange={(e) => handleChange('dose', e.target.value)}
              placeholder="ej. 400 mg"
              className={errors.dose ? "border-red-500" : ""}
            />
            {errors.dose && <p className="text-sm text-red-500 mt-1">{errors.dose}</p>}
          </div>

          <div>
            <Label htmlFor="frequency">Frecuencia *</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => handleChange('frequency', value)}
            >
              <SelectTrigger className={errors.frequency ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccione la frecuencia" />
              </SelectTrigger>
              <SelectContent>
                {commonFrequencies.map((freq) => (
                  <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.frequency && <p className="text-sm text-red-500 mt-1">{errors.frequency}</p>}
          </div>

          <div>
            <Label htmlFor="administration">Vía de Administración *</Label>
            <Select
              value={formData.administration}
              onValueChange={(value) => handleChange('administration', value)}
            >
              <SelectTrigger className={errors.administration ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccione la vía" />
              </SelectTrigger>
              <SelectContent>
                {administrationRoutes.map((route) => (
                  <SelectItem key={route} value={route}>{route}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.administration && <p className="text-sm text-red-500 mt-1">{errors.administration}</p>}
          </div>

          <div>
            <Label htmlFor="duration">Duración *</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              placeholder="ej. 5 días"
              className={errors.duration ? "border-red-500" : ""}
            />
            {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration}</p>}
          </div>

          <div>
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Agregar Medicamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}