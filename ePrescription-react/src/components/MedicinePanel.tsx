import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Edit, Save, X, Trash2 } from "lucide-react";
import { Medicine } from "./MedicineTable";
import { MedicineClassificationAPI } from "../utils/medicineClassificationStore";

interface MedicinePanelProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicine: Medicine) => void;
  onAdd: (medicine: Omit<Medicine, 'id'>) => void;
  onDelete: (medicineId: string) => void;
}

export function MedicinePanel({ medicine, isOpen, onClose, onSave, onAdd, onDelete }: MedicinePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMedicine, setEditedMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    if (medicine) {
      setEditedMedicine({ ...medicine });
      setIsEditing(false);
    } else if (isOpen) {
      // Modo agregar nuevo medicamento
      setEditedMedicine({
        id: '',
        name: '',
        quantity: '',
        dose: '',
        frequency: '',
        administration: '',
        duration: '',
        observations: ''
      });
      setIsEditing(true);
    }
  }, [medicine, isOpen]);

  const isAddingNew = !medicine;

  const handleSave = () => {
    if (editedMedicine) {
      if (isAddingNew) {
        // Validar campos requeridos para nuevo medicamento
        if (editedMedicine.name && editedMedicine.quantity && editedMedicine.dose && 
            editedMedicine.frequency && editedMedicine.administration && editedMedicine.duration) {
          const { id, ...medicineData } = editedMedicine;
          onAdd(medicineData);
          onClose();
        }
      } else {
        onSave(editedMedicine);
        setIsEditing(false);
      }
    }
  };

  const handleDelete = () => {
    if (medicine && confirm('¿Está seguro de que desea eliminar este medicamento?')) {
      onDelete(medicine.id);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditedMedicine(null);
    onClose();
  };

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
    "Amoxicilina",
    "Amoxicilina/Ácido Clavulánico",
    "Penicilina G",
    "Ampicilina",
    "Cefalexina",
    "Cefuroxima",
    "Ceftriaxona",
    "Cefepime",
    "Azitromicina",
    "Claritromicina",
    "Eritromicina",
    "Ciprofloxacino",
    "Levofloxacino",
    "Moxifloxacino",
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
    "Paracetamol",
    "Acetaminofén",
    "Ibuprofeno",
    "Naproxeno",
    "Diclofenaco",
    "Ketoprofeno",
    "Omeprazol",
    "Esomeprazol",
    "Pantoprazol",
    "Ranitidina",
    "Loratadina",
    "Cetirizina",
    "Desloratadina",
    "Fexofenadina",
    "Metformina",
    "Losartán",
    "Atorvastatina",
    "Salbutamol",
    "Amlodipino",
    "Simvastatina",
    "Aspirina",
    "Captopril"
  ];

  // Obtener información de clasificación del medicamento seleccionado
  const selectedMedicineInfo = editedMedicine?.name 
    ? MedicineClassificationAPI.getMedicineInfo(editedMedicine.name)
    : null;

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

  // Lista de frecuencias comunes
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

  // Lista de vías de administración
  const administrationRoutes = [
    "Vía oral",
    "Vía tópica",
    "Intramuscular",
    "Intravenosa",
    "Vía sublingual",
    "Rectal",
    "Inhalatoria",
    "Oftálmica",
    "Subcutánea",
    "Transdérmica",
    "Ótica",
    "Nasal"
  ];

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>{isAddingNew ? 'Agregar Medicamento' : 'Medicamento'}</SheetTitle>
              <SheetDescription>
                {isAddingNew 
                  ? 'Complete la información del medicamento a prescribir'
                  : isEditing 
                    ? 'Editando información del medicamento' 
                    : 'Información detallada del medicamento'
                }
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Información del Medicamento */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="medicine">Medicamento</Label>
              {isEditing ? (
                <>
                  <Select
                    value={editedMedicine?.name || ''}
                    onValueChange={(value) => setEditedMedicine(prev => prev ? { ...prev, name: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un medicamento" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {/* 🔴 ESTUPEFACIENTES */}
                      <div className="px-2 py-1.5 text-xs font-semibold text-red-700 bg-red-50 sticky top-0">
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
                      
                      {/* 🟠 PSICOTRÓPICOS */}
                      <div className="px-2 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 sticky top-0 border-t mt-1">
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
                      
                      {/* 🟣 ANTIMICROBIANOS */}
                      <div className="px-2 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 sticky top-0 border-t mt-1">
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
                      
                      {/* 🔵 CONTROLADOS */}
                      <div className="px-2 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 sticky top-0 border-t mt-1">
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
                      
                      {/* 🟢 MEDICAMENTOS LIBRES */}
                      <div className="px-2 py-1.5 text-xs font-semibold text-green-700 bg-green-50 sticky top-0 border-t mt-1">
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
                            : `${selectedMedicineInfo.maxPerPrescription} med.`} por receta
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
                </>
              ) : (
                <Input
                  id="medicine"
                  value={editedMedicine?.name || ''}
                  disabled
                />
              )}
            </div>

            <div>
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                value={editedMedicine?.quantity || ''}
                onChange={(e) => setEditedMedicine(prev => prev ? { ...prev, quantity: e.target.value } : null)}
                disabled={!isEditing}
                placeholder="ej. 15 tabletas"
              />
            </div>

            <div>
              <Label htmlFor="dose">Dosis</Label>
              <Input
                id="dose"
                value={editedMedicine?.dose || ''}
                onChange={(e) => setEditedMedicine(prev => prev ? { ...prev, dose: e.target.value } : null)}
                disabled={!isEditing}
                placeholder="ej. 400 mg"
              />
            </div>

            <div>
              <Label htmlFor="frequency">Frecuencia</Label>
              {isEditing ? (
                <Select
                  value={editedMedicine?.frequency || ''}
                  onValueChange={(value) => setEditedMedicine(prev => prev ? { ...prev, frequency: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonFrequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="frequency"
                  value={editedMedicine?.frequency || ''}
                  disabled
                />
              )}
            </div>

            <div>
              <Label htmlFor="administration">Vía de Administración</Label>
              {isEditing ? (
                <Select
                  value={editedMedicine?.administration || ''}
                  onValueChange={(value) => setEditedMedicine(prev => prev ? { ...prev, administration: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la vía" />
                  </SelectTrigger>
                  <SelectContent>
                    {administrationRoutes.map((route) => (
                      <SelectItem key={route} value={route}>{route}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="administration"
                  value={editedMedicine?.administration || ''}
                  disabled
                />
              )}
            </div>

            <div>
              <Label htmlFor="duration">Duración</Label>
              <Input
                id="duration"
                value={editedMedicine?.duration || ''}
                onChange={(e) => setEditedMedicine(prev => prev ? { ...prev, duration: e.target.value } : null)}
                disabled={!isEditing}
                placeholder="ej. 5 días"
              />
            </div>

            <div>
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={editedMedicine?.observations || ''}
                onChange={(e) => setEditedMedicine(prev => prev ? { ...prev, observations: e.target.value } : null)}
                disabled={!isEditing}
                placeholder="Observaciones adicionales..."
                rows={3}
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between pt-6">
            {!isEditing && !isAddingNew && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            )}

            <div className="flex gap-2 ml-auto">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (isAddingNew) {
                        handleClose();
                      } else {
                        setIsEditing(false);
                        setEditedMedicine(medicine ? { ...medicine } : null);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-2"
                  >
                    {isAddingNew ? 'Agregar' : 'Guardar'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}