import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { 
  Edit, Save, X, Trash2, AlertCircle, Info, Calendar as CalendarIcon,
  Search, Check, ChevronsUpDown
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "./ui/utils";

// Tipo de receta
export type TipoReceta = "estupefacientes" | "psicotropicos" | "antimicrobianos" | "libre";

// Tipo de prescripción para antimicrobianos
export type TipoPrescripcion = "empirico" | "cultivo" | "profilaxis_quirurgica" | "profilaxis_medica";

export interface MedicamentoExtendido {
  id: string;
  
  // Diagnóstico
  diagnostico?: string;
  diagnosticoCIE10?: string;
  confirmacionDiagnostico?: "presuntivo" | "confirmado";
  tipoDiagnostico?: "cronico" | "agudo";
  
  // Medicamento
  nombreComercial: string;
  componenteActivo: string;
  formaFarmaceutica: string;
  fuerza: string;
  unidadFuerza: string;
  viaAdministracion: string;
  concentracion?: string;
  
  // Prescripción
  dosis: string;
  unidadAdministracion: string;
  frecuencia: string;
  unidadFrecuencia: string;
  duracion: string;
  unidadTiempo: string;
  cantidadTotal: string;
  cantidadTotalLetras: string;
  
  // Fechas
  fechaInicioTratamiento: string;
  
  // Instrucciones
  instruccionesAdicionales: string;
  
  // Tipo de prescripción (solo para antimicrobianos)
  tipoPrescripcion?: TipoPrescripcion;
}

interface EnhancedMedicinePanelProps {
  medicine: MedicamentoExtendido | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicine: MedicamentoExtendido) => void;
  onAdd: (medicine: Omit<MedicamentoExtendido, 'id'>) => void;
  onDelete: (medicineId: string) => void;
  tipoReceta: TipoReceta;
  especialidadMedico?: string;
  profesionMedico?: string;
}

// Catálogos mock (en producción vendrían de API)
const catalogoDiagnosticosCIE10 = [
  { codigo: "J00", descripcion: "Rinofaringitis aguda [resfriado común]" },
  { codigo: "J01", descripcion: "Sinusitis aguda" },
  { codigo: "J02", descripcion: "Faringitis aguda" },
  { codigo: "J03", descripcion: "Amigdalitis aguda" },
  { codigo: "J06", descripcion: "Infección aguda de las vías respiratorias superiores" },
  { codigo: "J18", descripcion: "Neumonía, organismo no especificado" },
  { codigo: "K29", descripcion: "Gastritis y duodenitis" },
  { codigo: "K30", descripcion: "Dispepsia funcional" },
  { codigo: "N39.0", descripcion: "Infección de vías urinarias, sitio no especificado" },
  { codigo: "L02", descripcion: "Absceso cutáneo, furúnculo y ántrax" }
];

const catalogoMedicamentos = [
  {
    id: "1",
    nombreComercial: "Amoxicilina 500mg cápsulas",
    componenteActivo: "Amoxicilina",
    formaFarmaceutica: "Cápsulas",
    fuerza: "500",
    unidadFuerza: "mg",
    viaAdministracion: "Oral",
    concentracion: "500mg",
    tipo: "antimicrobiano"
  },
  {
    id: "2",
    nombreComercial: "Ibuprofeno 400mg tabletas",
    componenteActivo: "Ibuprofeno",
    formaFarmaceutica: "Tabletas",
    fuerza: "400",
    unidadFuerza: "mg",
    viaAdministracion: "Oral",
    concentracion: "400mg",
    tipo: "libre"
  },
  {
    id: "3",
    nombreComercial: "Morfina 10mg ampolla",
    componenteActivo: "Morfina",
    formaFarmaceutica: "Ampolla",
    fuerza: "10",
    unidadFuerza: "mg",
    viaAdministracion: "Intramuscular",
    concentracion: "10mg/ml",
    tipo: "estupefaciente"
  },
  {
    id: "4",
    nombreComercial: "Diazepam 10mg tabletas",
    componenteActivo: "Diazepam",
    formaFarmaceutica: "Tabletas",
    fuerza: "10",
    unidadFuerza: "mg",
    viaAdministracion: "Oral",
    concentracion: "10mg",
    tipo: "psicotropico"
  },
  {
    id: "5",
    nombreComercial: "Fentanilo 100mcg parche",
    componenteActivo: "Fentanilo",
    formaFarmaceutica: "Parche transdérmico",
    fuerza: "100",
    unidadFuerza: "mcg",
    viaAdministracion: "Transdérmica",
    concentracion: "100mcg/hora",
    tipo: "estupefaciente",
    requiereEspecialidad: ["Anestesiología", "Medicina de Emergencias", "Medicina Intensiva"]
  }
];

