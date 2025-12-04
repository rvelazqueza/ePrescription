import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Search,
  User,
  Users,
  Clock,
  AlertTriangle,
  Plus,
  Info,
  Heart,
  Activity,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserPlus,
  CheckCircle2,
  XCircle,
  Shield,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { NewPatientDialog } from "./NewPatientDialog";

interface PatientData {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  birthDate: string;
  age: number;
  gender: "M" | "F";
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  insuranceProvider: string;
  insuranceNumber: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  weight: string;
  height: string;
  bmi: string;
  occupation: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  clinicalNotes: string;
}

interface PatientSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPatient: (patient: PatientData) => void;
}

// Mock de pacientes del sistema (en producción vendría de un API/Store)
const mockPatients: PatientData[] = [
  {
    id: "PAC-001",
    fullName: "María Isabel López García",
    firstName: "María Isabel",
    lastName: "López García",
    idType: "Cédula Nacional",
    idNumber: "1-0234-0567",
    birthDate: "1985-03-15",
    age: 40,
    gender: "F",
    bloodType: "O+",
    phone: "+506 8765-4321",
    email: "maria.lopez@email.com",
    address: "San José, Escazú, Trejos Montealegre",
    city: "San José",
    country: "Costa Rica",
    insuranceProvider: "Caja Costarricense de Seguro Social",
    insuranceNumber: "100234567",
    allergies: ["Penicilina", "Mariscos"],
    chronicConditions: ["Hipertensión arterial"],
    currentMedications: ["Losartán 50mg", "Hidroclorotiazida 12.5mg"],
    weight: "65 kg",
    height: "1.60 m",
    bmi: "25.4",
    occupation: "Profesora",
    emergencyContact: {
      name: "Carlos López",
      relationship: "Esposo",
      phone: "+506 8888-9999",
    },
    clinicalNotes: "Paciente con hipertensión controlada. Última consulta hace 3 meses.",
  },
  {
    id: "PAC-002",
    fullName: "Juan Carlos Pérez Mora",
    firstName: "Juan Carlos",
    lastName: "Pérez Mora",
    idType: "Cédula Nacional",
    idNumber: "1-0456-0789",
    birthDate: "1972-07-22",
    age: 52,
    gender: "M",
    bloodType: "A+",
    phone: "+506 8777-6543",
    email: "jcperez@email.com",
    address: "Heredia, San Rafael, Residencial Los Arcos",
    city: "Heredia",
    country: "Costa Rica",
    insuranceProvider: "INS",
    insuranceNumber: "200456789",
    allergies: [],
    chronicConditions: ["Diabetes Mellitus tipo 2", "Dislipidemia"],
    currentMedications: ["Metformina 850mg", "Atorvastatina 20mg"],
    weight: "82 kg",
    height: "1.75 m",
    bmi: "26.8",
    occupation: "Ingeniero",
    emergencyContact: {
      name: "Ana Mora",
      relationship: "Esposa",
      phone: "+506 8666-5555",
    },
    clinicalNotes: "Control de diabetes cada 3 meses. HbA1c: 6.8%",
  },
  {
    id: "PAC-003",
    fullName: "Ana Patricia González Vega",
    firstName: "Ana Patricia",
    lastName: "González Vega",
    idType: "Cédula Nacional",
    idNumber: "1-0678-0912",
    birthDate: "1990-11-08",
    age: 34,
    gender: "F",
    bloodType: "B+",
    phone: "+506 8555-4444",
    email: "ana.gonzalez@email.com",
    address: "Cartago, Centro, Calle 5",
    city: "Cartago",
    country: "Costa Rica",
    insuranceProvider: "Caja Costarricense de Seguro Social",
    insuranceNumber: "300678912",
    allergies: ["Sulfonamidas"],
    chronicConditions: [],
    currentMedications: [],
    weight: "58 kg",
    height: "1.65 m",
    bmi: "21.3",
    occupation: "Contadora",
    emergencyContact: {
      name: "Roberto González",
      relationship: "Padre",
      phone: "+506 8444-3333",
    },
    clinicalNotes: "Paciente sana. Consulta preventiva anual.",
  },
  {
    id: "PAC-004",
    fullName: "Roberto José Ramírez Solís",
    firstName: "Roberto José",
    lastName: "Ramírez Solís",
    idType: "Cédula Nacional",
    idNumber: "1-0890-1234",
    birthDate: "1965-05-30",
    age: 59,
    gender: "M",
    bloodType: "AB+",
    phone: "+506 8333-2222",
    email: "rramirez@email.com",
    address: "Alajuela, Centro, Barrio San José",
    city: "Alajuela",
    country: "Costa Rica",
    insuranceProvider: "Sagicor",
    insuranceNumber: "400890234",
    allergies: ["Aspirina", "AINEs"],
    chronicConditions: ["Artritis reumatoide", "Enfermedad renal crónica grado 2"],
    currentMedications: ["Metotrexato 15mg semanal", "Ácido fólico 5mg"],
    weight: "75 kg",
    height: "1.70 m",
    bmi: "26.0",
    occupation: "Contador retirado",
    emergencyContact: {
      name: "María Solís",
      relationship: "Esposa",
      phone: "+506 8222-1111",
    },
    clinicalNotes: "Control de función renal mensual. Última creatinina: 1.4 mg/dL",
  },
  {
    id: "PAC-005",
    fullName: "Laura Sofía Hernández Castro",
    firstName: "Laura Sofía",
    lastName: "Hernández Castro",
    idType: "Cédula Nacional",
    idNumber: "1-1012-3456",
    birthDate: "2000-01-12",
    age: 25,
    gender: "F",
    bloodType: "O-",
    phone: "+506 8111-0000",
    email: "laura.hernandez@email.com",
    address: "Puntarenas, Centro, Paseo de los Turistas",
    city: "Puntarenas",
    country: "Costa Rica",
    insuranceProvider: "Caja Costarricense de Seguro Social",
    insuranceNumber: "501012456",
    allergies: [],
    chronicConditions: ["Asma bronquial leve"],
    currentMedications: ["Salbutamol inhalador PRN"],
    weight: "55 kg",
    height: "1.62 m",
    bmi: "21.0",
    occupation: "Estudiante universitaria",
    emergencyContact: {
      name: "Patricia Castro",
      relationship: "Madre",
      phone: "+506 8000-9999",
    },
    clinicalNotes: "Asma bien controlada. Última crisis hace 2 años.",
  },
];

