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
  Heart,
  Shield,
  AlertTriangle,
  Users,
  Calendar,
  X,
  Plus,
  Save,
  FileText,
  Activity,
  Pill,
  Stethoscope
} from "lucide-react";

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

interface NewPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientCreated?: (patient: PatientData) => void;
}

export function NewPatientDialog({ open, onOpenChange, onPatientCreated }: NewPatientDialogProps) {
  const [currentTab, setCurrentTab] = useState("personal");
  
  // Estados del formulario - Información personal
  const [idType, setIdType] = useState("CC");
  const [idNumber, setIdNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [firstLastName, setFirstLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [occupation, setOccupation] = useState("");
  
  // Estados del formulario - Información de contacto
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Colombia");
  
  // Estados del formulario - Información médica
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState("");
  const [currentMedications, setCurrentMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  
  // Estados del formulario - Seguro médico
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [insuranceNumber, setInsuranceNumber] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  
  // Estados del formulario - Contacto de emergencia
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    if (!weight || !height) return "";
    const weightKg = parseFloat(weight);
    const heightM = parseFloat(height);
    if (isNaN(weightKg) || isNaN(heightM) || heightM === 0) return "";
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setChronicConditions([...chronicConditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const handleRemoveCondition = (index: number) => {
    setChronicConditions(chronicConditions.filter((_, i) => i !== index));
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setCurrentMedications([...currentMedications, newMedication.trim()]);
      setNewMedication("");
    }
  };

  const handleRemoveMedication = (index: number) => {
    setCurrentMedications(currentMedications.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    // Validaciones de información personal
    if (!idNumber.trim()) {
      toast.error("Error de validación", {
        description: "El número de identificación es obligatorio"
      });
      setCurrentTab("personal");
      return false;
    }

    if (!firstName.trim() || !firstLastName.trim()) {
      toast.error("Error de validación", {
        description: "El primer nombre y primer apellido son obligatorios"
      });
      setCurrentTab("personal");
      return false;
    }

    if (!birthDate) {
      toast.error("Error de validación", {
        description: "La fecha de nacimiento es obligatoria"
      });
      setCurrentTab("personal");
      return false;
    }

    if (!gender) {
      toast.error("Error de validación", {
        description: "El género es obligatorio"
      });
      setCurrentTab("personal");
      return false;
    }

    // Validaciones de contacto
    if (!phone.trim()) {
      toast.error("Error de validación", {
        description: "El teléfono de contacto es obligatorio"
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

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Simular guardado del paciente
    const lastName = `${firstLastName} ${secondLastName}`.trim();
    const newPatient: PatientData = {
      id: `PAC-${Math.floor(Math.random() * 900000 + 100000)}`,
      fullName: `${firstName} ${secondName} ${firstLastName} ${secondLastName}`.replace(/\s+/g, ' ').trim(),
      firstName: `${firstName} ${secondName}`.trim(),
      lastName,
      idType,
      idNumber,
      birthDate,
      age: calculateAge(birthDate),
      gender: gender as "M" | "F",
      bloodType,
      occupation,
      phone,
      email,
      address,
      city,
      country,
      weight,
      height,
      bmi: calculateBMI(),
      allergies,
      chronicConditions,
      currentMedications,
      clinicalNotes,
      insuranceProvider,
      insuranceNumber,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelationship,
        phone: emergencyPhone
      }
    };

    console.log("Nuevo paciente registrado:", newPatient);

    toast.success("¡Paciente registrado exitosamente!", {
      description: `${newPatient.fullName} ha sido agregado al sistema`,
      duration: 4000,
    });

    // Llamar al callback si existe
    if (onPatientCreated) {
      onPatientCreated(newPatient);
    }

    // Resetear formulario
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setCurrentTab("personal");
    setIdType("CC");
    setIdNumber("");
    setFirstName("");
    setSecondName("");
    setFirstLastName("");
    setSecondLastName("");
    setBirthDate("");
    setGender("");
    setBloodType("");
    setOccupation("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity("");
    setCountry("Colombia");
    setWeight("");
    setHeight("");
    setAllergies([]);
    setNewAllergy("");
    setChronicConditions([]);
    setNewCondition("");
    setCurrentMedications([]);
    setNewMedication("");
    setClinicalNotes("");
    setInsuranceProvider("");
    setInsuranceNumber("");
    setInsuranceType("");
    setEmergencyName("");
    setEmergencyRelationship("");
    setEmergencyPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Registrar nuevo paciente
          </DialogTitle>
          <DialogDescription>
            Complete la información del paciente. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span className="hidden sm:inline">Contacto</span>
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span className="hidden sm:inline">Médica</span>
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">Seguro</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span className="hidden sm:inline">Emergencia</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Información Personal */}
          <TabsContent value="personal" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
                <CardDescription>Datos de identificación del paciente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Identificación */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idType">Tipo de documento *</Label>
                    <Select value={idType} onValueChange={setIdType}>
                      <SelectTrigger id="idType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                        <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                        <SelectItem value="PA">Pasaporte</SelectItem>
                        <SelectItem value="RC">Registro Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="idNumber">Número de documento *</Label>
                    <Input
                      id="idNumber"
                      placeholder="Ej: 1234567890"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* Nombres */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Primer nombre *</Label>
                    <Input
                      id="firstName"
                      placeholder="Ej: María"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondName">Segundo nombre</Label>
                    <Input
                      id="secondName"
                      placeholder="Ej: Elena"
                      value={secondName}
                      onChange={(e) => setSecondName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Apellidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstLastName">Primer apellido *</Label>
                    <Input
                      id="firstLastName"
                      placeholder="Ej: González"
                      value={firstLastName}
                      onChange={(e) => setFirstLastName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondLastName">Segundo apellido</Label>
                    <Input
                      id="secondLastName"
                      placeholder="Ej: Rodríguez"
                      value={secondLastName}
                      onChange={(e) => setSecondLastName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Fecha de nacimiento, género y grupo sanguíneo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de nacimiento *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                    {birthDate && (
                      <p className="text-xs text-muted-foreground">
                        Edad: {calculateAge(birthDate)} años
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Género *</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Tipo de sangre</Label>
                    <Select value={bloodType} onValueChange={setBloodType}>
                      <SelectTrigger id="bloodType">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Ocupación */}
                <div className="space-y-2">
                  <Label htmlFor="occupation">Ocupación</Label>
                  <Input
                    id="occupation"
                    placeholder="Ej: Contador, Ingeniero, Estudiante"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
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
                <CardDescription>Datos para comunicación con el paciente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      placeholder="Ej: +57 310 456-7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <EmailInput
                    id="email"
                    label="Correo electrónico"
                    value={email}
                    onChange={setEmail}
                    placeholder="Ej: paciente@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección de residencia</Label>
                  <Input
                    id="address"
                    placeholder="Ej: Calle 45 #23-67, Apto 301"
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
                        <SelectItem value="Venezuela">Venezuela</SelectItem>
                        <SelectItem value="Ecuador">Ecuador</SelectItem>
                        <SelectItem value="España">España</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
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
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setCurrentTab("medical")}>
                  Siguiente: Información médica
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Información Médica */}
          <TabsContent value="medical" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Información médica</CardTitle>
                <CardDescription>Datos clínicos y antecedentes del paciente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Peso y altura */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Ej: 70.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (m)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      placeholder="Ej: 1.75"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>IMC</Label>
                    <div className="h-10 flex items-center px-3 border rounded-md bg-muted">
                      <span className="text-sm">
                        {calculateBMI() || "---"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alergias */}
                <div className="space-y-2">
                  <Label>Alergias conocidas</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: Penicilina"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
                    />
                    <Button type="button" size="sm" onClick={handleAddAllergy}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {allergies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {allergies.map((allergy, index) => (
                        <Badge
                          key={index}
                          variant="destructive"
                          className="flex items-center gap-1"
                        >
                          {allergy}
                          <button
                            type="button"
                            onClick={() => handleRemoveAllergy(index)}
                            className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Condiciones crónicas */}
                <div className="space-y-2">
                  <Label>Condiciones crónicas</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: Hipertensión arterial"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCondition())}
                    />
                    <Button type="button" size="sm" onClick={handleAddCondition}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {chronicConditions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {chronicConditions.map((condition, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="flex items-center gap-1 bg-orange-100 text-orange-800 border-orange-300"
                        >
                          {condition}
                          <button
                            type="button"
                            onClick={() => handleRemoveCondition(index)}
                            className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Medicación actual */}
                <div className="space-y-2">
                  <Label>Medicación actual</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: Losartán 50mg - 1 vez al día"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMedication())}
                    />
                    <Button type="button" size="sm" onClick={handleAddMedication}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {currentMedications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentMedications.map((medication, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-300"
                        >
                          {medication}
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(index)}
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notas clínicas */}
                <div className="space-y-2">
                  <Label htmlFor="clinicalNotes">Notas clínicas adicionales</Label>
                  <Textarea
                    id="clinicalNotes"
                    placeholder="Información médica relevante, antecedentes familiares, observaciones..."
                    rows={4}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentTab("contact")}>
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setCurrentTab("insurance")}>
                  Siguiente: Seguro médico
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: Seguro Médico */}
          <TabsContent value="insurance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Información del seguro médico</CardTitle>
                <CardDescription>Datos de la aseguradora o EPS del paciente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">EPS / Aseguradora</Label>
                  <Select value={insuranceProvider} onValueChange={setInsuranceProvider}>
                    <SelectTrigger id="insuranceProvider">
                      <SelectValue placeholder="Seleccione la EPS o aseguradora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sanitas EPS">Sanitas EPS</SelectItem>
                      <SelectItem value="Sura EPS">Sura EPS</SelectItem>
                      <SelectItem value="Compensar">Compensar</SelectItem>
                      <SelectItem value="Nueva EPS">Nueva EPS</SelectItem>
                      <SelectItem value="Salud Total">Salud Total</SelectItem>
                      <SelectItem value="Famisanar">Famisanar</SelectItem>
                      <SelectItem value="Coomeva">Coomeva</SelectItem>
                      <SelectItem value="Aliansalud">Aliansalud</SelectItem>
                      <SelectItem value="Cafesalud">Cafesalud</SelectItem>
                      <SelectItem value="Particular">Particular (sin seguro)</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceNumber">Número de afiliación</Label>
                    <Input
                      id="insuranceNumber"
                      placeholder="Ej: SAN-2024-789456"
                      value={insuranceNumber}
                      onChange={(e) => setInsuranceNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insuranceType">Tipo de régimen</Label>
                    <Select value={insuranceType} onValueChange={setInsuranceType}>
                      <SelectTrigger id="insuranceType">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Contributivo">Contributivo</SelectItem>
                        <SelectItem value="Subsidiado">Subsidiado</SelectItem>
                        <SelectItem value="Particular">Particular</SelectItem>
                        <SelectItem value="Especial">Régimen Especial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentTab("medical")}>
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setCurrentTab("emergency")}>
                  Siguiente: Contacto de emergencia
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 5: Contacto de Emergencia */}
          <TabsContent value="emergency" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contacto de emergencia</CardTitle>
                <CardDescription>
                  Información de la persona a contactar en caso de emergencia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Nombre completo</Label>
                  <Input
                    id="emergencyName"
                    placeholder="Ej: Carlos González Pérez"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Parentesco / Relación</Label>
                    <Select
                      value={emergencyRelationship}
                      onValueChange={setEmergencyRelationship}
                    >
                      <SelectTrigger id="emergencyRelationship">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Padre">Padre</SelectItem>
                        <SelectItem value="Madre">Madre</SelectItem>
                        <SelectItem value="Hermano">Hermano/a</SelectItem>
                        <SelectItem value="Esposo">Esposo/a</SelectItem>
                        <SelectItem value="Hijo">Hijo/a</SelectItem>
                        <SelectItem value="Tío">Tío/a</SelectItem>
                        <SelectItem value="Abuelo">Abuelo/a</SelectItem>
                        <SelectItem value="Primo">Primo/a</SelectItem>
                        <SelectItem value="Amigo">Amigo/a</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Teléfono</Label>
                    <Input
                      id="emergencyPhone"
                      placeholder="Ej: +57 311 123-4567"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-900">
                        Información importante
                      </p>
                      <p className="text-xs text-blue-700">
                        Este contacto será notificado únicamente en situaciones de emergencia médica
                        que requieran autorización o presencia familiar.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentTab("insurance")}>
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Registrar paciente
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
