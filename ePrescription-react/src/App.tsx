import { useState, useEffect } from "react";
import { NewLayout } from "./components/NewLayout";
import { DashboardPage } from "./pages/DashboardPage";
import {
  initializeSession,
  closeSession,
} from "./utils/multiRoleSession";
import { getUserById, getAllUsers } from "./utils/usersStore";
import { LoginPage } from "./pages/LoginPage";
import { MFAVerificationPage } from "./pages/MFAVerificationPage";
import { PasswordRecoveryPage } from "./pages/PasswordRecoveryPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { RegistrationSuccessPage } from "./pages/RegistrationSuccessPage";
import { UserApprovalsPage } from "./pages/UserApprovalsPage";
import { SessionManagementPage } from "./pages/SessionManagementPage";
import {
  NuevaRecetaPage,
  BorradoresPage,
  EmitidasPage,
  BuscarRecetaPage,
  DuplicarRecetaPage,
} from "./pages/PrescripcionesPage";
import { CentrosMedicosPage } from "./pages/CentrosMedicosPage";
import {
  VerificarRecetaPage,
  RegistrarDispensacionPage,
  RechazosPage,
} from "./pages/DispensacionPage";
import {
  ListaPacientesPage,
  PerfilPacientePage,
  RecetasPacientePage,
} from "./pages/PacientesPage";
import {
  ListaMedicosPage,
  EditarMedicoPage,
} from "./pages/MedicosPage";
import {
  StockPage,
  AlertasStockPage,
  AjustesStockPage,
  LotesPage,
} from "./pages/InventarioPage";
import { FarmaciasListPage } from "./pages/FarmaciasPage";
import { ConsultaInventarioPage } from "./pages/ConsultaInventarioPage";
import {
  ComprarTalonariosPage,
  ListadoTalonariosPage,
} from "./pages/TalonariosPage";
import { TalonariosIntegradosPage } from "./pages/TalonariosIntegradosPage";
import {
  BandejaAlertasPage,
  ReglasAlertasPage,
  TiposAlertasPage,
} from "./pages/AlertasPage";
import { HistorialInteraccionesPage } from "./pages/HistorialInteraccionesPage";
import {
  FirmarRecetaPage,
  GenerarQRPage,
  VerificarQRPage,
  TrazabilidadFirmasPage,
} from "./pages/FirmaPage";
import {
  ActividadMedicoPage,
  ActividadFarmaciaPage,
  ExportarReportesPage,
} from "./pages/ReportesPage";
import {
  FHIRIDsPage,
  ExportarFHIRPage,
  ImportarDatosPage,
  EventosHL7Page,
} from "./pages/InteropPage";
import {
  UsuariosPage,
  RolesPage,
  ParametrosSeguridadPage,
  BloqueosPage,
  SesionesPage,
} from "./pages/SeguridadPage";
import { LogAuditoriaPage } from "./pages/AuditoriaPage";
import { AIAuditPage } from "./pages/AIAuditPage";
import {
  MedicamentosPage,
  ViasPage,
  EspecialidadesPage,
  UnidadesPage,
  InteraccionesPage,
  TiposAlertasCatalogo,
  PaisesPage,
} from "./pages/CatalogosPage";
import {
  PoliticasPage,
  AuxiliaresPage,
  NumeracionPage,
} from "./pages/ConfigPage";
import { NotificacionesConfigPage } from "./pages/NotificacionesConfigPage";
import { NotificacionesListPage } from "./pages/NotificacionesListPage";
import { RegistroUsuariosPage } from "./pages/RegistroUsuariosPage";
import { DocumentacionPage } from "./pages/DocumentacionPage";
import { AutoservicioPage } from "./pages/AutoservicioPage";
import { CentroAyudaPage } from "./pages/CentroAyudaPage";
import { MiPerfilPage } from "./pages/MiPerfilPage";

interface RouteConfig {
  component: React.ComponentType<any>;
  breadcrumbs: Array<{ label: string; route?: string }>;
  passNavigate?: boolean;
}

