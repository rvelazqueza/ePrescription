import { useState } from "react";
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
import {
  Network,
  Upload,
  Download,
  Database,
  Search,
  FilterX,
  Eye,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink,
  FileJson,
  Code,
  Activity,
  Send,
  Inbox,
  Link2,
  Globe,
  Server,
  Clock,
  Shield,
  Info,
  FileText,
  User,
  Building2,
  Hash
} from "lucide-react";

// Datos mock de IDs FHIR
const mockFHIRIds = [
  {
    id: "FHIR-001",
    resourceType: "Patient",
    internalId: "PAT-0012",
    fhirId: "urn:uuid:a8d5f7e9-3c2b-4d6e-8f1a-9b7c3d4e5f6a",
    name: "María Elena González Rodríguez",
    status: "active",
    lastSync: "2024-10-01 08:30",
    version: "R4",
    system: "ePrescription Hospital"
  },
  {
    id: "FHIR-002",
    resourceType: "Practitioner",
    internalId: "DOC-001",
    fhirId: "urn:uuid:b9e6g8f0-4d3c-5e7f-9g2b-0c8d4e5f6g7h",
    name: "Dr. Carlos Andrés Martínez López",
    status: "active",
    lastSync: "2024-10-01 07:15",
    version: "R4",
    system: "ePrescription Hospital"
  },
  {
    id: "FHIR-003",
    resourceType: "MedicationRequest",
    internalId: "RX-2024-0192",
    fhirId: "urn:uuid:c0f7h9g1-5e4d-6f8g-0h3c-1d9e5f6g7h8i",
    name: "Receta - Elena Martínez",
    status: "active",
    lastSync: "2024-10-01 08:30",
    version: "R4",
    system: "ePrescription Hospital"
  },
  {
    id: "FHIR-004",
    resourceType: "Medication",
    internalId: "MED-1001",
    fhirId: "urn:uuid:d1g8i0h2-6f5e-7g9h-1i4d-2e0f6g7h8i9j",
    name: "Paracetamol 500mg",
    status: "active",
    lastSync: "2024-09-30 14:20",
    version: "R4",
    system: "ePrescription Hospital"
  },
  {
    id: "FHIR-005",
    resourceType: "Organization",
    internalId: "ORG-001",
    fhirId: "urn:uuid:e2h9j1i3-7g6f-8h0i-2j5e-3f1g7h8i9j0k",
    name: "Hospital General Central",
    status: "active",
    lastSync: "2024-09-28 10:00",
    version: "R4",
    system: "ePrescription Hospital"
  }
];

// Datos mock de exportaciones FHIR
const mockFHIRExports = [
  {
    id: "EXP-001",
    prescriptionId: "RX-2024-0192",
    patientName: "Elena Martínez",
    doctorName: "Dr. Carlos Martínez",
    exportDate: "2024-10-01",
    exportTime: "08:35",
    resourceType: "MedicationRequest",
    version: "FHIR R4",
    format: "JSON",
    size: "12.4 KB",
    status: "completed",
    destination: "Sistema Nacional de Recetas",
    responseCode: "200 OK"
  },
  {
    id: "EXP-002",
    prescriptionId: "RX-2024-0195",
    patientName: "Roberto Sánchez",
    doctorName: "Dra. Laura Ramírez",
    exportDate: "2024-10-01",
    exportTime: "11:22",
    resourceType: "MedicationRequest",
    version: "FHIR R4",
    format: "JSON",
    size: "14.8 KB",
    status: "completed",
    destination: "Red de Farmacias Nacional",
    responseCode: "200 OK"
  },
  {
    id: "EXP-003",
    prescriptionId: "RX-2024-0178",
    patientName: "Carlos Ramírez",
    doctorName: "Dr. Carlos Martínez",
    exportDate: "2024-09-30",
    exportTime: "16:45",
    resourceType: "MedicationRequest",
    version: "FHIR R4",
    format: "JSON",
    size: "11.2 KB",
    status: "failed",
    destination: "Sistema Nacional de Recetas",
    responseCode: "500 Error"
  }
];

