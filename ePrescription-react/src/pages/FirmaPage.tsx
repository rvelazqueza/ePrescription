import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { TablePagination } from "../components/TablePagination";
import { ExportButtons } from "../components/ExportButtons";
import { usePagination } from "../utils/usePagination";
import { normalizedIncludes } from "../utils/searchUtils";
import { toast } from "sonner@2.0.3";
import QRCodeLib from "qrcode";
import {
  ShieldCheck,
  QrCode,
  CheckCircle,
  FileCheck,
  Search,
  FilterX,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  User,
  FileText,
  Clock,
  Key,
  Shield,
  Info,
  Plus,
  Scan,
  Fingerprint,
  Lock,
  Unlock,
  Calendar,
  Mail,
  Phone,
  Building2,
  Hash,
  RefreshCcw,
  Copy,
  ExternalLink
} from "lucide-react";

// Datos mock de recetas pendientes de firma
const mockPrescriptionsToSign = [
  {
    id: "RX-2024-0198",
    patientId: "PAT-0012",
    patientName: "María González",
    doctorId: "DOC-003",
    doctorName: "Dra. Isabel Moreno",
    createdDate: "2024-10-01",
    createdTime: "14:35",
    medicinesCount: 3,
    medicines: ["Paracetamol 500mg", "Ibuprofeno 400mg", "Omeprazol 20mg"],
    status: "pending_signature",
    diagnosis: "Gastritis aguda con cefalea tensional"
  },
  {
    id: "RX-2024-0199",
    patientId: "PAT-0045",
    patientName: "Carlos Ramírez",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Martínez",
    createdDate: "2024-10-01",
    createdTime: "15:12",
    medicinesCount: 2,
    medicines: ["Losartán 50mg", "Atorvastatina 20mg"],
    status: "pending_signature",
    diagnosis: "Hipertensión arterial esencial"
  },
  {
    id: "RX-2024-0200",
    patientId: "PAT-0089",
    patientName: "Ana Herrera",
    doctorId: "DOC-005",
    doctorName: "Dr. Miguel Ruiz",
    createdDate: "2024-10-01",
    createdTime: "15:45",
    medicinesCount: 1,
    medicines: ["Paracetamol 500mg"],
    status: "pending_signature",
    diagnosis: "Dolor lumbar agudo"
  }
];

// Datos mock de recetas firmadas con QR
const mockSignedPrescriptions = [
  {
    id: "RX-2024-0192",
    patientName: "Elena Martínez",
    doctorName: "Dr. Carlos Martínez",
    signedDate: "2024-10-01",
    signedTime: "08:30",
    qrCode: "QR-2024-0192-A3B5C7D9E1F2",
    qrUrl: "https://eprescription.hospital.com/verify/QR-2024-0192-A3B5C7D9E1F2",
    token: "VERIFY-0192-2024",
    certificateId: "CERT-DR-MARTINEZ-2024",
    signatureHash: "SHA256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    status: "signed",
    validUntil: "2024-11-01"
  },
  {
    id: "RX-2024-0195",
    patientName: "Roberto Sánchez",
    doctorName: "Farmacéutica Ana García",
    signedDate: "2024-10-01",
    signedTime: "11:20",
    qrCode: "QR-2024-0195-B4C6D8E0F2G4",
    qrUrl: "https://eprescription.hospital.com/verify/QR-2024-0195-B4C6D8E0F2G4",
    token: "VERIFY-0195-2024",
    certificateId: "CERT-FARMACIA-2024",
    signatureHash: "SHA256:p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1",
    status: "signed",
    validUntil: "2024-10-15"
  }
];

