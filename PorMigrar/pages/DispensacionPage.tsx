import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { QrCode, XCircle, Pill, Package, Plus, Clock, Save, X, FileCheck, AlertTriangle, Scan, Search, CheckCircle2, ShieldCheck, Key, Camera, Hash, FileText, Filter, FilterX, Eye, MessageSquare, ShieldAlert, User, BarChart3, TrendingUp, Calendar, Download, Info, Printer, Copy, FileJson, Sheet } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { MedicineTable, Medicine } from "../components/MedicineTable";
import { MedicinePanel } from "../components/MedicinePanel";
import { DispensationTable, PrescribedMedicine, DispensationRecord } from "../components/DispensationTable";
import { DispensationPanel } from "../components/DispensationPanel";
import { PrescriptionSelector, PrescriptionForSelection } from "../components/PrescriptionSelector";
import { PrescriptionHeader } from "../components/PrescriptionHeader";
import { 
  generateDispensationPDF,
  printDispensation,
  downloadDispensationPDF,
  downloadDispensationJSON,
  downloadDispensationCSV,
  copyDispensationToClipboard,
  type DispensationExportData
} from "../utils/dispensationExportUtils";
import { normalizedIncludes } from "../utils/searchUtils";
import { PageBanner } from "../components/PageBanner";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { VerificationResultPanel } from "../components/VerificationResultPanel";
import { RejectionDetailPanel } from "../components/RejectionDetailPanel";
import { toast } from "sonner@2.0.3";

// Datos mock de recetas para verificación
const mockPrescriptionsForVerification = [
  {
    prescriptionNumber: "RX-2025-009847",
    qrCode: "QR-9847-A3F2",
    token: "VRF-2025-9847-X8K4",
    patientName: "María Elena González Rodríguez",
    patientId: "CC-52.841.963",
    emittedDate: "27/09/2025",
    emittedTime: "10:32 a.m.",
    validUntil: "11/10/2025",
    medicinesCount: 3,
    dispensationStatus: "emitted" as const,
    age: 45,
    gender: "F" as const,
    doctorName: "Dr. Carlos Alberto Mendoza Herrera",
    verificationStatus: "valid" as const
  },
  {
    prescriptionNumber: "RX-2025-009846",
    qrCode: "QR-9846-B7H9",
    token: "VRF-2025-9846-M2P5",
    patientName: "Juan Carlos Martínez López",
    patientId: "CC-41.523.789",
    emittedDate: "20/09/2025",
    emittedTime: "02:15 p.m.",
    validUntil: "04/10/2025",
    medicinesCount: 2,
    dispensationStatus: "emitted" as const,
    age: 52,
    gender: "M" as const,
    doctorName: "Dr. Carlos Alberto Mendoza Herrera",
    verificationStatus: "expired" as const
  },
  {
    prescriptionNumber: "RX-2025-009845",
    qrCode: "QR-9845-C4J1",
    token: "VRF-2025-9845-N7R3",
    patientName: "Ana Patricia Ruiz Sánchez",
    patientId: "CC-39.654.321",
    emittedDate: "25/09/2025",
    emittedTime: "11:20 a.m.",
    validUntil: "09/10/2025",
    medicinesCount: 4,
    dispensationStatus: "fully_dispensed" as const,
    age: 33,
    gender: "F" as const,
    doctorName: "Dr. Carlos Alberto Mendoza Herrera",
    verificationStatus: "already_dispensed" as const
  },
  {
    prescriptionNumber: "RX-2025-009844",
    qrCode: "QR-9844-D8K6",
    token: "VRF-2025-9844-Q1W9",
    patientName: "Roberto Antonio Silva Gómez",
    patientId: "CC-45.789.123",
    emittedDate: "28/09/2025",
    emittedTime: "09:00 a.m.",
    validUntil: "12/10/2025",
    medicinesCount: 1,
    dispensationStatus: "cancelled" as const,
    age: 28,
    gender: "M" as const,
    doctorName: "Dr. Carlos Alberto Mendoza Herrera",
    verificationStatus: "cancelled" as const
  }
];