// Datos mock de eventos HL7
const mockHL7Events = [
  {
    id: "HL7-001",
    timestamp: "2024-10-01 14:35:22",
    eventType: "ADT^A01",
    eventLabel: "Admisión de paciente",
    messageId: "MSG-2024-10-01-001",
    patientId: "PAT-0012",
    patientName: "María González",
    facility: "Hospital General Central",
    sendingApp: "HIS Sistema",
    receivingApp: "ePrescription",
    status: "processed",
    direction: "inbound",
    messageSize: "2.4 KB",
    processingTime: "45 ms"
  },
  {
    id: "HL7-002",
    timestamp: "2024-10-01 14:28:15",
    eventType: "ORM^O01",
    eventLabel: "Nueva orden médica",
    messageId: "MSG-2024-10-01-002",
    patientId: "PAT-0045",
    patientName: "Carlos Ramírez",
    facility: "Hospital General Central",
    sendingApp: "ePrescription",
    receivingApp: "Sistema Farmacia",
    status: "processed",
    direction: "outbound",
    messageSize: "3.2 KB",
    processingTime: "52 ms"
  },
  {
    id: "HL7-003",
    timestamp: "2024-10-01 13:45:08",
    eventType: "ORU^R01",
    eventLabel: "Resultado de laboratorio",
    messageId: "MSG-2024-10-01-003",
    patientId: "PAT-0089",
    patientName: "Ana Herrera",
    facility: "Laboratorio Central",
    sendingApp: "LIS Sistema",
    receivingApp: "ePrescription",
    status: "processed",
    direction: "inbound",
    messageSize: "5.6 KB",
    processingTime: "78 ms"
  },
  {
    id: "HL7-004",
    timestamp: "2024-10-01 12:30:45",
    eventType: "ADT^A08",
    eventLabel: "Actualización de paciente",
    messageId: "MSG-2024-10-01-004",
    patientId: "PAT-0067",
    patientName: "Roberto Sánchez",
    facility: "Hospital General Central",
    sendingApp: "HIS Sistema",
    receivingApp: "ePrescription",
    status: "processed",
    direction: "inbound",
    messageSize: "2.1 KB",
    processingTime: "38 ms"
  },
  {
    id: "HL7-005",
    timestamp: "2024-10-01 11:15:30",
    eventType: "RDE^O11",
    eventLabel: "Codificación de farmacia",
    messageId: "MSG-2024-10-01-005",
    patientId: "PAT-0123",
    patientName: "Elena Martínez",
    facility: "Farmacia Central",
    sendingApp: "Sistema Farmacia",
    receivingApp: "ePrescription",
    status: "error",
    direction: "inbound",
    messageSize: "4.8 KB",
    processingTime: "125 ms"
  }
];

