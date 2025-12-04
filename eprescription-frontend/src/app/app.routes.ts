import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login-page.component').then(m => m.LoginPageComponent),
    canActivate: [LoginGuard]
  },
  {
    path: 'password-recovery',
    loadComponent: () => import('./pages/password-recovery/password-recovery.component').then(m => m.PasswordRecoveryComponent),
    canActivate: [LoginGuard]
  },
  {
    path: 'solicitud-registro',
    loadComponent: () => import('./pages/solicitud-registro/solicitud-registro.component').then(m => m.SolicitudRegistroComponent),
    canActivate: [LoginGuard]
  },
  {
    path: 'registro-exitoso',
    loadComponent: () => import('./pages/registro-exitoso/registro-exitoso.component').then(m => m.RegistroExitosoComponent),
    canActivate: [LoginGuard]
  },
  {
    path: 'login-test',
    loadComponent: () => import('./pages/login/login-test.component').then(m => m.LoginTestComponent)
  },
  {
    path: 'test-data',
    loadComponent: () => import('./test-data.component').then(m => m.TestDataComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'prescripciones',
    loadComponent: () => import('./pages/prescripciones/prescripciones.component').then(m => m.PrescripcionesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./pages/pacientes/pacientes.component').then(m => m.PacientesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'medicos',
    loadComponent: () => import('./pages/medicos/medicos.component').then(m => m.MedicosComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      },
      {
        path: 'lista',
        loadComponent: () => import('./pages/medicos/lista/lista.component').then(m => m.ListaMedicosComponent)
      },
      {
        path: 'editar',
        loadComponent: () => import('./pages/medicos/editar/editar.component').then(m => m.EditarMedicoComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/medicos/editar/editar.component').then(m => m.EditarMedicoComponent)
      }
    ]
  },
  // ⚠️ DEPRECATED: Estas rutas de farmacias NO se usan en la aplicación
  // La vista real de farmacias está en /inventario/farmacias
  {
    path: 'farmacias',
    loadComponent: () => import('./pages/farmacias/farmacias.component').then(m => m.FarmaciasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'farmacias/lista',
    loadComponent: () => import('./pages/farmacias/lista/lista.component').then(m => m.FarmaciasListaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'inventario',
    loadComponent: () => import('./pages/inventario/inventario.component').then(m => m.InventarioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/reportes/reportes.component').then(m => m.ReportesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/config/config.component').then(m => m.ConfigComponent),
    canActivate: [AuthGuard]
  },
  // Configuración subrutas
  {
    path: 'config/politicas',
    loadComponent: () => import('./pages/config/politicas/politicas.component').then(m => m.PoliticasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'config/auxiliares',
    loadComponent: () => import('./pages/config/auxiliares/auxiliares.component').then(m => m.AuxiliaresComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'config/numeracion',
    loadComponent: () => import('./pages/config/numeracion/numeracion.component').then(m => m.NumeracionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'citas',
    loadComponent: () => import('./pages/citas/citas.component').then(m => m.CitasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dispensacion',
    loadComponent: () => import('./pages/dispensacion/dispensacion.component').then(m => m.DispensacionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'notificaciones',
    loadComponent: () => import('./pages/notificaciones/notificaciones.component').then(m => m.NotificacionesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'notificaciones/lista',
    loadComponent: () => import('./pages/notificaciones/lista/lista.component').then(m => m.ListaNotificacionesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'notificaciones/nueva',
    loadComponent: () => import('./pages/notificaciones/nueva/nueva.component').then(m => m.NuevaNotificacionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'autoservicio',
    loadComponent: () => import('./pages/autoservicio/autoservicio.component').then(m => m.AutoservicioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ayuda',
    loadComponent: () => import('./pages/ayuda/ayuda.component').then(m => m.AyudaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'documentacion',
    loadComponent: () => import('./pages/documentacion/documentacion.component').then(m => m.DocumentacionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'mi-perfil',
    loadComponent: () => import('./pages/mi-perfil/mi-perfil.component').then(m => m.MiPerfilComponent),
    canActivate: [AuthGuard]
  },
  // Prescripciones subrutas
  {
    path: 'prescripciones/nueva',
    loadComponent: () => import('./pages/prescripciones/nueva/nueva.component').then(m => m.NuevaPrescripcionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'prescripciones/nueva/:patientId',
    loadComponent: () => import('./pages/prescripciones/nueva/nueva.component').then(m => m.NuevaPrescripcionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'prescripciones/borradores',
    loadComponent: () => import('./pages/prescripciones/borradores/borradores.component').then(m => m.BorradoresComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'prescripciones/emitidas',
    loadComponent: () => import('./pages/prescripciones/emitidas/emitidas.component').then(m => m.EmitidasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'prescripciones/buscar',
    loadComponent: () => import('./pages/prescripciones/buscar/buscar.component').then(m => m.BuscarPrescripcionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'prescripciones/duplicar',
    loadComponent: () => import('./pages/prescripciones/duplicar/duplicar.component').then(m => m.DuplicarPrescripcionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'prescripciones/centros',
    loadComponent: () => import('./pages/prescripciones/centros/centros.component').then(m => m.CentrosMedicosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'prescripciones/imprimir/:id',
    loadComponent: () => import('./pages/prescripciones/imprimir/imprimir.component').then(m => m.ImprimirComponent)
  },
  // Dispensación subrutas
  {
    path: 'dispensacion/verificar',
    loadComponent: () => import('./pages/dispensacion/verificar/verificar.component').then(m => m.VerificarRecetaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dispensacion/registrar',
    loadComponent: () => import('./pages/dispensacion/registrar/registrar.component').then(m => m.RegistrarDispensacionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dispensacion/rechazos',
    loadComponent: () => import('./pages/dispensacion/rechazos/rechazos.component').then(m => m.RechazosDispensacionComponent),
    canActivate: [AuthGuard]
  },
  // Pacientes subrutas
  {
    path: 'pacientes/lista',
    loadComponent: () => import('./pages/pacientes/lista/lista.component').then(m => m.ListaPacientesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes/perfil',
    loadComponent: () => import('./pages/pacientes/perfil/perfil.component').then(m => m.PerfilPacienteComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes/perfil/:id',
    loadComponent: () => import('./pages/pacientes/perfil/perfil.component').then(m => m.PerfilPacienteComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes/recetas',
    loadComponent: () => import('./pages/pacientes/recetas/recetas.component').then(m => m.RecetasPacienteComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes/recetas/:id',
    loadComponent: () => import('./pages/pacientes/recetas/recetas.component').then(m => m.RecetasPacienteComponent),
    canActivate: [AuthGuard]
  },
  // Rutas de demo con datos mock automáticos
  {
    path: 'demo/perfil',
    loadComponent: () => import('./pages/pacientes/perfil/perfil.component').then(m => m.PerfilPacienteComponent)
  },
  {
    path: 'demo/recetas',
    loadComponent: () => import('./pages/pacientes/recetas/recetas.component').then(m => m.RecetasPacienteComponent)
  },

  // Inventario subrutas
  {
    path: 'inventario/stock',
    loadComponent: () => import('./pages/inventario/stock/stock.component').then(m => m.StockComponent),
    canActivate: [AuthGuard]
  },
  // ✅ VISTA PRINCIPAL DE FARMACIAS - Esta es la vista que se usa realmente
  {
    path: 'inventario/farmacias',
    loadComponent: () => import('./pages/inventario/farmacias/farmacias.component').then(m => m.FarmaciasInventarioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'inventario/consulta',
    loadComponent: () => import('./pages/inventario/consulta/consulta.component').then(m => m.ConsultaInventarioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'inventario/alertas',
    loadComponent: () => import('./pages/inventario/alertas/alertas.component').then(m => m.AlertasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'inventario/lotes',
    loadComponent: () => import('./pages/inventario/lotes/lotes.component').then(m => m.LotesVencimientosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'inventario/ajustes',
    loadComponent: () => import('./pages/inventario/ajustes/ajustes.component').then(m => m.AjustesStockComponent),
    canActivate: [AuthGuard]
  },
  // Talonarios subrutas
  {
    path: 'talonarios/comprar',
    loadComponent: () => import('./pages/talonarios/comprar/comprar.component').then(m => m.ComprarTalonariosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'talonarios/listado',
    loadComponent: () => import('./pages/talonarios/listado/listado.component').then(m => m.ListadoTalonariosComponent),
    canActivate: [AuthGuard]
  },
  // Alertas rutas principales
  {
    path: 'alertas',
    redirectTo: '/alertas/bandeja',
    pathMatch: 'full'
  },
  // Alertas subrutas
  {
    path: 'alertas/bandeja',
    loadComponent: () => import('./pages/alertas/bandeja/bandeja.component').then(m => m.BandejaAlertasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'alertas/reglas',
    loadComponent: () => import('./pages/alertas/reglas/reglas.component').then(m => m.ReglasAlertasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'alertas/configuracion',
    loadComponent: () => import('./pages/alertas/configuracion/configuracion.component').then(m => m.ConfiguracionAlertasComponent),
    canActivate: [AuthGuard]
  },
  // Seguridad rutas principales y subrutas
  {
    path: 'seguridad',
    loadComponent: () => import('./pages/seguridad/seguridad.component').then(m => m.SeguridadComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguridad/usuarios',
    loadComponent: () => import('./pages/seguridad/usuarios/usuarios.component').then(m => m.UsuariosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguridad/usuarios/registro',
    loadComponent: () => import('./pages/seguridad/usuarios/registro-usuarios.component').then(m => m.RegistroUsuariosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguridad/aprobaciones',
    loadComponent: () => import('./pages/seguridad/aprobaciones/aprobaciones.component').then(m => m.AprobacionesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguridad/roles',
    loadComponent: () => import('./pages/seguridad/roles/roles.component').then(m => m.RolesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguridad/parametros',
    loadComponent: () => import('./pages/seguridad/parametros/parametros.component').then(m => m.ParametrosSeguridadComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguridad/bloqueos',
    loadComponent: () => import('./pages/seguridad/bloqueos/bloqueos.component').then(m => m.BloqueosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguridad/sesiones',
    loadComponent: () => import('./pages/seguridad/sesiones/sesiones.component').then(m => m.SesionesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguridad/mis-sesiones',
    loadComponent: () => import('./pages/seguridad/sesiones/mis-sesiones.component').then(m => m.MisSesionesComponent),
    canActivate: [AuthGuard]
  },
  // Reportes subrutas
  {
    path: 'reportes/actividad-medico',
    loadComponent: () => import('./pages/reportes/actividad-medico/actividad-medico.component').then(m => m.ActividadMedicoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reportes/actividad-farmacia',
    loadComponent: () => import('./pages/reportes/actividad-farmacia/actividad-farmacia.component').then(m => m.ActividadFarmaciaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reportes/exportar',
    loadComponent: () => import('./pages/reportes/exportar/exportar.component').then(m => m.ExportarComponent),
    canActivate: [AuthGuard]
  },
  // Interoperabilidad rutas
  {
    path: 'interop',
    loadComponent: () => import('./pages/interoperabilidad/interoperabilidad.component').then(m => m.InteroperabilidadComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'interop/fhir-ids',
    loadComponent: () => import('./pages/interoperabilidad/fhir-ids/fhir-ids.component').then(m => m.FhirIdsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'interop/exportar',
    loadComponent: () => import('./pages/interoperabilidad/exportar-fhir/exportar-fhir.component').then(m => m.ExportarFhirComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'interop/importar',
    loadComponent: () => import('./pages/interoperabilidad/importar/importar.component').then(m => m.ImportarDatosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'interop/eventos',
    loadComponent: () => import('./pages/interoperabilidad/eventos/eventos.component').then(m => m.EventosHl7Component),
    canActivate: [AuthGuard]
  },
  // Catálogos subrutas
  {
    path: 'catalogos/medicamentos',
    loadComponent: () => import('./pages/catalogos/medicamentos/medicamentos.component').then(m => m.CatalogosMedicamentosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'catalogos/vias',
    loadComponent: () => import('./pages/catalogos/vias/vias.component').then(m => m.ViasAdministracionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'catalogos/especialidades',
    loadComponent: () => import('./pages/catalogos/especialidades/especialidades.component').then(m => m.EspecialidadesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'catalogos/unidades',
    loadComponent: () => import('./pages/catalogos/unidades/unidades.component').then(m => m.UnidadesMedicasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'catalogos/interacciones',
    loadComponent: () => import('./pages/catalogos/interacciones/interacciones.component').then(m => m.InteraccionesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'catalogos/tipos-alertas',
    loadComponent: () => import('./pages/catalogos/tipos-alertas/tipos-alertas.component').then(m => m.TiposAlertasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'catalogos/paises',
    loadComponent: () => import('./pages/catalogos/paises/paises.component').then(m => m.PaisesComponent),
    canActivate: [AuthGuard]
  },
  // Auditoría y cumplimiento rutas
  {
    path: 'auditoria',
    redirectTo: '/auditoria/log-auditoria',
    pathMatch: 'full'
  },
  {
    path: 'auditoria/log-auditoria',
    loadComponent: () => import('./pages/auditoria/log-auditoria/log-auditoria.component').then(m => m.LogAuditoriaComponent),
    canActivate: [AuthGuard]
  },
  // Firma y verificación rutas
  {
    path: 'firma',
    loadComponent: () => import('./pages/firma/firma.component').then(m => m.FirmaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'firma/firmar-receta',
    loadComponent: () => import('./pages/firma/firmar-receta/firmar-receta.component').then(m => m.FirmarRecetaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'firma/generar-qr',
    loadComponent: () => import('./pages/firma/generar-qr/generar-qr.component').then(m => m.GenerarQRComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'firma/verificar-qr',
    loadComponent: () => import('./pages/firma/verificar-qr/verificar-qr.component').then(m => m.VerificarQRComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'firma/trazabilidad',
    loadComponent: () => import('./pages/firma/trazabilidad/trazabilidad.component').then(m => m.TrazabilidadComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];