// Datos mock de trazabilidad de firmas
const mockSignatureTrail = [
  {
    id: "SIGN-001",
    prescriptionId: "RX-2024-0192",
    patientName: "Elena Martínez",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Martínez",
    action: "signature_created",
    actionLabel: "Firma digital aplicada",
    timestamp: "2024-10-01 08:30:05",
    certificateId: "CERT-DR-MARTINEZ-2024",
    certificateIssuer: "Autoridad Certificadora Médica",
    certificateValidFrom: "2024-01-01",
    certificateValidTo: "2025-12-31",
    signatureMethod: "Digital Certificate RSA 2048",
    ipAddress: "192.168.1.45",
    deviceInfo: "Windows PC - Chrome 118.0",
    qrGenerated: true,
    tokenGenerated: true,
    status: "valid"
  },
  {
    id: "SIGN-002",
    prescriptionId: "RX-2024-0192",
    patientName: "Elena Martínez",
    doctorId: "PHARM-001",
    doctorName: "Farmacéutica Ana García",
    action: "verification",
    actionLabel: "Verificación en farmacia",
    timestamp: "2024-10-01 10:15:30",
    certificateId: null,
    certificateIssuer: null,
    certificateValidFrom: null,
    certificateValidTo: null,
    signatureMethod: "QR Code Verification",
    ipAddress: "192.168.1.78",
    deviceInfo: "Scanner QR - Farmacia Central",
    qrGenerated: false,
    tokenGenerated: false,
    status: "verified"
  },
  {
    id: "SIGN-003",
    prescriptionId: "RX-2024-0195",
    patientName: "Roberto Sánchez",
    doctorId: "DOC-002",
    doctorName: "Dra. Laura Ramírez",
    action: "signature_created",
    actionLabel: "Firma digital aplicada",
    timestamp: "2024-10-01 11:20:15",
    certificateId: "CERT-DRA-RAMIREZ-2024",
    certificateIssuer: "Autoridad Certificadora Médica",
    certificateValidFrom: "2024-01-01",
    certificateValidTo: "2025-12-31",
    signatureMethod: "Digital Certificate RSA 2048",
    ipAddress: "192.168.1.67",
    deviceInfo: "Windows PC - Edge 118.0",
    qrGenerated: true,
    tokenGenerated: true,
    status: "valid"
  },
  {
    id: "SIGN-004",
    prescriptionId: "RX-2024-0178",
    patientName: "Carlos Ramírez",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Martínez",
    action: "signature_revoked",
    actionLabel: "Firma revocada",
    timestamp: "2024-09-30 16:45:00",
    certificateId: "CERT-DR-MARTINEZ-2024",
    certificateIssuer: "Autoridad Certificadora Médica",
    certificateValidFrom: "2024-01-01",
    certificateValidTo: "2025-12-31",
    signatureMethod: "Digital Certificate RSA 2048",
    ipAddress: "192.168.1.45",
    deviceInfo: "Windows PC - Chrome 118.0",
    qrGenerated: false,
    tokenGenerated: false,
    status: "revoked"
  }
];