const routes: Record<string, RouteConfig> = {
  // Dashboard
  "/dashboard": {
    component: DashboardPage,
    breadcrumbs: [{ label: "Inicio" }],
    passNavigate: true, // Flag para pasar onNavigate
  },

  // Prescripciones
  "/prescripciones/nueva": {
    component: NuevaRecetaPage,
    breadcrumbs: [
      {
        label: "Prescripciones",
        route: "/prescripciones/nueva",
      },
      { label: "Nueva receta" },
    ],
  },
  "/prescripciones/borradores": {
    component: BorradoresPage,
    breadcrumbs: [
      {
        label: "Prescripciones",
        route: "/prescripciones/nueva",
      },
      { label: "Mis borradores" },
    ],
  },
  "/prescripciones/emitidas": {
    component: EmitidasPage,
    breadcrumbs: [
      {
        label: "Prescripciones",
        route: "/prescripciones/nueva",
      },
      { label: "Recetas emitidas" },
    ],
  },
  "/prescripciones/buscar": {
    component: BuscarRecetaPage,
    breadcrumbs: [
      {
        label: "Prescripciones",
        route: "/prescripciones/nueva",
      },
      { label: "Buscar receta" },
    ],
  },
  "/prescripciones/duplicar": {
    component: DuplicarRecetaPage,
    breadcrumbs: [
      {
        label: "Prescripciones",
        route: "/prescripciones/nueva",
      },
      { label: "Duplicar receta" },
    ],
  },
  "/prescripciones/centros": {
    component: CentrosMedicosPage,
    breadcrumbs: [
      {
        label: "Prescripciones",
        route: "/prescripciones/nueva",
      },
      { label: "Centros médicos" },
    ],
  },

  // Dispensación
  "/dispensacion/verificar": {
    component: VerificarRecetaPage,
    breadcrumbs: [
      {
        label: "Dispensación",
        route: "/dispensacion/verificar",
      },
      { label: "Verificar receta" },
    ],
  },
  "/dispensacion/registrar": {
    component: RegistrarDispensacionPage,
    breadcrumbs: [
      {
        label: "Dispensación",
        route: "/dispensacion/verificar",
      },
      { label: "Registrar dispensación" },
    ],
  },
  "/dispensacion/rechazos": {
    component: RechazosPage,
    breadcrumbs: [
      {
        label: "Dispensación",
        route: "/dispensacion/verificar",
      },
      { label: "Rechazos y motivos" },
    ],
  },

  // Pacientes
  "/pacientes/lista": {
    component: ListaPacientesPage,
    breadcrumbs: [
      { label: "Pacientes", route: "/pacientes/lista" },
      { label: "Listado de pacientes" },
    ],
  },
  "/pacientes/perfil": {
    component: PerfilPacientePage,
    breadcrumbs: [
      { label: "Pacientes", route: "/pacientes/lista" },
      { label: "Perfil del paciente" },
    ],
  },
  "/pacientes/recetas": {
    component: RecetasPacientePage,
    breadcrumbs: [
      { label: "Pacientes", route: "/pacientes/lista" },
      { label: "Recetas del paciente" },
    ],
  },

  // Médicos
  "/medicos/lista": {
    component: ListaMedicosPage,
    breadcrumbs: [
      { label: "Médicos", route: "/medicos/lista" },
      { label: "Listado de médicos" },
    ],
  },
  "/medicos/editar": {
    component: EditarMedicoPage,
    breadcrumbs: [
      { label: "Médicos", route: "/medicos/lista" },
      { label: "Alta/Edición de médico" },
    ],
  },

  // Inventario
  "/inventario/stock": {
    component: StockPage,
    breadcrumbs: [
      {
        label: "Farmacia e Inventario",
        route: "/inventario/stock",
      },
      { label: "Stock de medicamentos" },
    ],
  },
  "/inventario/alertas": {
    component: AlertasStockPage,
    breadcrumbs: [
      {
        label: "Farmacia e Inventario",
        route: "/inventario/stock",
      },
      { label: "Alertas de stock bajo" },
    ],
  },
  "/inventario/ajustes": {
    component: AjustesStockPage,
    breadcrumbs: [
      {
        label: "Farmacia e Inventario",
        route: "/inventario/stock",
      },
      { label: "Ajustes de stock" },
    ],
  },
  "/inventario/lotes": {
    component: LotesPage,
    breadcrumbs: [
      {
        label: "Farmacia e Inventario",
        route: "/inventario/stock",
      },
      { label: "Lotes y vencimientos" },
    ],
  },
  "/inventario/farmacias": {
    component: FarmaciasListPage,
    breadcrumbs: [
      {
        label: "Farmacia e Inventario",
        route: "/inventario/stock",
      },
      { label: "Farmacias registradas" },
    ],
  },
  "/inventario/consulta": {
    component: ConsultaInventarioPage,
    breadcrumbs: [
      {
        label: "Farmacia e Inventario",
        route: "/inventario/stock",
      },
      { label: "Consulta de inventario" },
    ],
  },

  // Talonarios
  "/talonarios/comprar": {
    component: ComprarTalonariosPage,
    breadcrumbs: [
      { label: "Talonarios", route: "/talonarios/comprar" },
      { label: "Comprar talonarios" },
    ],
  },
  "/talonarios/listado": {
    component: ListadoTalonariosPage,
    breadcrumbs: [
      { label: "Talonarios", route: "/talonarios/comprar" },
      { label: "Mis talonarios" },
    ],
  },
  "/talonarios/integrados": {
    component: TalonariosIntegradosPage,
    breadcrumbs: [
      { label: "Talonarios", route: "/talonarios/comprar" },
      { label: "Talonarios integrados" },
    ],
  },

  // Alertas
  "/alertas/bandeja": {
    component: BandejaAlertasPage,
    breadcrumbs: [
      { label: "Alertas clínicas", route: "/alertas/bandeja" },
      { label: "Bandeja de alertas" },
    ],
  },
  "/alertas/reglas": {
    component: ReglasAlertasPage,
    breadcrumbs: [
      { label: "Alertas clínicas", route: "/alertas/bandeja" },
      { label: "Reglas e interacciones" },
    ],
  },
  "/alertas/tipos": {
    component: TiposAlertasPage,
    breadcrumbs: [
      { label: "Alertas clínicas", route: "/alertas/bandeja" },
      { label: "Tipos de alertas" },
    ],
  },
  "/alertas/historial": {
    component: HistorialInteraccionesPage,
    breadcrumbs: [
      { label: "Alertas clínicas", route: "/alertas/bandeja" },
      { label: "Historial de interacciones" },
    ],
  },

  // Firma
  "/firma/firmar": {
    component: FirmarRecetaPage,
    breadcrumbs: [
      { label: "Firma y verificación", route: "/firma/firmar" },
      { label: "Firmar receta" },
    ],
  },
  "/firma/qr": {
    component: GenerarQRPage,
    breadcrumbs: [
      { label: "Firma y verificación", route: "/firma/firmar" },
      { label: "Generar/Ver QR" },
    ],
  },
  "/firma/verificar": {
    component: VerificarQRPage,
    breadcrumbs: [
      { label: "Firma y verificación", route: "/firma/firmar" },
      { label: "Verificación de QR/Token" },
    ],
  },
  "/firma/trazabilidad": {
    component: TrazabilidadFirmasPage,
    breadcrumbs: [
      { label: "Firma y verificación", route: "/firma/firmar" },
      { label: "Trazabilidad de firmas" },
    ],
  },

  // Reportes
  "/reportes/actividad-medico": {
    component: ActividadMedicoPage,
    breadcrumbs: [
      {
        label: "Reportes y analítica",
        route: "/reportes/actividad-medico",
      },
      { label: "Actividad por médico" },
    ],
  },
  "/reportes/actividad-farmacia": {
    component: ActividadFarmaciaPage,
    breadcrumbs: [
      {
        label: "Reportes y analítica",
        route: "/reportes/actividad-medico",
      },
      { label: "Actividad de farmacia" },
    ],
  },
  "/reportes/exportar": {
    component: ExportarReportesPage,
    breadcrumbs: [
      {
        label: "Reportes y analítica",
        route: "/reportes/actividad-medico",
      },
      { label: "Exportaciones" },
    ],
  },

  // Interoperabilidad
  "/interop/fhir-ids": {
    component: FHIRIDsPage,
    breadcrumbs: [
      {
        label: "Interoperabilidad",
        route: "/interop/fhir-ids",
      },
      { label: "IDs FHIR" },
    ],
  },
  "/interop/exportar": {
    component: ExportarFHIRPage,
    breadcrumbs: [
      {
        label: "Interoperabilidad",
        route: "/interop/fhir-ids",
      },
      { label: "Exportar receta (FHIR)" },
    ],
  },
  "/interop/importar": {
    component: ImportarDatosPage,
    breadcrumbs: [
      {
        label: "Interoperabilidad",
        route: "/interop/fhir-ids",
      },
      { label: "Importar datos externos" },
    ],
  },
  "/interop/eventos": {
    component: EventosHL7Page,
    breadcrumbs: [
      {
        label: "Interoperabilidad",
        route: "/interop/fhir-ids",
      },
      { label: "Registro HL7 eventos" },
    ],
  },

  // Seguridad
  "/seguridad/usuarios": {
    component: UsuariosPage,
    breadcrumbs: [
      {
        label: "Seguridad y usuarios",
        route: "/seguridad/usuarios",
      },
      { label: "Usuarios" },
    ],
  },
  "/seguridad/roles": {
    component: RolesPage,
    breadcrumbs: [
      {
        label: "Seguridad y usuarios",
        route: "/seguridad/usuarios",
      },
      { label: "Roles y permisos" },
    ],
  },
  "/seguridad/parametros": {
    component: ParametrosSeguridadPage,
    breadcrumbs: [
      {
        label: "Seguridad y usuarios",
        route: "/seguridad/usuarios",
      },
      { label: "Parámetros de seguridad" },
    ],
  },
  "/seguridad/bloqueos": {
    component: BloqueosPage,
    breadcrumbs: [
      {
        label: "Seguridad y usuarios",
        route: "/seguridad/usuarios",
      },
      { label: "Bloqueos/Desbloqueos" },
    ],
  },
  "/seguridad/sesiones": {
    component: SesionesPage,
    breadcrumbs: [
      {
        label: "Seguridad y usuarios",
        route: "/seguridad/usuarios",
      },
      { label: "Sesiones de usuario" },
    ],
  },
  "/seguridad/registro": {
    component: RegistroUsuariosPage,
    breadcrumbs: [
      {
        label: "Seguridad y usuarios",
        route: "/seguridad/usuarios",
      },
      { label: "Registro de usuarios" },
    ],
  },
  "/seguridad/aprobaciones": {
    component: UserApprovalsPage,
    breadcrumbs: [
      {
        label: "Seguridad y usuarios",
        route: "/seguridad/usuarios",
      },
      { label: "Aprobación de usuarios" },
    ],
  },
  "/seguridad/mis-sesiones": {
    component: SessionManagementPage,
    breadcrumbs: [
      {
        label: "Seguridad y usuarios",
        route: "/seguridad/usuarios",
      },
      { label: "Mis sesiones" },
    ],
  },

  // Auditoría
  "/auditoria/log": {
    component: LogAuditoriaPage,
    breadcrumbs: [
      {
        label: "Auditoría y cumplimiento",
        route: "/auditoria/log",
      },
      { label: "Log auditoría" },
    ],
  },
  "/auditoria/ia": {
    component: AIAuditPage,
    breadcrumbs: [
      {
        label: "Auditoría y cumplimiento",
        route: "/auditoria/log",
      },
      { label: "Auditoría Asistente IA" },
    ],
  },

  // Catálogos
  "/catalogos/medicamentos": {
    component: MedicamentosPage,
    breadcrumbs: [
      {
        label: "Catálogos clínicos",
        route: "/catalogos/medicamentos",
      },
      { label: "Medicamentos" },
    ],
  },
  "/catalogos/vias": {
    component: ViasPage,
    breadcrumbs: [
      {
        label: "Catálogos clínicos",
        route: "/catalogos/medicamentos",
      },
      { label: "Vías de administración" },
    ],
  },
  "/catalogos/especialidades": {
    component: EspecialidadesPage,
    breadcrumbs: [
      {
        label: "Catálogos clínicos",
        route: "/catalogos/medicamentos",
      },
      { label: "Especialidades" },
    ],
  },
  "/catalogos/unidades": {
    component: UnidadesPage,
    breadcrumbs: [
      {
        label: "Catálogos clínicos",
        route: "/catalogos/medicamentos",
      },
      { label: "Unidades médicas" },
    ],
  },
  "/catalogos/interacciones": {
    component: InteraccionesPage,
    breadcrumbs: [
      {
        label: "Catálogos clínicos",
        route: "/catalogos/medicamentos",
      },
      { label: "Interacciones" },
    ],
  },
  "/catalogos/tipos-alertas": {
    component: TiposAlertasCatalogo,
    breadcrumbs: [
      {
        label: "Catálogos clínicos",
        route: "/catalogos/medicamentos",
      },
      { label: "Tipos de alertas" },
    ],
  },
  "/catalogos/paises": {
    component: PaisesPage,
    breadcrumbs: [
      {
        label: "Catálogos clínicos",
        route: "/catalogos/medicamentos",
      },
      { label: "Países" },
    ],
  },

  // Configuración
  "/config/politicas": {
    component: PoliticasPage,
    breadcrumbs: [
      { label: "Configuración", route: "/config/politicas" },
      { label: "Políticas de recetas" },
    ],
  },
  "/config/auxiliares": {
    component: AuxiliaresPage,
    breadcrumbs: [
      { label: "Configuración", route: "/config/politicas" },
      { label: "Catálogos auxiliares" },
    ],
  },
  "/config/numeracion": {
    component: NumeracionPage,
    breadcrumbs: [
      { label: "Configuración", route: "/config/politicas" },
      { label: "Numeración de recetas" },
    ],
  },

  // Notificaciones
  "/notificaciones/lista": {
    component: NotificacionesListPage,
    breadcrumbs: [
      {
        label: "Notificaciones",
        route: "/notificaciones/lista",
      },
      { label: "Listado de notificaciones" },
    ],
  },
  "/notificaciones/nueva": {
    component: NotificacionesConfigPage,
    breadcrumbs: [
      {
        label: "Notificaciones",
        route: "/notificaciones/lista",
      },
      { label: "Nueva notificación" },
    ],
  },
  "/notificaciones/editar": {
    component: NotificacionesConfigPage,
    breadcrumbs: [
      {
        label: "Notificaciones",
        route: "/notificaciones/lista",
      },
      { label: "Editar notificación" },
    ],
  },

  // Documentación
  "/documentacion": {
    component: DocumentacionPage,
    breadcrumbs: [{ label: "Documentación técnica" }],
  },

  // Autoservicio
  "/autoservicio": {
    component: AutoservicioPage,
    breadcrumbs: [{ label: "Autoservicio del usuario" }],
  },

  // Centro de Ayuda
  "/ayuda": {
    component: CentroAyudaPage,
    breadcrumbs: [{ label: "Centro de ayuda y soporte" }],
  },

  // Mi Perfil
  "/mi-perfil": {
    component: MiPerfilPage,
    breadcrumbs: [{ label: "Mi perfil" }],
  },
};

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

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Cambiar a true para saltar el login y acceder directo al dashboard
  const [authView, setAuthView] = useState<
    | "login"
    | "mfa"
    | "recovery"
    | "onboarding"
    | "registration-success"
  >("login");
  const [currentUserId, setCurrentUserId] = useState<
    string | null
  >("USR-0001"); // Usuario admin por defecto
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [registrationEmail, setRegistrationEmail] =
    useState<string>("");

  // Inicializar sesión automáticamente si está autenticado
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      const user = getUserById(currentUserId) || getAllUsers()[0];
      
      // Solo inicializar si no hay sesión activa
      const currentSession = require('./utils/multiRoleSession').getCurrentSession();
      if (!currentSession) {
        console.log('🔧 Inicializando sesión automáticamente para:', user.fullName);
        initializeSession(
          user.userId,
          user.username,
          user.fullName,
          user.primaryRole,
          user.assignedRoles,
        );
      }
    }
  }, [isAuthenticated, currentUserId]);

  // Application state
  const [currentRoute, setCurrentRoute] =
    useState("/dashboard");
  const [editingDraftId, setEditingDraftId] = useState<
    string | null
  >(null);
  const [selectedPatient, setSelectedPatient] =
    useState<PatientData | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<
    string | null
  >(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<
    string | null
  >(null);
  const [editingNotificationId, setEditingNotificationId] =
    useState<string | null>(null);

  // Auth handlers
  const handleLoginSuccess = (
    userId: string,
    needsMFA: boolean,
  ) => {
    setCurrentUserId(userId);
    setRequiresMFA(needsMFA);

    if (needsMFA) {
      setAuthView("mfa");
    } else {
      // Inicializar sesión multi-rol desde el store dinámico
      const user = getUserById(userId) || getAllUsers()[0];

      initializeSession(
        user.userId,
        user.username,
        user.fullName,
        user.primaryRole,
        user.assignedRoles,
      );

      setIsAuthenticated(true);
      setCurrentRoute("/dashboard");
    }
  };

  const handleMFASuccess = () => {
    // Inicializar sesión multi-rol después de MFA desde el store dinámico
    if (currentUserId) {
      const user =
        getUserById(currentUserId) || getAllUsers()[0];

      initializeSession(
        user.userId,
        user.username,
        user.fullName,
        user.primaryRole,
        user.assignedRoles,
      );
    }

    setIsAuthenticated(true);
    setCurrentRoute("/dashboard");
  };

  const handleOnboardingComplete = (email: string) => {
    setRegistrationEmail(email);
    setAuthView("registration-success");
  };

  const handleLogout = () => {
    // Cerrar sesión multi-rol
    closeSession();

    setIsAuthenticated(false);
    setAuthView("login");
    setCurrentUserId(null);
    setCurrentRoute("/dashboard");
  };

  const handleNavigate = (route: string, itemId?: string) => {
    setCurrentRoute(route);
    setEditingDraftId(null); // Limpiar el estado de edición al navegar
    setSelectedPatient(null); // Limpiar el paciente seleccionado al navegar

    // Si se proporciona un itemId, determinar su contexto
    if (itemId) {
      // Para médicos
      if (
        route.includes("/medicos") ||
        route.includes("/prescripciones/emitidas")
      ) {
        setSelectedDoctorId(itemId);
      }
      // Para notificaciones
      else if (route.includes("/notificaciones/editar")) {
        setEditingNotificationId(itemId);
      }
      // Para pacientes
      else if (route.includes("/pacientes/recetas") || route.includes("/pacientes/perfil")) {
        setSelectedPatientId(itemId);
      }
    } else {
      setSelectedDoctorId(null);
      setSelectedPatientId(null);
      // Limpiar editingNotificationId especialmente al ir a /notificaciones/nueva
      if (route === "/notificaciones/nueva") {
        setEditingNotificationId(null);
      } else if (!route.includes("/notificaciones/editar")) {
        setEditingNotificationId(null);
      }
    }
  };

  const handleEditDraft = (draftId: string) => {
    setEditingDraftId(draftId);
    setSelectedPatient(null); // Limpiar paciente al editar borrador
    setCurrentRoute("/prescripciones/nueva");
  };

  const handleBackToDrafts = () => {
    setEditingDraftId(null);
    setSelectedPatient(null);
    setCurrentRoute("/prescripciones/borradores");
  };

  const handleNavigateToDrafts = () => {
    setEditingDraftId(null);
    setSelectedPatient(null);
    setCurrentRoute("/prescripciones/borradores");
  };

  const handleNavigateToEmitted = () => {
    setEditingDraftId(null);
    setSelectedPatient(null);
    setCurrentRoute("/prescripciones/emitidas");
  };

  const handleNewPrescriptionForPatient = (
    patient: PatientData,
  ) => {
    setSelectedPatient(patient);
    setEditingDraftId(null); // Limpiar borrador al crear nueva receta desde paciente
    setCurrentRoute("/prescripciones/nueva");
  };

  const routeConfig =
    routes[currentRoute] || routes["/dashboard"];
  const PageComponent = routeConfig.component;

  // Renderizar el componente con props especiales si es necesario
  const renderPage = () => {
    if (currentRoute === "/dashboard") {
      return <DashboardPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === "/prescripciones/borradores") {
      return <BorradoresPage onEditDraft={handleEditDraft} />;
    }

    if (currentRoute === "/prescripciones/nueva") {
      if (editingDraftId) {
        return (
          <NuevaRecetaPage
            draftId={editingDraftId}
            onBack={handleBackToDrafts}
            onNavigateToDrafts={handleNavigateToDrafts}
            onNavigateToEmitted={handleNavigateToEmitted}
          />
        );
      }
      if (selectedPatient) {
        return (
          <NuevaRecetaPage
            patientData={selectedPatient}
            onNavigateToDrafts={handleNavigateToDrafts}
            onNavigateToEmitted={handleNavigateToEmitted}
          />
        );
      }
      // Caso por defecto: nueva receta sin borrador ni paciente
      return (
        <NuevaRecetaPage
          onNavigateToDrafts={handleNavigateToDrafts}
          onNavigateToEmitted={handleNavigateToEmitted}
        />
      );
    }

    if (currentRoute === "/prescripciones/emitidas") {
      return (
        <EmitidasPage
          doctorId={selectedDoctorId}
          onClearFilter={() => setSelectedDoctorId(null)}
        />
      );
    }

    if (currentRoute === "/pacientes/lista") {
      return <ListaPacientesPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === "/pacientes/perfil") {
      return (
        <PerfilPacientePage
          onNewPrescription={handleNewPrescriptionForPatient}
        />
      );
    }

    if (currentRoute === "/pacientes/recetas") {
      return (
        <RecetasPacientePage
          onNewPrescription={handleNewPrescriptionForPatient}
          patientId={selectedPatientId || undefined}
        />
      );
    }

    if (currentRoute === "/medicos/lista") {
      return <ListaMedicosPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === "/notificaciones/lista") {
      return (
        <NotificacionesListPage onNavigate={handleNavigate} />
      );
    }

    if (currentRoute === "/notificaciones/editar") {
      return (
        <NotificacionesConfigPage
          notificationId={editingNotificationId || undefined}
          onBack={() => {
            setEditingNotificationId(null);
            setCurrentRoute("/notificaciones/lista");
          }}
        />
      );
    }

    if (currentRoute === "/notificaciones/nueva") {
      return (
        <NotificacionesConfigPage
          onBack={() =>
            setCurrentRoute("/notificaciones/lista")
          }
        />
      );
    }

    if (currentRoute === "/prescripciones/duplicar") {
      return (
        <DuplicarRecetaPage
          onNavigate={handleNavigate}
          onEditDraft={handleEditDraft}
        />
      );
    }

    if (currentRoute === "/seguridad/registro") {
      return (
        <RegistroUsuariosPage onNavigate={handleNavigate} />
      );
    }

    if (currentRoute === "/catalogos/interacciones") {
      return <InteraccionesPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === "/dispensacion/verificar") {
      return <VerificarRecetaPage onNavigate={handleNavigate} />;
    }

    return <PageComponent />;
  };

  // Si no está autenticado, mostrar flujo de autenticación
  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setAuthView("onboarding")}
          onNavigateToRecovery={() => setAuthView("recovery")}
        />
      );
    }

    if (authView === "mfa" && currentUserId) {
      return (
        <MFAVerificationPage
          userId={currentUserId}
          onVerificationSuccess={handleMFASuccess}
          onBack={() => setAuthView("login")}
        />
      );
    }

    if (authView === "recovery") {
      return (
        <PasswordRecoveryPage
          onBack={() => setAuthView("login")}
        />
      );
    }

    if (authView === "onboarding") {
      return (
        <OnboardingPage
          onBack={() => setAuthView("login")}
          onComplete={handleOnboardingComplete}
        />
      );
    }

    if (authView === "registration-success") {
      return (
        <RegistrationSuccessPage
          email={registrationEmail}
          onBackToLogin={() => setAuthView("login")}
        />
      );
    }
  }

  // Si está autenticado, mostrar la aplicación principal
  return (
    <NewLayout
      currentRoute={currentRoute}
      onNavigate={handleNavigate}
      breadcrumbs={routeConfig.breadcrumbs}
      onLogout={handleLogout}
    >
      {renderPage()}
    </NewLayout>
  );
}