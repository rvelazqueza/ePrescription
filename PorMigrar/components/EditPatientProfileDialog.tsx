import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { EmailInput } from "./EmailInput";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  Heart, 
  Pill, 
  FileText,
  Plus,
  X,
  Save,
  UserCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PatientData {
  id: string;
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

interface EditPatientProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientData;
  onSave: (updatedPatient: PatientData) => void;
}

export function EditPatientProfileDialog({ 
  open, 
  onOpenChange, 
  patient,
  onSave 
}: EditPatientProfileDialogProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState<PatientData>(patient);
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calcular IMC automáticamente cuando cambian peso o altura
  const calculateBMI = (weight: string, height: string) => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    if (weightNum > 0 && heightNum > 0) {
      const bmi = weightNum / (heightNum * heightNum);
      return bmi.toFixed(2);
    }
    return "";
  };

  const handleInputChange = (field: keyof PatientData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalcular IMC si cambia peso o altura
      if (field === "weight" || field === "height") {
        updated.bmi = calculateBMI(updated.weight, updated.height);
      }
      
      return updated;
    });
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleEmergencyContactChange = (field: keyof PatientData['emergencyContact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy("");
      toast.success('Alergia agregada');
    }
  };

  const handleRemoveAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
    toast.info('Alergia eliminada');
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, newCondition.trim()]
      }));
      setNewCondition("");
      toast.success('Condición agregada');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter((_, i) => i !== index)
    }));
    toast.info('Condición eliminada');
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setFormData(prev => ({
        ...prev,
        currentMedications: [...prev.currentMedications, newMedication.trim()]
      }));
      setNewMedication("");
      toast.success('Medicación agregada');
    }
  };

  const handleRemoveMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.filter((_, i) => i !== index)
    }));
    toast.info('Medicación eliminada');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validaciones básicas
    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es requerido";
    if (!formData.lastName.trim()) newErrors.lastName = "Los apellidos son requeridos";
    if (!formData.idNumber.trim()) newErrors.idNumber = "La identificación es requerida";
    if (!formData.birthDate.trim()) newErrors.birthDate = "La fecha de nacimiento es requerida";
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    
    // Validación de teléfono (básica)
    if (formData.phone && formData.phone.length < 7) {
      newErrors.phone = "Teléfono inválido";
    }

    // Validación de peso y altura
    if (formData.weight && (parseFloat(formData.weight) <= 0 || parseFloat(formData.weight) > 500)) {
      newErrors.weight = "Peso inválido (1-500 kg)";
    }
    if (formData.height && (parseFloat(formData.height) <= 0 || parseFloat(formData.height) > 3)) {
      newErrors.height = "Altura inválida (0.1-3 m)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Por favor corrija los errores en el formulario', {
        description: 'Revise los campos marcados en rojo',
        duration: 4000
      });
      return;
    }

    onSave(formData);
    toast.success('Perfil actualizado correctamente', {
      description: `Datos de ${formData.firstName} ${formData.lastName} guardados`,
      duration: 3000
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData(patient); // Restaurar datos originales
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-600" />
            Editar perfil del paciente
          </DialogTitle>
          <p className="text-sm text-gray-600">
            ID: {patient.id} • Actualice la información médica y personal del paciente
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">
              <User className="w-4 h-4 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Phone className="w-4 h-4 mr-2" />
              Contacto
            </TabsTrigger>
            <TabsTrigger value="medical">
              <Activity className="w-4 h-4 mr-2" />
              Médico
            </TabsTrigger>
            <TabsTrigger value="conditions">
              <Heart className="w-4 h-4 mr-2" />
              Condiciones
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="w-4 h-4 mr-2" />
              Notas
            </TabsTrigger>
          </TabsList>

          {/* Tab: Datos Personales */}
          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Nombres <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                  placeholder="Nombres del paciente"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Apellidos <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                  placeholder="Apellidos del paciente"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="idType">Tipo de identificación</Label>
                <Select value={formData.idType} onValueChange={(v) => handleInputChange("idType", v)}>
                  <SelectTrigger id="idType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                    <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                    <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                    <SelectItem value="PA">Pasaporte</SelectItem>
                    <SelectItem value="RC">Registro Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">
                  Número de identificación <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  className={errors.idNumber ? "border-red-500" : ""}
                  placeholder="Número de documento"
                />
                {errors.idNumber && (
                  <p className="text-xs text-red-600">{errors.idNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">
                  Fecha de nacimiento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  className={errors.birthDate ? "border-red-500" : ""}
                  placeholder="DD/MM/YYYY"
                />
                {errors.birthDate && (
                  <p className="text-xs text-red-600">{errors.birthDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Sexo</Label>
                <Select value={formData.gender} onValueChange={(v: "M" | "F") => handleInputChange("gender", v)}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Tipo de sangre</Label>
                <Select value={formData.bloodType} onValueChange={(v) => handleInputChange("bloodType", v)}>
                  <SelectTrigger id="bloodType">
                    <SelectValue />
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

              <div className="space-y-2">
                <Label htmlFor="occupation">Ocupación</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="Ej: Docente, Ingeniero, etc."
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab: Contacto */}
          <TabsContent value="contact" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Información de contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                      placeholder="+57 310 456-7890"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <EmailInput
                    id="email"
                    label="Email"
                    value={formData.email}
                    onChange={(value) => handleInputChange("email", value)}
                    placeholder="paciente@email.com"
                  />

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Calle 45 #23-67, Apto 301"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Bogotá"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      placeholder="Colombia"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Seguro médico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Proveedor de seguro</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                      placeholder="Sanitas EPS"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insuranceNumber">Número de póliza</Label>
                    <Input
                      id="insuranceNumber"
                      value={formData.insuranceNumber}
                      onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
                      placeholder="SAN-2024-789456"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Contacto de emergencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Nombre completo</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                      placeholder="Nombre del contacto"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relación</Label>
                    <Input
                      id="emergencyRelationship"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                      placeholder="Esposo, Madre, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Teléfono</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                      placeholder="+57 310 123-4567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Datos Médicos */}
          <TabsContent value="medical" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Datos antropométricos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      className={errors.weight ? "border-red-500" : ""}
                      placeholder="68"
                    />
                    {errors.weight && (
                      <p className="text-xs text-red-600">{errors.weight}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (m)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      className={errors.height ? "border-red-500" : ""}
                      placeholder="1.65"
                    />
                    {errors.height && (
                      <p className="text-xs text-red-600">{errors.height}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>IMC (calculado)</Label>
                    <div className="h-10 px-3 py-2 bg-gray-50 rounded-md border flex items-center">
                      <span className="font-medium">{formData.bmi || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  Medicación actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Ej: Enalapril 10mg - 1 vez al día - Mañana"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMedication()}
                  />
                  <Button onClick={handleAddMedication} type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.currentMedications.map((medication, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{medication}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMedication(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.currentMedications.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay medicación registrada
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Condiciones */}
          <TabsContent value="conditions" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Alergias conocidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Ej: Penicilina"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                  />
                  <Button onClick={handleAddAllergy} type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-red-900">{allergy}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAllergy(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.allergies.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay alergias registradas
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-orange-600" />
                  Condiciones crónicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Ej: Hipertensión arterial"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                  />
                  <Button onClick={handleAddCondition} type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.chronicConditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">{condition}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCondition(index)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.chronicConditions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay condiciones crónicas registradas
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Notas */}
          <TabsContent value="notes" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notas clínicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.clinicalNotes}
                  onChange={(e) => handleInputChange("clinicalNotes", e.target.value)}
                  placeholder="Ingrese observaciones clínicas, antecedentes relevantes, indicaciones especiales, seguimiento requerido, etc."
                  rows={12}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Incluya información relevante para la atención médica del paciente
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}