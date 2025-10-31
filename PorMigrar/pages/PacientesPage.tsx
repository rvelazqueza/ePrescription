import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Users, UserCircle, FileText, Search, Filter, FilterX, Eye, Edit, Plus, UserPlus, Phone, Mail, Calendar, Activity, Heart, AlertTriangle, TrendingUp, UserCheck, UserX, User, MapPin, ShieldAlert, Pill, FileCheck, Download, Trash2, Share2, Image as ImageIcon, File, Upload, X } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PatientDetailPanel } from "../components/PatientDetailPanel";
import { MedicalTimeline } from "../components/MedicalTimeline";
import { EditPatientProfileDialog } from "../components/EditPatientProfileDialog";
import { ContactPatientDialog } from "../components/ContactPatientDialog";
import { ClinicalDocumentsDialog } from "../components/ClinicalDocumentsDialog";
import { NewPatientDialog } from "../components/NewPatientDialog";
import { TablePagination } from "../components/TablePagination";
import { ExportButtons } from "../components/ExportButtons";
import { usePagination } from "../utils/usePagination";
import { normalizedIncludes } from "../utils/searchUtils";
import { toast } from "sonner@2.0.3";

// Datos mock de pacientes
const mockPatients = [
  {
    id: "PAT-001",
    fullName: "María Elena González Rodríguez",
    firstName: "María Elena",
    lastName: "González Rodríguez",
    idType: "CC",
    idNumber: "52.841.963",
    birthDate: "15/03/1980",
    age: 45,
    gender: "F" as const,
    bloodType: "O+",
    phone: "+57 310 456-7890",
    email: "maria.gonzalez@email.com",
    address: "Calle 45 #23-67, Apto 301",
    city: "Bogotá",
    country: "Colombia",
    insuranceProvider: "Sanitas EPS",
    insuranceNumber: "SAN-2024-789456",
    allergies: ["Penicilina", "Sulfas"],
    chronicConditions: ["Hipertensión arterial", "Diabetes tipo 2"],
    currentMedications: ["Enalapril 10mg - 1 vez al día", "Metformina 850mg - 2 veces al día"],
    lastVisit: "27/09/2025",
    totalPrescriptions: 24,
    activePrescriptions: 2,
    registrationDate: "10/01/2020",
    status: "active" as const
  },
  {
    id: "PAT-002",
    fullName: "Juan Carlos Martínez López",
    firstName: "Juan Carlos",
    lastName: "Martínez López",
    idType: "CC",
    idNumber: "41.523.789",
    birthDate: "22/07/1973",
    age: 52,
    gender: "M" as const,
    bloodType: "A+",
    phone: "+57 315 789-0123",
    email: "juan.martinez@email.com",
    address: "Carrera 15 #89-45",
    city: "Medellín",
    country: "Colombia",
    insuranceProvider: "Sura EPS",
    insuranceNumber: "SUR-2023-456123",
    allergies: ["Aspirina"],
    chronicConditions: ["Artritis reumatoide"],
    currentMedications: ["Metotrexato 15mg - 1 vez por semana"],
    lastVisit: "20/09/2025",
    totalPrescriptions: 18,
    activePrescriptions: 1,
    registrationDate: "05/03/2021",
    status: "active" as const
  },
  {
    id: "PAT-003",
    fullName: "Ana Patricia Ruiz Sánchez",
    firstName: "Ana Patricia",
    lastName: "Ruiz Sánchez",
    idType: "CC",
    idNumber: "39.654.321",
    birthDate: "08/11/1992",
    age: 33,
    gender: "F" as const,
    bloodType: "B+",
    phone: "+57 320 123-4567",
    email: "ana.ruiz@email.com",
    address: "Avenida 68 #45-32, Casa 12",
    city: "Cali",
    country: "Colombia",
    insuranceProvider: "Compensar EPS",
    insuranceNumber: "COM-2024-321654",
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    lastVisit: "25/09/2025",
    totalPrescriptions: 8,
    activePrescriptions: 0,
    registrationDate: "18/06/2022",
    status: "active" as const
  },
  {
    id: "PAT-004",
    fullName: "Roberto Antonio Silva Gómez",
    firstName: "Roberto Antonio",
    lastName: "Silva Gómez",
    idType: "CC",
    idNumber: "45.789.123",
    birthDate: "30/05/1997",
    age: 28,
    gender: "M" as const,
    bloodType: "AB+",
    phone: "+57 318 654-3210",
    email: "roberto.silva@email.com",
    address: "Transversal 34 #56-78",
    city: "Barranquilla",
    country: "Colombia",
    insuranceProvider: "Nueva EPS",
    insuranceNumber: "NEP-2025-987654",
    allergies: ["Yodo"],
    chronicConditions: ["Asma"],
    currentMedications: ["Salbutamol inhalador - Según necesidad"],
    lastVisit: "28/09/2025",
    totalPrescriptions: 15,
    activePrescriptions: 1,
    registrationDate: "22/11/2023",
    status: "active" as const
  },
  {
    id: "PAT-005",
    fullName: "Carmen Rosa Herrera Castro",
    firstName: "Carmen Rosa",
    lastName: "Herrera Castro",
    idType: "CC",
    idNumber: "48.963.852",
    birthDate: "12/02/1985",
    age: 40,
    gender: "F" as const,
    bloodType: "O-",
    phone: "+57 312 987-6543",
    email: "carmen.herrera@email.com",
    address: "Calle 123 #45-67, Torre B",
    city: "Cartagena",
    country: "Colombia",
    insuranceProvider: "Famisanar EPS",
    insuranceNumber: "FAM-2024-741852",
    allergies: ["Latex", "Mariscos"],
    chronicConditions: ["Hipotiroidismo"],
    currentMedications: ["Levotiroxina 100mcg - 1 vez al día en ayunas"],
    lastVisit: "15/09/2025",
    totalPrescriptions: 32,
    activePrescriptions: 1,
    registrationDate: "08/04/2019",
    status: "active" as const
  },
  {
    id: "PAT-006",
    fullName: "Diego Fernando Ramírez Vargas",
    firstName: "Diego Fernando",
    lastName: "Ramírez Vargas",
    idType: "CC",
    idNumber: "50.147.258",
    birthDate: "19/09/1990",
    age: 35,
    gender: "M" as const,
    bloodType: "A-",
    phone: "+57 311 234-5678",
    email: "diego.ramirez@email.com",
    address: "Carrera 7 #32-45",
    city: "Bucaramanga",
    country: "Colombia",
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    lastVisit: "10/08/2025",
    totalPrescriptions: 5,
    activePrescriptions: 0,
    registrationDate: "15/09/2024",
    status: "inactive" as const
  }
];

