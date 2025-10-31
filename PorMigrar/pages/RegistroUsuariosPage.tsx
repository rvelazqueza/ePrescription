import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  UserPlus,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Building2,
  Lock,
  Send,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  AlertTriangle,
  Shield,
  FileText,
  User,
  MapPinned
} from "lucide-react";
import { toast } from "sonner";
import { 
  provinciasCostaRica, 
  getCantonesByProvincia, 
  getDistritosByCanton,
  Provincia,
  Canton,
  Distrito
} from "../utils/costaRicaData";
import { LocationMap } from "../components/LocationMap";
import { 
  reverseGeocode as reverseGeocodeAPI,
  findBestCantonMatch,
  findBestDistritoMatch
} from "../utils/geocodingUtils";

// Tipos de perfil de usuario (homologado con OnboardingPage)
const PERFILES_USUARIO = [
  { value: "medico", label: "Médico", colegio: "Colegio de Médicos y Cirujanos de Costa Rica", requiereColegio: true },
  { value: "farmaceutico", label: "Farmacéutico / Regente Farmacéutico", colegio: "Colegio de Farmacéuticos de Costa Rica", requiereColegio: true },
  { value: "odontologo", label: "Odontólogo", colegio: "Colegio de Cirujanos Dentistas de Costa Rica", requiereColegio: true },
  { value: "enfermero", label: "Enfermero / Obstetra", colegio: "Colegio de Enfermeros de Costa Rica", requiereColegio: true },
  { value: "veterinario", label: "Médico Veterinario", colegio: "Colegio de Médicos Veterinarios de Costa Rica", requiereColegio: true },
  { value: "farmacia", label: "Farmacia", colegio: "N/A", requiereColegio: false },
  { value: "centro_medico", label: "Centro Médico", colegio: "N/A", requiereColegio: false },
  { value: "drogueria", label: "Droguería", colegio: "N/A", requiereColegio: false },
  { value: "laboratorio", label: "Laboratorio", colegio: "N/A", requiereColegio: false },
  { value: "funcionario", label: "Funcionario de Salud", colegio: "N/A", requiereColegio: false }
];

type TipoControlado = "estupefacientes" | "psicotropicos" | "antimicrobianos" | "ninguno";
type MetodoAutenticacion = "firma_digital" | "password_mfa" | "";

interface RegistroFormData {
  // Paso 1: Tipo de usuario y autenticación
  perfilUsuario: string;
  tipoMedicamentosControlados: TipoControlado;
  metodoAutenticacion: MetodoAutenticacion;
  
  // Paso 2: Validación profesional (si aplica)
  codigoProfesional: string;
  nombreCompleto: string;
  cedula: string;
  estadoProfesional: "activo" | "inactivo" | "";
  
  // Paso 3: Datos de contacto y ubicación
  telefono: string;
  correoElectronico: string;
  provinciaId: string;
  cantonId: string;
  distritoId: string;
  otrasSenas: string;
  latitud: number;
  longitud: number;
}

interface RegistroUsuariosPageProps {
  onNavigate?: (route: string) => void;
}

