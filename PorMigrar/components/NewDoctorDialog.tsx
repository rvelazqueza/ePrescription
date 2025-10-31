import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { EmailInput } from "./EmailInput";
import { toast } from "sonner@2.0.3";
import {
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Shield,
  Clock,
  Settings,
  X,
  Plus,
  Save,
  Stethoscope,
  Award,
  Calendar,
  FileText,
  Building2
} from "lucide-react";

interface NewDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDoctorCreated?: (doctor: any) => void;
}

export function NewDoctorDialog({ open, onOpenChange, onDoctorCreated }: NewDoctorDialogProps) {
  const [currentTab, setCurrentTab] = useState("personal");
  
  // Estados del formulario - Información personal
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idType, setIdType] = useState("CC");
  const [idNumber, setIdNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  
  // Estados del formulario - Información de contacto
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Colombia");
  
  // Estados del formulario - Formación académica
  const [specialty, setSpecialty] = useState("");
  const [subspecialties, setSubspecialties] = useState<string[]>([]);
  const [newSubspecialty, setNewSubspecialty] = useState("");
  const [university, setUniversity] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  
  // Estados del formulario - Licencias y certificaciones
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState("");
  
  // Estados del formulario - Horarios
  const [schedules, setSchedules] = useState<Array<{days: string; hours: string}>>([]);
  const [newScheduleDays, setNewScheduleDays] = useState("");
  const [newScheduleHours, setNewScheduleHours] = useState("");
  
  // Estados del formulario - Configuración
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [certificationStatus, setCertificationStatus] = useState<"verified" | "expired">("verified");
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [notes, setNotes] = useState("");

  // Convertir fecha de formato YYYY-MM-DD a DD/MM/YYYY
  const convertDateToDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleAddSubspecialty = () => {
    if (!newSubspecialty.trim()) {
      toast.error("Campo vacío", {
        description: "Por favor ingresa el nombre de la subespecialidad"
      });
      return;
    }
    setSubspecialties([...subspecialties, newSubspecialty.trim()]);
    setNewSubspecialty("");
    toast.success("Subespecialidad agregada", {
      description: newSubspecialty.trim(),
      duration: 2000
    });
  };

  const handleRemoveSubspecialty = (index: number) => {
    const removed = subspecialties[index];
    setSubspecialties(subspecialties.filter((_, i) => i !== index));
    toast.info("Subespecialidad eliminada", {
      description: removed,
      duration: 2000
    });
  };

  const handleAddCertification = () => {
    if (!newCertification.trim()) {
      toast.error("Campo vacío", {
        description: "Por favor ingresa el nombre de la certificación"
      });
      return;
    }
    setCertifications([...certifications, newCertification.trim()]);
    setNewCertification("");
    toast.success("Certificación agregada", {
      description: newCertification.trim(),
      duration: 2000
    });
  };

  const handleRemoveCertification = (index: number) => {
    const removed = certifications[index];
    setCertifications(certifications.filter((_, i) => i !== index));
    toast.info("Certificación eliminada", {
      description: removed,
      duration: 2000
    });
  };

  const handleAddSchedule = () => {
    if (!newScheduleDays.trim() || !newScheduleHours.trim()) {
      toast.error("Campos incompletos", {
        description: "Por favor completa los días y el horario"
      });
      return;
    }
    setSchedules([...schedules, { days: newScheduleDays.trim(), hours: newScheduleHours.trim() }]);
    toast.success("Horario agregado", {
      description: `${newScheduleDays.trim()} • ${newScheduleHours.trim()}`,
      duration: 2000
    });
    setNewScheduleDays("");
    setNewScheduleHours("");
  };

  const handleRemoveSchedule = (index: number) => {
    const removed = schedules[index];
    setSchedules(schedules.filter((_, i) => i !== index));
    toast.info("Horario eliminado", {
      description: `${removed.days} • ${removed.hours}`,
      duration: 2000
    });
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setIdType("CC");
    setIdNumber("");
    setBirthDate("");
    setGender("");
    setEmail("");
    setPhone("");
    setOfficePhone("");
    setAddress("");
    setCity("");
    setCountry("Colombia");
    setSpecialty("");
    setSubspecialties([]);
    setNewSubspecialty("");
    setUniversity("");
    setGraduationYear("");
    setYearsOfExperience("");
    setLicenseNumber("");
    setLicenseExpiry("");
    setCertifications([]);
    setNewCertification("");
    setSchedules([]);
    setNewScheduleDays("");
    setNewScheduleHours("");
    setStatus("active");
    setCertificationStatus("verified");
    setIsOnDuty(false);
    setNotes("");
    setCurrentTab("personal");
  };

  const validateForm = () => {
    // Validaciones de información personal
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Error de validación", {
        description: "El nombre y apellido son obligatorios"
      });
      setCurrentTab("personal");
      return false;
    }

    // Validaciones de contacto
    if (!email.trim()) {
      toast.error("Error de validación", {
        description: "El email es obligatorio"
      });
      setCurrentTab("contact");
      return false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Error de validación", {
        description: "El formato del email no es válido"
      });
      setCurrentTab("contact");
      return false;
    }

    if (!phone.trim()) {
      toast.error("Error de validación", {
        description: "El teléfono es obligatorio"
      });
      setCurrentTab("contact");
      return false;
    }

    // Validaciones de formación académica
    if (!specialty.trim()) {
      toast.error("Error de validación", {
        description: "La especialidad es obligatoria"
      });
      setCurrentTab("academic");
      return false;
    }

    if (!licenseNumber.trim()) {
      toast.error("Error de validación", {
        description: "El número de licencia es obligatorio"
      });
      setCurrentTab("license");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Generar ID único para el nuevo médico
    const newDoctorId = `MD${Date.now()}`;

    // Crear nuevo médico
    const newDoctor = {
      id: newDoctorId,
      firstName,
      lastName,
      fullName: `Dr. ${firstName} ${lastName}`,
      idType,
      idNumber,
      birthDate,
      gender,
      email,
      phone,
      officePhone,
      address,
      city,
      country,
      specialty,
      subspecialties,
      university,
      graduationYear,
      yearsOfExperience: parseInt(yearsOfExperience) || 0,
      licenseNumber,
      licenseExpiry: convertDateToDisplay(licenseExpiry),
      certifications,
      schedule: schedules,
      status,
      certificationStatus,
      isOnDuty,
      notes,
      totalPrescriptions: 0,
      totalPatients: 0,
      monthlyPrescriptions: 0,
      lastActivity: new Date().toLocaleDateString('es-ES'),
      registrationDate: new Date().toLocaleDateString('es-ES')
    };

    console.log("Nuevo médico creado:", newDoctor);

    toast.success("¡Médico registrado exitosamente!", {
      description: `${newDoctor.fullName} ha sido agregado al sistema`,
      duration: 4000,
    });

    // Callback para actualizar la lista de médicos si se proporciona
    if (onDoctorCreated) {
      onDoctorCreated(newDoctor);
    }

    resetForm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetForm();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            Registrar nuevo médico
          </DialogTitle>
          <DialogDescription>
            Ingresa la información completa del nuevo médico. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span className="hidden sm:inline">Contacto</span>
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              <span className="hidden sm:inline">Formación</span>
            </TabsTrigger>
            <TabsTrigger value="license" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">Licencias</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="hidden sm:inline">Horarios</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-1">
              <Settings className="w-3 h-3" />
              <span className="hidden sm:inline">Config.</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Información Personal */}
          <TabsContent value="personal" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
                <CardDescription>Datos de identificación del médico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombres *</Label>
                    <Input
                      id="firstName"
                      placeholder="Ej: Carlos Andrés"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellidos *</Label>
                    <Input
                      id="lastName"
                      placeholder="Ej: Martínez López"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idType">Tipo de documento</Label>
                    <Select value={idType} onValueChange={setIdType}>
                      <SelectTrigger id="idType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                        <SelectItem value="PA">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idNumber">Número de documento</Label>
                    <Input
                      id="idNumber"
                      placeholder="Ej: 1234567890"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={() => setCurrentTab("contact")}>
                Siguiente: Contacto
              </Button>
            </div>
          </TabsContent>

          {/* Tab 2: Información de Contacto */}
          <TabsContent value="contact" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
                <CardDescription>Datos para comunicación con el médico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EmailInput
                    id="email"
                    label="Correo electrónico"
                    value={email}
                    onChange={setEmail}
                    placeholder="Ej: doctor@hospital.com"
                    required
                  />

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono personal *</Label>
                    <Input
                      id="phone"
                      placeholder="Ej: +57 310 456-7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officePhone">Teléfono consultorio</Label>
                  <Input
                    id="officePhone"
                    placeholder="Ej: +57 1 234-5678"
                    value={officePhone}
                    onChange={(e) => setOfficePhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección del consultorio</Label>
                  <Input
                    id="address"
                    placeholder="Ej: Cra 15 #85-23, Consultorio 402"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      placeholder="Ej: Bogotá"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Colombia">Colombia</SelectItem>
                        <SelectItem value="Argentina">Argentina</SelectItem>
                        <SelectItem value="Chile">Chile</SelectItem>
                        <SelectItem value="México">México</SelectItem>
                        <SelectItem value="Perú">Perú</SelectItem>
                        <SelectItem value="España">España</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentTab("personal")}>
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={() => setCurrentTab("academic")}>
                  Siguiente: Formación académica
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Formación Académica */}
          <TabsContent value="academic" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Formación académica</CardTitle>
                <CardDescription>Especialidad y datos académicos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidad principal *</Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Seleccione la especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiología">Cardiología</SelectItem>
                      <SelectItem value="Pediatría">Pediatría</SelectItem>
                      <SelectItem value="Medicina Interna">Medicina Interna</SelectItem>
                      <SelectItem value="Ginecología y Obstetricia">Ginecología y Obstetricia</SelectItem>
                      <SelectItem value="Ortopedia y Traumatología">Ortopedia y Traumatología</SelectItem>
                      <SelectItem value="Neurología">Neurología</SelectItem>
                      <SelectItem value="Psiquiatría">Psiquiatría</SelectItem>
                      <SelectItem value="Dermatología">Dermatología</SelectItem>
                      <SelectItem value="Anestesiología">Anestesiología</SelectItem>
                      <SelectItem value="Radiología">Radiología</SelectItem>
                      <SelectItem value="Cirugía General">Cirugía General</SelectItem>
                      <SelectItem value="Medicina General">Medicina General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subespecialidades</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: Electrofisiología"
                      value={newSubspecialty}
                      onChange={(e) => setNewSubspecialty(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubspecialty())}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={handleAddSubspecialty}
                      className="bg-blue-600 hover:bg-blue-700"
                      title="Agregar subespecialidad"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                  {subspecialties.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">
                        {subspecialties.length} subespecialidad(es) agregada(s):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {subspecialties.map((sub, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-300"
                          >
                            {sub}
                            <button
                              type="button"
                              onClick={() => handleRemoveSubspecialty(index)}
                              className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                              title="Eliminar subespecialidad"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">Universidad</Label>
                    <Input
                      id="university"
                      placeholder="Ej: Universidad Nacional de Colombia"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Año de graduación</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      placeholder="Ej: 2008"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Años de experiencia</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    placeholder="Ej: 15"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentTab("contact")}>
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={() => setCurrentTab("license")}>
                  Siguiente: Licencias
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: Licencias y Certificaciones */}
          <TabsContent value="license" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Licencias y certificaciones</CardTitle>
                <CardDescription>Información de licencia médica y certificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Número de licencia médica *</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="Ej: MSP-2015-045678"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiry">Fecha de vencimiento</Label>
                    <Input
                      id="licenseExpiry"
                      type="date"
                      value={licenseExpiry}
                      onChange={(e) => setLicenseExpiry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Certificaciones adicionales</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: Certificación en Electrofisiología Cardíaca - ACC 2018"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={handleAddCertification}
                      className="bg-blue-600 hover:bg-blue-700"
                      title="Agregar certificación"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                  {certifications.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">
                        {certifications.length} certificación(es) agregada(s):
                      </p>
                      <div className="space-y-2">
                        {certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                            <Award className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-sm flex-1">{cert}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCertification(index)}
                              className="hover:bg-blue-200 rounded-full p-1"
                              title="Eliminar certificación"
                            >
                              <X className="w-4 h-4 text-blue-800" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentTab("academic")}>
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={() => setCurrentTab("schedule")}>
                  Siguiente: Horarios
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 5: Horarios de Atención */}
          <TabsContent value="schedule" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Horarios de atención</CardTitle>
                <CardDescription>Configura los horarios de consulta del médico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduleDays">Días</Label>
                    <Input
                      id="scheduleDays"
                      placeholder="Ej: Lunes - Viernes"
                      value={newScheduleDays}
                      onChange={(e) => setNewScheduleDays(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduleHours">Horario</Label>
                    <div className="flex gap-2">
                      <Input
                        id="scheduleHours"
                        placeholder="Ej: 08:00 - 14:00"
                        value={newScheduleHours}
                        onChange={(e) => setNewScheduleHours(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={handleAddSchedule}
                        className="bg-blue-600 hover:bg-blue-700"
                        title="Agregar horario"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                </div>

                {schedules.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <Label>Horarios configurados</Label>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        {schedules.length} horario(s)
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {schedules.map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">{schedule.days}</p>
                              <p className="text-xs text-muted-foreground">{schedule.hours}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSchedule(index)}
                            className="hover:bg-blue-200 rounded-full p-1"
                            title="Eliminar horario"
                          >
                            <X className="w-4 h-4 text-blue-800" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentTab("license")}>
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={() => setCurrentTab("config")}>
                  Siguiente: Configuración
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 6: Configuración del Sistema */}
          <TabsContent value="config" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del sistema</CardTitle>
                <CardDescription>Estado y permisos del médico en el sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado del médico</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive")}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certStatus">Estado de certificación</Label>
                    <Select value={certificationStatus} onValueChange={(v) => setCertificationStatus(v as "verified" | "expired")}>
                      <SelectTrigger id="certStatus">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verified">Verificado</SelectItem>
                        <SelectItem value="expired">Vencido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm">Médico en turno</p>
                      <p className="text-xs text-muted-foreground">
                        Indica si el médico está actualmente de turno
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={isOnDuty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsOnDuty(!isOnDuty)}
                  >
                    {isOnDuty ? "Sí" : "No"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas administrativas</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observaciones, restricciones o información administrativa relevante..."
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentTab("schedule")}>
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Registrar médico
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}