export function ListaPacientesPage() {
  const [searchMode, setSearchMode] = useState<"quick" | "advanced">("quick");
  const [quickSearch, setQuickSearch] = useState("");
  
  // Filtros avanzados
  const [nameFilter, setNameFilter] = useState("");
  const [idFilter, setIdFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");
  const [hasAllergies, setHasAllergies] = useState("all");
  const [hasChronicConditions, setHasChronicConditions] = useState("all");

  // Estados
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);
  const [isEditPatientDialogOpen, setIsEditPatientDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);

  // Búsqueda rápida
  const handleQuickSearch = () => {
    if (!quickSearch.trim()) {
      toast.error('Ingresa un criterio de búsqueda');
      return;
    }

    const results = mockPatients.filter(patient => 
      normalizedIncludes(patient.fullName, quickSearch) ||
      normalizedIncludes(patient.idNumber, quickSearch) ||
      normalizedIncludes(patient.email, quickSearch) ||
      normalizedIncludes(patient.phone, quickSearch)
    );

    setFilteredPatients(results);
    setHasSearched(true);

    toast.success('Búsqueda completada', {
      description: `Se encontraron ${results.length} paciente(s)`,
      duration: 3000,
    });
  };

  // Búsqueda avanzada
  const handleAdvancedSearch = () => {
    let results = [...mockPatients];

    if (nameFilter) {
      results = results.filter(p => 
        normalizedIncludes(p.fullName, nameFilter)
      );
    }

    if (idFilter) {
      results = results.filter(p => 
        normalizedIncludes(p.idNumber, idFilter)
      );
    }

    if (genderFilter !== "all") {
      results = results.filter(p => p.gender === genderFilter);
    }

    if (statusFilter !== "all") {
      results = results.filter(p => p.status === statusFilter);
    }

    if (ageFrom) {
      results = results.filter(p => p.age >= parseInt(ageFrom));
    }

    if (ageTo) {
      results = results.filter(p => p.age <= parseInt(ageTo));
    }

    if (hasAllergies === "yes") {
      results = results.filter(p => p.allergies.length > 0);
    } else if (hasAllergies === "no") {
      results = results.filter(p => p.allergies.length === 0);
    }

    if (hasChronicConditions === "yes") {
      results = results.filter(p => p.chronicConditions.length > 0);
    } else if (hasChronicConditions === "no") {
      results = results.filter(p => p.chronicConditions.length === 0);
    }

    setFilteredPatients(results);
    setHasSearched(true);

    toast.success('Búsqueda avanzada completada', {
      description: `Se encontraron ${results.length} paciente(s)`,
      duration: 3000,
    });
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setQuickSearch("");
    setNameFilter("");
    setIdFilter("");
    setGenderFilter("all");
    setStatusFilter("all");
    setAgeFrom("");
    setAgeTo("");
    setHasAllergies("all");
    setHasChronicConditions("all");
    setFilteredPatients(mockPatients);
    setHasSearched(false);
  };

  // Ver detalle del paciente
  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIsDetailOpen(true);
  };

  // Doble clic para ver detalles
  const handleDoubleClick = (patient: any) => {
    setSelectedPatient(patient);
    setIsDetailOpen(true);
  };

  // Estadísticas
  const stats = {
    total: mockPatients.length,
    active: mockPatients.filter(p => p.status === 'active').length,
    inactive: mockPatients.filter(p => p.status === 'inactive').length,
    withAllergies: mockPatients.filter(p => p.allergies.length > 0).length,
    withChronicConditions: mockPatients.filter(p => p.chronicConditions.length > 0).length,
    averageAge: Math.round(mockPatients.reduce((sum, p) => sum + p.age, 0) / mockPatients.length)
  };

  // Mostrar todos los pacientes al inicio
  if (!hasSearched) {
    if (filteredPatients.length !== mockPatients.length) {
      setFilteredPatients(mockPatients);
    }
  }

  // Paginación
  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    goToPage,
    changePageSize,
    goToNextPage,
    goToPreviousPage
  } = usePagination(filteredPatients, 25);

  // Datos para exportación
  const exportData = filteredPatients.map(p => ({
    'Nombre completo': p.fullName,
    'Identificación': p.idNumber,
    'Email': p.email,
    'Teléfono': p.phone,
    'Edad': p.age,
    'Género': p.gender === 'M' ? 'Masculino' : 'Femenino',
    'Ciudad': p.city,
    'Alergias': p.allergies.join(', ') || 'Ninguna',
    'Condiciones crónicas': p.chronicConditions.join(', ') || 'Ninguna',
    'Estado': p.status === 'active' ? 'Activo' : 'Inactivo'
  }));

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white">Listado de Pacientes</h1>
                  <p className="text-blue-100 text-sm">
                    Directorio completo del padrón de pacientes
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-blue-100 text-xs mb-1">Total pacientes</p>
                <p className="text-white font-semibold text-3xl">{stats.total}</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-blue-100 text-xs mb-1">Pacientes activos</p>
                <p className="text-white font-semibold text-3xl">{stats.active}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner informativo */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Gestión integral de pacientes</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  Accede al registro completo de pacientes con información demográfica, historial clínico, alergias y medicación actual para prescripción segura.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Búsqueda rápida y avanzada con múltiples criterios</li>
                  <li>Alertas de alergias y condiciones crónicas</li>
                  <li>Historial completo de prescripciones</li>
                  <li>Cumplimiento de normativas de privacidad (HIPAA, GDPR)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-center">
              <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="text-center">
              <UserX className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Inactivos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inactive}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Con alergias</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.withAllergies}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="text-center">
              <Heart className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Con condiciones</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.withChronicConditions}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Edad promedio</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageAge}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de búsqueda */}
      <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "quick" | "advanced")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick">Búsqueda Rápida</TabsTrigger>
          <TabsTrigger value="advanced">Búsqueda Avanzada</TabsTrigger>
        </TabsList>

        {/* Búsqueda rápida */}
        <TabsContent value="quick">
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda Rápida</CardTitle>
              <p className="text-sm text-gray-600">
                Busca pacientes por nombre, identificación, teléfono o email
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Nombre, identificación, teléfono o email..."
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
                    className="pl-11 h-12"
                  />
                </div>
                <Button 
                  onClick={handleQuickSearch} 
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
                {hasSearched && (
                  <Button 
                    onClick={handleClearSearch} 
                    variant="outline"
                    size="lg"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Mostrar todos
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Búsqueda avanzada */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda Avanzada</CardTitle>
              <p className="text-sm text-gray-600">
                Usa múltiples criterios para encontrar pacientes específicos
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre del paciente</label>
                    <Input
                      placeholder="Nombre completo"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Identificación</label>
                    <Input
                      placeholder="Número de identificación"
                      value={idFilter}
                      onChange={(e) => setIdFilter(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Sexo</label>
                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Estado</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="active">Activos</SelectItem>
                        <SelectItem value="inactive">Inactivos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Edad desde</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={ageFrom}
                      onChange={(e) => setAgeFrom(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Edad hasta</label>
                    <Input
                      type="number"
                      placeholder="120"
                      value={ageTo}
                      onChange={(e) => setAgeTo(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Alergias</label>
                    <Select value={hasAllergies} onValueChange={setHasAllergies}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="yes">Con alergias</SelectItem>
                        <SelectItem value="no">Sin alergias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Condiciones crónicas</label>
                    <Select value={hasChronicConditions} onValueChange={setHasChronicConditions}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="yes">Con condiciones</SelectItem>
                        <SelectItem value="no">Sin condiciones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleAdvancedSearch} 
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Buscar con filtros
                  </Button>
                  <Button 
                    onClick={handleClearSearch} 
                    variant="outline"
                    size="lg"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tabla de pacientes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pacientes registrados</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredPatients.length} paciente(s) • Doble clic para ver detalles
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ExportButtons
                data={exportData}
                filename="pacientes"
                title="Listado de Pacientes - ePrescription"
              />
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsNewPatientDialogOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Nuevo paciente
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Identificación</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Edad/Sexo</TableHead>
                <TableHead className="text-center">Alertas</TableHead>
                <TableHead className="text-center">Recetas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((patient) => (
                <TableRow 
                  key={patient.id}
                  className="hover:bg-blue-50/50 cursor-pointer"
                  onDoubleClick={() => handleDoubleClick(patient)}
                  title="Doble clic para ver detalles"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{patient.fullName}</p>
                        <p className="text-xs text-gray-600">{patient.city}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{patient.idType} {patient.idNumber}</p>
                    <p className="text-xs text-gray-600">{patient.bloodType}</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[150px]">{patient.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{patient.age} años</p>
                    <p className="text-xs text-gray-600">{patient.gender === 'M' ? 'Masculino' : 'Femenino'}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      {patient.allergies.length > 0 && (
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {patient.allergies.length} alergia(s)
                        </Badge>
                      )}
                      {patient.chronicConditions.length > 0 && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          {patient.chronicConditions.length} condición(es)
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {patient.totalPrescriptions}
                      </Badge>
                      {patient.activePrescriptions > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                          {patient.activePrescriptions} activa(s)
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={patient.status === 'active' 
                        ? 'bg-green-100 text-green-700 border-green-300' 
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                      }
                    >
                      {patient.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPatient(patient);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPatient(patient);
                          setIsEditPatientDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Paginación */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredPatients.length}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
          />
        </CardContent>
      </Card>

      {/* Panel de detalles */}
      <PatientDetailPanel
        patient={selectedPatient}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onViewProfile={(id) => {
          toast.info('Navegando a perfil completo...', { duration: 2000 });
        }}
        onViewPrescriptions={(id) => {
          toast.info('Navegando a recetas del paciente...', { duration: 2000 });
        }}
        onEdit={(id) => {
          setEditingPatient(selectedPatient);
          setIsEditPatientDialogOpen(true);
          setIsDetailOpen(false);
        }}
      />

      {/* Diálogo de nuevo paciente */}
      <NewPatientDialog
        open={isNewPatientDialogOpen}
        onOpenChange={setIsNewPatientDialogOpen}
      />

      {/* Diálogo de editar paciente */}
      {editingPatient && (
        <EditPatientProfileDialog
          open={isEditPatientDialogOpen}
          onOpenChange={setIsEditPatientDialogOpen}
          patient={{
            id: editingPatient.id,
            firstName: editingPatient.firstName,
            lastName: editingPatient.lastName,
            idType: editingPatient.idType,
            idNumber: editingPatient.idNumber,
            birthDate: editingPatient.birthDate,
            age: editingPatient.age,
            gender: editingPatient.gender,
            bloodType: editingPatient.bloodType,
            phone: editingPatient.phone,
            email: editingPatient.email,
            address: editingPatient.address,
            city: editingPatient.city,
            country: editingPatient.country,
            insuranceProvider: editingPatient.insuranceProvider || "",
            insuranceNumber: editingPatient.insuranceNumber || "",
            allergies: editingPatient.allergies || [],
            chronicConditions: editingPatient.chronicConditions || [],
            currentMedications: editingPatient.currentMedications || [],
            weight: "",
            height: "",
            bmi: "",
            occupation: "",
            emergencyContact: {
              name: "",
              relationship: "",
              phone: ""
            },
            clinicalNotes: ""
          }}
          onSave={(updatedData) => {
            toast.success('Paciente actualizado correctamente', {
              description: `Se han guardado los cambios de ${updatedData.firstName} ${updatedData.lastName}`,
              duration: 3000
            });
            setIsEditPatientDialogOpen(false);
            setEditingPatient(null);
          }}
        />
      )}
    </div>
  );
}

interface PerfilPacientePageProps {
  onNewPrescription?: (patient: any) => void;
}

export function PerfilPacientePage({ onNewPrescription }: PerfilPacientePageProps = {}) {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "prescriptions" | "documents">("overview");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [uploadDocDialogOpen, setUploadDocDialogOpen] = useState(false);
  const [documentSearchTerm, setDocumentSearchTerm] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>("all");

  // Datos del paciente (normalmente vendría de la navegación desde ListaPacientesPage)
  // Usar useState para poder actualizar los datos cuando se editen
  const [patient, setPatient] = useState({
    id: "PAT-001",
    fullName: "María Elena González Rodríguez",
    firstName: "María Elena",
    lastName: "González Rodríguez",
    idType: "CC",
    idNumber: "52.841.963",
    birthDate: "15/03/1980",
    age: 45,
    gender: "F" as const,
    bloodType: "O+",
    phone: "+57 310 456-7890",
    email: "maria.gonzalez@email.com",
    address: "Calle 45 #23-67, Apto 301",
    city: "Bogotá",
    country: "Colombia",
    insuranceProvider: "Sanitas EPS",
    insuranceNumber: "SAN-2024-789456",
    allergies: ["Penicilina", "Sulfas", "Mariscos"],
    chronicConditions: ["Hipertensión arterial", "Diabetes tipo 2", "Hipotiroidismo"],
    currentMedications: [
      "Enalapril 10mg - 1 vez al día - Mañana",
      "Metformina 850mg - 2 veces al día - Desayuno y cena",
      "Levotiroxina 100mcg - 1 vez al día en ayunas"
    ],
    lastVisit: "27/09/2025",
    totalPrescriptions: 24,
    activePrescriptions: 2,
    registrationDate: "10/01/2020",
    status: "active" as const,
    emergencyContact: {
      name: "Carlos González",
      relationship: "Esposo",
      phone: "+57 310 123-4567"
    },
    clinicalNotes: "Paciente con buena adherencia al tratamiento. Control periódico de glicemia y presión arterial. Última HbA1c: 6.5% (27/08/2025). Requiere seguimiento endocrinológico cada 3 meses.",
    weight: "68",
    height: "1.65",
    bmi: "24.98",
    occupation: "Docente"
  });

  // Timeline de eventos médicos
  const timelineEvents = [
    {
      id: "evt-001",
      date: "27/09/2025",
      time: "10:30 a.m.",
      type: "prescription" as const,
      title: "Nueva prescripción - Control HTA y Diabetes",
      description: "Renovación de medicamentos: Enalapril 10mg, Metformina 850mg. Paciente estable con buenos niveles de glicemia.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera - Medicina Interna",
      status: "completed" as const
    },
    {
      id: "evt-002",
      date: "27/08/2025",
      time: "09:00 a.m.",
      type: "lab" as const,
      title: "Resultados de laboratorio",
      description: "HbA1c: 6.5%, Glicemia en ayunas: 105 mg/dL, Perfil lipídico: valores normales. Control adecuado.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera - Medicina Interna",
      status: "completed" as const
    },
    {
      id: "evt-003",
      date: "15/08/2025",
      time: "11:15 a.m.",
      type: "visit" as const,
      title: "Control de rutina - Medicina Interna",
      description: "Paciente refiere buen estado general. PA: 125/80 mmHg. Peso estable. Se ordena laboratorio de control.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera - Medicina Interna",
      status: "completed" as const
    },
    {
      id: "evt-004",
      date: "10/06/2025",
      time: "03:45 p.m.",
      type: "diagnosis" as const,
      title: "Diagnóstico de Hipotiroidismo",
      description: "TSH elevada (8.5 mUI/L). Se inicia tratamiento con Levotiroxina 100mcg. Control en 6 semanas.",
      doctor: "Dra. Patricia Sánchez Vega - Endocrinología",
      status: "completed" as const
    },
    {
      id: "evt-005",
      date: "25/05/2025",
      time: "02:00 p.m.",
      type: "vaccination" as const,
      title: "Vacunación - Influenza",
      description: "Vacuna contra influenza estacional 2025. Sin reacciones adversas.",
      doctor: "Enf. Laura Martínez - Vacunación",
      status: "completed" as const
    },
    {
      id: "evt-006",
      date: "18/03/2025",
      time: "10:00 a.m.",
      type: "allergy" as const,
      title: "Registro de nueva alergia",
      description: "Paciente reporta reacción alérgica a mariscos (urticaria). Agregado a historial de alergias.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera - Medicina Interna",
      status: "completed" as const
    }
  ];

  // Historial de prescripciones recientes
  const recentPrescriptions = [
    {
      id: "RX-2025-009842",
      date: "27/09/2025",
      doctor: "Dr. Carlos Alberto Mendoza Herrera",
      medicines: ["Enalapril 10mg", "Metformina 850mg"],
      status: "dispensed" as const
    },
    {
      id: "RX-2025-008756",
      date: "15/08/2025",
      doctor: "Dr. Carlos Alberto Mendoza Herrera",
      medicines: ["Enalapril 10mg", "Metformina 850mg"],
      status: "dispensed" as const
    },
    {
      id: "RX-2025-007234",
      date: "10/06/2025",
      doctor: "Dra. Patricia Sánchez Vega",
      medicines: ["Levotiroxina 100mcg"],
      status: "dispensed" as const
    },
    {
      id: "RX-2025-006123",
      date: "28/05/2025",
      doctor: "Dr. Carlos Alberto Mendoza Herrera",
      medicines: ["Enalapril 10mg", "Metformina 850mg", "Atorvastatina 20mg"],
      status: "expired" as const
    }
  ];

  // Documentos clínicos
  const [clinicalDocuments, setClinicalDocuments] = useState([
    {
      id: "DOC-001",
      name: "Hemograma completo - Septiembre 2025",
      type: "lab" as const,
      category: "Laboratorio",
      date: "27/09/2025",
      uploadedBy: "Dr. Carlos Alberto Mendoza Herrera",
      size: "256 KB",
      format: "pdf" as const,
      description: "Hemograma completo con recuento diferencial. Valores dentro de rangos normales."
    },
    {
      id: "DOC-002",
      name: "Radiografía de tórax - PA y lateral",
      type: "imaging" as const,
      category: "Imagen diagnóstica",
      date: "20/09/2025",
      uploadedBy: "Dr. Roberto Jiménez - Radiología",
      size: "1.8 MB",
      format: "jpg" as const,
      description: "Sin hallazgos patológicos. Campos pulmonares limpios. Silueta cardíaca normal."
    },
    {
      id: "DOC-003",
      name: "HbA1c y perfil lipídico - Agosto 2025",
      type: "lab" as const,
      category: "Laboratorio",
      date: "27/08/2025",
      uploadedBy: "Dr. Carlos Alberto Mendoza Herrera",
      size: "198 KB",
      format: "pdf" as const,
      description: "HbA1c: 6.5%, Colesterol total: 185 mg/dL, HDL: 52 mg/dL, LDL: 110 mg/dL"
    },
    {
      id: "DOC-004",
      name: "Informe consulta - Endocrinología",
      type: "report" as const,
      category: "Informe médico",
      date: "15/08/2025",
      uploadedBy: "Dra. Patricia Sánchez Vega - Endocrinología",
      size: "142 KB",
      format: "pdf" as const,
      description: "Evaluación de control tiroideo. Paciente con buen control de hipotiroidismo con Levotiroxina."
    },
    {
      id: "DOC-005",
      name: "Ecografía abdominal completa",
      type: "imaging" as const,
      category: "Imagen diagnóstica",
      date: "10/07/2025",
      uploadedBy: "Dra. María Fernanda Castro - Radiología",
      size: "2.4 MB",
      format: "jpg" as const,
      description: "Hígado, vesícula, páncreas, bazo y riñones sin alteraciones. Estudio normal."
    },
    {
      id: "DOC-006",
      name: "Consentimiento informado - Procedimiento",
      type: "consent" as const,
      category: "Consentimiento",
      date: "05/07/2025",
      uploadedBy: "Dr. Carlos Alberto Mendoza Herrera",
      size: "325 KB",
      format: "pdf" as const,
      description: "Consentimiento informado para realización de procedimiento diagnóstico."
    },
    {
      id: "DOC-007",
      name: "Perfil tiroideo completo - Junio 2025",
      type: "lab" as const,
      category: "Laboratorio",
      date: "10/06/2025",
      uploadedBy: "Dra. Patricia Sánchez Vega - Endocrinología",
      size: "178 KB",
      format: "pdf" as const,
      description: "TSH: 2.5 mUI/L, T4 libre: 1.2 ng/dL. Función tiroidea normalizada con tratamiento."
    },
    {
      id: "DOC-008",
      name: "Electrocardiograma de reposo",
      type: "exam" as const,
      category: "Examen clínico",
      date: "28/05/2025",
      uploadedBy: "Dr. Jorge Luis Ramírez - Cardiología",
      size: "512 KB",
      format: "pdf" as const,
      description: "ECG de 12 derivaciones. Ritmo sinusal normal. FC: 72 lpm. Sin alteraciones."
    },
    {
      id: "DOC-009",
      name: "Receta médica - Control mensual",
      type: "prescription" as const,
      category: "Prescripción",
      date: "15/05/2025",
      uploadedBy: "Dr. Carlos Alberto Mendoza Herrera",
      size: "89 KB",
      format: "pdf" as const,
      description: "Prescripción mensual: Enalapril 10mg, Metformina 850mg, Levotiroxina 100mcg"
    },
    {
      id: "DOC-010",
      name: "Certificado de vacunación - Influenza",
      type: "other" as const,
      category: "Otro",
      date: "25/04/2025",
      uploadedBy: "Enf. Laura Martínez - Vacunación",
      size: "112 KB",
      format: "pdf" as const,
      description: "Certificado de vacunación contra influenza estacional 2025"
    }
  ]);

  const handleNewPrescription = () => {
    if (onNewPrescription) {
      onNewPrescription(patient);
      toast.success('Creando receta para el paciente', {
        description: `Receta para ${patient.fullName}`,
        duration: 3000,
      });
    } else {
      toast.success('Iniciando nueva prescripción...', {
        description: 'Serás redirigido al módulo de prescripciones',
        duration: 3000,
      });
    }
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const handleSaveProfile = (updatedPatient: typeof patient) => {
    // Actualizar fullName basado en firstName y lastName
    const patientWithFullName = {
      ...updatedPatient,
      fullName: `${updatedPatient.firstName} ${updatedPatient.lastName}`
    };
    setPatient(patientWithFullName);
    // Aquí normalmente se haría una llamada al backend para guardar los cambios
  };

  const handleUploadDocument = (newDoc: Omit<typeof clinicalDocuments[0], "id">) => {
    const docWithId = {
      ...newDoc,
      id: `DOC-${Date.now()}`
    };
    setClinicalDocuments([docWithId, ...clinicalDocuments]);
  };

  const handleViewDocument = (docId: string) => {
    const doc = clinicalDocuments.find(d => d.id === docId);
    if (doc) {
      toast.success("Abriendo documento", {
        description: `Visualizando: ${doc.name}`,
        duration: 3000,
      });
      // En producción, aquí se abriría el visualizador de documentos
    }
  };

  const handleDownloadDocument = (docId: string) => {
    const doc = clinicalDocuments.find(d => d.id === docId);
    if (doc) {
      toast.success("Descargando documento", {
        description: `${doc.name} (${doc.size})`,
        duration: 3000,
      });
      // En producción, aquí se iniciaría la descarga real
    }
  };

  const handleDeleteDocument = (docId: string) => {
    const doc = clinicalDocuments.find(d => d.id === docId);
    if (doc) {
      setClinicalDocuments(clinicalDocuments.filter(d => d.id !== docId));
      toast.success("Documento eliminado", {
        description: `${doc.name} ha sido eliminado`,
        duration: 3000,
      });
    }
  };

  const handleShareDocument = (docId: string) => {
    const doc = clinicalDocuments.find(d => d.id === docId);
    if (doc) {
      toast.success("Compartiendo documento", {
        description: `Generando enlace seguro para: ${doc.name}`,
        duration: 3000,
      });
      // En producción, aquí se generaría un enlace seguro para compartir
    }
  };

  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case "lab":
        return <FileCheck className="w-4 h-4" />;
      case "imaging":
        return <ImageIcon className="w-4 h-4" />;
      case "report":
        return <FileText className="w-4 h-4" />;
      case "consent":
        return <FileText className="w-4 h-4" />;
      case "exam":
        return <FileCheck className="w-4 h-4" />;
      case "prescription":
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getDocTypeColor = (type: string) => {
    switch (type) {
      case "lab":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "imaging":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "report":
        return "bg-green-100 text-green-800 border-green-300";
      case "consent":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "exam":
        return "bg-teal-100 text-teal-800 border-teal-300";
      case "prescription":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getFormatIcon = (format: string) => {
    if (format === "pdf") {
      return <FileText className="w-4 h-4 text-red-600" />;
    } else if (["jpg", "png"].includes(format)) {
      return <ImageIcon className="w-4 h-4 text-blue-600" />;
    } else {
      return <File className="w-4 h-4 text-gray-600" />;
    }
  };

  // Filtrar documentos
  const filteredDocuments = clinicalDocuments.filter(doc => {
    const matchesSearch = normalizedIncludes(doc.name, documentSearchTerm) ||
                         normalizedIncludes(doc.description || '', documentSearchTerm);
    const matchesType = documentTypeFilter === "all" || doc.type === documentTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleViewAllPrescriptions = () => {
    toast.info('Navegando a historial completo...', { duration: 2000 });
  };

  return (
    <div className="space-y-6">
      {/* Header del perfil */}
      <Card className="border-l-4 border-l-blue-500">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg">
                <User className="w-12 h-12 text-blue-600" />
              </div>

              {/* Información principal */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-gray-900">{patient.fullName}</h1>
                  <Badge 
                    variant="outline" 
                    className={patient.status === 'active' 
                      ? 'bg-green-100 text-green-700 border-green-300' 
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                    }
                  >
                    {patient.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Identificación</p>
                    <p className="text-sm font-medium">{patient.idType} {patient.idNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Edad</p>
                    <p className="text-sm font-medium">{patient.age} años ({patient.gender === 'M' ? 'M' : 'F'})</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Tipo de sangre</p>
                    <p className="text-sm font-medium">{patient.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Última visita</p>
                    <p className="text-sm font-medium">{patient.lastVisit}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleNewPrescription} className="bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Nueva receta
                  </Button>
                  <Button onClick={handleEditProfile} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar perfil
                  </Button>
                  <Button variant="outline" onClick={() => setContactDialogOpen(true)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Contactar
                  </Button>
                </div>
              </div>
            </div>

            {/* Indicadores rápidos */}
            <div className="hidden lg:flex gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-gray-900">{patient.totalPrescriptions}</p>
                <p className="text-xs text-gray-600">Recetas totales</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <Activity className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-gray-900">{patient.activePrescriptions}</p>
                <p className="text-xs text-gray-600">Activas</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Alertas médicas críticas */}
      {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Alergias */}
          {patient.allergies.length > 0 && (
            <Card className="bg-red-50 border-red-200 border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <AlertTriangle className="w-5 h-5" />
                  Alergias Conocidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patient.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      <p className="text-sm font-medium text-red-900">{allergy}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Condiciones crónicas */}
          {patient.chronicConditions.length > 0 && (
            <Card className="bg-orange-50 border-orange-200 border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <Heart className="w-5 h-5" />
                  Condiciones Crónicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patient.chronicConditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border border-orange-200">
                      <Activity className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <p className="text-sm font-medium text-orange-900">{condition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tabs de contenido */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <UserCircle className="w-4 h-4 mr-2" />
            Información General
          </TabsTrigger>
          <TabsTrigger value="history">
            <Activity className="w-4 h-4 mr-2" />
            Historial Médico
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <FileText className="w-4 h-4 mr-2" />
            Prescripciones
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileCheck className="w-4 h-4 mr-2" />
            Documentos
          </TabsTrigger>
        </TabsList>

        {/* Tab: Información General */}
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Información personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Datos Personales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Nombres</p>
                    <p className="text-sm font-medium">{patient.firstName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Apellidos</p>
                    <p className="text-sm font-medium">{patient.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Fecha de nacimiento</p>
                    <p className="text-sm font-medium">{patient.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Edad / Sexo</p>
                    <p className="text-sm font-medium">{patient.age} años / {patient.gender === 'M' ? 'Masculino' : 'Femenino'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Tipo de sangre</p>
                    <p className="text-sm font-medium">{patient.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Ocupación</p>
                    <p className="text-sm font-medium">{patient.occupation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Teléfono</p>
                    <p className="text-sm font-medium">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Dirección</p>
                    <p className="text-sm font-medium">{patient.address}</p>
                    <p className="text-xs text-gray-600 mt-1">{patient.city}, {patient.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datos antropométricos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Datos Antropométricos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Peso</p>
                    <p className="text-xl font-semibold text-gray-900">{patient.weight} kg</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Altura</p>
                    <p className="text-xl font-semibold text-gray-900">{patient.height} m</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">IMC</p>
                    <p className="text-xl font-semibold text-gray-900">{patient.bmi}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3 text-center">
                  Clasificación: Peso normal
                </p>
              </CardContent>
            </Card>

            {/* Seguro médico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  Seguro Médico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-gray-900">{patient.insuranceProvider}</p>
                  <p className="text-xs text-gray-600 mt-1">Póliza: {patient.insuranceNumber}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Contacto de emergencia</p>
                  <p className="text-sm font-medium">{patient.emergencyContact.name}</p>
                  <p className="text-xs text-gray-600">{patient.emergencyContact.relationship} • {patient.emergencyContact.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Medicación actual */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Medicación Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patient.currentMedications.map((medication, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Pill className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">{medication}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Activo
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notas clínicas */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notas Clínicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{patient.clinicalNotes}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Historial Médico */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline de Eventos Médicos
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Historial cronológico completo de eventos médicos relevantes
              </p>
            </CardHeader>
            <CardContent>
              <MedicalTimeline events={timelineEvents} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Prescripciones */}
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Historial de Prescripciones
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {patient.totalPrescriptions} prescripciones registradas
                  </p>
                </div>
                <Button onClick={handleViewAllPrescriptions} variant="outline">
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de receta</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Medicamentos</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>
                        <p className="font-medium">{prescription.id}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{prescription.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{prescription.doctor}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {prescription.medicines.map((med, idx) => (
                            <Badge key={idx} variant="outline" className="mr-1">
                              {med}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={prescription.status === 'dispensed' 
                            ? 'bg-green-100 text-green-700 border-green-300' 
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                          }
                        >
                          {prescription.status === 'dispensed' ? 'Dispensada' : 'Vencida'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Documentos */}
        <TabsContent value="documents">
          {/* Estadísticas de documentos */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">{clinicalDocuments.length}</p>
                    <p className="text-xs text-gray-600">Total documentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {clinicalDocuments.filter(d => d.type === "lab").length}
                    </p>
                    <p className="text-xs text-gray-600">Laboratorios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {clinicalDocuments.filter(d => d.type === "imaging").length}
                    </p>
                    <p className="text-xs text-gray-600">Imágenes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <File className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {clinicalDocuments.filter(d => d.type === "report").length}
                    </p>
                    <p className="text-xs text-gray-600">Informes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Documentos Clínicos
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Laboratorios, imágenes diagnósticas y documentos adjuntos
                  </p>
                </div>
                <Button onClick={() => setUploadDocDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir documento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros y búsqueda */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nombre o descripción..."
                      value={documentSearchTerm}
                      onChange={(e) => setDocumentSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                  <SelectTrigger className="md:w-64">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        Todos los documentos
                      </div>
                    </SelectItem>
                    <SelectItem value="lab">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4" />
                        Laboratorios
                      </div>
                    </SelectItem>
                    <SelectItem value="imaging">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Imágenes diagnósticas
                      </div>
                    </SelectItem>
                    <SelectItem value="report">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Informes médicos
                      </div>
                    </SelectItem>
                    <SelectItem value="consent">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Consentimientos
                      </div>
                    </SelectItem>
                    <SelectItem value="exam">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4" />
                        Exámenes clínicos
                      </div>
                    </SelectItem>
                    <SelectItem value="prescription">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Prescripciones
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        Otros
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {(documentSearchTerm || documentTypeFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDocumentSearchTerm("");
                      setDocumentTypeFilter("all");
                    }}
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Tabla de documentos */}
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    {documentSearchTerm || documentTypeFilter !== "all"
                      ? "No se encontraron documentos con los filtros aplicados"
                      : "No hay documentos adjuntos"}
                  </p>
                  <Button onClick={() => setUploadDocDialogOpen(true)} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Subir primer documento
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre del documento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Subido por</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getFormatIcon(doc.format)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              {doc.description && (
                                <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getDocTypeColor(doc.type)} border`}>
                            {getDocTypeIcon(doc.type)}
                            <span className="ml-1">{doc.category}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{doc.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{doc.size}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{doc.uploadedBy}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDocument(doc.id)}
                              title="Ver documento"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadDocument(doc.id)}
                              title="Descargar"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShareDocument(doc.id)}
                              title="Compartir"
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de edición de perfil */}
      <EditPatientProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        patient={patient}
        onSave={handleSaveProfile}
      />

      <ContactPatientDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        patient={patient}
      />

      <ClinicalDocumentsDialog
        open={uploadDocDialogOpen}
        onOpenChange={setUploadDocDialogOpen}
        patientName={patient.fullName}
        onUpload={handleUploadDocument}
      />
    </div>
  );
}

interface RecetasPacientePageProps {
  onNewPrescription?: (patient: any) => void;
}

export function RecetasPacientePage({ onNewPrescription }: RecetasPacientePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);

  // Datos del paciente completo para la nueva receta
  const patient = {
    id: "PAT-001",
    fullName: "María Elena González Rodríguez",
    firstName: "María Elena",
    lastName: "González Rodríguez",
    idType: "CC",
    idNumber: "52.841.963",
    birthDate: "15/03/1980",
    age: 45,
    gender: "F" as const,
    bloodType: "O+",
    phone: "+57 310 456-7890",
    email: "maria.gonzalez@email.com",
    address: "Calle 45 #23-67, Apto 301",
    city: "Bogotá",
    country: "Colombia",
    insuranceProvider: "Sanitas EPS",
    insuranceNumber: "SAN-2024-789456",
    allergies: ["Penicilina", "Sulfas"],
    chronicConditions: ["Hipertensión arterial", "Diabetes tipo 2"],
    currentMedications: ["Enalapril 10mg - 1 vez al día", "Metformina 850mg - 2 veces al día"],
    weight: "68 kg",
    height: "1.62 m",
    bmi: "25.9",
    occupation: "Contadora",
    emergencyContact: {
      name: "Carlos González",
      relationship: "Hermano",
      phone: "+57 311 123-4567"
    },
    clinicalNotes: "Paciente con adherencia al tratamiento. Control periódico de HbA1c y presión arterial."
  };

  // Datos mock de recetas del paciente
  const prescriptions = [
    {
      id: "RX-2025-009842",
      date: "27/09/2025",
      time: "10:30 a.m.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera",
      specialty: "Medicina Interna",
      medicines: [
        { name: "Enalapril", dose: "10mg", frequency: "Cada 12 horas", duration: "30 días" },
        { name: "Metformina", dose: "850mg", frequency: "Cada 8 horas", duration: "30 días" }
      ],
      diagnosis: "Hipertensión arterial esencial, Diabetes Mellitus tipo 2",
      status: "dispensed" as const,
      dispensedDate: "27/09/2025",
      pharmacy: "Farmacia Central - Hospital San Rafael",
      notes: "Control de presión arterial y glicemia. Próximo control en 30 días."
    },
    {
      id: "RX-2025-009123",
      date: "15/09/2025",
      time: "03:45 p.m.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera",
      specialty: "Medicina Interna",
      medicines: [
        { name: "Amoxicilina", dose: "500mg", frequency: "Cada 8 horas", duration: "7 días" },
        { name: "Ibuprofeno", dose: "400mg", frequency: "Cada 6 horas PRN", duration: "5 días" }
      ],
      diagnosis: "Faringitis aguda",
      status: "dispensed" as const,
      dispensedDate: "15/09/2025",
      pharmacy: "Farmacia Central - Hospital San Rafael",
      notes: "Completar tratamiento antibiótico. Reposo relativo."
    },
    {
      id: "RX-2025-008756",
      date: "15/08/2025",
      time: "11:00 a.m.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera",
      specialty: "Medicina Interna",
      medicines: [
        { name: "Enalapril", dose: "10mg", frequency: "Cada 12 horas", duration: "30 días" },
        { name: "Metformina", dose: "850mg", frequency: "Cada 8 horas", duration: "30 días" }
      ],
      diagnosis: "Hipertensión arterial esencial, Diabetes Mellitus tipo 2",
      status: "dispensed" as const,
      dispensedDate: "15/08/2025",
      pharmacy: "Farmacia Central - Hospital San Rafael",
      notes: "Medicamentos de control crónico."
    },
    {
      id: "RX-2025-008234",
      date: "28/07/2025",
      time: "09:15 a.m.",
      doctor: "Dra. Patricia Sánchez Vega",
      specialty: "Endocrinología",
      medicines: [
        { name: "Levotiroxina", dose: "100mcg", frequency: "Cada 24 horas", duration: "60 días" }
      ],
      diagnosis: "Hipotiroidismo primario",
      status: "dispensed" as const,
      dispensedDate: "28/07/2025",
      pharmacy: "Farmacia Central - Hospital San Rafael",
      notes: "Tomar en ayunas, 30 minutos antes del desayuno."
    },
    {
      id: "RX-2025-007234",
      date: "10/06/2025",
      time: "02:30 p.m.",
      doctor: "Dra. Patricia Sánchez Vega",
      specialty: "Endocrinología",
      medicines: [
        { name: "Levotiroxina", dose: "100mcg", frequency: "Cada 24 horas", duration: "30 días" }
      ],
      diagnosis: "Hipotiroidismo primario - Inicio de tratamiento",
      status: "dispensed" as const,
      dispensedDate: "10/06/2025",
      pharmacy: "Farmacia Central - Hospital San Rafael",
      notes: "Primera prescripción. Control con TSH en 6 semanas."
    },
    {
      id: "RX-2025-006789",
      date: "28/05/2025",
      time: "04:00 p.m.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera",
      specialty: "Medicina Interna",
      medicines: [
        { name: "Enalapril", dose: "10mg", frequency: "Cada 12 horas", duration: "30 días" },
        { name: "Metformina", dose: "850mg", frequency: "Cada 8 horas", duration: "30 días" },
        { name: "Atorvastatina", dose: "20mg", frequency: "Cada 24 horas", duration: "30 días" }
      ],
      diagnosis: "Hipertensión arterial, Diabetes tipo 2, Dislipidemia",
      status: "expired" as const,
      dispensedDate: "28/05/2025",
      pharmacy: "Farmacia Central - Hospital San Rafael",
      notes: "Inicio de estatina por perfil lipídico alterado."
    },
    {
      id: "RX-2025-005432",
      date: "15/04/2025",
      time: "10:45 a.m.",
      doctor: "Dr. Jorge Luis Ramírez",
      specialty: "Cardiología",
      medicines: [
        { name: "Enalapril", dose: "10mg", frequency: "Cada 12 horas", duration: "60 días" },
        { name: "Aspirina", dose: "100mg", frequency: "Cada 24 horas", duration: "60 días" }
      ],
      diagnosis: "Hipertensión arterial grado I",
      status: "expired" as const,
      dispensedDate: "15/04/2025",
      pharmacy: "Farmacia Central - Hospital San Rafael",
      notes: "Evaluación cardiovascular. Continuar con cambios en estilo de vida."
    },
    {
      id: "RX-2025-004567",
      date: "20/03/2025",
      time: "03:20 p.m.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera",
      specialty: "Medicina Interna",
      medicines: [
        { name: "Omeprazol", dose: "20mg", frequency: "Cada 24 horas", duration: "14 días" }
      ],
      diagnosis: "Gastritis aguda",
      status: "expired" as const,
      dispensedDate: "20/03/2025",
      pharmacy: "Farmacia Central - Hospital San Rafael",
      notes: "Evitar irritantes gástricos. Dieta blanda."
    },
    {
      id: "RX-2025-003891",
      date: "28/02/2025",
      time: "11:30 a.m.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera",
      specialty: "Medicina Interna",
      medicines: [
        { name: "Enalapril", dose: "10mg", frequency: "Cada 12 horas", duration: "30 días" },
        { name: "Metformina", dose: "850mg", frequency: "Cada 8 horas", duration: "30 días" }
      ],
      diagnosis: "Hipertensión arterial esencial, Diabetes Mellitus tipo 2",
      status: "expired" as const,
      dispensedDate: "28/02/2025",
      pharmacy: "Farmacia Central - Hospital San Rafael",
      notes: "Control mensual de crónicos."
    },
    {
      id: "RX-2025-002341",
      date: "15/01/2025",
      time: "09:00 a.m.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera",
      specialty: "Medicina Interna",
      medicines: [
        { name: "Losartán", dose: "50mg", frequency: "Cada 12 horas", duration: "30 días" },
        { name: "Metformina", dose: "500mg", frequency: "Cada 8 horas", duration: "30 días" }
      ],
      diagnosis: "Hipertensión arterial, Diabetes tipo 2 - Inicio de tratamiento",
      status: "expired" as const,
      dispensedDate: "15/01/2025",
      pharmacy: "Farmacia Central - Hospital San Rafael",
      notes: "Primera prescripción de manejo crónico. Control en 30 días."
    },
    {
      id: "RX-2024-012456",
      date: "20/12/2024",
      time: "02:15 p.m.",
      doctor: "Dra. Ana María Fernández",
      specialty: "Medicina General",
      medicines: [
        { name: "Loratadina", dose: "10mg", frequency: "Cada 24 horas", duration: "10 días" }
      ],
      diagnosis: "Rinitis alérgica",
      status: "cancelled" as const,
      cancelledDate: "20/12/2024",
      cancelledReason: "Paciente reportó reacción adversa",
      notes: "Suspendido por reacción adversa. Cambiar a otro antihistamínico."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "dispensed":
        return "bg-green-100 text-green-800 border-green-300";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "dispensed":
        return "Dispensada";
      case "expired":
        return "Vencida";
      case "cancelled":
        return "Cancelada";
      default:
        return "Activa";
    }
  };

  // Filtrar prescripciones
  const filteredPrescriptions = prescriptions.filter(presc => {
    const matchesSearch = 
      normalizedIncludes(presc.id, searchTerm) ||
      normalizedIncludes(presc.doctor, searchTerm) ||
      normalizedIncludes(presc.diagnosis, searchTerm) ||
      presc.medicines.some(med => normalizedIncludes(med.name, searchTerm));
    
    const matchesStatus = statusFilter === "all" || presc.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const prescDate = new Date(presc.date.split('/').reverse().join('-'));
      const now = new Date();
      const diffMonths = (now.getFullYear() - prescDate.getFullYear()) * 12 + (now.getMonth() - prescDate.getMonth());
      
      if (dateFilter === "1month") matchesDate = diffMonths <= 1;
      else if (dateFilter === "3months") matchesDate = diffMonths <= 3;
      else if (dateFilter === "6months") matchesDate = diffMonths <= 6;
      else if (dateFilter === "1year") matchesDate = diffMonths <= 12;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Estadísticas
  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter(p => p.status === "dispensed").length,
    expired: prescriptions.filter(p => p.status === "expired").length,
    cancelled: prescriptions.filter(p => p.status === "cancelled").length
  };

  const handleViewPrescription = (id: string) => {
    setSelectedPrescription(id);
  };

  const handlePrintPrescription = (id: string) => {
    const presc = prescriptions.find(p => p.id === id);
    if (presc) {
      toast.success("Imprimiendo receta", {
        description: `${presc.id} - ${presc.date}`,
        duration: 3000,
      });
    }
  };

  const handleDownloadPrescription = (id: string) => {
    const presc = prescriptions.find(p => p.id === id);
    if (presc) {
      toast.success("Descargando receta", {
        description: `${presc.id} - Formato PDF`,
        duration: 3000,
      });
    }
  };

  const selectedPrescriptionData = prescriptions.find(p => p.id === selectedPrescription);

  return (
    <div className="space-y-6">
      {/* Header con información del paciente */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900 mb-1">{patient.fullName}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <UserCircle className="w-4 h-4" />
                    <span>CC {patient.idNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{patient.age} años</span>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {patient.gender === "F" ? "Femenino" : "Masculino"}
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    Grupo {patient.bloodType}
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => onNewPrescription?.(patient)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva receta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-600">Total recetas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
                <p className="text-xs text-gray-600">Dispensadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{stats.expired}</p>
                <p className="text-xs text-gray-600">Vencidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{stats.cancelled}</p>
                <p className="text-xs text-gray-600">Canceladas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Historial de Recetas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por N° receta, médico, diagnóstico o medicamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="dispensed">Dispensadas</SelectItem>
                <SelectItem value="expired">Vencidas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el historial</SelectItem>
                <SelectItem value="1month">Último mes</SelectItem>
                <SelectItem value="3months">Últimos 3 meses</SelectItem>
                <SelectItem value="6months">Últimos 6 meses</SelectItem>
                <SelectItem value="1year">Último año</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                }}
              >
                <FilterX className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Tabla de recetas */}
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "No se encontraron recetas con los filtros aplicados"
                  : "No hay recetas registradas para este paciente"}
              </p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Crear primera receta
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Receta</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Medicamentos</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((presc) => (
                  <TableRow 
                    key={presc.id}
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => handleViewPrescription(presc.id)}
                  >
                    <TableCell>
                      <p className="font-medium text-blue-600">{presc.id}</p>
                      <p className="text-xs text-gray-500">{presc.time}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{presc.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-gray-900">{presc.doctor}</p>
                      <p className="text-xs text-gray-600">{presc.specialty}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {presc.medicines.slice(0, 2).map((med, idx) => (
                          <Badge key={idx} variant="outline" className="mr-1 bg-blue-50 text-blue-700 border-blue-300">
                            <Pill className="w-3 h-3 mr-1" />
                            {med.name} {med.dose}
                          </Badge>
                        ))}
                        {presc.medicines.length > 2 && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700">
                            +{presc.medicines.length - 2} más
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700 line-clamp-2">{presc.diagnosis}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(presc.status)} border`}>
                        {getStatusLabel(presc.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPrescription(presc.id)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPrescription(presc.id)}
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrintPrescription(presc.id)}
                          title="Imprimir"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredPrescriptions.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>Mostrando {filteredPrescriptions.length} de {prescriptions.length} recetas</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel lateral de detalles */}
      {selectedPrescriptionData && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
            <div>
              <h3 className="text-gray-900">Detalles de la Receta</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedPrescriptionData.id}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPrescription(null)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Estado */}
            <Card className={selectedPrescriptionData.status === "dispensed" ? "bg-green-50 border-green-200" : selectedPrescriptionData.status === "cancelled" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estado de la receta</p>
                    <Badge variant="outline" className={`${getStatusColor(selectedPrescriptionData.status)} border`}>
                      {getStatusLabel(selectedPrescriptionData.status)}
                    </Badge>
                  </div>
                  {selectedPrescriptionData.status === "dispensed" && (
                    <FileCheck className="w-8 h-8 text-green-600" />
                  )}
                  {selectedPrescriptionData.status === "cancelled" && (
                    <UserX className="w-8 h-8 text-red-600" />
                  )}
                  {selectedPrescriptionData.status === "expired" && (
                    <AlertTriangle className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                {selectedPrescriptionData.status === "dispensed" && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-gray-600">Dispensada el {selectedPrescriptionData.dispensedDate}</p>
                    <p className="text-xs text-gray-600">{selectedPrescriptionData.pharmacy}</p>
                  </div>
                )}
                {selectedPrescriptionData.status === "cancelled" && selectedPrescriptionData.cancelledReason && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-xs text-gray-600">Motivo: {selectedPrescriptionData.cancelledReason}</p>
                    <p className="text-xs text-gray-600">Fecha: {selectedPrescriptionData.cancelledDate}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información general */}
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Fecha de emisión</p>
                    <p className="text-sm font-medium">{selectedPrescriptionData.date} - {selectedPrescriptionData.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Médico prescriptor</p>
                    <p className="text-sm font-medium">{selectedPrescriptionData.doctor}</p>
                    <p className="text-xs text-gray-600">{selectedPrescriptionData.specialty}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Diagnóstico</p>
                    <p className="text-sm font-medium">{selectedPrescriptionData.diagnosis}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medicamentos prescritos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Medicamentos Prescritos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedPrescriptionData.medicines.map((med, idx) => (
                  <div key={idx} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{med.name}</p>
                        <Badge variant="outline" className="mt-1 bg-white">
                          {med.dose}
                        </Badge>
                      </div>
                      <Pill className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-600">Frecuencia</p>
                        <p className="font-medium text-gray-900">{med.frequency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Duración</p>
                        <p className="font-medium text-gray-900">{med.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notas e indicaciones */}
            {selectedPrescriptionData.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas e Indicaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{selectedPrescriptionData.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Acciones */}
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => handleDownloadPrescription(selectedPrescriptionData.id)}>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
              <Button variant="outline" onClick={() => handlePrintPrescription(selectedPrescriptionData.id)}>
                <FileText className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}