export function VerificarRecetaPage() {
  const [verificationMethod, setVerificationMethod] = useState<"qr" | "token">("qr");
  const [qrInput, setQrInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [recentVerifications, setRecentVerifications] = useState<any[]>([]);

  // Simulación de escaneo QR
  const handleStartQRScan = () => {
    setIsScanning(true);
    toast.info('Cámara activada', {
      description: 'Enfoca el código QR de la receta...',
      duration: 2000,
    });

    // Simular escaneo después de 2 segundos
    setTimeout(() => {
      setIsScanning(false);
      const mockQR = "QR-9847-A3F2";
      setQrInput(mockQR);
      handleVerifyByQR(mockQR);
    }, 2000);
  };

  // Verificación por QR
  const handleVerifyByQR = (qrCode?: string) => {
    const codeToVerify = qrCode || qrInput;
    
    if (!codeToVerify.trim()) {
      toast.error('Por favor ingresa o escanea un código QR');
      return;
    }

    // Buscar receta por QR
    const prescription = mockPrescriptionsForVerification.find(
      p => p.qrCode.toLowerCase() === codeToVerify.toLowerCase()
    );

    if (prescription) {
      setVerificationResult(prescription);
      setIsResultOpen(true);
      addToRecentVerifications(prescription);
      
      toast.success('Receta verificada', {
        description: `${prescription.prescriptionNumber} - ${prescription.verificationStatus === 'valid' ? 'Válida' : 'No válida'}`,
        duration: 3000,
      });
    } else {
      const invalidResult = {
        prescriptionNumber: "Desconocido",
        qrCode: codeToVerify,
        patientName: "No identificado",
        patientId: "---",
        emittedDate: "---",
        emittedTime: "---",
        validUntil: "---",
        medicinesCount: 0,
        age: 0,
        gender: "M",
        doctorName: "---",
        verificationStatus: "invalid" as const
      };
      
      setVerificationResult(invalidResult);
      setIsResultOpen(true);
      
      toast.error('Código QR no válido', {
        description: 'No se encontró ninguna receta con este código',
        duration: 3000,
      });
    }
  };

  // Verificación por Token
  const handleVerifyByToken = () => {
    if (!tokenInput.trim()) {
      toast.error('Por favor ingresa un token de verificación');
      return;
    }

    // Buscar receta por token
    const prescription = mockPrescriptionsForVerification.find(
      p => p.token.toLowerCase() === tokenInput.toLowerCase()
    );

    if (prescription) {
      setVerificationResult(prescription);
      setIsResultOpen(true);
      addToRecentVerifications(prescription);
      
      toast.success('Receta verificada', {
        description: `${prescription.prescriptionNumber} - ${prescription.verificationStatus === 'valid' ? 'Válida' : 'No válida'}`,
        duration: 3000,
      });
    } else {
      const invalidResult = {
        prescriptionNumber: "Desconocido",
        token: tokenInput,
        patientName: "No identificado",
        patientId: "---",
        emittedDate: "---",
        emittedTime: "---",
        validUntil: "---",
        medicinesCount: 0,
        age: 0,
        gender: "M",
        doctorName: "---",
        verificationStatus: "invalid" as const
      };
      
      setVerificationResult(invalidResult);
      setIsResultOpen(true);
      
      toast.error('Token no válido', {
        description: 'No se encontró ninguna receta con este token',
        duration: 3000,
      });
    }
  };

  // Agregar a verificaciones recientes
  const addToRecentVerifications = (prescription: any) => {
    const verification = {
      ...prescription,
      verifiedAt: new Date().toLocaleString('es-ES'),
    };
    
    setRecentVerifications(prev => {
      const filtered = prev.filter(v => v.prescriptionNumber !== prescription.prescriptionNumber);
      return [verification, ...filtered].slice(0, 5);
    });
  };

  // Ver resultado de verificación reciente
  const handleViewRecentVerification = (verification: any) => {
    setVerificationResult(verification);
    setIsResultOpen(true);
  };

  const handleProceedToDispensation = (prescriptionNumber: string) => {
    toast.success('Redirigiendo a dispensación', {
      description: `Preparando dispensación para ${prescriptionNumber}`,
      duration: 2000,
    });
  };

  const handlePrint = (prescriptionNumber: string) => {
    toast.success('Imprimiendo receta', {
      description: `Preparando impresión de ${prescriptionNumber}`,
      duration: 2000,
    });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      valid: { label: "Válida", className: "bg-green-100 text-green-700 border-green-300" },
      expired: { label: "Vencida", className: "bg-red-100 text-red-700 border-red-300" },
      cancelled: { label: "Anulada", className: "bg-red-100 text-red-700 border-red-300" },
      already_dispensed: { label: "Ya dispensada", className: "bg-orange-100 text-orange-700 border-orange-300" },
      invalid: { label: "No válida", className: "bg-red-100 text-red-700 border-red-300" }
    };
    return config[status] || config.invalid;
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white">Verificar Receta</h1>
                  <p className="text-emerald-100 text-sm">
                    Validación de autenticidad mediante QR o Token
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-emerald-100 text-xs mb-1">Verificaciones hoy</p>
                <p className="text-white font-semibold text-3xl">{recentVerifications.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner informativo de seguridad */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-emerald-900 mb-2">Sistema de verificación segura</h4>
              <div className="text-sm text-emerald-800 space-y-2">
                <p>
                  Antes de dispensar medicamentos, verifica la autenticidad de la receta para garantizar la seguridad del paciente y el cumplimiento normativo.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Validación de firma digital del médico prescriptor</li>
                  <li>Verificación de vigencia y estado de la receta</li>
                  <li>Detección de recetas duplicadas o anuladas</li>
                  <li>Trazabilidad completa del proceso de dispensación</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métodos de verificación */}
      <Tabs value={verificationMethod} onValueChange={(v) => setVerificationMethod(v as "qr" | "token")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qr">
            <QrCode className="w-4 h-4 mr-2" />
            Escanear QR
          </TabsTrigger>
          <TabsTrigger value="token">
            <Key className="w-4 h-4 mr-2" />
            Buscar por Token
          </TabsTrigger>
        </TabsList>

        {/* Verificación por QR */}
        <TabsContent value="qr">
          <Card>
            <CardHeader>
              <CardTitle>Verificación por Código QR</CardTitle>
              <p className="text-sm text-gray-600">
                Escanea el código QR impreso en la receta física o ingresa el código manualmente
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Escáner QR */}
              <div className="p-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-dashed border-emerald-300">
                <div className="text-center">
                  {isScanning ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-lg flex items-center justify-center animate-pulse">
                        <Camera className="w-12 h-12 text-emerald-600" />
                      </div>
                      <p className="font-medium text-emerald-900">Cámara activada</p>
                      <p className="text-sm text-emerald-700">Enfoca el código QR de la receta...</p>
                      <Button 
                        onClick={() => setIsScanning(false)}
                        variant="outline"
                        className="mt-4"
                      >
                        Cancelar escaneo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Scan className="w-12 h-12 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-900 mb-1">Escanear código QR</p>
                        <p className="text-sm text-emerald-700">
                          Activa la cámara para escanear el código QR de la receta
                        </p>
                      </div>
                      <Button 
                        onClick={handleStartQRScan}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        size="lg"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Activar cámara
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Input manual de QR */}
              <div className="space-y-3">
                <label className="text-sm font-medium">O ingresa el código QR manualmente</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Ejemplo: QR-9847-A3F2"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyByQR()}
                      className="pl-11 h-12"
                    />
                  </div>
                  <Button 
                    onClick={() => handleVerifyByQR()}
                    className="bg-emerald-600 hover:bg-emerald-700 px-8"
                    size="lg"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verificar
                  </Button>
                </div>
                <p className="text-xs text-gray-600">
                  💡 El código QR está impreso en la esquina superior derecha de la receta
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verificación por Token */}
        <TabsContent value="token">
          <Card>
            <CardHeader>
              <CardTitle>Verificación por Token</CardTitle>
              <p className="text-sm text-gray-600">
                Ingresa el token de verificación único de la receta
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input de token */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Token de verificación</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Ejemplo: VRF-2025-9847-X8K4"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyByToken()}
                      className="pl-11 h-12 font-mono"
                    />
                  </div>
                  <Button 
                    onClick={handleVerifyByToken}
                    className="bg-emerald-600 hover:bg-emerald-700 px-8"
                    size="lg"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verificar
                  </Button>
                </div>
              </div>

              {/* Información sobre tokens */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Key className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">¿Dónde encontrar el token?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• El token está impreso en la parte inferior de la receta</li>
                      <li>• También puede ser proporcionado verbalmente por el paciente</li>
                      <li>• Formato: VRF-AAAA-NNNN-XXXX (año-número-código)</li>
                      <li>• Cada token es único y de un solo uso</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ejemplos de tokens */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Tokens de ejemplo para prueba:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mockPrescriptionsForVerification.map((rx) => (
                    <button
                      key={rx.token}
                      onClick={() => {
                        setTokenInput(rx.token);
                        handleVerifyByToken();
                      }}
                      className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                    >
                      <p className="font-mono text-sm font-medium text-gray-900">{rx.token}</p>
                      <p className="text-xs text-gray-600 mt-1">{rx.prescriptionNumber}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Verificaciones recientes */}
      {recentVerifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Verificaciones Recientes</CardTitle>
            <p className="text-sm text-gray-600">
              Últimas verificaciones realizadas en esta sesión
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentVerifications.map((verification, index) => {
                const statusBadge = getStatusBadge(verification.verificationStatus);
                return (
                  <button
                    key={`${verification.prescriptionNumber}-${index}`}
                    onClick={() => handleViewRecentVerification(verification)}
                    className="w-full p-4 text-left bg-gradient-to-r from-gray-50 to-white hover:from-emerald-50 hover:to-white rounded-lg border border-gray-200 hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium text-gray-900">{verification.prescriptionNumber}</span>
                        </div>
                        <p className="text-sm text-gray-600">{verification.patientName}</p>
                        <p className="text-xs text-gray-500 mt-1">Verificado: {verification.verifiedAt}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                        {verification.verificationStatus === 'valid' && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de seguridad */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Importante - Protocolo de verificación</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Siempre verifica la identidad del paciente antes de dispensar</li>
                <li>✓ Confirma que los datos de la receta coinciden con el documento del paciente</li>
                <li>✓ En caso de duda, contacta al médico prescriptor</li>
                <li>✓ No dispensar medicamentos controlados sin verificación exitosa</li>
                <li>✓ Registra cualquier anomalía en el sistema de auditoría</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de resultados */}
      <VerificationResultPanel
        result={verificationResult}
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        onProceedToDispensation={handleProceedToDispensation}
        onPrint={handlePrint}
      />
    </div>
  );
}

// Datos mock para la demostración de dispensación
const mockDispensationData = {
  prescriptionNumber: "RX-2025-009847",
  patientId: "CC-52.841.963",
  patientName: "María Elena",
  patientFirstLastName: "González",
  patientSecondLastName: "Rodríguez",
  patientGender: "Femenino",
  patientAge: 45,
  doctorName: "Dr. Carlos Alberto Mendoza Herrera",
  doctorCode: "RM-12345-COL",
  issueDate: "27/09/2025",
  issueTime: "10:32 a.m.",
  status: "draft" as const
};

const mockPrescribedMedicines: PrescribedMedicine[] = [
  {
    id: "1",
    name: "Ibuprofeno",
    prescribedQuantity: "15 tabletas",
    dose: "400 mg",
    frequency: "3 veces al día",
    administration: "Oral",
    duration: "5 días",
    observations: "Tomar con alimentos"
  },
  {
    id: "2",
    name: "Amoxicilina",
    prescribedQuantity: "14 cápsulas",
    dose: "500 mg",
    frequency: "2 veces al día",
    administration: "Oral",
    duration: "7 días",
    observations: "Completar tratamiento completo"
  },
  {
    id: "3",
    name: "Omeprazol",
    prescribedQuantity: "14 tabletas",
    dose: "20 mg",
    frequency: "1 vez al día",
    administration: "Oral",
    duration: "14 días",
    observations: "Tomar 30 minutos antes del desayuno"
  }
];

// Motivos de rechazo simplificados para el componente
const rejectionReasons = [
  { value: "stock_out", label: "Medicamento fuera de stock" },
  { value: "discontinued", label: "Medicamento descontinuado" },
  { value: "unavailable_presentation", label: "Presentación no disponible" },
  { value: "quarantine", label: "Lote en cuarentena" },
  { value: "patient_rejection", label: "Paciente rechaza el medicamento" },
  { value: "requires_refrigeration", label: "Requiere refrigeración no disponible" },
  { value: "other", label: "Otro motivo (especificar en observaciones)" }
];

export function RegistrarDispensacionPage() {
  // Estado del flujo de dispensación
  const [currentStep, setCurrentStep] = useState<"select" | "dispense">("select");
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);
  
  // Estados para dispensación
  const [prescribedMedicines] = useState<PrescribedMedicine[]>(mockPrescribedMedicines);
  const [dispensationRecords, setDispensationRecords] = useState<Record<string, DispensationRecord>>({});
  const [selectedMedicine, setSelectedMedicine] = useState<PrescribedMedicine | null>(null);
  const [currentRecord, setCurrentRecord] = useState<DispensationRecord | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Manejar selección de receta
  const handleSelectPrescription = (prescription: any) => {
    setSelectedPrescription(prescription);
    setCurrentStep("dispense");
    toast.success("Receta seleccionada", {
      description: `${prescription.prescriptionNumber} - ${prescription.patientName}`,
      duration: 3000
    });
  };

  // Volver a selección de recetas
  const handleBackToSelection = () => {
    setCurrentStep("select");
    setSelectedPrescription(null);
    setDispensationRecords({});
  };

  const handleMedicineDoubleClick = (medicine: PrescribedMedicine, record: DispensationRecord) => {
    setSelectedMedicine(medicine);
    setCurrentRecord(record);
    setIsPanelOpen(true);
  };

  const handleSaveDispensation = (medicineId: string, record: DispensationRecord) => {
    setDispensationRecords(prev => ({
      ...prev,
      [medicineId]: record
    }));
  };

  const handleCompleteDispensation = () => {
    // Validar que todos los medicamentos tengan registro
    const allRecorded = prescribedMedicines.every(med => 
      dispensationRecords[med.id] && dispensationRecords[med.id].status !== "pending"
    );

    if (!allRecorded) {
      toast.error("Dispensación incompleta", {
        description: "Debe registrar el estado de todos los medicamentos prescritos antes de completar"
      });
      return;
    }

    // Confirmar dispensación
    toast.success("Dispensación completada exitosamente", {
      description: `Se registró la dispensación de ${prescribedMedicines.length} medicamento(s)`,
      duration: 4000
    });
  };

  // Preparar datos para exportación
  const prepareExportData = (): DispensationExportData => {
    if (!selectedPrescription) {
      throw new Error("No hay receta seleccionada");
    }

    return {
      // Información de la receta
      prescriptionNumber: selectedPrescription.prescriptionNumber,
      prescriptionDate: selectedPrescription.emittedDate,
      prescriptionTime: selectedPrescription.emittedTime,
      validUntil: selectedPrescription.validUntil,
      
      // Información del paciente
      patientName: selectedPrescription.patientName,
      patientId: selectedPrescription.patientId,
      patientAge: selectedPrescription.age,
      patientGender: selectedPrescription.gender === 'M' ? 'Masculino' : 'Femenino',
      
      // Información del médico
      doctorName: selectedPrescription.doctorName,
      doctorCode: "RM-12345-COL", // Mock - debería venir de los datos
      specialty: "Medicina General",
      
      // Información de la farmacia (mock - debería venir de configuración)
      pharmacyName: "Farmacia Central Hospital San José",
      pharmacyAddress: "Av. Principal #123, San José, Costa Rica",
      pharmacistName: "Farm. Ana María Castillo",
      pharmacistLicense: "LIC-FARM-5678",
      
      // Información de la dispensación
      dispensationDate: new Date().toLocaleDateString("es-ES"),
      dispensationTime: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      dispensationNumber: `DISP-${Date.now()}`,
      
      // Medicamentos dispensados
      medicines: prescribedMedicines.map(med => ({
        name: med.name,
        prescribedQuantity: med.prescribedQuantity,
        dispensedQuantity: dispensationRecords[med.id]?.dispensedQuantity || 0,
        dispensedQuantityUnit: dispensationRecords[med.id]?.dispensedQuantityUnit || '',
        dose: med.dose,
        frequency: med.frequency,
        administration: med.administration,
        duration: med.duration,
        status: dispensationRecords[med.id]?.status || "pending",
        batchNumber: dispensationRecords[med.id]?.batchNumber,
        expirationDate: dispensationRecords[med.id]?.expirationDate,
        dispensationNotes: dispensationRecords[med.id]?.dispensationNotes,
        rejectionReason: dispensationRecords[med.id]?.rejectionReason
      })),
      
      // QR y verificación
      qrCode: selectedPrescription.qrCode,
      verificationToken: selectedPrescription.token
    };
  };

  // Handlers de exportación e impresión
  const handlePrint = () => {
    try {
      const exportData = prepareExportData();
      printDispensation(exportData);
      toast.success("Abriendo vista de impresión", {
        description: "Se abrirá una nueva ventana con el comprobante"
      });
    } catch (error) {
      toast.error("Error al imprimir", {
        description: "No se pudo generar el comprobante de dispensación"
      });
    }
  };

  const handleDownloadPDF = () => {
    try {
      const exportData = prepareExportData();
      downloadDispensationPDF(exportData);
      toast.success("PDF descargado", {
        description: "El comprobante se guardó en su carpeta de descargas"
      });
    } catch (error) {
      toast.error("Error al descargar PDF", {
        description: "No se pudo generar el archivo"
      });
    }
  };

  const handleDownloadJSON = () => {
    try {
      const exportData = prepareExportData();
      downloadDispensationJSON(exportData);
      toast.success("JSON descargado", {
        description: "Datos exportados en formato JSON"
      });
    } catch (error) {
      toast.error("Error al exportar JSON");
    }
  };

  const handleDownloadCSV = () => {
    try {
      const exportData = prepareExportData();
      downloadDispensationCSV(exportData);
      toast.success("CSV descargado", {
        description: "Datos exportados en formato CSV"
      });
    } catch (error) {
      toast.error("Error al exportar CSV");
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const exportData = prepareExportData();
      await copyDispensationToClipboard(exportData);
      toast.success("Copiado al portapapeles", {
        description: "Resumen de dispensación copiado"
      });
    } catch (error) {
      toast.error("Error al copiar", {
        description: "No se pudo copiar al portapapeles"
      });
    }
  };

  const handleSaveDraft = () => {
    toast.info("Borrador guardado", {
      description: "Puede continuar con la dispensación más tarde"
    });
  };

  // Calcular estadísticas de dispensación
  const getDispensationStats = () => {
    const total = prescribedMedicines.length;
    const dispensed = Object.values(dispensationRecords).filter(r => r.status === "fully_dispensed").length;
    const partial = Object.values(dispensationRecords).filter(r => r.status === "partially_dispensed").length;
    const notAvailable = Object.values(dispensationRecords).filter(r => r.status === "not_available").length;
    const rejected = Object.values(dispensationRecords).filter(r => r.status === "rejected").length;
    const pending = total - (dispensed + partial + notAvailable + rejected);

    return { total, dispensed, partial, notAvailable, rejected, pending };
  };

  const stats = getDispensationStats();

  // Calcular el estado dinámico
  const calculateStatus = () => {
    if (stats.pending === 0 && stats.total > 0) return "completed";
    return "draft";
  };

  const dynamicData = {
    ...mockDispensationData,
    status: calculateStatus() as "draft" | "completed"
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Banner de encabezado */}
      <PageBanner
        icon={Package}
        title="Registrar Dispensación"
        description="Dispensación de medicamentos prescritos con verificación farmacéutica"
        gradient="from-green-600 via-emerald-500 to-teal-600"
      />

      {/* Indicador de paso actual */}
      <Card className="bg-white border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "select" 
                  ? "bg-primary text-white" 
                  : "bg-green-600 text-white"
              }`}>
                {currentStep === "dispense" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>1</span>
                )}
              </div>
              <span className={`font-medium ${
                currentStep === "select" ? "text-primary" : "text-green-600"
              }`}>
                Seleccionar Receta
              </span>
            </div>

            <div className="w-16 h-0.5 bg-gray-300"></div>

            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "dispense" 
                  ? "bg-primary text-white" 
                  : "bg-gray-300 text-gray-600"
              }`}>
                2
              </div>
              <span className={`font-medium ${
                currentStep === "dispense" ? "text-primary" : "text-gray-600"
              }`}>
                Registrar Dispensación
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paso 1: Selector de Recetas */}
      {currentStep === "select" && (
        <PrescriptionSelector
          prescriptions={mockPrescriptionsForVerification}
          onSelectPrescription={handleSelectPrescription}
        />
      )}

      {/* Paso 2: Registrar Dispensación */}
      {currentStep === "dispense" && selectedPrescription && (
        <>
          {/* Header de la receta seleccionada */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-green-900">Receta Seleccionada</h3>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Verificada
                      </Badge>
                    </div>
                    <div className="text-sm text-green-800 space-y-1">
                      <p><strong>{selectedPrescription.prescriptionNumber}</strong> • {selectedPrescription.patientName}</p>
                      <p className="text-xs">{selectedPrescription.medicinesCount} medicamento(s) prescrito(s) por {selectedPrescription.doctorName}</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToSelection}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cambiar Receta
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Header de la dispensación */}
          <PrescriptionHeader prescription={{
            ...mockDispensationData,
            prescriptionNumber: selectedPrescription.prescriptionNumber,
            patientName: selectedPrescription.patientName.split(' ')[0],
            patientFirstLastName: selectedPrescription.patientName.split(' ')[1] || '',
            patientSecondLastName: selectedPrescription.patientName.split(' ')[2] || '',
            patientId: selectedPrescription.patientId,
            patientAge: selectedPrescription.age,
            patientGender: selectedPrescription.gender === 'M' ? 'Masculino' : 'Femenino',
            doctorName: selectedPrescription.doctorName,
            issueDate: selectedPrescription.emittedDate,
            issueTime: selectedPrescription.emittedTime,
            status: calculateStatus() as "draft" | "completed"
          }} />

      {/* Banner informativo de mejores prácticas */}
      <Card className="bg-cyan-50 border-cyan-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-cyan-900 mb-2">Módulo de Dispensación Profesional</h4>
              <div className="text-sm text-cyan-800 space-y-1">
                <p>
                  ✓ Los medicamentos prescritos NO pueden ser modificados - solo el médico puede alterar la prescripción
                </p>
                <p>
                  ✓ Registre la cantidad dispensada, lote y fecha de vencimiento para cada medicamento
                </p>
                <p>
                  ✓ En caso de dispensación parcial o no disponibilidad, documente el motivo claramente
                </p>
                <p>
                  ✓ Doble clic en cualquier medicamento para registrar su dispensación
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de dispensación */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-semibold text-blue-700">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Dispensados</p>
              <p className="text-2xl font-semibold text-green-700">{stats.dispensed}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Parciales</p>
              <p className="text-2xl font-semibold text-yellow-700">{stats.partial}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">No Disponibles</p>
              <p className="text-2xl font-semibold text-red-700">{stats.notAvailable}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Rechazados</p>
              <p className="text-2xl font-semibold text-gray-700">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección principal con tabla de medicamentos prescritos */}
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Pill className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Medicamentos Prescritos</CardTitle>
              <p className="text-sm text-gray-600">
                Doble clic en cualquier fila para registrar dispensación • {prescribedMedicines.length} medicamento{prescribedMedicines.length !== 1 ? 's' : ''} prescrito{prescribedMedicines.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={
              stats.pending === 0 
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }
          >
            <Clock className="w-3 h-3 mr-1" />
            {stats.pending === 0 ? "Completado" : `${stats.pending} pendiente${stats.pending !== 1 ? 's' : ''}`}
          </Badge>
        </CardHeader>
        <CardContent className="p-6">
          <DispensationTable 
            medicines={prescribedMedicines}
            dispensationRecords={dispensationRecords}
            onMedicineDoubleClick={handleMedicineDoubleClick}
          />
        </CardContent>
      </Card>

      {/* Resumen de dispensación registrada */}
      {Object.keys(dispensationRecords).length > 0 && (
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-green-100">
          <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">Resumen de Dispensación Registrada</CardTitle>
                <p className="text-sm text-gray-600">Medicamentos con dispensación documentada</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescribedMedicines
                .filter(med => dispensationRecords[med.id] && dispensationRecords[med.id].status !== "pending")
                .map((medicine) => {
                  const record = dispensationRecords[medicine.id];
                  const statusConfig = 
                    record.status === "fully_dispensed" ? { bg: "from-green-50 to-white", border: "border-green-200", icon: CheckCircle2, iconColor: "text-green-600", label: "Dispensado" } :
                    record.status === "partially_dispensed" ? { bg: "from-yellow-50 to-white", border: "border-yellow-200", icon: AlertTriangle, iconColor: "text-yellow-600", label: "Parcial" } :
                    record.status === "not_available" ? { bg: "from-red-50 to-white", border: "border-red-200", icon: XCircle, iconColor: "text-red-600", label: "No disponible" } :
                    { bg: "from-gray-50 to-white", border: "border-gray-200", icon: XCircle, iconColor: "text-gray-600", label: "Rechazado" };
                  
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div key={`summary-${medicine.id}`} className={`flex items-start gap-3 p-4 bg-gradient-to-br ${statusConfig.bg} rounded-xl border ${statusConfig.border} hover:shadow-md transition-all duration-200`}>
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-current/10">
                        <StatusIcon className={`w-6 h-6 ${statusConfig.iconColor}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-gray-900">{medicine.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Prescrito: {medicine.prescribedQuantity}
                        </p>
                        {(record.status === "fully_dispensed" || record.status === "partially_dispensed") && (
                          <>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              Dispensado: {record.dispensedQuantity} {record.dispensedQuantityUnit}
                            </p>
                            {record.batchNumber && (
                              <p className="text-xs text-gray-600 mt-1">
                                Lote: {record.batchNumber} • Vence: {record.expirationDate}
                              </p>
                            )}
                          </>
                        )}
                        {(record.status === "not_available" || record.status === "rejected") && record.rejectionReason && (
                          <p className="text-xs text-gray-600 mt-1">
                            Motivo: {rejectionReasons.find(r => r.value === record.rejectionReason)?.label || record.rejectionReason}
                          </p>
                        )}
                        {record.dispensationNotes && (
                          <p className="text-xs text-gray-500 mt-2 italic">
                            "{record.dispensationNotes}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones de acción finales */}
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {stats.pending > 0 ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-gray-600">
                      Debe registrar {stats.pending} medicamento{stats.pending !== 1 ? 's' : ''} pendiente{stats.pending !== 1 ? 's' : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">
                      Todos los medicamentos han sido registrados
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancelar
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex items-center gap-2"
                onClick={handleSaveDraft}
              >
                <Save className="w-4 h-4" />
                Guardar Borrador
              </Button>
              <Button 
                size="lg" 
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                onClick={handleCompleteDispensation}
                disabled={stats.pending > 0}
              >
                <FileCheck className="w-4 h-4" />
                Completar Dispensación
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de impresión y exportación (solo si hay dispensación registrada) */}
      {Object.keys(dispensationRecords).length > 0 && (
        <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Printer className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-900">Imprimir y Exportar</CardTitle>
                  <p className="text-sm text-blue-700 mt-1">
                    Genere comprobantes de dispensación en diferentes formatos
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Imprimir */}
              <Button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 h-16"
                disabled={!selectedPrescription}
              >
                <Printer className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Imprimir</div>
                  <div className="text-xs opacity-90">Vista de impresión</div>
                </div>
              </Button>

              {/* Descargar PDF */}
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex items-center justify-center gap-2 border-blue-300 hover:bg-blue-50 h-16"
                disabled={!selectedPrescription}
              >
                <Download className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold text-blue-900">Descargar PDF</div>
                  <div className="text-xs text-blue-700">Comprobante completo</div>
                </div>
              </Button>

              {/* Copiar al portapapeles */}
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                className="flex items-center justify-center gap-2 border-blue-300 hover:bg-blue-50 h-16"
                disabled={!selectedPrescription}
              >
                <Copy className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold text-blue-900">Copiar</div>
                  <div className="text-xs text-blue-700">Al portapapeles</div>
                </div>
              </Button>

              {/* Exportar JSON */}
              <Button
                onClick={handleDownloadJSON}
                variant="outline"
                className="flex items-center justify-center gap-2 border-blue-300 hover:bg-blue-50 h-16"
                disabled={!selectedPrescription}
              >
                <FileJson className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold text-blue-900">Exportar JSON</div>
                  <div className="text-xs text-blue-700">Datos estructurados</div>
                </div>
              </Button>

              {/* Exportar CSV */}
              <Button
                onClick={handleDownloadCSV}
                variant="outline"
                className="flex items-center justify-center gap-2 border-blue-300 hover:bg-blue-50 h-16"
                disabled={!selectedPrescription}
              >
                <Sheet className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold text-blue-900">Exportar CSV</div>
                  <div className="text-xs text-blue-700">Para Excel</div>
                </div>
              </Button>

              {/* Vista previa (placeholder) */}
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 border-blue-300 hover:bg-blue-50 h-16"
                disabled={!selectedPrescription}
                onClick={() => {
                  const exportData = prepareExportData();
                  const doc = generateDispensationPDF(exportData);
                  window.open(doc.output("bloburl"), "_blank");
                  toast.info("Vista previa abierta");
                }}
              >
                <Eye className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold text-blue-900">Vista Previa</div>
                  <div className="text-xs text-blue-700">Ver antes de imprimir</div>
                </div>
              </Button>
            </div>

            {/* Nota informativa */}
            <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <strong>Nota:</strong> El comprobante de dispensación incluye todos los medicamentos registrados con sus lotes, 
                  fechas de vencimiento y observaciones farmacéuticas. Este documento cumple con normativas HL7, FDA y OMS.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Panel lateral para registrar dispensación */}
      <DispensationPanel
        medicine={selectedMedicine}
        currentRecord={currentRecord}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSave={handleSaveDispensation}
      />
        </>
      )}
    </div>
  );
}

// Motivos de rechazo estandarizados por categoría (para RechazosPage)
const rejectionReasonsByCategory = {
  medical: [
    { code: "MED-001", label: "Contraindicación médica detectada" },
    { code: "MED-002", label: "Interacción medicamentosa peligrosa" },
    { code: "MED-003", label: "Duplicidad terapéutica" },
    { code: "MED-004", label: "Alergia conocida al medicamento" },
    { code: "MED-005", label: "Dosificación incorrecta o peligrosa" },
    { code: "MED-006", label: "Medicamento no apto para la edad del paciente" },
    { code: "MED-007", label: "Contraindicación por embarazo/lactancia" }
  ],
  administrative: [
    { code: "ADM-001", label: "Receta vencida" },
    { code: "ADM-002", label: "Falta firma del médico" },
    { code: "ADM-003", label: "Datos del paciente incompletos o erróneos" },
    { code: "ADM-004", label: "Receta ilegible o con borrones" },
    { code: "ADM-005", label: "Falta información del medicamento" },
    { code: "ADM-006", label: "Receta no cumple normativas vigentes" },
    { code: "ADM-007", label: "Médico no autorizado o sin registro" }
  ],
  pharmaceutical: [
    { code: "FAR-001", label: "Medicamento fuera de stock" },
    { code: "FAR-002", label: "Medicamento descontinuado" },
    { code: "FAR-003", label: "Medicamento controlado sin autorización" },
    { code: "FAR-004", label: "Lote del medicamento en cuarentena" },
    { code: "FAR-005", label: "Presentación no disponible" },
    { code: "FAR-006", label: "Requiere refrigeración no disponible" }
  ],
  patient: [
    { code: "PAC-001", label: "Paciente rechaza el medicamento" },
    { code: "PAC-002", label: "Paciente no puede costear el medicamento" },
    { code: "PAC-003", label: "Paciente solicita cambio por genérico" },
    { code: "PAC-004", label: "Paciente no presenta identificación válida" },
    { code: "PAC-005", label: "Paciente no autoriza la dispensación" }
  ]
};

// Datos mock de rechazos históricos
const mockRejections = [
  {
    id: "REJ-001",
    prescriptionNumber: "RX-2025-009842",
    patientName: "Carlos Andrés Pérez Morales",
    patientId: "CC-43.654.789",
    rejectionDate: "28/09/2025",
    rejectionTime: "03:45 p.m.",
    rejectedBy: "Farm. Ana María Castillo",
    rejectedByRole: "Químico Farmacéutico",
    category: "pharmaceutical" as const,
    reason: "Medicamento fuera de stock",
    reasonCode: "FAR-001",
    detailedNotes: "El medicamento Atorvastatina 40mg no está disponible en inventario actual. Se agotó el lote anterior y el nuevo pedido está programado para el 02/10/2025. Se recomendó al paciente consultar con el médico para alternativa temporal o esperar reabastecimiento.",
    doctorName: "Dr. Carlos Alberto Mendoza Herrera",
    medicinesCount: 2,
    emittedDate: "27/09/2025",
    notificationSent: true,
    requiresAction: true
  },
  {
    id: "REJ-002",
    prescriptionNumber: "RX-2025-009838",
    patientName: "María José Ramírez Silva",
    patientId: "CC-52.987.456",
    rejectionDate: "27/09/2025",
    rejectionTime: "11:20 a.m.",
    rejectedBy: "Farm. Pedro Luis González",
    rejectedByRole: "Regente de Farmacia",
    category: "medical" as const,
    reason: "Interacción medicamentosa peligrosa",
    reasonCode: "MED-002",
    detailedNotes: "Se detectó interacción severa entre Warfarina (anticoagulante actual del paciente según historial) y el nuevo medicamento prescrito (Aspirina 500mg). Esta combinación puede causar riesgo de hemorragia grave. Se contactó al médico para ajuste de prescripción.",
    doctorName: "Dra. Patricia Sánchez Vega",
    medicinesCount: 3,
    emittedDate: "27/09/2025",
    notificationSent: true,
    requiresAction: true
  },
  {
    id: "REJ-003",
    prescriptionNumber: "RX-2025-009835",
    patientName: "Jorge Luis Martínez Castro",
    patientId: "CC-38.741.963",
    rejectionDate: "26/09/2025",
    rejectionTime: "09:15 a.m.",
    rejectedBy: "Farm. Ana María Castillo",
    rejectedByRole: "Químico Farmacéutico",
    category: "administrative" as const,
    reason: "Receta vencida",
    reasonCode: "ADM-001",
    detailedNotes: "La receta fue emitida hace 18 días, excediendo el período de validez de 15 días establecido en la normativa vigente. Se informó al paciente sobre la necesidad de solicitar nueva receta al médico tratante.",
    doctorName: "Dr. Roberto Jiménez Ortiz",
    medicinesCount: 1,
    emittedDate: "08/09/2025",
    notificationSent: false,
    requiresAction: false
  },
  {
    id: "REJ-004",
    prescriptionNumber: "RX-2025-009830",
    patientName: "Sofía Elena Vargas Díaz",
    patientId: "CC-41.852.741",
    rejectionDate: "25/09/2025",
    rejectionTime: "02:30 p.m.",
    rejectedBy: "Farm. Pedro Luis González",
    rejectedByRole: "Regente de Farmacia",
    category: "patient" as const,
    reason: "Paciente rechaza el medicamento",
    reasonCode: "PAC-001",
    detailedNotes: "La paciente manifestó que previamente tuvo efectos adversos con este medicamento (náuseas severas) y no desea tomarlo nuevamente. Se recomendó contactar al médico para prescripción de alternativa terapéutica.",
    doctorName: "Dr. Carlos Alberto Mendoza Herrera",
    medicinesCount: 2,
    emittedDate: "25/09/2025",
    notificationSent: true,
    requiresAction: true
  },
  {
    id: "REJ-005",
    prescriptionNumber: "RX-2025-009828",
    patientName: "Diego Fernando Ruiz López",
    patientId: "CC-45.963.852",
    rejectionDate: "24/09/2025",
    rejectionTime: "04:50 p.m.",
    rejectedBy: "Farm. Ana María Castillo",
    rejectedByRole: "Químico Farmacéutico",
    category: "medical" as const,
    reason: "Alergia conocida al medicamento",
    reasonCode: "MED-004",
    detailedNotes: "El sistema de alertas indicó alergia registrada del paciente a Penicilina. La receta incluía Amoxicilina (derivado de penicilina). Se rechazó la dispensación por riesgo de reacción alérgica grave. Se notificó de inmediato al médico.",
    doctorName: "Dra. Laura Fernández Torres",
    medicinesCount: 1,
    emittedDate: "24/09/2025",
    notificationSent: true,
    requiresAction: true
  }
];

export function RechazosPage() {
  const [activeTab, setActiveTab] = useState<"register" | "history">("register");
  
  // Estados para registro de rechazo
  const [searchPrescription, setSearchPrescription] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);
  const [rejectionCategory, setRejectionCategory] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [detailedNotes, setDetailedNotes] = useState("");
  const [notifyDoctor, setNotifyDoctor] = useState(true);
  
  // Estados para historial
  const [historyFilter, setHistoryFilter] = useState({
    category: "all",
    dateFrom: "",
    dateTo: "",
    searchText: ""
  });
  const [filteredRejections, setFilteredRejections] = useState(mockRejections);
  const [selectedRejection, setSelectedRejection] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Prescripciones disponibles para rechazar
  const availablePrescriptions = [
    {
      prescriptionNumber: "RX-2025-009847",
      patientName: "María Elena González Rodríguez",
      patientId: "CC-52.841.963",
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      emittedDate: "27/09/2025",
      medicinesCount: 3
    },
    {
      prescriptionNumber: "RX-2025-009846",
      patientName: "Juan Carlos Martínez López",
      patientId: "CC-41.523.789",
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      emittedDate: "26/09/2025",
      medicinesCount: 2
    },
    {
      prescriptionNumber: "RX-2025-009845",
      patientName: "Ana Patricia Ramírez Solís",
      patientId: "CC-36.852.147",
      doctorName: "Dra. Patricia Sánchez Vega",
      emittedDate: "26/09/2025",
      medicinesCount: 4
    },
    {
      prescriptionNumber: "RX-2025-009844",
      patientName: "Roberto Carlos Fernández Díaz",
      patientId: "CC-48.963.258",
      doctorName: "Dr. Roberto Jiménez Ortiz",
      emittedDate: "25/09/2025",
      medicinesCount: 1
    },
    {
      prescriptionNumber: "RX-2025-009843",
      patientName: "Carmen Rosa Vega Morales",
      patientId: "CC-52.147.369",
      doctorName: "Dra. Laura Fernández Torres",
      emittedDate: "25/09/2025",
      medicinesCount: 3
    },
    {
      prescriptionNumber: "RX-2025-009842",
      patientName: "Luis Alberto Castro Jiménez",
      patientId: "CC-45.258.741",
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      emittedDate: "24/09/2025",
      medicinesCount: 2
    },
    {
      prescriptionNumber: "RX-2025-009841",
      patientName: "Sandra Milena Ortiz Vargas",
      patientId: "CC-39.741.852",
      doctorName: "Dra. Patricia Sánchez Vega",
      emittedDate: "24/09/2025",
      medicinesCount: 5
    },
    {
      prescriptionNumber: "RX-2025-009840",
      patientName: "Eduardo José Hernández Ruiz",
      patientId: "CC-42.369.147",
      doctorName: "Dr. Roberto Jiménez Ortiz",
      emittedDate: "23/09/2025",
      medicinesCount: 2
    },
    {
      prescriptionNumber: "RX-2025-009839",
      patientName: "Gabriela Andrea López Campos",
      patientId: "CC-51.852.963",
      doctorName: "Dra. Laura Fernández Torres",
      emittedDate: "23/09/2025",
      medicinesCount: 3
    },
    {
      prescriptionNumber: "RX-2025-009838",
      patientName: "Fernando Antonio Mora Sánchez",
      patientId: "CC-47.963.852",
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      emittedDate: "22/09/2025",
      medicinesCount: 4
    }
  ];

  // Buscar receta para rechazar
  const handleSearchPrescription = () => {
    if (!searchPrescription.trim()) {
      toast.error('Ingresa un número de receta');
      return;
    }

    const found = availablePrescriptions.find(p => 
      normalizedIncludes(p.prescriptionNumber, searchPrescription)
    );

    if (found) {
      setSelectedPrescription(found);
      toast.success('Receta encontrada', {
        description: `${found.prescriptionNumber} - ${found.patientName}`,
        duration: 3000,
      });
    } else {
      toast.error('Receta no encontrada', {
        description: 'Verifica el número de receta',
        duration: 3000,
      });
    }
  };

  // Registrar rechazo
  const handleRegisterRejection = () => {
    if (!selectedPrescription) {
      toast.error('Selecciona una receta');
      return;
    }

    if (!rejectionCategory) {
      toast.error('Selecciona una categoría de rechazo');
      return;
    }

    if (!rejectionReason) {
      toast.error('Selecciona un motivo de rechazo');
      return;
    }

    if (!detailedNotes.trim()) {
      toast.error('Ingresa observaciones detalladas');
      return;
    }

    const selectedReasonData = rejectionReasonsByCategory[rejectionCategory as keyof typeof rejectionReasonsByCategory]?.find(
      r => r.code === rejectionReason
    );

    toast.success('Rechazo registrado exitosamente', {
      description: `${selectedPrescription.prescriptionNumber} - ${selectedReasonData?.label}`,
      duration: 4000,
    });

    if (notifyDoctor) {
      setTimeout(() => {
        toast.info('Notificación enviada', {
          description: 'El médico prescriptor ha sido notificado',
          duration: 3000,
        });
      }, 1000);
    }

    // Limpiar formulario
    setSelectedPrescription(null);
    setSearchPrescription("");
    setRejectionCategory("");
    setRejectionReason("");
    setDetailedNotes("");
    setNotifyDoctor(true);
  };

  // Filtrar historial
  const handleFilterHistory = () => {
    let filtered = [...mockRejections];

    if (historyFilter.category !== "all") {
      filtered = filtered.filter(r => r.category === historyFilter.category);
    }

    if (historyFilter.searchText) {
      filtered = filtered.filter(r => 
        normalizedIncludes(r.prescriptionNumber, historyFilter.searchText) ||
        normalizedIncludes(r.patientName, historyFilter.searchText)
      );
    }

    if (historyFilter.dateFrom) {
      filtered = filtered.filter(r => r.rejectionDate >= historyFilter.dateFrom);
    }

    if (historyFilter.dateTo) {
      filtered = filtered.filter(r => r.rejectionDate <= historyFilter.dateTo);
    }

    setFilteredRejections(filtered);
    
    toast.success('Filtros aplicados', {
      description: `${filtered.length} rechazo(s) encontrado(s)`,
      duration: 2000,
    });
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setHistoryFilter({
      category: "all",
      dateFrom: "",
      dateTo: "",
      searchText: ""
    });
    setFilteredRejections(mockRejections);
  };

  // Ver detalle de rechazo
  const handleViewRejection = (rejection: any) => {
    setSelectedRejection(rejection);
    setIsDetailOpen(true);
  };

  // Obtener razones disponibles según categoría
  const availableReasons = rejectionCategory 
    ? rejectionReasonsByCategory[rejectionCategory as keyof typeof rejectionReasonsByCategory] || []
    : [];

  // Estadísticas
  const stats = {
    total: mockRejections.length,
    medical: mockRejections.filter(r => r.category === 'medical').length,
    administrative: mockRejections.filter(r => r.category === 'administrative').length,
    pharmaceutical: mockRejections.filter(r => r.category === 'pharmaceutical').length,
    patient: mockRejections.filter(r => r.category === 'patient').length,
    requiresAction: mockRejections.filter(r => r.requiresAction).length
  };

  const getCategoryBadge = (category: string) => {
    const config: Record<string, { label: string; className: string }> = {
      medical: { label: "Médico", className: "bg-red-100 text-red-700 border-red-300" },
      administrative: { label: "Administrativo", className: "bg-orange-100 text-orange-700 border-orange-300" },
      pharmaceutical: { label: "Farmacéutico", className: "bg-amber-100 text-amber-700 border-amber-300" },
      patient: { label: "Paciente", className: "bg-blue-100 text-blue-700 border-blue-300" }
    };
    return config[category] || config.administrative;
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-red-700 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white">Rechazos y Motivos</h1>
                  <p className="text-red-100 text-sm">
                    Registro y gestión de rechazos de dispensación
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-red-100 text-xs mb-1">Total rechazos</p>
                <p className="text-white font-semibold text-3xl">{stats.total}</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-red-100 text-xs mb-1">Requieren acción</p>
                <p className="text-white font-semibold text-3xl">{stats.requiresAction}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner informativo */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 mb-2">Sistema de trazabilidad de rechazos</h4>
              <div className="text-sm text-red-800 space-y-2">
                <p>
                  Documenta todos los rechazos de dispensación para garantizar seguridad del paciente, cumplimiento normativo y análisis de causas raíz.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Motivos estandarizados según normativas HL7, FDA y OMS</li>
                  <li>Notificación automática a médicos prescriptores</li>
                  <li>Trazabilidad completa para auditorías</li>
                  <li>Análisis estadístico para mejora continua</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas por categoría */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="text-center">
              <BarChart3 className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-center">
              <ShieldAlert className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Médicos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.medical}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="text-center">
              <FileText className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Administrativos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.administrative}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="text-center">
              <Pill className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Farmacéuticos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pharmaceutical}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <User className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Paciente</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.patient}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principal */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "register" | "history")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">
            <Plus className="w-4 h-4 mr-2" />
            Registrar rechazo
          </TabsTrigger>
          <TabsTrigger value="history">
            <FileText className="w-4 h-4 mr-2" />
            Historial de rechazos
          </TabsTrigger>
        </TabsList>

        {/* Tab: Registrar rechazo */}
        <TabsContent value="register">
          <div className="space-y-6">
            {/* Buscar receta */}
            <Card>
              <CardHeader>
                <CardTitle>1. Buscar receta a rechazar</CardTitle>
                <p className="text-sm text-gray-600">
                  Ingresa el número de receta que deseas rechazar
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Número de receta (ej: RX-2025-009847)"
                      value={searchPrescription}
                      onChange={(e) => setSearchPrescription(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchPrescription()}
                      className="pl-11 h-12"
                    />
                  </div>
                  <Button 
                    onClick={handleSearchPrescription}
                    className="bg-red-600 hover:bg-red-700 px-8"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>

                {selectedPrescription && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{selectedPrescription.prescriptionNumber}</p>
                        <p className="text-sm text-gray-600">{selectedPrescription.patientName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedPrescription.patientId} • {selectedPrescription.medicinesCount} medicamento(s)
                        </p>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Formulario de rechazo */}
            {selectedPrescription && (
              <Card>
                <CardHeader>
                  <CardTitle>2. Datos del rechazo</CardTitle>
                  <p className="text-sm text-gray-600">
                    Selecciona la categoría y motivo del rechazo
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categoría */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categoría del rechazo *</label>
                    <Select value={rejectionCategory} onValueChange={(value) => {
                      setRejectionCategory(value);
                      setRejectionReason(""); // Reset reason when category changes
                    }}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-red-600" />
                            <span>Motivo médico</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="administrative">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-600" />
                            <span>Motivo administrativo</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="pharmaceutical">
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4 text-amber-600" />
                            <span>Motivo farmacéutico</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="patient">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>Motivo del paciente</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Motivo específico */}
                  {rejectionCategory && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Motivo específico *</label>
                      <Select value={rejectionReason} onValueChange={setRejectionReason}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Selecciona el motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableReasons.map((reason) => (
                            <SelectItem key={reason.code} value={reason.code}>
                              <div className="flex items-center justify-between w-full">
                                <span>{reason.label}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {reason.code}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Observaciones detalladas */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Observaciones detalladas *</label>
                    <Textarea
                      placeholder="Describe en detalle el motivo del rechazo, acciones tomadas y recomendaciones para el médico o paciente..."
                      value={detailedNotes}
                      onChange={(e) => setDetailedNotes(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Mínimo 50 caracteres. Estas observaciones serán parte del registro de auditoría.
                    </p>
                  </div>

                  {/* Notificar al médico */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={notifyDoctor}
                        onChange={(e) => setNotifyDoctor(e.target.checked)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-blue-900">Notificar al médico prescriptor</p>
                        <p className="text-sm text-blue-800 mt-1">
                          Se enviará una notificación automática al Dr. {selectedPrescription.doctorName} informando sobre este rechazo.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        setSelectedPrescription(null);
                        setSearchPrescription("");
                        setRejectionCategory("");
                        setRejectionReason("");
                        setDetailedNotes("");
                      }}
                      variant="outline"
                      size="lg"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleRegisterRejection}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      size="lg"
                    >
                      <FileCheck className="w-4 h-4 mr-2" />
                      Registrar rechazo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="history">
          <div className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros de búsqueda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Categoría</label>
                      <Select 
                        value={historyFilter.category} 
                        onValueChange={(value) => setHistoryFilter({...historyFilter, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las categorías</SelectItem>
                          <SelectItem value="medical">Médico</SelectItem>
                          <SelectItem value="administrative">Administrativo</SelectItem>
                          <SelectItem value="pharmaceutical">Farmacéutico</SelectItem>
                          <SelectItem value="patient">Paciente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Buscar</label>
                      <Input
                        placeholder="Receta o paciente..."
                        value={historyFilter.searchText}
                        onChange={(e) => setHistoryFilter({...historyFilter, searchText: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Desde</label>
                      <Input
                        type="date"
                        value={historyFilter.dateFrom}
                        onChange={(e) => setHistoryFilter({...historyFilter, dateFrom: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Hasta</label>
                      <Input
                        type="date"
                        value={historyFilter.dateTo}
                        onChange={(e) => setHistoryFilter({...historyFilter, dateTo: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleFilterHistory} className="bg-red-600 hover:bg-red-700">
                      <Filter className="w-4 h-4 mr-2" />
                      Aplicar filtros
                    </Button>
                    <Button onClick={handleClearFilters} variant="outline">
                      <FilterX className="w-4 h-4 mr-2" />
                      Limpiar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de rechazos */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Historial de rechazos</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredRejections.length} rechazo(s) registrado(s)
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha/Hora</TableHead>
                      <TableHead>Receta</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRejections.map((rejection) => {
                      const categoryBadge = getCategoryBadge(rejection.category);
                      return (
                        <TableRow 
                          key={rejection.id}
                          className="hover:bg-red-50/50 cursor-pointer"
                          onDoubleClick={() => handleViewRejection(rejection)}
                          title="Doble clic para ver detalles"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{rejection.rejectionDate}</span>
                            </div>
                            <p className="text-xs text-gray-500">{rejection.rejectionTime}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{rejection.prescriptionNumber}</p>
                            <p className="text-xs text-gray-600">{rejection.doctorName}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{rejection.patientName}</p>
                            <p className="text-xs text-gray-600">{rejection.patientId}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={categoryBadge.className}>
                              {categoryBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">{rejection.reason}</p>
                            <p className="text-xs text-gray-600">{rejection.reasonCode}</p>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              {rejection.notificationSent && (
                                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                                  Notificado
                                </Badge>
                              )}
                              {rejection.requiresAction && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">
                                  Req. acción
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewRejection(rejection);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Panel de detalles */}
      <RejectionDetailPanel
        rejection={selectedRejection}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onPrint={(id) => {
          toast.success('Imprimiendo registro de rechazo...', { duration: 2000 });
        }}
        onNotifyDoctor={(id) => {
          toast.success('Notificación enviada al médico', { duration: 2000 });
          setIsDetailOpen(false);
        }}
      />
    </div>
  );
}