export function RegistroUsuariosPage({ onNavigate }: RegistroUsuariosPageProps = {}) {
  const [pasoActual, setPasoActual] = useState(1);
  const [validandoProfesional, setValidandoProfesional] = useState(false);
  const [profesionalValidado, setProfesionalValidado] = useState(false);
  const [procesandoRegistro, setProcesandoRegistro] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const [formData, setFormData] = useState<RegistroFormData>({
    perfilUsuario: "",
    tipoMedicamentosControlados: "ninguno",
    metodoAutenticacion: "",
    codigoProfesional: "",
    nombreCompleto: "",
    cedula: "",
    estadoProfesional: "",
    telefono: "",
    correoElectronico: "",
    provinciaId: "",
    cantonId: "",
    distritoId: "",
    otrasSenas: "",
    latitud: 9.9281, // Centro de Costa Rica por defecto
    longitud: -84.0907
  });

  // Obtener datos de cascada
  const [cantones, setCantones] = useState<Canton[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  // Validar si necesita firma digital obligatoria
  const necesitaFirmaDigitalObligatoria = (): boolean => {
    return formData.tipoMedicamentosControlados === "estupefacientes" || 
           formData.tipoMedicamentosControlados === "psicotropicos";
  };

  // Auto-seleccionar método si es obligatorio
  useEffect(() => {
    if (necesitaFirmaDigitalObligatoria()) {
      setFormData(prev => ({ ...prev, metodoAutenticacion: "firma_digital" }));
    }
  }, [formData.tipoMedicamentosControlados]);

  // Geocodificar dirección a coordenadas
  const geocodeAddress = async (provincia: string, canton: string, distrito: string, senas: string) => {
    try {
      const address = `${distrito}, ${canton}, ${provincia}, Costa Rica`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=cr&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error("❌ Error en geocodificación forward:");
      console.error("  • Tipo:", error instanceof Error ? "Error" : typeof error);
      console.error("  • Mensaje:", error instanceof Error ? error.message : String(error));
      console.error("  • Objeto completo:", error);
      return null;
    }
  };

  // Geocodificación inversa: coordenadas a dirección
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      setGeocodingLoading(true);
      toast.info("Obteniendo dirección...", { duration: 1500 });
      
      // Usar la utilidad mejorada de reverse geocoding
      const result = await reverseGeocodeAPI(lat, lon);
      
      if (!result.success) {
        toast.warning(result.error || "No se pudo obtener la dirección", {
          description: "Puede seleccionar manualmente la ubicación"
        });
        return;
      }

      // Buscar la provincia
      let provinciaEncontrada: Provincia | undefined;
      if (result.provincia) {
        provinciaEncontrada = provinciasCostaRica.find(p => p.id === result.provincia);
      }

      if (!provinciaEncontrada) {
        toast.warning("No se pudo identificar la provincia", {
          description: "Por favor seleccione manualmente provincia, cantón y distrito"
        });
        // Actualizar solo las coordenadas
        setFormData(prev => ({
          ...prev,
          latitud: lat,
          longitud: lon,
          otrasSenas: result.direccionCompleta || prev.otrasSenas
        }));
        return;
      }

      // Obtener cantones de la provincia encontrada
      const cantonesDisponibles = getCantonesByProvincia(provinciaEncontrada.id);
      
      // Buscar el cantón con coincidencia aproximada
      let cantonIdEncontrado: string | null = null;
      if (result.canton) {
        cantonIdEncontrado = findBestCantonMatch(result.canton, cantonesDisponibles);
      }

      if (!cantonIdEncontrado) {
        // Solo actualizar provincia y coordenadas
        setFormData(prev => ({
          ...prev,
          provinciaId: provinciaEncontrada.id,
          cantonId: "",
          distritoId: "",
          latitud: lat,
          longitud: lon,
          otrasSenas: result.direccionCompleta || prev.otrasSenas
        }));
        setCantones(cantonesDisponibles);
        setDistritos([]);
        
        toast.success("Provincia identificada", {
          description: "Seleccione manualmente el cantón y distrito"
        });
        return;
      }

      // Obtener distritos del cantón encontrado
      const distritosDisponibles = getDistritosByCanton(provinciaEncontrada.id, cantonIdEncontrado);
      console.log("🔍 Distritos disponibles para el cantón:", distritosDisponibles.map(d => d.nombre));
      
      // Buscar el distrito con coincidencia aproximada
      let distritoIdEncontrado: string | null = null;
      if (result.distrito) {
        console.log("🔍 Buscando distrito:", result.distrito);
        distritoIdEncontrado = findBestDistritoMatch(result.distrito, distritosDisponibles);
        console.log("🔍 Distrito encontrado:", distritoIdEncontrado ? distritosDisponibles.find(d => d.id === distritoIdEncontrado)?.nombre : "NO ENCONTRADO");
      } else {
        console.log("⚠️ No se recibió información de distrito desde la API");
      }

      // Actualizar el formulario con todos los datos encontrados
      setFormData(prev => ({
        ...prev,
        provinciaId: provinciaEncontrada!.id,
        cantonId: cantonIdEncontrado!,
        distritoId: distritoIdEncontrado || "",
        latitud: lat,
        longitud: lon,
        otrasSenas: result.direccionCompleta || prev.otrasSenas
      }));
      
      setCantones(cantonesDisponibles);
      setDistritos(distritosDisponibles);
      
      // Mensaje de éxito con detalles
      const provincia = provinciaEncontrada;
      const canton = cantonesDisponibles.find(c => c.id === cantonIdEncontrado);
      const distrito = distritosDisponibles.find(d => d.id === distritoIdEncontrado);
      
      const partsFound = [
        provincia?.nombre,
        canton?.nombre,
        distrito?.nombre
      ].filter(Boolean);
      
      if (distritoIdEncontrado) {
        toast.success("✅ Ubicación detectada completamente", {
          description: `${partsFound.join(", ")}`,
          duration: 4000
        });
      } else {
        toast.success("✓ Ubicación parcialmente detectada", {
          description: (
            <div className="space-y-1">
              <p>{partsFound.join(", ")}</p>
              <p className="text-xs mt-2">💡 <strong>Seleccione el distrito manualmente</strong> en el campo de abajo para completar su dirección.</p>
            </div>
          ),
          duration: 6000
        });
      }
      
    } catch (error) {
      console.error("❌ Error en geocodificación inversa:");
      console.error("  • Tipo:", error instanceof Error ? "Error" : typeof error);
      console.error("  • Mensaje:", error instanceof Error ? error.message : String(error));
      console.error("  • Objeto completo:", error);
      
      toast.error("Error al obtener la dirección", {
        description: "Por favor, seleccione manualmente la ubicación"
      });
    } finally {
      setGeocodingLoading(false);
    }
  };

  // Manejar cambio de provincia
  const handleProvinciaChange = (provinciaId: string) => {
    setFormData({
      ...formData,
      provinciaId,
      cantonId: "",
      distritoId: ""
    });
    setCantones(getCantonesByProvincia(provinciaId));
    setDistritos([]);
  };

  // Manejar cambio de cantón
  const handleCantonChange = (cantonId: string) => {
    setFormData({
      ...formData,
      cantonId,
      distritoId: ""
    });
    setDistritos(getDistritosByCanton(formData.provinciaId, cantonId));
  };

  // Actualizar mapa cuando cambia la dirección
  useEffect(() => {
    if (formData.provinciaId && formData.cantonId && formData.distritoId) {
      const provincia = provinciasCostaRica.find(p => p.id === formData.provinciaId);
      const canton = cantones.find(c => c.id === formData.cantonId);
      const distrito = distritos.find(d => d.id === formData.distritoId);
      
      if (provincia && canton && distrito) {
        geocodeAddress(
          provincia.nombre,
          canton.nombre,
          distrito.nombre,
          formData.otrasSenas
        ).then(coords => {
          if (coords) {
            setFormData(prev => ({
              ...prev,
              latitud: coords.lat,
              longitud: coords.lon
            }));
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.provinciaId, formData.cantonId, formData.distritoId, cantones, distritos]);

  // Validar código profesional con colegio (simulado)
  const validarCodigoProfesional = async () => {
    if (!formData.codigoProfesional) {
      toast.error("Ingrese el código profesional");
      return;
    }

    setValidandoProfesional(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulación de respuesta exitosa
      setFormData(prev => ({
        ...prev,
        nombreCompleto: "Dr. Juan Carlos Pérez González",
        cedula: "1-0234-0567",
        estadoProfesional: "activo"
      }));
      setProfesionalValidado(true);
      toast.success("Código profesional validado correctamente");
    } catch (err) {
      toast.error("Error al validar código profesional");
    } finally {
      setValidandoProfesional(false);
    }
  };

  // Completar registro
  const completarRegistro = async () => {
    setProcesandoRegistro(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcesandoRegistro(false);
      setShowSuccessDialog(true);
      toast.success("✅ Usuario registrado exitosamente", {
        description: "El usuario recibirá las instrucciones por correo electrónico",
        duration: 3000
      });
      
      // Redirigir automáticamente después de 2 segundos
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('/seguridad/usuarios');
        } else {
          // Si no hay función de navegación, solo reiniciar el formulario
          reiniciarFormulario();
          setShowSuccessDialog(false);
        }
      }, 2000);
    } catch (err) {
      toast.error("Error al registrar usuario");
      setProcesandoRegistro(false);
    }
  };

  // Validar paso actual
  const validarPaso = (paso: number): boolean => {
    switch (paso) {
      case 1:
        if (!formData.perfilUsuario) return false;
        if (formData.tipoMedicamentosControlados !== "ninguno" && !formData.metodoAutenticacion) return false;
        if (necesitaFirmaDigitalObligatoria() && formData.metodoAutenticacion !== "firma_digital") return false;
        return true;
      
      case 2:
        const perfilSeleccionado = PERFILES_USUARIO.find(p => p.value === formData.perfilUsuario);
        if (perfilSeleccionado?.requiereColegio) {
          return profesionalValidado && formData.estadoProfesional === "activo";
        }
        return true;
      
      case 3:
        if (!formData.telefono || !formData.correoElectronico) return false;
        if (!formData.provinciaId || !formData.cantonId || !formData.distritoId) return false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) return false;
        return true;
      
      default:
        return false;
    }
  };

  // Siguiente paso
  const siguientePaso = () => {
    if (validarPaso(pasoActual)) {
      const perfilSeleccionado = PERFILES_USUARIO.find(p => p.value === formData.perfilUsuario);
      
      // Si está en paso 1 y no requiere colegio, saltar al paso 3
      if (pasoActual === 1 && !perfilSeleccionado?.requiereColegio) {
        setPasoActual(3);
      } else {
        setPasoActual(pasoActual + 1);
      }
    } else {
      toast.error("Complete todos los campos requeridos");
    }
  };

  // Paso anterior
  const pasoAnterior = () => {
    const perfilSeleccionado = PERFILES_USUARIO.find(p => p.value === formData.perfilUsuario);
    
    // Si está en paso 3 y no requiere colegio, volver al paso 1
    if (pasoActual === 3 && !perfilSeleccionado?.requiereColegio) {
      setPasoActual(1);
    } else {
      setPasoActual(pasoActual - 1);
    }
  };

  // Reiniciar formulario
  const reiniciarFormulario = () => {
    setFormData({
      perfilUsuario: "",
      tipoMedicamentosControlados: "ninguno",
      metodoAutenticacion: "",
      codigoProfesional: "",
      nombreCompleto: "",
      cedula: "",
      estadoProfesional: "",
      telefono: "",
      correoElectronico: "",
      provinciaId: "",
      cantonId: "",
      distritoId: "",
      otrasSenas: "",
      latitud: 9.9281,
      longitud: -84.0907
    });
    setPasoActual(1);
    setProfesionalValidado(false);
    setShowSuccessDialog(false);
  };

  const getTotalSteps = () => {
    const perfilSeleccionado = PERFILES_USUARIO.find(p => p.value === formData.perfilUsuario);
    return perfilSeleccionado?.requiereColegio ? 4 : 3;
  };

  return (
    <div className="space-y-6">
      {/* Banner de registro */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-blue-600 to-cyan-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-white mb-1">Registro de usuarios</h1>
                <p className="text-white/90 max-w-2xl">
                  Registre nuevos profesionales de salud en el sistema de prescripción electrónica. 
                  Complete el proceso paso a paso para garantizar la validación adecuada.
                </p>
              </div>
            </div>
            
            {/* Iconos decorativos */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <Stethoscope className="w-6 h-6 text-white/80" />
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white/80" />
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <Building2 className="w-6 h-6 text-white/80" />
              </div>
            </div>
          </div>
          
          {/* Indicadores de progreso rápido */}
          <div className="mt-6 flex items-center gap-2 text-white/80 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Validación automática con colegios profesionales</span>
            <span className="mx-2">•</span>
            <Shield className="w-4 h-4" />
            <span>Cumplimiento normativo HL7, FDA y OMS</span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map((paso, index) => {
              // Determinar la etiqueta correcta según si requiere o no colegio profesional
              const perfilSeleccionado = PERFILES_USUARIO.find(p => p.value === formData.perfilUsuario);
              const requiereColegio = perfilSeleccionado?.requiereColegio || false;
              
              let etiqueta = "";
              if (requiereColegio) {
                // Flujo completo: Perfil → Validación → Contacto → Confirmación
                if (paso === 1) etiqueta = "Perfil";
                else if (paso === 2) etiqueta = "Validación";
                else if (paso === 3) etiqueta = "Contacto";
                else if (paso === 4) etiqueta = "Confirmación";
              } else {
                // Flujo corto: Perfil → Contacto → Confirmación
                if (paso === 1) etiqueta = "Perfil";
                else if (paso === 2) etiqueta = "Contacto";
                else if (paso === 3) etiqueta = "Confirmación";
              }
              
              return (
                <div key={paso} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                        paso < pasoActual
                          ? "bg-success border-success text-white"
                          : paso === pasoActual
                          ? "bg-primary border-primary text-white shadow-md"
                          : "bg-white border-border text-muted-foreground"
                      }`}
                    >
                      {paso < pasoActual ? <CheckCircle2 className="w-6 h-6" /> : <span>{paso}</span>}
                    </div>
                    <p className={`text-sm mt-2 text-center font-medium ${paso === pasoActual ? "text-foreground" : "text-muted-foreground"}`}>
                      {etiqueta}
                    </p>
                  </div>
                  {index < getTotalSteps() - 1 && (
                    <div className={`h-1 flex-1 mx-3 rounded transition-all ${
                      paso < pasoActual ? "bg-success" : "bg-border"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Paso 1: Tipo de perfil y medicamentos controlados */}
      {pasoActual === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Paso 1: Selección de perfil y autenticación
            </CardTitle>
            <CardDescription>
              Define el tipo de usuario y los medicamentos que prescribirá o dispensará
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="perfilUsuario">Tipo de perfil de usuario *</Label>
              <Select value={formData.perfilUsuario} onValueChange={(value) => setFormData({ ...formData, perfilUsuario: value })}>
                <SelectTrigger id="perfilUsuario">
                  <SelectValue placeholder="Seleccione el perfil del usuario..." />
                </SelectTrigger>
                <SelectContent>
                  {PERFILES_USUARIO.map((perfil) => (
                    <SelectItem key={perfil.value} value={perfil.value}>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        {perfil.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.perfilUsuario && (
                <Alert className="mt-2">
                  <Building2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Colegio profesional:</strong>{" "}
                    {PERFILES_USUARIO.find(p => p.value === formData.perfilUsuario)?.colegio}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-3 p-5 bg-muted/40 border border-border rounded-lg">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                ¿Prescribirá o dispensará medicamentos controlados? *
              </Label>
              <RadioGroup 
                value={formData.tipoMedicamentosControlados} 
                onValueChange={(v) => setFormData({ ...formData, tipoMedicamentosControlados: v as TipoControlado })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="ninguno" id="control-ninguno" />
                  <Label htmlFor="control-ninguno" className="flex-1 cursor-pointer">
                    <p>No, solo medicamentos de libre venta</p>
                    <p className="text-sm text-muted-foreground">Sin restricciones especiales</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="antimicrobianos" id="control-antimicrobianos" />
                  <Label htmlFor="control-antimicrobianos" className="flex-1 cursor-pointer">
                    <p>Antimicrobianos (Antibióticos)</p>
                    <p className="text-sm text-muted-foreground">Requiere registro especial</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 border-orange-500 bg-orange-50/50 rounded-lg cursor-pointer">
                  <RadioGroupItem value="psicotropicos" id="control-psicotropicos" />
                  <Label htmlFor="control-psicotropicos" className="flex-1 cursor-pointer">
                    <p>Psicotrópicos</p>
                    <p className="text-sm text-orange-700">⚠️ Requiere Firma Digital obligatoria</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 border-destructive bg-destructive/5 rounded-lg cursor-pointer">
                  <RadioGroupItem value="estupefacientes" id="control-estupefacientes" />
                  <Label htmlFor="control-estupefacientes" className="flex-1 cursor-pointer">
                    <p>Estupefacientes</p>
                    <p className="text-sm text-destructive">⚠️ Requiere Firma Digital obligatoria</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.tipoMedicamentosControlados !== "ninguno" && (
              <Alert className="border-primary/30 bg-primary/5">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <AlertTitle>Método de autenticación requerido</AlertTitle>
                <AlertDescription>
                  {necesitaFirmaDigitalObligatoria()
                    ? "Para estupefacientes y psicotrópicos es OBLIGATORIO usar Firma Digital BCCR."
                    : "Para antimicrobianos se puede usar Firma Digital o Usuario/Contraseña + MFA."}
                </AlertDescription>
              </Alert>
            )}

            {formData.tipoMedicamentosControlados !== "ninguno" && (
              <div className="space-y-3">
                {necesitaFirmaDigitalObligatoria() ? (
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      La Firma Digital ha sido seleccionada automáticamente por requisitos de seguridad nacional.
                      El usuario configurará su firma digital cuando reciba la notificación de registro.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <RadioGroup value={formData.metodoAutenticacion} onValueChange={(v) => setFormData({ ...formData, metodoAutenticacion: v as MetodoAutenticacion })}>
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="password_mfa" id="auth-password" />
                      <Label htmlFor="auth-password" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <div>
                            <p>Usuario y Contraseña + MFA</p>
                            <p className="text-sm text-muted-foreground">El usuario configurará sus credenciales al recibir notificación</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="firma_digital" id="auth-signature" />
                      <Label htmlFor="auth-signature" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <div>
                            <p>Firma Digital BCCR (GAUDI)</p>
                            <p className="text-sm text-muted-foreground">Máxima seguridad, el usuario configurará su firma</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> El usuario recibirá una notificación por correo electrónico y SMS para completar la configuración de su método de autenticación.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end pt-4">
              <Button onClick={siguientePaso} size="lg">
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 2: Validación profesional */}
      {pasoActual === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Paso 2: Validación profesional
            </CardTitle>
            <CardDescription>
              Valide el código profesional del usuario con el colegio correspondiente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Building2 className="h-4 w-4" />
              <AlertTitle>Validación con colegio profesional</AlertTitle>
              <AlertDescription>
                Ingrese el código profesional para validar automáticamente los datos con el{" "}
                <strong>{PERFILES_USUARIO.find(p => p.value === formData.perfilUsuario)?.colegio}</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="codigoProfesional">Código profesional *</Label>
              <div className="flex gap-2">
                <Input
                  id="codigoProfesional"
                  value={formData.codigoProfesional}
                  onChange={(e) => setFormData({ ...formData, codigoProfesional: e.target.value.toUpperCase() })}
                  placeholder="Ej: MED-12345"
                  disabled={profesionalValidado}
                  className="flex-1"
                />
                <Button 
                  onClick={validarCodigoProfesional} 
                  disabled={validandoProfesional || profesionalValidado || !formData.codigoProfesional}
                  variant={profesionalValidado ? "outline" : "default"}
                >
                  {validandoProfesional && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {profesionalValidado ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Validado</> : "Validar"}
                </Button>
              </div>
            </div>

            {profesionalValidado && (
              <Alert className="border-success bg-success/5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertTitle className="text-success">Datos validados exitosamente</AlertTitle>
                <AlertDescription className="space-y-1 mt-2">
                  <p><strong>Nombre:</strong> {formData.nombreCompleto}</p>
                  <p><strong>Cédula:</strong> {formData.cedula}</p>
                  <p><strong>Estado:</strong> <Badge variant="outline" className="ml-1">Activo</Badge></p>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={pasoAnterior}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button onClick={siguientePaso} disabled={!profesionalValidado} className="flex-1" size="lg">
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 3: Datos de contacto y ubicación */}
      {pasoActual === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Paso {PERFILES_USUARIO.find(p => p.value === formData.perfilUsuario)?.requiereColegio ? "3" : "2"}: Datos de contacto y ubicación
            </CardTitle>
            <CardDescription>
              Ingrese la información de contacto y ubicación del usuario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Datos de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="telefono" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Teléfono *
                </Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: +506 8888-8888"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correoElectronico" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Correo electrónico *
                </Label>
                <Input
                  id="correoElectronico"
                  type="email"
                  value={formData.correoElectronico}
                  onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPinned className="w-5 h-5 text-primary" />
                <h3>Ubicación</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Select value={formData.provinciaId} onValueChange={handleProvinciaChange}>
                    <SelectTrigger id="provincia">
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinciasCostaRica.map((provincia) => (
                        <SelectItem key={provincia.id} value={provincia.id}>
                          {provincia.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canton">Cantón *</Label>
                  <Select value={formData.cantonId} onValueChange={handleCantonChange} disabled={!formData.provinciaId}>
                    <SelectTrigger id="canton">
                      <SelectValue placeholder="Seleccionar cantón" />
                    </SelectTrigger>
                    <SelectContent>
                      {cantones.map((canton) => (
                        <SelectItem key={canton.id} value={canton.id}>
                          {canton.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distrito" className="flex items-center gap-2">
                    Distrito *
                    {formData.cantonId && !formData.distritoId && (
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
                        ⚠️ Pendiente
                      </Badge>
                    )}
                  </Label>
                  <Select 
                    value={formData.distritoId} 
                    onValueChange={(value) => setFormData({ ...formData, distritoId: value })} 
                    disabled={!formData.cantonId}
                  >
                    <SelectTrigger 
                      id="distrito" 
                      className={formData.cantonId && !formData.distritoId ? "border-yellow-500 bg-yellow-50" : ""}
                    >
                      <SelectValue placeholder="Seleccionar distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {distritos.map((distrito) => (
                        <SelectItem key={distrito.id} value={distrito.id}>
                          {distrito.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.cantonId && !formData.distritoId && (
                    <p className="text-xs text-yellow-700 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Por favor seleccione el distrito para completar la dirección
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otrasSenas">Otras señas</Label>
                <Input
                  id="otrasSenas"
                  value={formData.otrasSenas}
                  onChange={(e) => setFormData({ ...formData, otrasSenas: e.target.value })}
                  placeholder="Detalles adicionales de la dirección..."
                />
              </div>

              {/* Mapa */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPinned className="w-4 h-4" />
                  Ubicación en mapa
                  {geocodingLoading && (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Detectando ubicación...
                    </span>
                  )}
                </Label>
                <div className="border border-border rounded-lg overflow-hidden">
                  <LocationMap
                    latitude={formData.latitud}
                    longitude={formData.longitud}
                    onLocationChange={(lat, lon) => {
                      setFormData(prev => ({
                        ...prev,
                        latitud: lat,
                        longitud: lon
                      }));
                      reverseGeocode(lat, lon);
                    }}
                    editable={true}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 border border-blue-200 rounded-md p-2.5">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-blue-900 font-medium">¿Cómo funciona el autocompletado?</p>
                      <ul className="mt-1.5 space-y-1 list-disc list-inside">
                        <li><strong>Haga clic en el mapa</strong>: Seleccione su ubicación exacta</li>
                        <li><strong>Use "Mi ubicación"</strong>: GPS automático (requiere permisos)</li>
                        <li><strong>Selección manual</strong>: Use los campos si el GPS no funciona</li>
                      </ul>
                      <p className="mt-2 text-xs text-blue-600">
                        💡 <strong>Nota:</strong> El distrito puede requerir selección manual ya que OpenStreetMap no siempre tiene información precisa de distritos en Costa Rica.
                      </p>
                    </div>
                  </div>
                  
                  {/* Botón de diagnóstico de GPS */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      if (!navigator.geolocation) {
                        toast.error("❌ Su navegador no soporta geolocalización");
                      } else {
                        toast.success("✅ Su navegador soporta geolocalización", {
                          description: "Haga clic en 'Mi ubicación' para obtener su GPS"
                        });
                      }
                    }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 mr-2" />
                    Verificar compatibilidad de GPS
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={pasoAnterior}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button onClick={siguientePaso} disabled={!validarPaso(3)} className="flex-1" size="lg">
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 4: Confirmación */}
      {pasoActual === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Paso 4: Confirmación de datos
            </CardTitle>
            <CardDescription>
              Revise los datos antes de completar el registro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 p-5 bg-muted/30 border border-border rounded-lg">
              <div>
                <h3 className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-primary" />
                  Información del perfil
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Perfil:</p>
                    <p>{PERFILES_USUARIO.find(p => p.value === formData.perfilUsuario)?.label}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Medicamentos:</p>
                    <p className="capitalize">{formData.tipoMedicamentosControlados}</p>
                  </div>
                  {formData.nombreCompleto && (
                    <>
                      <div>
                        <p className="text-muted-foreground">Nombre:</p>
                        <p>{formData.nombreCompleto}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cédula:</p>
                        <p>{formData.cedula}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4 text-primary" />
                  Datos de contacto
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Teléfono:</p>
                    <p>{formData.telefono}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Correo:</p>
                    <p>{formData.correoElectronico}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  Ubicación
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Provincia:</span>{" "}
                    {provinciasCostaRica.find(p => p.id === formData.provinciaId)?.nombre}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Cantón:</span>{" "}
                    {cantones.find(c => c.id === formData.cantonId)?.nombre}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Distrito:</span>{" "}
                    {distritos.find(d => d.id === formData.distritoId)?.nombre}
                  </p>
                  {formData.otrasSenas && (
                    <p>
                      <span className="text-muted-foreground">Otras señas:</span>{" "}
                      {formData.otrasSenas}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Alert className="border-warning/50 bg-warning/5">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertTitle>Confirmación de registro</AlertTitle>
              <AlertDescription>
                El usuario recibirá una notificación por correo electrónico y SMS con las instrucciones para completar la configuración de su cuenta y método de autenticación.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={pasoAnterior}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button onClick={completarRegistro} disabled={procesandoRegistro} className="flex-1" size="lg">
                {procesandoRegistro ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Completar registro
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
            </div>
            <DialogTitle className="text-center">¡Usuario registrado exitosamente!</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Se ha enviado una notificación al usuario con las instrucciones para activar su cuenta.
              {onNavigate && (
                <span className="block text-xs text-muted-foreground italic mt-2">
                  Redirigiendo a la lista de usuarios...
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button 
              onClick={() => {
                setShowSuccessDialog(false);
                reiniciarFormulario();
              }} 
              variant="outline"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Registrar otro usuario
            </Button>
            <Button 
              onClick={() => {
                setShowSuccessDialog(false);
                if (onNavigate) {
                  onNavigate('/seguridad/usuarios');
                }
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Ir a usuarios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