// PÁGINA 1: FIRMAR RECETA
export function FirmarRecetaPage() {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptionsToSign);
  const [selectedPrescription, setSelectedPrescription] = useState<typeof mockPrescriptionsToSign[0] | null>(null);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [certificatePassword, setCertificatePassword] = useState("");

  const handleSign = () => {
    if (!pin || !certificatePassword) {
      toast.error('Campos incompletos', {
        description: 'Debes ingresar el PIN y la contraseña del certificado',
      });
      return;
    }

    toast.success('Receta firmada exitosamente', {
      description: `Receta ${selectedPrescription?.id} firmada digitalmente. QR generado.`,
      duration: 4000,
    });

    setPrescriptions(prescriptions.filter(p => p.id !== selectedPrescription?.id));
    setIsSignDialogOpen(false);
    setPin("");
    setCertificatePassword("");
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Firma Digital de Recetas</h1>
              <p className="text-blue-100 text-sm">Firma electrónica avanzada con certificado digital</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes de firma</p>
                <p className="text-2xl font-semibold">{prescriptions.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Firmadas hoy</p>
                <p className="text-2xl font-semibold">12</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificado válido</p>
                <p className="text-2xl font-semibold">365d</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recetas Pendientes de Firma</CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-medium mb-2">No hay recetas pendientes</h3>
              <p className="text-sm text-gray-600">Todas las recetas han sido firmadas</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Receta</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Medicamentos</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-mono text-sm">{prescription.id}</TableCell>
                    <TableCell>{prescription.patientName}</TableCell>
                    <TableCell>{prescription.doctorName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{prescription.createdDate}</p>
                        <p className="text-gray-600">{prescription.createdTime}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                        {prescription.medicinesCount} medicamento{prescription.medicinesCount !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{prescription.diagnosis}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => {
                        setSelectedPrescription(prescription);
                        setIsSignDialogOpen(true);
                      }}>
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Firmar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Firma Electrónica Avanzada</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Equivalencia legal con firma manuscrita según normativas internacionales</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Certificado digital emitido por autoridad certificadora autorizada</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Genera código QR único y token de verificación para farmacia</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de firma */}
      {selectedPrescription && (
        <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Firmar Receta Digitalmente
              </DialogTitle>
              <DialogDescription>
                Receta {selectedPrescription.id} para {selectedPrescription.patientName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="bg-gray-50 border rounded-lg p-4">
                <h4 className="font-medium mb-3">Detalles de la receta</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Paciente</Label>
                    <p className="mt-1">{selectedPrescription.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Médico</Label>
                    <p className="mt-1">{selectedPrescription.doctorName}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Medicamentos</Label>
                    <ul className="mt-1 list-disc list-inside">
                      {selectedPrescription.medicines.map((med, idx) => (
                        <li key={idx}>{med}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <Label>PIN de seguridad *</Label>
                <Input
                  type="password"
                  placeholder="Ingresa tu PIN de 6 dígitos"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={6}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Contraseña del certificado digital *</Label>
                <Input
                  type="password"
                  placeholder="Contraseña de tu certificado"
                  value={certificatePassword}
                  onChange={(e) => setCertificatePassword(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Tu certificado digital</p>
                    <p className="text-blue-700">CERT-DR-MARTINEZ-2024</p>
                    <p className="text-blue-700 text-xs mt-1">Válido hasta: 31/12/2025</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSignDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSign}>
                <ShieldCheck className="w-4 h-4 mr-2" />
                Firmar digitalmente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Componente auxiliar: Visualizador de QR Code
function QRCodeDisplay({ 
  data, 
  size = 256 
}: { 
  data: string; 
  size?: number; 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCodeLib.toCanvas(
        canvasRef.current,
        data,
        {
          width: size,
          margin: 2,
          color: {
            dark: '#047857', // Verde médico
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        },
        (error) => {
          if (error) {
            console.error('Error generando QR:', error);
          }
        }
      );
    }
  }, [data, size]);

  return <canvas ref={canvasRef} />;
}

// PÁGINA 2: GENERAR/VER QR
export function GenerarQRPage() {
  const [signedPrescriptions] = useState(mockSignedPrescriptions);
  const [selectedPrescription, setSelectedPrescription] = useState<typeof mockSignedPrescriptions[0] | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopyQR = (qrCode: string) => {
    navigator.clipboard.writeText(qrCode);
    toast.success('Código QR copiado', {
      description: 'El código ha sido copiado al portapapeles',
    });
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada', {
      description: 'La URL de verificación ha sido copiada',
    });
  };

  const handleDownloadQR = async () => {
    if (!selectedPrescription) return;

    setIsDownloading(true);

    try {
      // Crear un canvas temporal más grande para incluir información adicional
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('No se pudo crear el contexto del canvas');
      }

      // Dimensiones del canvas
      const qrSize = 400;
      const padding = 40;
      const headerHeight = 100;
      const footerHeight = 120;
      const canvasWidth = qrSize + (padding * 2);
      const canvasHeight = qrSize + headerHeight + footerHeight + (padding * 2);

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fondo blanco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Header - Título
      ctx.fillStyle = '#047857'; // Verde médico
      ctx.fillRect(0, 0, canvasWidth, headerHeight);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ePrescription', canvasWidth / 2, 35);
      
      ctx.font = '16px Arial';
      ctx.fillText('Código de Verificación de Receta', canvasWidth / 2, 65);

      // Generar el QR code
      const qrCodeDataUrl = await QRCodeLib.toDataURL(
        selectedPrescription.qrUrl,
        {
          width: qrSize,
          margin: 2,
          color: {
            dark: '#047857',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        }
      );

      // Cargar y dibujar el QR
      const qrImage = new Image();
      await new Promise((resolve, reject) => {
        qrImage.onload = resolve;
        qrImage.onerror = reject;
        qrImage.src = qrCodeDataUrl;
      });

      ctx.drawImage(qrImage, padding, headerHeight + padding, qrSize, qrSize);

      // Borde decorativo alrededor del QR
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 3;
      ctx.strokeRect(padding - 5, headerHeight + padding - 5, qrSize + 10, qrSize + 10);

      // Footer - Información de la receta
      const footerY = headerHeight + padding + qrSize + 30;
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Receta: ${selectedPrescription.id}`, canvasWidth / 2, footerY);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#4b5563';
      ctx.fillText(`Paciente: ${selectedPrescription.patientName}`, canvasWidth / 2, footerY + 25);
      ctx.fillText(`Médico: ${selectedPrescription.doctorName}`, canvasWidth / 2, footerY + 45);
      ctx.fillText(`Fecha: ${selectedPrescription.signedDate} ${selectedPrescription.signedTime}`, canvasWidth / 2, footerY + 65);
      
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#059669';
      ctx.fillText(`Token: ${selectedPrescription.token}`, canvasWidth / 2, footerY + 90);

      // Convertir canvas a blob y descargar
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `QR_Receta_${selectedPrescription.id}_${selectedPrescription.patientName.replace(/\s+/g, '_')}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.success('Código QR descargado', {
            description: `El código QR de la receta ${selectedPrescription.id} ha sido descargado exitosamente`,
            duration: 5000,
          });
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Error al descargar QR:', error);
      toast.error('Error al descargar QR', {
        description: 'Ocurrió un problema al generar el archivo. Por favor, intente nuevamente.',
        duration: 4000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Generar/Ver Código QR</h1>
              <p className="text-green-100 text-sm">Códigos de verificación para dispensación en farmacia</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">QR generados</p>
                <p className="text-2xl font-semibold">{signedPrescriptions.length}</p>
              </div>
              <QrCode className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verificados</p>
                <p className="text-2xl font-semibold">45</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold">3</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recetas con Código QR</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Receta</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Fecha de firma</TableHead>
                <TableHead>Código QR</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Válido hasta</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signedPrescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-mono text-sm">{prescription.id}</TableCell>
                  <TableCell>{prescription.patientName}</TableCell>
                  <TableCell>{prescription.doctorName}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{prescription.signedDate}</p>
                      <p className="text-gray-600">{prescription.signedTime}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{prescription.qrCode.substring(0, 20)}...</span>
                      <Button variant="ghost" size="sm" onClick={() => handleCopyQR(prescription.qrCode)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 font-mono">
                      {prescription.token}
                    </Badge>
                  </TableCell>
                  <TableCell>{prescription.validUntil}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => {
                      setSelectedPrescription(prescription);
                      setIsQRDialogOpen(true);
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver QR
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de QR */}
      {selectedPrescription && (
        <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-green-600" />
                Código QR de Verificación
              </DialogTitle>
              <DialogDescription>
                Receta {selectedPrescription.id} - {selectedPrescription.patientName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <div className="bg-white border-4 border-green-600 rounded-lg p-6 shadow-lg">
                  <QRCodeDisplay 
                    data={selectedPrescription.qrUrl} 
                    size={256} 
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <p className="text-sm text-gray-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <Info className="w-4 h-4 inline mr-1" />
                  Escanea este código QR para verificar la receta en farmacia
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">Código QR</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={selectedPrescription.qrCode} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="sm" onClick={() => handleCopyQR(selectedPrescription.qrCode)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Token de verificación</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={selectedPrescription.token} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="sm" onClick={() => handleCopyQR(selectedPrescription.token)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">URL de verificación</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={selectedPrescription.qrUrl} readOnly className="text-sm" />
                    <Button variant="outline" size="sm" onClick={() => handleCopyUrl(selectedPrescription.qrUrl)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Hash de firma</Label>
                    <p className="text-xs font-mono mt-1 break-all">{selectedPrescription.signatureHash}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Válido hasta</Label>
                    <p className="mt-1">{selectedPrescription.validUntil}</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsQRDialogOpen(false)}
                disabled={isDownloading}
              >
                Cerrar
              </Button>
              <Button 
                onClick={handleDownloadQR}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isDownloading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Generando QR...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Descargar QR
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// PÁGINA 3: VERIFICACIÓN DE QR/TOKEN
export function VerificarQRPage() {
  const [verificationMethod, setVerificationMethod] = useState<"qr" | "token">("qr");
  const [qrInput, setQrInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerify = () => {
    const input = verificationMethod === "qr" ? qrInput : tokenInput;
    
    if (!input) {
      toast.error('Campo vacío', {
        description: 'Ingresa el código QR o token para verificar',
      });
      return;
    }

    // Simulación de verificación
    setVerificationResult({
      valid: true,
      prescriptionId: "RX-2024-0192",
      patientName: "Elena Martínez",
      doctorName: "Dr. Carlos Martínez",
      signedDate: "2024-10-01 08:30",
      medicines: ["Paracetamol 500mg", "Ibuprofeno 400mg", "Omeprazol 20mg"],
      status: "Válida y no dispensada",
      certificateId: "CERT-DR-MARTINEZ-2024"
    });

    toast.success('Receta verificada', {
      description: 'La firma digital es válida y la receta es auténtica',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Scan className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Verificación de QR/Token</h1>
              <p className="text-purple-100 text-sm">Validación de autenticidad de recetas firmadas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verificar Receta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Método de verificación</Label>
              <Select value={verificationMethod} onValueChange={(v: "qr" | "token") => setVerificationMethod(v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qr">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      <span>Código QR</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="token">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      <span>Token alfanumérico</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {verificationMethod === "qr" ? (
              <div>
                <Label>Código QR de la receta</Label>
                <Input
                  placeholder="Escanea o ingresa el código QR completo"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="mt-2 font-mono"
                />
                <p className="text-xs text-gray-600 mt-1">Ej: QR-2024-0192-A3B5C7D9E1F2</p>
              </div>
            ) : (
              <div>
                <Label>Token de verificación</Label>
                <Input
                  placeholder="Ingresa el token de 15 caracteres"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="mt-2 font-mono"
                  maxLength={17}
                />
                <p className="text-xs text-gray-600 mt-1">Ej: VERIFY-0192-2024</p>
              </div>
            )}

            <Button onClick={handleVerify} className="w-full">
              <Scan className="w-4 h-4 mr-2" />
              Verificar autenticidad
            </Button>
          </CardContent>
        </Card>

        {verificationResult && (
          <Card className="border-green-300 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle className="w-5 h-5" />
                Receta Verificada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-green-600 rounded-full">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">ID de receta</Label>
                  <p className="font-mono mt-1">{verificationResult.prescriptionId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Paciente</Label>
                    <p className="mt-1">{verificationResult.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Médico</Label>
                    <p className="mt-1">{verificationResult.doctorName}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Fecha de firma</Label>
                  <p className="mt-1">{verificationResult.signedDate}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Medicamentos prescritos</Label>
                  <ul className="mt-1 list-disc list-inside text-sm">
                    {verificationResult.medicines.map((med: string, idx: number) => (
                      <li key={idx}>{med}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t">
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    ✓ {verificationResult.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// PÁGINA 4: TRAZABILIDAD DE FIRMAS
export function TrazabilidadFirmasPage() {
  const [trail] = useState(mockSignatureTrail);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTrailItem, setSelectedTrailItem] = useState<typeof mockSignatureTrail[0] | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredTrail = trail.filter(item => {
    const matchesSearch = 
      normalizedIncludes(item.prescriptionId, searchTerm) ||
      normalizedIncludes(item.patientName, searchTerm) ||
      normalizedIncludes(item.doctorName, searchTerm);
    const matchesAction = actionFilter === "all" || item.action === actionFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesAction && matchesStatus;
  });

  const stats = {
    total: trail.length,
    valid: trail.filter(t => t.status === 'valid').length,
    verified: trail.filter(t => t.status === 'verified').length,
    revoked: trail.filter(t => t.status === 'revoked').length
  };

  const getStatusBadge = (status: string) => {
    const config = {
      valid: { label: "Válida", className: "bg-green-100 text-green-700 border-green-300" },
      verified: { label: "Verificada", className: "bg-blue-100 text-blue-700 border-blue-300" },
      revoked: { label: "Revocada", className: "bg-red-100 text-red-700 border-red-300" }
    };
    return config[status as keyof typeof config] || config.valid;
  };

  const handleVerDetalles = (item: typeof mockSignatureTrail[0]) => {
    setSelectedTrailItem(item);
    setIsDetailDialogOpen(true);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'signature_created':
        return <ShieldCheck className="w-5 h-5 text-green-600" />;
      case 'verification':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'revocation':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileCheck className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-600 via-gray-500 to-zinc-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Trazabilidad de Firmas</h1>
              <p className="text-gray-100 text-sm">Registro completo de firmas digitales y verificaciones</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total eventos</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <FileCheck className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Firmas válidas</p>
                <p className="text-2xl font-semibold">{stats.valid}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verificaciones</p>
                <p className="text-2xl font-semibold">{stats.verified}</p>
              </div>
              <Scan className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revocadas</p>
                <p className="text-2xl font-semibold">{stats.revoked}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por ID de receta, paciente o médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                <SelectItem value="signature_created">Firma creada</SelectItem>
                <SelectItem value="verification">Verificación</SelectItem>
                <SelectItem value="signature_revoked">Firma revocada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="valid">Válidas</SelectItem>
                <SelectItem value="verified">Verificadas</SelectItem>
                <SelectItem value="revoked">Revocadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registro de Trazabilidad</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>ID Receta</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrail.map((item) => {
                const statusBadge = getStatusBadge(item.status);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm">{item.timestamp}</TableCell>
                    <TableCell className="font-mono text-sm">{item.prescriptionId}</TableCell>
                    <TableCell>{item.patientName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{item.doctorName}</p>
                        <p className="text-gray-600 font-mono text-xs">{item.doctorId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.actionLabel}</TableCell>
                    <TableCell className="text-sm">{item.signatureMethod}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge.className}>
                        {statusBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerDetalles(item)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de Detalles de Trazabilidad */}
      {selectedTrailItem && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getActionIcon(selectedTrailItem.action)}
                Detalles de Trazabilidad - {selectedTrailItem.id}
              </DialogTitle>
              <DialogDescription>
                Información completa del registro de firma digital y verificación
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Información Principal */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {getActionIcon(selectedTrailItem.action)}
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{selectedTrailItem.actionLabel}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Timestamp: {selectedTrailItem.timestamp}
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusBadge(selectedTrailItem.status).className}>
                    {getStatusBadge(selectedTrailItem.status).label}
                  </Badge>
                </div>
              </div>

              {/* Información de la Receta */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Información de la Receta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">ID Receta</Label>
                      <p className="font-mono mt-1">{selectedTrailItem.prescriptionId}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Paciente</Label>
                      <p className="mt-1">{selectedTrailItem.patientName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información del Usuario */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="w-4 h-4 text-purple-600" />
                    Información del Usuario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Nombre completo</Label>
                      <p className="mt-1">{selectedTrailItem.doctorName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">ID Usuario</Label>
                      <p className="font-mono mt-1">{selectedTrailItem.doctorId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detalles del Certificado Digital (si aplica) */}
              {selectedTrailItem.certificateId && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="w-4 h-4 text-green-600" />
                      Certificado Digital
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">ID Certificado</Label>
                          <p className="font-mono text-sm mt-1">{selectedTrailItem.certificateId}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Emisor</Label>
                          <p className="text-sm mt-1">{selectedTrailItem.certificateIssuer}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Válido desde</Label>
                          <p className="mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {selectedTrailItem.certificateValidFrom}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Válido hasta</Label>
                          <p className="mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {selectedTrailItem.certificateValidTo}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Información Técnica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Key className="w-4 h-4 text-orange-600" />
                    Información Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-600">Método de firma/verificación</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Fingerprint className="w-4 h-4 text-gray-500" />
                        <p>{selectedTrailItem.signatureMethod}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Dirección IP</Label>
                        <p className="font-mono text-sm mt-1">{selectedTrailItem.ipAddress}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Dispositivo</Label>
                        <p className="text-sm mt-1">{selectedTrailItem.deviceInfo}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Códigos Generados (si aplica) */}
              {(selectedTrailItem.qrGenerated || selectedTrailItem.tokenGenerated) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <QrCode className="w-4 h-4 text-indigo-600" />
                      Códigos de Verificación Generados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        {selectedTrailItem.qrGenerated ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <div>
                              <Label className="text-sm text-gray-600">Código QR</Label>
                              <p className="text-sm mt-1">Generado exitosamente</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-gray-400" />
                            <div>
                              <Label className="text-sm text-gray-600">Código QR</Label>
                              <p className="text-sm text-gray-500 mt-1">No generado</p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedTrailItem.tokenGenerated ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <div>
                              <Label className="text-sm text-gray-600">Token verificación</Label>
                              <p className="text-sm mt-1">Generado exitosamente</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-gray-400" />
                            <div>
                              <Label className="text-sm text-gray-600">Token verificación</Label>
                              <p className="text-sm text-gray-500 mt-1">No generado</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Alerta de seguridad según el tipo de acción */}
              <div className={`rounded-lg p-4 border ${
                selectedTrailItem.action === 'signature_created' 
                  ? 'bg-green-50 border-green-200' 
                  : selectedTrailItem.action === 'verification'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    selectedTrailItem.action === 'signature_created' 
                      ? 'text-green-600' 
                      : selectedTrailItem.action === 'verification'
                      ? 'text-blue-600'
                      : 'text-red-600'
                  }`} />
                  <div className={`text-sm ${
                    selectedTrailItem.action === 'signature_created' 
                      ? 'text-green-900' 
                      : selectedTrailItem.action === 'verification'
                      ? 'text-blue-900'
                      : 'text-red-900'
                  }`}>
                    <p className="font-medium mb-1">
                      {selectedTrailItem.action === 'signature_created' && 'Firma Digital Aplicada'}
                      {selectedTrailItem.action === 'verification' && 'Verificación Exitosa'}
                      {selectedTrailItem.action === 'revocation' && 'Firma Revocada'}
                    </p>
                    <p className={
                      selectedTrailItem.action === 'signature_created' 
                        ? 'text-green-700' 
                        : selectedTrailItem.action === 'verification'
                        ? 'text-blue-700'
                        : 'text-red-700'
                    }>
                      {selectedTrailItem.action === 'signature_created' && 
                        'Esta receta fue firmada digitalmente con certificado válido. La firma garantiza la autenticidad y no repudio del documento médico.'
                      }
                      {selectedTrailItem.action === 'verification' && 
                        'La receta fue verificada correctamente en farmacia utilizando el código QR/Token. El proceso de dispensación puede continuar.'
                      }
                      {selectedTrailItem.action === 'revocation' && 
                        'La firma digital de esta receta fue revocada. El documento ya no es válido para dispensación.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                Registro creado: {selectedTrailItem.timestamp}
              </div>
              <Button onClick={() => setIsDetailDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