// Mock de pacientes recientes del médico actual
const recentPatientsIds = ["PAC-001", "PAC-002", "PAC-005"];

export function PatientSelectorDialog({
  open,
  onOpenChange,
  onSelectPatient,
}: PatientSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "name" | "id" | "phone">("all");
  const [selectedTab, setSelectedTab] = useState<"search" | "recent">("recent");
  const [hoveredPatient, setHoveredPatient] = useState<string | null>(null);
  const [showNewPatientDialog, setShowNewPatientDialog] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([]);

  // Pacientes recientes
  const recentPatients = mockPatients.filter((p) =>
    recentPatientsIds.includes(p.id)
  );

  // Efecto de búsqueda con debounce
  useEffect(() => {
    if (selectedTab === "search" && searchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setFilteredPatients([]);
    }
  }, [searchQuery, searchType, selectedTab]);

  const performSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    
    const results = mockPatients.filter((patient) => {
      switch (searchType) {
        case "name":
          return patient.fullName.toLowerCase().includes(query) ||
                 patient.firstName.toLowerCase().includes(query) ||
                 patient.lastName.toLowerCase().includes(query);
        case "id":
          return patient.idNumber.includes(query) || patient.id.toLowerCase().includes(query);
        case "phone":
          return patient.phone.replace(/\s|-/g, "").includes(query.replace(/\s|-/g, ""));
        case "all":
        default:
          return (
            patient.fullName.toLowerCase().includes(query) ||
            patient.idNumber.includes(query) ||
            patient.id.toLowerCase().includes(query) ||
            patient.phone.replace(/\s|-/g, "").includes(query.replace(/\s|-/g, ""))
          );
      }
    });

    setFilteredPatients(results);
  };

  const handleSelectPatient = (patient: PatientData) => {
    // Validación antes de seleccionar
    if (patient.allergies.length > 0 || patient.chronicConditions.length > 0) {
      toast.warning("Paciente con alertas clínicas", {
        description: "Revise alergias y condiciones crónicas antes de prescribir.",
        duration: 5000,
      });
    }

    onSelectPatient(patient);
    onOpenChange(false);
    
    // Limpiar búsqueda
    setSearchQuery("");
    setFilteredPatients([]);
    
    toast.success("Paciente seleccionado", {
      description: `${patient.fullName} - ${patient.idNumber}`,
    });
  };

  const handleNewPatientCreated = (patient: PatientData) => {
    setShowNewPatientDialog(false);
    handleSelectPatient(patient);
  };

  const getRiskLevel = (patient: PatientData): "high" | "medium" | "low" => {
    if (patient.allergies.length > 0 && patient.chronicConditions.length > 0) return "high";
    if (patient.allergies.length > 0 || patient.chronicConditions.length > 0) return "medium";
    return "low";
  };

  const renderPatientCard = (patient: PatientData, isRecent: boolean = false) => {
    const riskLevel = getRiskLevel(patient);
    const isHovered = hoveredPatient === patient.id;

    return (
      <Card
        key={patient.id}
        className={`cursor-pointer transition-all duration-200 ${
          isHovered
            ? "border-blue-500 shadow-md bg-blue-50/50"
            : "border-border hover:border-blue-300 hover:shadow-sm"
        } ${
          riskLevel === "high"
            ? "border-l-4 border-l-red-500"
            : riskLevel === "medium"
            ? "border-l-4 border-l-yellow-500"
            : ""
        }`}
        onMouseEnter={() => setHoveredPatient(patient.id)}
        onMouseLeave={() => setHoveredPatient(null)}
        onClick={() => handleSelectPatient(patient)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {/* Avatar */}
              <div className={`p-3 rounded-full ${
                patient.gender === "F" ? "bg-pink-100" : "bg-blue-100"
              }`}>
                <User className={`w-5 h-5 ${
                  patient.gender === "F" ? "text-pink-600" : "text-blue-600"
                }`} />
              </div>

              {/* Info principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{patient.fullName}</h4>
                  {isRecent && (
                    <Badge variant="outline" className="text-xs bg-blue-50">
                      <Clock className="w-3 h-3 mr-1" />
                      Reciente
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {patient.idNumber}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {patient.age} años
                  </span>
                  <span className="flex items-center gap-1">
                    {patient.gender === "F" ? "♀" : "♂"}
                    {patient.gender === "F" ? "Femenino" : "Masculino"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {patient.bloodType}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {patient.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {patient.city}
                  </span>
                </div>

                {/* Alertas clínicas */}
                {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
                  <div className="mt-3 space-y-2">
                    {patient.allergies.length > 0 && (
                      <Alert className="py-2 border-red-200 bg-red-50">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        <AlertDescription className="text-xs ml-2">
                          <strong>Alergias:</strong> {patient.allergies.join(", ")}
                        </AlertDescription>
                      </Alert>
                    )}
                    {patient.chronicConditions.length > 0 && (
                      <Alert className="py-2 border-yellow-200 bg-yellow-50">
                        <Info className="h-3 w-3 text-yellow-600" />
                        <AlertDescription className="text-xs ml-2">
                          <strong>Condiciones:</strong> {patient.chronicConditions.join(", ")}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Medicamentos actuales */}
                {patient.currentMedications.length > 0 && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Heart className="w-3 h-3 mr-1" />
                      {patient.currentMedications.length} medicamento(s) activo(s)
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Indicador de selección */}
            <Button
              size="sm"
              variant={isHovered ? "default" : "outline"}
              className="ml-2"
            >
              {isHovered ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Seleccionar
                </>
              ) : (
                "Seleccionar"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Seleccionar Paciente
            </DialogTitle>
            <DialogDescription>
              Busque y seleccione el paciente para crear la prescripción médica
            </DialogDescription>
          </DialogHeader>

          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recent" className="gap-2">
                <Clock className="w-4 h-4" />
                Pacientes Recientes ({recentPatients.length})
              </TabsTrigger>
              <TabsTrigger value="search" className="gap-2">
                <Search className="w-4 h-4" />
                Búsqueda Avanzada
              </TabsTrigger>
            </TabsList>

            {/* Tab: Pacientes Recientes */}
            <TabsContent value="recent" className="flex-1 overflow-hidden mt-4">
              <div className="mb-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Estos son los pacientes que ha atendido recientemente. Haga clic para seleccionar.
                  </AlertDescription>
                </Alert>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {recentPatients.map((patient) => renderPatientCard(patient, true))}
                  
                  {recentPatients.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No hay pacientes recientes</p>
                      <p className="text-sm mt-2">Use la búsqueda avanzada o cree un nuevo paciente</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Tab: Búsqueda Avanzada */}
            <TabsContent value="search" className="flex-1 overflow-hidden mt-4">
              <div className="space-y-4">
                {/* Barra de búsqueda */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre, cédula, código o teléfono..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as any)}
                    className="px-3 py-2 border border-border rounded-md text-sm bg-background"
                  >
                    <option value="all">Todos los campos</option>
                    <option value="name">Solo nombre</option>
                    <option value="id">Solo cédula/código</option>
                    <option value="phone">Solo teléfono</option>
                  </select>
                </div>

                {/* Instrucciones */}
                {searchQuery.length < 2 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Ingrese al menos 2 caracteres para realizar la búsqueda
                    </AlertDescription>
                  </Alert>
                )}

                {/* Resultados */}
                {searchQuery.length >= 2 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-muted-foreground">
                        {filteredPatients.length === 0
                          ? "No se encontraron resultados"
                          : `${filteredPatients.length} paciente(s) encontrado(s)`}
                      </p>
                    </div>

                    <ScrollArea className="h-[320px] pr-4">
                      <div className="space-y-3">
                        {filteredPatients.map((patient) => renderPatientCard(patient))}
                        
                        {filteredPatients.length === 0 && searchQuery.length >= 2 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <XCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No se encontraron pacientes</p>
                            <p className="text-sm mt-2">
                              Intente con otros criterios o cree un nuevo paciente
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          {/* Footer con acciones */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>
                {mockPatients.length} pacientes registrados en el sistema
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => setShowNewPatientDialog(true)}
                className="gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Nuevo Paciente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para crear nuevo paciente */}
      <NewPatientDialog
        open={showNewPatientDialog}
        onOpenChange={setShowNewPatientDialog}
        onPatientCreated={handleNewPatientCreated}
      />
    </>
  );
}
