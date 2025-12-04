import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { PageBanner } from "../components/PageBanner";
import { TablePagination } from "../components/TablePagination";
import { ExportButtons } from "../components/ExportButtons";
import { usePagination } from "../utils/usePagination";
import {
  Stethoscope,
  UserPlus,
  Search,
  Filter,
  FilterX,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  Activity,
  TrendingUp,
  UserCheck,
  UserX,
  Award,
  Shield,
  GraduationCap,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { DoctorDetailPanel } from "../components/DoctorDetailPanel";
import { NewDoctorDialog } from "../components/NewDoctorDialog";
import { EditDoctorDialog } from "../components/EditDoctorDialog";
import { normalizedIncludes } from "../utils/searchUtils";
import { toast } from "sonner@2.0.3";

// Datos mock de médicos
const mockDoctors = [
  {
    id: "DOC-001",
    fullName: "Dr. Carlos Andrés Martínez López",
    firstName: "Carlos Andrés",
    lastName: "Martínez López",
    specialty: "Cardiología",
    subspecialties: ["Electrofisiología", "Cardiopatía isquémica"],
    licenseNumber: "MSP-2015-045678",
    licenseExpiry: "15/06/2026",
    email: "carlos.martinez@hospital.com",
    phone: "+57 310 456-7890",
    officePhone: "+57 1 234-5678",
    address: "Cra 15 #85-23, Consultorio 402",
    city: "Bogotá",
    country: "Colombia",
    university: "Universidad Nacional de Colombia",
    graduationYear: "2008",
    yearsOfExperience: 17,
    certifications: [
      "Certificación en Electrofisiología Cardíaca - ACC 2018",
      "Fellowship en Arritmias Cardíacas - Cleveland Clinic 2012",
      "Diplomado en Ecocardiografía Avanzada 2020"
    ],
    totalPrescriptions: 2847,
    monthlyPrescriptions: 156,
    totalPatients: 892,
    averageMonthlyPrescriptions: 142,
    registrationDate: "10/01/2020",
    lastActivity: "01/10/2025",
    status: "active" as const,
    certificationStatus: "verified" as const,
    isOnDuty: true,
    schedule: [
      { days: "Lunes - Viernes", hours: "08:00 - 14:00" },
      { days: "Sábados", hours: "09:00 - 12:00" }
    ]
  },
  {
    id: "DOC-002",
    fullName: "Dra. María Elena Rodríguez Silva",
    firstName: "María Elena",
    lastName: "Rodríguez Silva",
    specialty: "Pediatría",
    subspecialties: ["Neonatología", "Cuidados intensivos pediátricos"],
    licenseNumber: "MSP-2012-034521",
    licenseExpiry: "22/11/2025",
    email: "maria.rodriguez@hospital.com",
    phone: "+57 315 234-8901",
    officePhone: "+57 1 345-6789",
    address: "Calle 116 #9-02, Torre Médica 3, Piso 8",
    city: "Bogotá",
    country: "Colombia",
    university: "Universidad de los Andes",
    graduationYear: "2005",
    yearsOfExperience: 20,
    certifications: [
      "Especialista en Neonatología - Hospital San José 2010",
      "Reanimación Neonatal Avanzada - AAP 2022",
      "Certificación en Ventilación Mecánica Pediátrica 2019"
    ],
    totalPrescriptions: 3921,
    monthlyPrescriptions: 198,
    totalPatients: 1456,
    averageMonthlyPrescriptions: 185,
    registrationDate: "15/03/2020",
    lastActivity: "30/09/2025",
    status: "active" as const,
    certificationStatus: "verified" as const,
    isOnDuty: false,
    schedule: [
      { days: "Lunes - Jueves", hours: "14:00 - 18:00" },
      { days: "Viernes", hours: "08:00 - 12:00" }
    ]
  },
  {
    id: "DOC-003",
    fullName: "Dr. Jorge Luis Ramírez Mendoza",
    firstName: "Jorge Luis",
    lastName: "Ramírez Mendoza",
    specialty: "Medicina Interna",
    subspecialties: ["Endocrinología", "Diabetes"],
    licenseNumber: "MSP-2018-056789",
    licenseExpiry: "10/08/2027",
    email: "jorge.ramirez@hospital.com",
    phone: "+57 312 567-8901",
    officePhone: "+57 1 456-7890",
    address: "Av. Caracas #45-67, Centro Médico, Consultorio 305",
    city: "Bogotá",
    country: "Colombia",
    university: "Universidad Javeriana",
    graduationYear: "2012",
    yearsOfExperience: 13,
    certifications: [
      "Especialista en Endocrinología - Hospital Universitario 2016",
      "Certificación en Manejo de Diabetes - ADA 2021",
      "Ecografía de tiroides - AACE 2020"
    ],
    totalPrescriptions: 1867,
    monthlyPrescriptions: 123,
    totalPatients: 567,
    averageMonthlyPrescriptions: 115,
    registrationDate: "20/06/2020",
    lastActivity: "29/09/2025",
    status: "active" as const,
    certificationStatus: "verified" as const,
    isOnDuty: true,
    schedule: [
      { days: "Lunes, Miércoles, Viernes", hours: "08:00 - 13:00" },
      { days: "Martes, Jueves", hours: "15:00 - 19:00" }
    ]
  },
  {
    id: "DOC-004",
    fullName: "Dra. Ana Patricia Gómez Torres",
    firstName: "Ana Patricia",
    lastName: "Gómez Torres",
    specialty: "Ginecología y Obstetricia",
    subspecialties: ["Medicina materno-fetal", "Ultrasonido obstétrico"],
    licenseNumber: "MSP-2016-047823",
    licenseExpiry: "18/04/2026",
    email: "ana.gomez@hospital.com",
    phone: "+57 318 678-9012",
    officePhone: "+57 1 567-8901",
    address: "Calle 100 #15-45, Clínica de la Mujer",
    city: "Bogotá",
    country: "Colombia",
    university: "Universidad El Bosque",
    graduationYear: "2010",
    yearsOfExperience: 15,
    certifications: [
      "Especialista en Medicina Materno Fetal 2014",
      "Certificación en Ultrasonido Obstétrico - ISUOG 2019",
      "Manejo de embarazo de alto riesgo - ACOG 2021"
    ],
    totalPrescriptions: 2134,
    monthlyPrescriptions: 142,
    totalPatients: 734,
    averageMonthlyPrescriptions: 128,
    registrationDate: "08/02/2020",
    lastActivity: "01/10/2025",
    status: "active" as const,
    certificationStatus: "verified" as const,
    isOnDuty: false,
    schedule: [
      { days: "Lunes - Viernes", hours: "09:00 - 16:00" }
    ]
  },
  {
    id: "DOC-005",
    fullName: "Dr. Roberto Alejandro Pérez Vargas",
    firstName: "Roberto Alejandro",
    lastName: "Pérez Vargas",
    specialty: "Ortopedia y Traumatología",
    subspecialties: ["Cirugía de columna", "Traumatología deportiva"],
    licenseNumber: "MSP-2014-038956",
    licenseExpiry: "25/09/2025",
    email: "roberto.perez@hospital.com",
    phone: "+57 316 789-0123",
    officePhone: "+57 1 678-9012",
    address: "Cra 7 #127-45, Centro de Ortopedia",
    city: "Bogotá",
    country: "Colombia",
    university: "Universidad del Rosario",
    graduationYear: "2007",
    yearsOfExperience: 18,
    certifications: [
      "Fellowship en Cirugía de Columna - Mayo Clinic 2011",
      "Certificación en Artroscopia de Hombro - ESSKA 2018",
      "Cirugía mínimamente invasiva de columna 2020"
    ],
    totalPrescriptions: 1654,
    monthlyPrescriptions: 98,
    totalPatients: 489,
    averageMonthlyPrescriptions: 92,
    registrationDate: "12/04/2020",
    lastActivity: "28/09/2025",
    status: "active" as const,
    certificationStatus: "verified" as const,
    isOnDuty: false,
    schedule: [
      { days: "Lunes, Miércoles", hours: "07:00 - 12:00" },
      { days: "Martes, Jueves", hours: "14:00 - 18:00" }
    ],
    notes: "Licencia próxima a vencer - renovación en proceso"
  },
  {
    id: "DOC-006",
    fullName: "Dra. Laura Daniela Castro Moreno",
    firstName: "Laura Daniela",
    lastName: "Castro Moreno",
    specialty: "Neurología",
    subspecialties: ["Epilepsia", "Neurofisiología"],
    licenseNumber: "MSP-2019-062345",
    licenseExpiry: "30/12/2027",
    email: "laura.castro@hospital.com",
    phone: "+57 314 890-1234",
    officePhone: "+57 1 789-0123",
    address: "Calle 85 #15-32, Piso 6",
    city: "Bogotá",
    country: "Colombia",
    university: "Universidad de Antioquia",
    graduationYear: "2013",
    yearsOfExperience: 12,
    certifications: [
      "Especialista en Epilepsia - Hospital Pablo Tobón Uribe 2017",
      "Electroencefalografía Avanzada - ILAE 2020",
      "Certificación en Neuromodulación 2022"
    ],
    totalPrescriptions: 1423,
    monthlyPrescriptions: 87,
    totalPatients: 398,
    averageMonthlyPrescriptions: 79,
    registrationDate: "05/08/2020",
    lastActivity: "30/09/2025",
    status: "active" as const,
    certificationStatus: "verified" as const,
    isOnDuty: true,
    schedule: [
      { days: "Martes - Viernes", hours: "08:00 - 14:00" }
    ]
  },
  {
    id: "DOC-007",
    fullName: "Dr. Fernando José Díaz Ruiz",
    firstName: "Fernando José",
    lastName: "Díaz Ruiz",
    specialty: "Psiquiatría",
    subspecialties: ["Psiquiatría de enlace", "Trastornos del ánimo"],
    licenseNumber: "MSP-2017-052134",
    licenseExpiry: "14/03/2026",
    email: "fernando.diaz@hospital.com",
    phone: "+57 317 901-2345",
    officePhone: "+57 1 890-1234",
    address: "Cra 19 #98-45, Centro de Salud Mental",
    city: "Bogotá",
    country: "Colombia",
    university: "Universidad CES",
    graduationYear: "2011",
    yearsOfExperience: 14,
    certifications: [
      "Especialista en Psiquiatría de Enlace 2015",
      "Certificación en Psicofarmacología - APA 2019",
      "Terapia Electroconvulsiva - APAPB 2021"
    ],
    totalPrescriptions: 2789,
    monthlyPrescriptions: 167,
    totalPatients: 621,
    averageMonthlyPrescriptions: 158,
    registrationDate: "18/05/2020",
    lastActivity: "01/10/2025",
    status: "active" as const,
    certificationStatus: "verified" as const,
    isOnDuty: false,
    schedule: [
      { days: "Lunes - Viernes", hours: "10:00 - 18:00" }
    ]
  },
  {
    id: "DOC-008",
    fullName: "Dr. Miguel Ángel Hernández Soto",
    firstName: "Miguel Ángel",
    lastName: "Hernández Soto",
    specialty: "Dermatología",
    subspecialties: ["Dermatología oncológica", "Cirugía dermatológica"],
    licenseNumber: "MSP-2013-041278",
    licenseExpiry: "20/07/2024",
    email: "miguel.hernandez@hospital.com",
    phone: "+57 313 012-3456",
    officePhone: "+57 1 901-2345",
    address: "Av. 15 #104-32, Clínica Dermatológica",
    city: "Bogotá",
    country: "Colombia",
    university: "Universidad Militar Nueva Granada",
    graduationYear: "2006",
    yearsOfExperience: 19,
    certifications: [
      "Especialista en Dermatología Oncológica 2010",
      "Cirugía de Mohs - AAD 2014",
      "Láser dermatológico avanzado 2020"
    ],
    totalPrescriptions: 1234,
    monthlyPrescriptions: 67,
    totalPatients: 445,
    averageMonthlyPrescriptions: 71,
    registrationDate: "22/07/2020",
    lastActivity: "15/08/2025",
    status: "inactive" as const,
    certificationStatus: "expired" as const,
    isOnDuty: false,
    schedule: [],
    notes: "Licencia vencida - suspendido temporalmente hasta renovación"
  }
];

interface ListaMedicosPageProps {
  onNavigate?: (route: string, doctorId?: string) => void;
}

export function ListaMedicosPage({ onNavigate }: ListaMedicosPageProps = {}) {
  const [searchMode, setSearchMode] = useState<"quick" | "advanced">("quick");
  const [quickSearch, setQuickSearch] = useState("");
  
  // Filtros avanzados
  const [nameFilter, setNameFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [certificationFilter, setCertificationFilter] = useState("all");
  const [licenseFilter, setLicenseFilter] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");

  // Estados
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewDoctorDialogOpen, setIsNewDoctorDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Calcular estadísticas
  const stats = {
    total: mockDoctors.length,
    active: mockDoctors.filter(d => d.status === "active").length,
    inactive: mockDoctors.filter(d => d.status === "inactive").length,
    verified: mockDoctors.filter(d => d.certificationStatus === "verified").length,
    onDuty: mockDoctors.filter(d => d.isOnDuty).length,
    expiringSoon: mockDoctors.filter(d => {
      if (!d.licenseExpiry) return false;
      const expiry = new Date(d.licenseExpiry.split('/').reverse().join('-'));
      const today = new Date();
      const diffMonths = (expiry.getFullYear() - today.getFullYear()) * 12 + 
                        (expiry.getMonth() - today.getMonth());
      return diffMonths <= 3 && diffMonths >= 0;
    }).length
  };

  // Búsqueda rápida
  const handleQuickSearch = () => {
    if (!quickSearch.trim()) {
      toast.error('Ingresa un criterio de búsqueda');
      return;
    }

    const results = mockDoctors.filter(doctor => 
      normalizedIncludes(doctor.fullName, quickSearch) ||
      normalizedIncludes(doctor.licenseNumber, quickSearch) ||
      normalizedIncludes(doctor.specialty, quickSearch) ||
      normalizedIncludes(doctor.email, quickSearch) ||
      normalizedIncludes(doctor.phone, quickSearch)
    );

    setFilteredDoctors(results);
    setHasSearched(true);

    toast.success('Búsqueda completada', {
      description: `Se encontraron ${results.length} médico(s)`,
      duration: 3000,
    });
  };

  // Búsqueda avanzada
  const handleAdvancedSearch = () => {
    let results = [...mockDoctors];

    if (nameFilter) {
      results = results.filter(d => 
        normalizedIncludes(d.fullName, nameFilter)
      );
    }

    if (specialtyFilter !== "all") {
      results = results.filter(d => d.specialty === specialtyFilter);
    }

    if (statusFilter !== "all") {
      results = results.filter(d => d.status === statusFilter);
    }

    if (certificationFilter !== "all") {
      results = results.filter(d => d.certificationStatus === certificationFilter);
    }

    if (licenseFilter) {
      results = results.filter(d => 
        normalizedIncludes(d.licenseNumber, licenseFilter)
      );
    }

    if (universityFilter) {
      results = results.filter(d => 
        normalizedIncludes(d.university, universityFilter)
      );
    }

    if (minExperience) {
      results = results.filter(d => d.yearsOfExperience >= parseInt(minExperience));
    }

    if (maxExperience) {
      results = results.filter(d => d.yearsOfExperience <= parseInt(maxExperience));
    }

    setFilteredDoctors(results);
    setHasSearched(true);

    toast.success('Búsqueda avanzada completada', {
      description: `Se encontraron ${results.length} médico(s)`,
      duration: 3000,
    });
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setQuickSearch("");
    setNameFilter("");
    setSpecialtyFilter("all");
    setStatusFilter("all");
    setCertificationFilter("all");
    setLicenseFilter("");
    setUniversityFilter("");
    setMinExperience("");
    setMaxExperience("");
    setFilteredDoctors(mockDoctors);
    setHasSearched(false);
    
    toast.info('Filtros limpiados', {
      description: 'Mostrando todos los médicos',
      duration: 2000,
    });
  };

  // Doble clic en fila
  const handleDoubleClick = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsDetailOpen(true);
  };

  // Obtener lista única de especialidades
  const specialties = Array.from(new Set(mockDoctors.map(d => d.specialty))).sort();

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <PageBanner
        icon={Stethoscope}
        title="Listado de Médicos"
        description="Directorio profesional médico del hospital"
        gradient="from-teal-600 via-cyan-500 to-blue-600"
        action={
          <Button onClick={() => setIsNewDoctorDialogOpen(true)} className="bg-white text-teal-600 hover:bg-teal-50 shadow-lg">
            <UserPlus className="w-5 h-5 mr-2" />
            Nuevo médico
          </Button>
        }
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <Stethoscope className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-center">
              <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl">{stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="text-center">
              <UserX className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Inactivos</p>
              <p className="text-2xl">{stats.inactive}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Verificados</p>
              <p className="text-2xl">{stats.verified}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-center">
              <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">En turno</p>
              <p className="text-2xl">{stats.onDuty}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="text-center">
              <AlertCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Lic. por vencer</p>
              <p className="text-2xl">{stats.expiringSoon}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sistema de búsqueda */}
      <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "quick" | "advanced")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Búsqueda rápida
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Búsqueda avanzada
          </TabsTrigger>
        </TabsList>

        {/* Búsqueda rápida */}
        <TabsContent value="quick">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Búsqueda rápida de médicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nombre, licencia, especialidad, email o teléfono..."
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
                  />
                </div>
                <Button onClick={handleQuickSearch} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
                {hasSearched && (
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Limpiar
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
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros avanzados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Nombre */}
                  <div className="space-y-2">
                    <label className="text-sm">Nombre del médico</label>
                    <Input
                      placeholder="Ej: Carlos Martínez"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                  </div>

                  {/* Especialidad */}
                  <div className="space-y-2">
                    <label className="text-sm">Especialidad</label>
                    <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las especialidades</SelectItem>
                        {specialties.map(specialty => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estado */}
                  <div className="space-y-2">
                    <label className="text-sm">Estado</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Certificación */}
                  <div className="space-y-2">
                    <label className="text-sm">Certificación</label>
                    <Select value={certificationFilter} onValueChange={setCertificationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="verified">Verificada</SelectItem>
                        <SelectItem value="expired">Vencida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Número de licencia */}
                  <div className="space-y-2">
                    <label className="text-sm">Número de licencia</label>
                    <Input
                      placeholder="Ej: MSP-2015-045678"
                      value={licenseFilter}
                      onChange={(e) => setLicenseFilter(e.target.value)}
                    />
                  </div>

                  {/* Universidad */}
                  <div className="space-y-2">
                    <label className="text-sm">Universidad</label>
                    <Input
                      placeholder="Ej: Universidad Nacional"
                      value={universityFilter}
                      onChange={(e) => setUniversityFilter(e.target.value)}
                    />
                  </div>

                  {/* Experiencia mínima */}
                  <div className="space-y-2">
                    <label className="text-sm">Experiencia mínima (años)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minExperience}
                      onChange={(e) => setMinExperience(e.target.value)}
                    />
                  </div>

                  {/* Experiencia máxima */}
                  <div className="space-y-2">
                    <label className="text-sm">Experiencia máxima (años)</label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={maxExperience}
                      onChange={(e) => setMaxExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    size="lg"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                  <Button
                    onClick={handleAdvancedSearch}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tabla de médicos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Médicos registrados</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredDoctors.length} médico(s) • Doble clic para ver detalles
              </p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsNewDoctorDialogOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo médico
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Médico</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Licencia</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-center">Experiencia</TableHead>
                <TableHead className="text-center">Recetas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow 
                  key={doctor.id}
                  className="hover:bg-blue-50/50 cursor-pointer"
                  onDoubleClick={() => handleDoubleClick(doctor)}
                  title="Doble clic para ver detalles"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doctor.fullName}</p>
                        <p className="text-xs text-gray-500">{doctor.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{doctor.specialty}</p>
                      {doctor.subspecialties && doctor.subspecialties.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {doctor.subspecialties[0]}
                          {doctor.subspecialties.length > 1 && ` +${doctor.subspecialties.length - 1}`}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{doctor.licenseNumber}</p>
                      <p className="text-xs text-gray-500">Vence: {doctor.licenseExpiry}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{doctor.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{doctor.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">{doctor.yearsOfExperience} años</span>
                      </div>
                      {doctor.isOnDuty && (
                        <Badge variant="outline" className="mt-1 text-xs bg-green-50 text-green-700 border-green-300">
                          <Clock className="w-3 h-3 mr-1" />
                          En turno
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{doctor.totalPrescriptions}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {doctor.monthlyPrescriptions}/mes
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={doctor.status === "active" ? "default" : "secondary"}
                        className={
                          doctor.status === "active"
                            ? "bg-green-100 text-green-800 border-green-300 justify-center"
                            : "bg-gray-100 text-gray-800 border-gray-300 justify-center"
                        }
                      >
                        {doctor.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                      {doctor.certificationStatus === "verified" ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 justify-center text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 justify-center text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Vencido
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctor(doctor);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDoctor(doctor);
                          setIsEditDialogOpen(true);
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

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron médicos</p>
              <p className="text-sm text-gray-500 mt-1">
                Intenta ajustar los criterios de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel de detalles */}
      <DoctorDetailPanel
        doctor={selectedDoctor}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(id) => {
          const doctor = mockDoctors.find(d => d.id === id);
          if (doctor) {
            setEditingDoctor(doctor);
            setIsEditDialogOpen(true);
            setIsDetailOpen(false);
          }
        }}
        onViewPrescriptions={(doctorId) => {
          if (onNavigate) {
            onNavigate('/prescripciones/emitidas', doctorId);
          }
        }}
      />

      {/* Diálogo de nuevo médico */}
      <NewDoctorDialog
        open={isNewDoctorDialogOpen}
        onOpenChange={setIsNewDoctorDialogOpen}
        onDoctorCreated={(newDoctor) => {
          console.log('Nuevo médico creado:', newDoctor);
          toast.success('Médico registrado exitosamente', {
            description: `${newDoctor.firstName} ${newDoctor.lastName} ha sido añadido al sistema`,
            duration: 3000
          });
          // Aquí podrías actualizar la lista de médicos si fuera necesario
        }}
      />

      {/* Diálogo de edición de médico */}
      <EditDoctorDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        doctor={editingDoctor}
        onDoctorUpdated={(updatedDoctor) => {
          console.log('Médico actualizado:', updatedDoctor);
          toast.success('Cambios guardados exitosamente', {
            description: `La información de ${updatedDoctor.firstName} ${updatedDoctor.lastName} ha sido actualizada`,
            duration: 3000
          });
          setIsEditDialogOpen(false);
          setEditingDoctor(null);
          // Aquí podrías actualizar la lista de médicos si fuera necesario
        }}
      />
    </div>
  );
}

export function EditarMedicoPage() {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [isNewDoctorDialogOpen, setIsNewDoctorDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<typeof mockDoctors[0] | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filtrar médicos
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      normalizedIncludes(doctor.fullName, searchTerm) ||
      normalizedIncludes(doctor.id, searchTerm) ||
      normalizedIncludes(doctor.licenseNumber, searchTerm) ||
      normalizedIncludes(doctor.email, searchTerm);
    
    const matchesStatus = statusFilter === "all" || doctor.status === statusFilter;
    const matchesSpecialty = specialtyFilter === "all" || doctor.specialty === specialtyFilter;
    
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  // Obtener especialidades únicas para el filtro
  const uniqueSpecialties = Array.from(new Set(mockDoctors.map(d => d.specialty)));

  // Estadísticas
  const stats = {
    total: doctors.length,
    active: doctors.filter(d => d.status === 'active').length,
    inactive: doctors.filter(d => d.status === 'inactive').length,
    suspended: doctors.filter(d => d.status === 'suspended').length,
  };

  const handleEditDoctor = (doctor: typeof mockDoctors[0]) => {
    setEditingDoctor(doctor);
    setIsEditDialogOpen(true);
  };

  const handleDoubleClick = (doctor: typeof mockDoctors[0]) => {
    handleEditDoctor(doctor);
  };

  const handleDoctorCreated = (newDoctor: any) => {
    setDoctors([newDoctor, ...doctors]);
    toast.success('Médico registrado exitosamente', {
      description: `${newDoctor.fullName} ha sido agregado al sistema.`,
      duration: 4000,
    });
  };

  const handleDoctorUpdated = (updatedDoctor: any) => {
    setDoctors(doctors.map(d => d.id === updatedDoctor.id ? updatedDoctor : d));
    toast.success('Médico actualizado exitosamente', {
      description: `Los datos de ${updatedDoctor.fullName} han sido actualizados.`,
      duration: 4000,
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "Activo", className: "bg-green-100 text-green-700 border-green-300" },
      inactive: { label: "Inactivo", className: "bg-gray-100 text-gray-700 border-gray-300" },
      suspended: { label: "Suspendido", className: "bg-red-100 text-red-700 border-red-300" }
    };
    return config[status as keyof typeof config] || config.active;
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white">Alta/Edición de Médicos</h1>
                  <p className="text-blue-100 text-sm">
                    Gestión completa de profesionales médicos del sistema
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Button
                onClick={() => setIsNewDoctorDialogOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Registrar nuevo médico
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total médicos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactivos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.inactive}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <UserX className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspendidos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.suspended}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón móvil para nuevo médico */}
      <div className="block md:hidden">
        <Button
          onClick={() => setIsNewDoctorDialogOpen(true)}
          className="w-full"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Registrar nuevo médico
        </Button>
      </div>

      {/* Búsqueda y filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, ID, licencia o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="suspended">Suspendidos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especialidades</SelectItem>
                  {uniqueSpecialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm || statusFilter !== "all" || specialtyFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setSpecialtyFilter("all");
                  }}
                >
                  <FilterX className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de médicos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Médicos Registrados</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredDoctors.length} médico{filteredDoctors.length !== 1 ? 's' : ''} encontrado{filteredDoctors.length !== 1 ? 's' : ''} • Doble clic para editar
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No se encontraron médicos</h3>
              <p className="text-sm text-gray-600 mb-4">
                No hay médicos que coincidan con los filtros seleccionados.
              </p>
              <Button onClick={() => setIsNewDoctorDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Registrar primer médico
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre completo</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Licencia médica</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Recetas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => {
                    const statusBadge = getStatusBadge(doctor.status);
                    return (
                      <TableRow
                        key={doctor.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onDoubleClick={() => handleDoubleClick(doctor)}
                      >
                        <TableCell>
                          <span className="font-mono text-sm">{doctor.id}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Stethoscope className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doctor.fullName}</p>
                              <p className="text-sm text-gray-600">{doctor.idType} {doctor.idNumber}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{doctor.specialty}</span>
                            {doctor.subspecialties && doctor.subspecialties.length > 0 && (
                              <span className="text-xs text-gray-500 mt-1">
                                +{doctor.subspecialties.length} subespecialidad{doctor.subspecialties.length !== 1 ? 'es' : ''}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{doctor.licenseNumber}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{doctor.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[200px]">{doctor.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusBadge.className}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{doctor.totalPrescriptions || 0}</span>
                            <span className="text-xs text-gray-500">emitidas</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Gestión de médicos del sistema</h4>
              <p className="text-sm text-blue-700 mb-2">
                Esta página permite registrar nuevos médicos y actualizar información de profesionales existentes.
              </p>
              <ul className="space-y-1 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Haz doble clic en cualquier fila para editar rápidamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Configura especialidades, subespecialidades y certificaciones profesionales</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Gestiona certificados digitales y permisos de prescripción por categoría</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de nuevo médico */}
      <NewDoctorDialog
        open={isNewDoctorDialogOpen}
        onOpenChange={setIsNewDoctorDialogOpen}
        onDoctorCreated={handleDoctorCreated}
      />

      {/* Diálogo de edición */}
      {editingDoctor && (
        <EditDoctorDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          doctor={editingDoctor}
          onDoctorUpdated={handleDoctorUpdated}
        />
      )}
    </div>
  );
}
