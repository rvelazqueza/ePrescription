import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  X,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  FileCheck,
  Download,
  Eye,
  Trash2,
  Share2,
  Clock,
  HardDrive,
  FileType,
  Paperclip
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ClinicalDocument {
  id: string;
  name: string;
  type: "lab" | "imaging" | "report" | "consent" | "exam" | "prescription" | "other";
  category: string;
  date: string;
  uploadedBy: string;
  size: string;
  format: "pdf" | "jpg" | "png" | "doc" | "dicom";
  description?: string;
  url?: string;
}

interface ClinicalDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  onUpload?: (document: Omit<ClinicalDocument, "id">) => void;
}

export function ClinicalDocumentsDialog({
  open,
  onOpenChange,
  patientName,
  onUpload,
}: ClinicalDocumentsDialogProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [documentType, setDocumentType] = useState<ClinicalDocument["type"]>("lab");
  const [documentName, setDocumentName] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Tipo de archivo no permitido", {
          description: "Solo se permiten archivos PDF, imágenes (JPG, PNG) y documentos Word",
          duration: 4000,
        });
        return;
      }

      // Validar tamaño (10MB máximo)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("Archivo demasiado grande", {
          description: "El tamaño máximo permitido es 10MB",
          duration: 4000,
        });
        return;
      }

      setSelectedFile(file);
      
      // Crear preview para imágenes
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }

      toast.success("Archivo seleccionado", {
        description: `${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
        duration: 3000,
      });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!documentName.trim()) {
      toast.error("Nombre requerido", {
        description: "Por favor ingrese el nombre del documento",
        duration: 3000,
      });
      return;
    }

    if (!selectedFile) {
      toast.error("Archivo requerido", {
        description: "Por favor seleccione un archivo para subir",
        duration: 3000,
      });
      return;
    }

    setIsUploading(true);

    // Simular subida de archivo
    setTimeout(() => {
      const formatMap: Record<string, ClinicalDocument["format"]> = {
        "application/pdf": "pdf",
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "doc",
      };

      const newDocument: Omit<ClinicalDocument, "id"> = {
        name: documentName,
        type: documentType,
        category: getTypeLabel(documentType),
        date: new Date().toLocaleDateString('es-ES'),
        uploadedBy: "Dr. Carlos Alberto Mendoza Herrera",
        size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
        format: formatMap[selectedFile.type] || "pdf",
        description: documentDescription,
      };

      if (onUpload) {
        onUpload(newDocument);
      }

      toast.success("Documento subido exitosamente", {
        description: `${documentName} se ha guardado correctamente`,
        duration: 3000,
      });

      // Limpiar formulario
      setDocumentName("");
      setDocumentDescription("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setDocumentType("lab");
      setIsUploading(false);
      onOpenChange(false);
    }, 1500);
  };

  const getTypeLabel = (type: ClinicalDocument["type"]) => {
    const labels = {
      lab: "Laboratorio",
      imaging: "Imagen diagnóstica",
      report: "Informe médico",
      consent: "Consentimiento",
      exam: "Examen clínico",
      prescription: "Prescripción",
      other: "Otro",
    };
    return labels[type];
  };

  const getTypeIcon = (type: ClinicalDocument["type"]) => {
    switch (type) {
      case "lab":
        return <FileCheck className="w-4 h-4" />;
      case "imaging":
        return <ImageIcon className="w-4 h-4" />;
      case "report":
        return <FileText className="w-4 h-4" />;
      case "consent":
        return <FileType className="w-4 h-4" />;
      case "exam":
        return <FileCheck className="w-4 h-4" />;
      case "prescription":
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getFormatIcon = (format: string) => {
    if (format === "pdf") {
      return <FileText className="w-8 h-8 text-red-600" />;
    } else if (["jpg", "png"].includes(format)) {
      return <ImageIcon className="w-8 h-8 text-blue-600" />;
    } else {
      return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Subir Documento Clínico
          </DialogTitle>
          <DialogDescription>
            Cargar nuevos documentos clínicos para el paciente {patientName}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Subir documento
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Información
            </TabsTrigger>
          </TabsList>

          {/* Tab: Subir documento */}
          <TabsContent value="upload" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Información del Documento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-type">Tipo de documento *</Label>
                  <Select value={documentType} onValueChange={(value: any) => setDocumentType(value)}>
                    <SelectTrigger id="doc-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lab">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4" />
                          Resultado de laboratorio
                        </div>
                      </SelectItem>
                      <SelectItem value="imaging">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Imagen diagnóstica (RX, TAC, RM)
                        </div>
                      </SelectItem>
                      <SelectItem value="report">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Informe médico
                        </div>
                      </SelectItem>
                      <SelectItem value="consent">
                        <div className="flex items-center gap-2">
                          <FileType className="w-4 h-4" />
                          Consentimiento informado
                        </div>
                      </SelectItem>
                      <SelectItem value="exam">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4" />
                          Examen clínico
                        </div>
                      </SelectItem>
                      <SelectItem value="prescription">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Prescripción médica
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          Otro documento
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc-name">Nombre del documento *</Label>
                  <Input
                    id="doc-name"
                    placeholder="Ej: Hemograma completo - Septiembre 2025"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc-description">Descripción / Observaciones</Label>
                  <Textarea
                    id="doc-description"
                    placeholder="Detalles adicionales sobre el documento..."
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5" />
                  Archivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary hover:bg-blue-50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="font-medium text-gray-900 mb-1">
                        Haga clic para seleccionar un archivo
                      </p>
                      <p className="text-sm text-gray-600">
                        PDF, JPG, PNG o DOC hasta 10MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded border border-gray-300"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-white rounded border border-gray-300 flex items-center justify-center">
                            {getFormatIcon(selectedFile.type.includes("pdf") ? "pdf" : "doc")}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <HardDrive className="w-3 h-3" />
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </div>
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                            {selectedFile.type.includes("pdf") ? "PDF" : 
                             selectedFile.type.includes("image") ? "Imagen" : "Documento"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir documento
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUploading}
              >
                Cancelar
              </Button>
            </div>
          </TabsContent>

          {/* Tab: Información */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-2">Formatos permitidos</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>PDF (.pdf) - Documentos médicos, informes</li>
                      <li>Imágenes (.jpg, .jpeg, .png) - Radiografías, TAC, resonancias</li>
                      <li>Documentos Word (.doc, .docx) - Informes, consentimientos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <HardDrive className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-900">
                    <p className="font-semibold mb-2">Límites de tamaño</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Tamaño máximo por archivo: 10 MB</li>
                      <li>Para archivos más grandes, comprímalos o divídalos</li>
                      <li>Imágenes de alta resolución: use formato JPG comprimido</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900">
                    <p className="font-semibold mb-2">Seguridad y privacidad</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Todos los documentos se almacenan de forma segura y encriptada</li>
                      <li>Solo personal médico autorizado puede acceder a los documentos</li>
                      <li>Se mantiene un registro completo de accesos y descargas</li>
                      <li>Cumple con normativas HIPAA, GDPR y protección de datos médicos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <FileCheck className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-900">
                    <p className="font-semibold mb-2">Tipos de documentos recomendados</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="p-2 bg-gray-50 rounded border border-gray-200">
                        <p className="font-medium text-xs">Laboratorio</p>
                        <p className="text-xs text-gray-600">Hemogramas, química sanguínea</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200">
                        <p className="font-medium text-xs">Imágenes</p>
                        <p className="text-xs text-gray-600">RX, TAC, RM, ecografías</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200">
                        <p className="font-medium text-xs">Informes</p>
                        <p className="text-xs text-gray-600">Consultas, evaluaciones</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200">
                        <p className="font-medium text-xs">Consentimientos</p>
                        <p className="text-xs text-gray-600">Procedimientos, tratamientos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}