// PÁGINA 1: IDs FHIR
export function FHIRIDsPage() {
  const [fhirIds, setFhirIds] = useState(mockFHIRIds);
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<typeof mockFHIRIds[0] | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  const filteredIds = fhirIds.filter(item => {
    const matchesSearch = 
      normalizedIncludes(item.name, searchTerm) ||
      normalizedIncludes(item.fhirId, searchTerm) ||
      normalizedIncludes(item.internalId, searchTerm);
    const matchesResource = resourceFilter === "all" || item.resourceType === resourceFilter;
    return matchesSearch && matchesResource;
  });

  const resourceTypes = Array.from(new Set(mockFHIRIds.map(i => i.resourceType)));

  const stats = {
    total: fhirIds.length,
    patients: fhirIds.filter(i => i.resourceType === 'Patient').length,
    practitioners: fhirIds.filter(i => i.resourceType === 'Practitioner').length,
    medications: fhirIds.filter(i => i.resourceType === 'Medication' || i.resourceType === 'MedicationRequest').length
  };

  const handleCopyFHIRId = (fhirId: string) => {
    navigator.clipboard.writeText(fhirId);
    toast.success('ID FHIR copiado', {
      description: 'El identificador ha sido copiado al portapapeles',
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Network className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">IDs FHIR (Fast Healthcare Interoperability Resources)</h1>
              <p className="text-cyan-100 text-sm">Mapeo de identificadores para interoperabilidad estándar HL7 FHIR</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-cyan-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total recursos</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <Database className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pacientes</p>
                <p className="text-2xl font-semibold">{stats.patients}</p>
              </div>
              <Network className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profesionales</p>
                <p className="text-2xl font-semibold">{stats.practitioners}</p>
              </div>
              <Network className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medicamentos</p>
                <p className="text-2xl font-semibold">{stats.medications}</p>
              </div>
              <Network className="w-8 h-8 text-green-500" />
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
                placeholder="Buscar por nombre, ID interno o ID FHIR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los recursos</SelectItem>
                {resourceTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recursos FHIR Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de recurso</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>ID Interno</TableHead>
                <TableHead>ID FHIR</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Última sync</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIds.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline" className="bg-cyan-100 text-cyan-700 border-cyan-300">
                      {item.resourceType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono text-sm">{item.internalId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs truncate max-w-xs">{item.fhirId}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleCopyFHIRId(item.fhirId)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      {item.version}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{item.lastSync}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedId(item);
                      setIsDetailsPanelOpen(true);
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-cyan-200 bg-cyan-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-cyan-900 mb-1">Estándar HL7 FHIR R4</h4>
              <ul className="space-y-1 text-sm text-cyan-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Identificadores únicos globales (UUID) para cada recurso</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Sincronización bidireccional con sistemas externos compatibles FHIR</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Cumple con normativas de interoperabilidad HL7 International</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Detalles de ID FHIR */}
      {selectedId && (
        <Dialog open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-600" />
                Detalles del Recurso FHIR - {selectedId.id}
              </DialogTitle>
              <DialogDescription>
                Información completa del recurso HL7 FHIR y datos de interoperabilidad
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Información Principal */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {selectedId.resourceType === 'Patient' && <User className="w-5 h-5 text-cyan-600" />}
                    {selectedId.resourceType === 'Practitioner' && <User className="w-5 h-5 text-blue-600" />}
                    {selectedId.resourceType === 'MedicationRequest' && <FileText className="w-5 h-5 text-green-600" />}
                    {selectedId.resourceType === 'Medication' && <Database className="w-5 h-5 text-purple-600" />}
                    {selectedId.resourceType === 'Organization' && <Building2 className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{selectedId.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Tipo de recurso: <span className="font-mono">{selectedId.resourceType}</span>
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    {selectedId.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>

              {/* Identificadores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Hash className="w-4 h-4 text-cyan-600" />
                    Identificadores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600">ID FHIR (UUID Global)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-slate-100 px-3 py-2 rounded text-sm font-mono break-all">
                        {selectedId.fhirId}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyFHIRId(selectedId.fhirId)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">ID Interno del Sistema</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-slate-100 px-3 py-2 rounded text-sm font-mono">
                        {selectedId.internalId}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedId.internalId);
                          toast.success('ID copiado', {
                            description: 'El ID interno ha sido copiado al portapapeles',
                          });
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información Técnica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Server className="w-4 h-4 text-blue-600" />
                    Información Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Versión FHIR</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                          {selectedId.version}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Sistema de origen</Label>
                      <p className="text-sm mt-1">{selectedId.system}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Última sincronización</Label>
                      <p className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {selectedId.lastSync}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Estado del recurso</Label>
                      <Badge 
                        variant="outline" 
                        className={selectedId.status === 'active' 
                          ? 'bg-green-100 text-green-700 border-green-300 mt-1' 
                          : 'bg-gray-100 text-gray-700 border-gray-300 mt-1'
                        }
                      >
                        {selectedId.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endpoints FHIR */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="w-4 h-4 text-purple-600" />
                    Endpoints de Acceso FHIR
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">GET (Consulta individual)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-slate-100 px-3 py-2 rounded text-xs font-mono break-all">
                        https://fhir.eprescription.health/api/{selectedId.resourceType}/{selectedId.internalId}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://fhir.eprescription.health/api/${selectedId.resourceType}/${selectedId.internalId}`
                          );
                          toast.success('URL copiada', {
                            description: 'El endpoint ha sido copiado al portapapeles',
                          });
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">SEARCH (Búsqueda por tipo)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-slate-100 px-3 py-2 rounded text-xs font-mono break-all">
                        https://fhir.eprescription.health/api/{selectedId.resourceType}?_id={selectedId.internalId}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://fhir.eprescription.health/api/${selectedId.resourceType}?_id=${selectedId.internalId}`
                          );
                          toast.success('URL copiada', {
                            description: 'El endpoint ha sido copiado al portapapeles',
                          });
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ejemplo de Estructura JSON FHIR */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code className="w-4 h-4 text-green-600" />
                    Estructura JSON FHIR (Ejemplo)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs font-mono">
{`{
  "resourceType": "${selectedId.resourceType}",
  "id": "${selectedId.internalId}",
  "meta": {
    "versionId": "1",
    "lastUpdated": "${selectedId.lastSync}:00.000Z",
    "profile": [
      "http://hl7.org/fhir/StructureDefinition/${selectedId.resourceType}"
    ]
  },
  "identifier": [
    {
      "system": "urn:ietf:rfc:3986",
      "value": "${selectedId.fhirId}"
    },
    {
      "system": "https://eprescription.health/fhir/identifier",
      "value": "${selectedId.internalId}"
    }
  ],
  "status": "${selectedId.status}",
  ${selectedId.resourceType === 'Patient' ? `"name": [
    {
      "use": "official",
      "text": "${selectedId.name}"
    }
  ],
  "gender": "female",
  "birthDate": "1985-03-15"` : ''}${selectedId.resourceType === 'Practitioner' ? `"name": [
    {
      "use": "official",
      "text": "${selectedId.name}"
    }
  ],
  "qualification": [
    {
      "code": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0360",
            "code": "MD",
            "display": "Doctor of Medicine"
          }
        ]
      }
    }
  ]` : ''}${selectedId.resourceType === 'Medication' ? `"code": {
    "coding": [
      {
        "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
        "code": "161",
        "display": "${selectedId.name}"
      }
    ]
  }` : ''}
}`}
                    </pre>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const jsonExample = `{
  "resourceType": "${selectedId.resourceType}",
  "id": "${selectedId.internalId}",
  "identifier": [{"system": "urn:ietf:rfc:3986", "value": "${selectedId.fhirId}"}],
  "status": "${selectedId.status}"
}`;
                        navigator.clipboard.writeText(jsonExample);
                        toast.success('JSON copiado', {
                          description: 'El ejemplo JSON ha sido copiado al portapapeles',
                        });
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.info('Exportación FHIR', {
                          description: 'Esta función exportaría el recurso completo en formato FHIR',
                        });
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Recurso
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Información de Estándares */}
              <div className="rounded-lg p-4 border bg-cyan-50 border-cyan-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-cyan-900">
                    <p className="font-medium mb-2">Cumplimiento de Estándares HL7 FHIR R4</p>
                    <ul className="space-y-1 text-cyan-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Recurso compatible con HL7 FHIR R4 (Fast Healthcare Interoperability Resources)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Identificador UUID único global siguiendo RFC 4122</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Compatible con sistemas de interoperabilidad nacional e internacional</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Sincronización bidireccional con repositorios FHIR externos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Activity className="w-4 h-4" />
                Última sincronización: {selectedId.lastSync}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.info('Sincronización', {
                      description: 'Esta función sincronizaría el recurso con sistemas externos',
                    });
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sincronizar
                </Button>
                <Button onClick={() => setIsDetailsPanelOpen(false)}>
                  Cerrar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// PÁGINA 2: EXPORTAR RECETA (FHIR)
export function ExportarFHIRPage() {
  const [exports, setExports] = useState(mockFHIRExports);
  const [selectedPrescription, setSelectedPrescription] = useState<string>("");
  const [destination, setDestination] = useState("");
  const [format, setFormat] = useState("JSON");
  const [isExporting, setIsExporting] = useState(false);

  const generateFHIRResource = (prescriptionId: string) => {
    // Mapeo de recetas a pacientes
    const prescriptionData: Record<string, { patient: string; doctor: string; medication: string }> = {
      "RX-2024-0198": { patient: "María González", doctor: "Dr. Carlos Martínez", medication: "Paracetamol 500mg" },
      "RX-2024-0199": { patient: "Carlos Ramírez", doctor: "Dra. Laura Ramírez", medication: "Ibuprofeno 400mg" },
      "RX-2024-0200": { patient: "Ana Herrera", doctor: "Dr. Roberto Sánchez", medication: "Amoxicilina 500mg" }
    };

    const data = prescriptionData[prescriptionId] || prescriptionData["RX-2024-0198"];
    
    const fhirResource = {
      resourceType: "MedicationRequest",
      id: prescriptionId.toLowerCase().replace(/-/g, ''),
      meta: {
        versionId: "1",
        lastUpdated: new Date().toISOString(),
        profile: ["http://hl7.org/fhir/StructureDefinition/MedicationRequest"]
      },
      text: {
        status: "generated",
        div: `<div xmlns=\"http://www.w3.org/1999/xhtml\">Receta médica para ${data.patient}</div>`
      },
      identifier: [
        {
          use: "official",
          system: "http://eprescription.hospital/prescription-id",
          value: prescriptionId
        }
      ],
      status: "active",
      intent: "order",
      priority: "routine",
      medicationCodeableConcept: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "387517004",
            display: data.medication
          }
        ],
        text: data.medication
      },
      subject: {
        reference: `Patient/${prescriptionId}-pat`,
        display: data.patient,
        type: "Patient"
      },
      encounter: {
        reference: `Encounter/${prescriptionId}-enc`,
        display: "Consulta externa"
      },
      authoredOn: new Date().toISOString(),
      requester: {
        reference: `Practitioner/${prescriptionId}-doc`,
        display: data.doctor,
        type: "Practitioner"
      },
      reasonCode: [
        {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "25064002",
              display: "Dolor moderado"
            }
          ],
          text: "Tratamiento sintomático"
        }
      ],
      dosageInstruction: [
        {
          sequence: 1,
          text: "Tomar 1 comprimido cada 8 horas por 5 días",
          timing: {
            repeat: {
              frequency: 1,
              period: 8,
              periodUnit: "h",
              boundsDuration: {
                value: 5,
                unit: "days",
                system: "http://unitsofmeasure.org",
                code: "d"
              }
            }
          },
          route: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "26643006",
                display: "Oral"
              }
            ]
          },
          doseAndRate: [
            {
              type: {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/dose-rate-type",
                    code: "ordered",
                    display: "Ordered"
                  }
                ]
              },
              doseQuantity: {
                value: 1,
                unit: "comprimido",
                system: "http://unitsofmeasure.org",
                code: "1"
              }
            }
          ]
        }
      ],
      dispenseRequest: {
        validityPeriod: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        numberOfRepeatsAllowed: 0,
        quantity: {
          value: 15,
          unit: "comprimidos",
          system: "http://unitsofmeasure.org",
          code: "1"
        },
        expectedSupplyDuration: {
          value: 5,
          unit: "días",
          system: "http://unitsofmeasure.org",
          code: "d"
        }
      },
      signature: [
        {
          type: [
            {
              system: "urn:iso-astm:E1762-95:2013",
              code: "1.2.840.10065.1.12.1.1",
              display: "Author's Signature"
            }
          ],
          when: new Date().toISOString(),
          who: {
            reference: `Practitioner/${prescriptionId}-doc`,
            display: data.doctor
          },
          data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        }
      ]
    };

    return fhirResource;
  };

  const downloadFHIRFile = (data: any, filename: string, format: string) => {
    let content: string;
    let mimeType: string;
    
    if (format === "JSON") {
      content = JSON.stringify(data, null, 2);
      mimeType = "application/fhir+json";
    } else {
      // Conversión simple a XML (en producción usar librería XML)
      content = `<?xml version="1.0" encoding="UTF-8"?>
<MedicationRequest xmlns="http://hl7.org/fhir">
  <id value="${data.id}"/>
  <status value="${data.status}"/>
  <intent value="${data.intent}"/>
</MedicationRequest>`;
      mimeType = "application/fhir+xml";
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!selectedPrescription || !destination) {
      toast.error('Campos incompletos', {
        description: 'Selecciona una receta y un destino',
      });
      return;
    }

    setIsExporting(true);

    try {
      // Simular conexión al sistema externo
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar recurso FHIR
      const fhirResource = generateFHIRResource(selectedPrescription);
      
      // Calcular tamaño del archivo
      const jsonString = JSON.stringify(fhirResource, null, 2);
      const sizeInKB = (new Blob([jsonString]).size / 1024).toFixed(1);

      // Generar ID único de exportación
      const exportId = `EXP-${String(exports.length + 1).padStart(3, '0')}`;
      
      // Obtener datos de la receta
      const prescriptionData: Record<string, { patient: string; doctor: string }> = {
        "RX-2024-0198": { patient: "María González", doctor: "Dr. Carlos Martínez" },
        "RX-2024-0199": { patient: "Carlos Ramírez", doctor: "Dra. Laura Ramírez" },
        "RX-2024-0200": { patient: "Ana Herrera", doctor: "Dr. Roberto Sánchez" }
      };
      
      const rxData = prescriptionData[selectedPrescription] || prescriptionData["RX-2024-0198"];
      
      // Obtener nombre del destino
      const destinationNames: Record<string, string> = {
        "nacional": "Sistema Nacional de Recetas",
        "farmacias": "Red de Farmacias Nacional",
        "seguro": "Sistema de Aseguradoras",
        "his": "HIS Hospital Regional"
      };

      const now = new Date();
      const exportDate = now.toISOString().split('T')[0];
      const exportTime = now.toTimeString().slice(0, 5);

      // Crear nuevo registro de exportación
      const newExport = {
        id: exportId,
        prescriptionId: selectedPrescription,
        patientName: rxData.patient,
        doctorName: rxData.doctor,
        exportDate: exportDate,
        exportTime: exportTime,
        resourceType: "MedicationRequest",
        version: "FHIR R4",
        format: format,
        size: `${sizeInKB} KB`,
        status: "completed" as const,
        destination: destinationNames[destination] || destination,
        responseCode: "200 OK"
      };

      // Agregar al historial (al inicio)
      setExports([newExport, ...exports]);

      // Descargar archivo FHIR
      const filename = `${selectedPrescription}_FHIR_R4_${Date.now()}.${format.toLowerCase()}`;
      downloadFHIRFile(fhirResource, filename, format);

      // Notificación de éxito
      toast.success('✓ Receta exportada exitosamente', {
        description: `${destinationNames[destination]} | ID: ${exportId} | Tamaño: ${sizeInKB} KB | Respuesta: 200 OK`,
        duration: 5000,
      });

      // Limpiar formulario
      setSelectedPrescription("");
      setDestination("");
      
    } catch (error) {
      toast.error('Error en la exportación', {
        description: 'No se pudo completar la exportación FHIR. Intenta nuevamente.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const stats = {
    total: exports.length,
    completed: exports.filter(e => e.status === 'completed').length,
    failed: exports.filter(e => e.status === 'failed').length,
    today: exports.filter(e => e.exportDate === '2024-10-01').length
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Exportar Receta (FHIR)</h1>
              <p className="text-green-100 text-sm">Exportación de recetas en formato HL7 FHIR a sistemas externos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total exportaciones</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <Send className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exitosas</p>
                <p className="text-2xl font-semibold">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fallidas</p>
                <p className="text-2xl font-semibold">{stats.failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoy</p>
                <p className="text-2xl font-semibold">{stats.today}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Exportación FHIR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Receta a exportar</Label>
              <Select value={selectedPrescription} onValueChange={setSelectedPrescription}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecciona una receta..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RX-2024-0198">RX-2024-0198 - María González</SelectItem>
                  <SelectItem value="RX-2024-0199">RX-2024-0199 - Carlos Ramírez</SelectItem>
                  <SelectItem value="RX-2024-0200">RX-2024-0200 - Ana Herrera</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sistema destino</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecciona el destino..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nacional">Sistema Nacional de Recetas</SelectItem>
                  <SelectItem value="farmacias">Red de Farmacias Nacional</SelectItem>
                  <SelectItem value="seguro">Sistema de Aseguradoras</SelectItem>
                  <SelectItem value="his">HIS Hospital Regional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Formato</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JSON">JSON (recomendado)</SelectItem>
                  <SelectItem value="XML">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Exportación FHIR MedicationRequest</p>
                  <p className="text-blue-700">Incluye: paciente, médico, medicamentos, dosis, firma digital y código QR</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleExport} 
              className="w-full"
              disabled={isExporting}
            >
              <Upload className={`w-4 h-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
              {isExporting ? 'Exportando a FHIR...' : 'Exportar receta'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview JSON FHIR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
              <pre>{`{
  "resourceType": "MedicationRequest",
  "id": "rx-2024-0198",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2024-10-01T14:35:00Z"
  },
  "status": "active",
  "intent": "order",
  "medicationCodeableConcept": {
    "coding": [{
      "system": "http://snomed.info/sct",
      "code": "387517004",
      "display": "Paracetamol 500mg"
    }]
  },
  "subject": {
    "reference": "Patient/pat-0012",
    "display": "María González"
  },
  "requester": {
    "reference": "Practitioner/doc-001",
    "display": "Dr. Carlos Martínez"
  },
  "dosageInstruction": [{
    "text": "1 tableta cada 8 horas",
    "timing": {
      "repeat": {
        "frequency": 1,
        "period": 8,
        "periodUnit": "h"
      }
    }
  }]
}`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Exportaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Receta</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Respuesta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exports.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>
                    <div className="text-sm">
                      <p>{exp.exportDate}</p>
                      <p className="text-gray-600">{exp.exportTime}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{exp.prescriptionId}</TableCell>
                  <TableCell>{exp.patientName}</TableCell>
                  <TableCell className="text-sm">{exp.destination}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      {exp.format}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{exp.size}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      exp.status === 'completed' 
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    }>
                      {exp.status === 'completed' ? 'Exitosa' : 'Fallida'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-mono ${
                      exp.status === 'completed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {exp.responseCode}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// PÁGINA 3: IMPORTAR DATOS EXTERNOS
export function ImportarDatosPage() {
  const [importType, setImportType] = useState("patient");
  const [sourceSystem, setSourceSystem] = useState("");
  const [fileContent, setFileContent] = useState("");

  const handleImport = () => {
    if (!sourceSystem || !fileContent) {
      toast.error('Campos incompletos', {
        description: 'Selecciona el sistema origen e ingresa el contenido FHIR',
      });
      return;
    }

    toast.success('Importación iniciada', {
      description: 'Los datos FHIR están siendo procesados e importados',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Download className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Importar Datos Externos</h1>
              <p className="text-orange-100 text-sm">Recepción e integración de recursos FHIR desde sistemas externos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Importación FHIR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tipo de recurso</Label>
              <Select value={importType} onValueChange={setImportType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Paciente (Patient)</SelectItem>
                  <SelectItem value="practitioner">Profesional (Practitioner)</SelectItem>
                  <SelectItem value="medication">Medicamento (Medication)</SelectItem>
                  <SelectItem value="observation">Observación (Observation)</SelectItem>
                  <SelectItem value="condition">Condición (Condition)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sistema origen</Label>
              <Select value={sourceSystem} onValueChange={setSourceSystem}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecciona el sistema origen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="his_regional">HIS Hospital Regional</SelectItem>
                  <SelectItem value="laboratorio">Sistema de Laboratorio</SelectItem>
                  <SelectItem value="radiologia">Sistema de Radiología</SelectItem>
                  <SelectItem value="otro_hospital">Otro Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Contenido FHIR (JSON)</Label>
              <Textarea
                placeholder='Pega aquí el JSON FHIR...'
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                rows={12}
                className="font-mono text-xs mt-2"
              />
            </div>

            <Button onClick={handleImport} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Importar recurso
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validación y Mapeo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Validaciones automáticas</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validación de esquema FHIR R4</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verificación de integridad referencial</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Detección de duplicados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mapeo automático de campos</span>
                </li>
              </ul>
            </div>

            <div>
              <Label className="mb-3 block">Campos detectados</Label>
              <div className="space-y-2 border rounded-lg p-3 max-h-64 overflow-auto">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-mono">resourceType</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                    ✓ Válido
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-mono">id</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                    ✓ Válido
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-mono">meta.lastUpdated</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                    ✓ Válido
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-mono">identifier</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                    ✓ Válido
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-900 mb-1">Listo para importar</p>
                  <p className="text-green-700">El recurso pasó todas las validaciones</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// PÁGINA 4: REGISTRO HL7 EVENTOS
export function EventosHL7Page() {
  const [events, setEvents] = useState(mockHL7Events);
  const [searchTerm, setSearchTerm] = useState("");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simular llamada al servidor HL7
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Recargar datos (en producción, esto vendría de una API real)
    setEvents(mockHL7Events);
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    toast.success('Eventos HL7 actualizados', {
      description: `${mockHL7Events.length} mensajes HL7 cargados - Última actualización: ${timeString}`,
      duration: 4000,
    });
    
    setIsRefreshing(false);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      normalizedIncludes(event.patientName, searchTerm) ||
      normalizedIncludes(event.messageId, searchTerm) ||
      normalizedIncludes(event.eventLabel, searchTerm);
    const matchesDirection = directionFilter === "all" || event.direction === directionFilter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesDirection && matchesStatus;
  });

  const stats = {
    total: events.length,
    inbound: events.filter(e => e.direction === 'inbound').length,
    outbound: events.filter(e => e.direction === 'outbound').length,
    errors: events.filter(e => e.status === 'error').length,
    avgProcessingTime: "60 ms"
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Registro HL7 Eventos</h1>
              <p className="text-indigo-100 text-sm">Monitoreo de mensajes HL7 v2.x entrantes y salientes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total mensajes</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entrantes</p>
                <p className="text-2xl font-semibold">{stats.inbound}</p>
              </div>
              <Inbox className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Salientes</p>
                <p className="text-2xl font-semibold">{stats.outbound}</p>
              </div>
              <Send className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errores</p>
                <p className="text-2xl font-semibold">{stats.errors}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo prom.</p>
                <p className="text-2xl font-semibold">{stats.avgProcessingTime}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
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
                placeholder="Buscar por paciente, mensaje o evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={directionFilter} onValueChange={setDirectionFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las direcciones</SelectItem>
                <SelectItem value="inbound">Entrantes</SelectItem>
                <SelectItem value="outbound">Salientes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="processed">Procesados</SelectItem>
                <SelectItem value="error">Errores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Log de Mensajes HL7</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Origen → Destino</TableHead>
                <TableHead>ID Mensaje</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="text-sm">{event.timestamp}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{event.eventLabel}</p>
                      <p className="text-xs text-gray-600 font-mono">{event.eventType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{event.patientName}</p>
                      <p className="text-gray-600 font-mono text-xs">{event.patientId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      event.direction === 'inbound' 
                        ? "bg-blue-100 text-blue-700 border-blue-300"
                        : "bg-green-100 text-green-700 border-green-300"
                    }>
                      {event.direction === 'inbound' ? 'Entrante' : 'Saliente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1">
                      <span className="truncate max-w-24">{event.sendingApp}</span>
                      <span>→</span>
                      <span className="truncate max-w-24">{event.receivingApp}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{event.messageId}</TableCell>
                  <TableCell className="text-sm">{event.messageSize}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                      {event.processingTime}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      event.status === 'processed' 
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    }>
                      {event.status === 'processed' ? 'Procesado' : 'Error'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-indigo-200 bg-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-indigo-900 mb-1">Protocolo HL7 v2.x</h4>
              <ul className="space-y-1 text-sm text-indigo-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Mensajería estándar para intercambio de información clínica</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Soporta: ADT (admisiones), ORM (órdenes), ORU (resultados), RDE (farmacia)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Integración bidireccional con sistemas HIS, LIS y RIS</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
