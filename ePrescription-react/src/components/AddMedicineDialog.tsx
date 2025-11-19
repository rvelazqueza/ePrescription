import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Medicine } from "./MedicineTable";

interface AddMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (medicine: Omit<Medicine, 'id'>) => void;
}

// Medicamentos comunes para el selector
const commonMedicines = [
  "Paracetamol",
  "Ibuprofeno",
  "Amoxicilina",
  "Omeprazol",
  "Atorvastatina",
  "Metformina",
  "Losartán",
  "Amlodipino",
  "Simvastatina",
  "Aspirina"
];

// Frecuencias comunes
const commonFrequencies = [
  "1 vez al día",
  "2 veces al día",
  "3 veces al día",
  "4 veces al día",
  "Cada 8 horas",
  "Cada 12 horas",
  "Cada 24 horas",
  "Según necesidad"
];

// Vías de administración
const administrationRoutes = [
  "Oral",
  "Sublingual",
  "Tópica",
  "Intramuscular",
  "Intravenosa",
  "Subcutánea",
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
              <SelectContent>
                {commonMedicines.map((med) => (
                  <SelectItem key={med} value={med}>{med}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
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