const catalogoDosis = ["0.5", "1", "1.5", "2", "2.5", "3", "4", "5"];
const catalogoFrecuencias = ["1", "2", "3", "4", "6", "8", "12", "24"];
const catalogoUnidadesFrecuencia = ["horas", "días", "semanas", "meses"];
const catalogoUnidadesTiempo = ["días", "semanas", "meses"];
const catalogoViasAdministracion = [
  "Oral", "Tópica", "Intramuscular", "Intravenosa", "Subcutánea",
  "Sublingual", "Rectal", "Inhalatoria", "Oftálmica", "Ótica", "Nasal", "Transdérmica"
];

const instruccionesPredefinidas = [
  "Antes de las comidas",
  "Durante las comidas",
  "Después de las comidas",
  "Antes de dormir",
  "En ayunas",
  "Con abundante agua",
  "Evitar exposición al sol",
  "No consumir alcohol durante el tratamiento"
];

export function EnhancedMedicinePanel({
  medicine,
  isOpen,
  onClose,
  onSave,
  onAdd,
  onDelete,
  tipoReceta,
  especialidadMedico = "",
  profesionMedico = "Médico"
}: EnhancedMedicinePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMedicine, setEditedMedicine] = useState<MedicamentoExtendido | null>(null);
  const [searchMedicine, setSearchMedicine] = useState("");
  const [searchDiagnostico, setSearchDiagnostico] = useState("");
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [showDiagnosticoSearch, setShowDiagnosticoSearch] = useState(false);

  useEffect(() => {
    if (medicine) {
      setEditedMedicine({ ...medicine });
      setIsEditing(false);
    } else if (isOpen) {
      // Modo agregar nuevo medicamento
      setEditedMedicine({
        id: '',
        nombreComercial: '',
        componenteActivo: '',
        formaFarmaceutica: '',
        fuerza: '',
        unidadFuerza: '',
        viaAdministracion: '',
        dosis: '',
        unidadAdministracion: 'tableta(s)',
        frecuencia: '',
        unidadFrecuencia: 'horas',
        duracion: '',
        unidadTiempo: 'días',
        cantidadTotal: '',
        cantidadTotalLetras: '',
        fechaInicioTratamiento: new Date().toISOString().split('T')[0],
        instruccionesAdicionales: '',
        tipoPrescripcion: tipoReceta === 'antimicrobianos' ? 'empirico' : undefined
      });
      setIsEditing(true);
    }
  }, [medicine, isOpen, tipoReceta]);

  const isAddingNew = !medicine;

  // Calcular período máximo según profesión
  const getPeriodoMaximo = (): number => {
    if (tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos") {
      // Metilfenidato y Fenobarbital/Diazepam: 3 meses (90 días)
      if (editedMedicine?.componenteActivo?.toLowerCase().includes("metilfenidato") ||
          editedMedicine?.componenteActivo?.toLowerCase().includes("fenobarbital") ||
          editedMedicine?.componenteActivo?.toLowerCase().includes("diazepam")) {
        return 90;
      }
      return 30; // Por defecto para controlados
    }
    
    if (profesionMedico === "Odontólogo" || profesionMedico === "Veterinario") {
      return 3;
    }
    
    return 30; // Máximo general
  };

  // Validar Fentanilo
  const validarFentanilo = (): boolean => {
    if (editedMedicine?.componenteActivo?.toLowerCase().includes("fentanilo")) {
      const especialidadesAutorizadas = ["Anestesiología", "Medicina de Emergencias", "Medicina Intensiva"];
      if (!especialidadesAutorizadas.includes(especialidadMedico)) {
        toast.error("Fentanilo solo puede ser prescrito por Anestesiólogos, Emergenciólogos o Intensivistas");
        return false;
      }
    }
    return true;
  };

  // Seleccionar medicamento del catálogo
  const handleSelectMedicamento = (med: typeof catalogoMedicamentos[0]) => {
    if (editedMedicine) {
      setEditedMedicine({
        ...editedMedicine,
        nombreComercial: med.nombreComercial,
        componenteActivo: med.componenteActivo,
        formaFarmaceutica: med.formaFarmaceutica,
        fuerza: med.fuerza,
        unidadFuerza: med.unidadFuerza,
        viaAdministracion: med.viaAdministracion,
        concentracion: med.concentracion
      });
      setShowMedicineSearch(false);
    }
  };

  // Cambiar componente activo - RESTABLECER todos los campos
  const handleChangeComponenteActivo = (nuevoComponente: string) => {
    if (editedMedicine) {
      toast.info("Al cambiar el principio activo, los campos del medicamento se han restablecido");
      setEditedMedicine({
        ...editedMedicine,
        componenteActivo: nuevoComponente,
        // Restablecer todos los campos relacionados
        nombreComercial: '',
        formaFarmaceutica: '',
        fuerza: '',
        unidadFuerza: '',
        viaAdministracion: '',
        concentracion: ''
      });
    }
  };

  // Seleccionar diagnóstico
  const handleSelectDiagnostico = (diag: typeof catalogoDiagnosticosCIE10[0]) => {
    if (editedMedicine) {
      setEditedMedicine({
        ...editedMedicine,
        diagnostico: diag.descripcion,
        diagnosticoCIE10: diag.codigo
      });
      setShowDiagnosticoSearch(false);
    }
  };

  // Agregar instrucción predefinida
  const handleAddInstruccion = (instruccion: string) => {
    if (editedMedicine) {
      const currentInstrucciones = editedMedicine.instruccionesAdicionales;
      const newInstrucciones = currentInstrucciones 
        ? `${currentInstrucciones}\n${instruccion}`
        : instruccion;
      
      setEditedMedicine({
        ...editedMedicine,
        instruccionesAdicionales: newInstrucciones
      });
    }
  };

  // Convertir número a letras (simplificado)
  const numeroALetras = (num: number): string => {
    const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const especiales = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
    
    if (num < 10) return unidades[num];
    if (num >= 10 && num < 20) return especiales[num - 10];
    if (num >= 20 && num < 100) {
      const dec = Math.floor(num / 10);
      const uni = num % 10;
      return uni === 0 ? decenas[dec] : `${decenas[dec]} y ${unidades[uni]}`;
    }
    return num.toString(); // Para números mayores, simplemente devolver el número
  };

  // Actualizar cantidad en letras cuando cambia cantidad
  const handleCantidadChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setEditedMedicine(prev => prev ? {
        ...prev,
        cantidadTotal: value,
        cantidadTotalLetras: numeroALetras(num)
      } : null);
    }
  };

  const handleSave = () => {
    if (!editedMedicine) return;

    // Validaciones
    if (!editedMedicine.nombreComercial || !editedMedicine.componenteActivo) {
      toast.error("Debe seleccionar un medicamento");
      return;
    }

    // Validar diagnóstico obligatorio para antimicrobianos
    if (tipoReceta === "antimicrobianos" && !editedMedicine.diagnostico) {
      toast.error("El diagnóstico es obligatorio para antimicrobianos");
      return;
    }

    // Validar campos obligatorios
    if (!editedMedicine.dosis || !editedMedicine.frecuencia || !editedMedicine.duracion || 
        !editedMedicine.cantidadTotal) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }

    // Validar período máximo
    const periodoMaximo = getPeriodoMaximo();
    const duracionDias = editedMedicine.unidadTiempo === "días" 
      ? parseInt(editedMedicine.duracion)
      : editedMedicine.unidadTiempo === "semanas"
        ? parseInt(editedMedicine.duracion) * 7
        : parseInt(editedMedicine.duracion) * 30;
    
    if (duracionDias > periodoMaximo) {
      toast.error(`La duración máxima permitida es de ${periodoMaximo} días`);
      return;
    }

    // Validar Fentanilo
    if (!validarFentanilo()) {
      return;
    }

    if (isAddingNew) {
      const { id, ...medicineData } = editedMedicine;
      onAdd(medicineData);
    } else {
      onSave(editedMedicine);
      setIsEditing(false);
    }
    
    onClose();
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

  if (!editedMedicine) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[700px] sm:w-[800px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>
                {isAddingNew ? 'Agregar Medicamento' : 'Detalle de Medicamento'}
              </SheetTitle>
              <SheetDescription>
                Tipo de receta: <Badge>{tipoReceta.toUpperCase()}</Badge>
              </SheetDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Alertas según tipo de receta */}
          {(tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos") && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Medicamento Controlado</AlertTitle>
              <AlertDescription>
                Solo se permite UN medicamento por receta. Período máximo: {getPeriodoMaximo()} días.
              </AlertDescription>
            </Alert>
          )}

          {/* Diagnóstico (Obligatorio para antimicrobianos) */}
          {tipoReceta === "antimicrobianos" && (
            <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium">Diagnóstico</h4>
              
              <div className="space-y-2">
                <Label>Código CIE-10 *</Label>
                <Popover open={showDiagnosticoSearch} onOpenChange={setShowDiagnosticoSearch}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {editedMedicine.diagnosticoCIE10 
                        ? `${editedMedicine.diagnosticoCIE10} - ${editedMedicine.diagnostico}`
                        : "Buscar diagnóstico..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[600px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar por código o descripción..." />
                      <CommandEmpty>No se encontraron diagnósticos</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {catalogoDiagnosticosCIE10.map((diag) => (
                            <CommandItem
                              key={diag.codigo}
                              onSelect={() => handleSelectDiagnostico(diag)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  editedMedicine.diagnosticoCIE10 === diag.codigo
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div>
                                <div className="font-medium">{diag.codigo}</div>
                                <div className="text-sm text-muted-foreground">{diag.descripcion}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Confirmación</Label>
                  <Select
                    value={editedMedicine.confirmacionDiagnostico || ""}
                    onValueChange={(value: "presuntivo" | "confirmado") =>
                      setEditedMedicine({ ...editedMedicine, confirmacionDiagnostico: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presuntivo">Presuntivo</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={editedMedicine.tipoDiagnostico || ""}
                    onValueChange={(value: "cronico" | "agudo") =>
                      setEditedMedicine({ ...editedMedicine, tipoDiagnostico: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agudo">Agudo</SelectItem>
                      <SelectItem value="cronico">Crónico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Prescripción</Label>
                <RadioGroup
                  value={editedMedicine.tipoPrescripcion || "empirico"}
                  onValueChange={(value: TipoPrescripcion) =>
                    setEditedMedicine({ ...editedMedicine, tipoPrescripcion: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="empirico" id="empirico" />
                    <Label htmlFor="empirico">Empírico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cultivo" id="cultivo" />
                    <Label htmlFor="cultivo">Basado en Cultivo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="profilaxis_quirurgica" id="prof_quir" />
                    <Label htmlFor="prof_quir">Profilaxis Quirúrgica</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="profilaxis_medica" id="prof_med" />
                    <Label htmlFor="prof_med">Profilaxis Médica</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <Separator />

          {/* Búsqueda y Selección de Medicamento */}
          <div className="space-y-4">
            <h4 className="font-medium">Medicamento *</h4>
            
            <div className="space-y-2">
              <Label>Buscar medicamento (DCI o marca)</Label>
              <Popover open={showMedicineSearch} onOpenChange={setShowMedicineSearch}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {editedMedicine.nombreComercial || "Buscar medicamento..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[700px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar por nombre comercial o componente activo..." />
                    <CommandEmpty>No se encontraron medicamentos</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {catalogoMedicamentos.map((med) => (
                          <CommandItem
                            key={med.id}
                            onSelect={() => handleSelectMedicamento(med)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                editedMedicine.nombreComercial === med.nombreComercial
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div>
                              <div className="font-medium">{med.nombreComercial}</div>
                              <div className="text-sm text-muted-foreground">
                                {med.componenteActivo} - {med.formaFarmaceutica} - {med.viaAdministracion}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Campos editables individuales del medicamento */}
            {editedMedicine.nombreComercial && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-muted-foreground">
                    Puede modificar cada campo individualmente según las opciones disponibles
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Componente Activo (Principio Activo) *</Label>
                  <Input
                    value={editedMedicine.componenteActivo}
                    onChange={(e) => handleChangeComponenteActivo(e.target.value)}
                    placeholder="Nombre del principio activo..."
                  />
                  <p className="text-xs text-amber-600">
                    ⚠️ Al modificar el principio activo, los demás campos se restablecerán
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Forma Farmacéutica *</Label>
                    <Input
                      value={editedMedicine.formaFarmaceutica}
                      onChange={(e) =>
                        setEditedMedicine({ ...editedMedicine, formaFarmaceutica: e.target.value })
                      }
                      placeholder="ej: Tabletas, Cápsulas..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vía de Administración *</Label>
                    <Select
                      value={editedMedicine.viaAdministracion}
                      onValueChange={(value) =>
                        setEditedMedicine({ ...editedMedicine, viaAdministracion: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar vía..." />
                      </SelectTrigger>
                      <SelectContent>
                        {catalogoViasAdministracion.map((via) => (
                          <SelectItem key={via} value={via}>{via}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Fuerza *</Label>
                    <Input
                      value={editedMedicine.fuerza}
                      onChange={(e) =>
                        setEditedMedicine({ ...editedMedicine, fuerza: e.target.value })
                      }
                      placeholder="ej: 500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unidad *</Label>
                    <Input
                      value={editedMedicine.unidadFuerza}
                      onChange={(e) =>
                        setEditedMedicine({ ...editedMedicine, unidadFuerza: e.target.value })
                      }
                      placeholder="ej: mg, mcg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Concentración</Label>
                    <Input
                      value={editedMedicine.concentracion || ''}
                      onChange={(e) =>
                        setEditedMedicine({ ...editedMedicine, concentracion: e.target.value })
                      }
                      placeholder="ej: 500mg/5ml"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Dosis y Frecuencia */}
          <div className="space-y-4">
            <h4 className="font-medium">Indicaciones de Uso *</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dosis *</Label>
                <Select
                  value={editedMedicine.dosis}
                  onValueChange={(value) =>
                    setEditedMedicine({ ...editedMedicine, dosis: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar dosis..." />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogoDosis.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Unidad de Administración *</Label>
                <Input
                  value={editedMedicine.unidadAdministracion}
                  onChange={(e) =>
                    setEditedMedicine({ ...editedMedicine, unidadAdministracion: e.target.value })
                  }
                  placeholder="ej: tableta(s), ml, aplicaciones..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frecuencia (cada) *</Label>
                <Select
                  value={editedMedicine.frecuencia}
                  onValueChange={(value) =>
                    setEditedMedicine({ ...editedMedicine, frecuencia: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cada..." />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogoFrecuencias.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Unidad de Frecuencia *</Label>
                <Select
                  value={editedMedicine.unidadFrecuencia}
                  onValueChange={(value) =>
                    setEditedMedicine({ ...editedMedicine, unidadFrecuencia: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogoUnidadesFrecuencia.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Duración y Cantidad */}
          <div className="space-y-4">
            <h4 className="font-medium">Duración y Cantidad *</h4>
            
            <div className="space-y-2">
              <Label>Fecha de Inicio del Tratamiento *</Label>
              <Input
                type="date"
                value={editedMedicine.fechaInicioTratamiento}
                onChange={(e) =>
                  setEditedMedicine({ ...editedMedicine, fechaInicioTratamiento: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duración *</Label>
                <Input
                  type="number"
                  value={editedMedicine.duracion}
                  onChange={(e) =>
                    setEditedMedicine({ ...editedMedicine, duracion: e.target.value })
                  }
                  placeholder="ej: 7"
                />
              </div>

              <div className="space-y-2">
                <Label>Unidad de Tiempo *</Label>
                <Select
                  value={editedMedicine.unidadTiempo}
                  onValueChange={(value) =>
                    setEditedMedicine({ ...editedMedicine, unidadTiempo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogoUnidadesTiempo.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Período máximo permitido: <strong>{getPeriodoMaximo()} días</strong>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cantidad Total (números) *</Label>
                <Input
                  type="number"
                  value={editedMedicine.cantidadTotal}
                  onChange={(e) => handleCantidadChange(e.target.value)}
                  placeholder="ej: 14"
                />
              </div>

              <div className="space-y-2">
                <Label>Cantidad Total (letras) *</Label>
                <Input
                  value={editedMedicine.cantidadTotalLetras}
                  onChange={(e) =>
                    setEditedMedicine({ ...editedMedicine, cantidadTotalLetras: e.target.value })
                  }
                  placeholder="ej: catorce"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Instrucciones Adicionales */}
          <div className="space-y-4">
            <h4 className="font-medium">Instrucciones Adicionales</h4>
            
            <div className="space-y-2">
              <Label>Instrucciones Predefinidas</Label>
              <div className="flex flex-wrap gap-2">
                {instruccionesPredefinidas.map((inst) => (
                  <Button
                    key={inst}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddInstruccion(inst)}
                  >
                    + {inst}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                value={editedMedicine.instruccionesAdicionales}
                onChange={(e) =>
                  setEditedMedicine({ ...editedMedicine, instruccionesAdicionales: e.target.value })
                }
                placeholder="Instrucciones adicionales para el paciente..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-between gap-2 pt-4 border-t">
          <div>
            {!isAddingNew && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {isAddingNew ? 'Agregar' : 'Guardar'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
