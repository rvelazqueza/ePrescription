import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Shield, 
  Lock,
  AlertTriangle,
  Info
} from "lucide-react";
import { TipoReceta, MedicamentoExtendido } from "./EnhancedMedicinePanel";
import { toast } from "sonner";

interface PrescriptionManagerProps {
  tipoReceta: TipoReceta;
  medicamentos: MedicamentoExtendido[];
  onAddMedicine: () => void;
  maxMedicamentosPermitidos: number;
}

// Determinar si un medicamento es controlado
const esControlado = (medicamento: MedicamentoExtendido): boolean => {
  const controlados = [
    "morfina", "fentanilo", "oxicodona", "metadona", "tramadol",
    "diazepam", "alprazolam", "clonazepam", "lorazepam", "midazolam",
    "fenobarbital", "metilfenidato", "anfetamina"
  ];
  
  return controlados.some(med => 
    medicamento.componenteActivo?.toLowerCase().includes(med)
  );
};

// Determinar si es antimicrobiano
const esAntimicrobiano = (medicamento: MedicamentoExtendido): boolean => {
  const antimicrobianos = [
    "amoxicilina", "ampicilina", "penicilina", "cefalexina", "cefuroxima",
    "azitromicina", "claritromicina", "eritromicina", "ciprofloxacina",
    "levofloxacina", "doxiciclina", "tetraciclina", "metronidazol"
  ];
  
  return antimicrobianos.some(med => 
    medicamento.componenteActivo?.toLowerCase().includes(med)
  );
};

export function PrescriptionManager({
  tipoReceta,
  medicamentos,
  onAddMedicine,
  maxMedicamentosPermitidos
}: PrescriptionManagerProps) {
  
  // Contar medicamentos por tipo
  const medicamentosControlados = medicamentos.filter(esControlado).length;
  const medicamentosAntimicrobianos = medicamentos.filter(esAntimicrobiano).length;
  const medicamentosLibres = medicamentos.filter(m => !esControlado(m) && !esAntimicrobiano(m)).length;
  const totalMedicamentos = medicamentos.length;

  // Determinar si se puede agregar más medicamentos
  const puedeAgregarControlado = () => {
    if (tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos") {
      return medicamentosControlados < 1;
    }
    return false;
  };

  const puedeAgregarAntimicrobiano = () => {
    if (tipoReceta === "antimicrobianos") {
      return medicamentosAntimicrobianos < 3;
    }
    return false;
  };

  const puedeAgregarLibre = () => {
    // Los medicamentos libres no tienen límite
    return tipoReceta === "libre" || medicamentosControlados >= 1;
  };

  const handleAgregarMedicamento = () => {
    // Validar límites según tipo de receta
    if (tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos") {
      if (medicamentosControlados >= 1) {
        toast.warning(
          "Límite alcanzado para medicamentos controlados",
          {
            description: "Solo se permite 1 medicamento controlado por receta. Puede agregar medicamentos de receta libre en una nueva receta."
          }
        );
        return;
      }
    }

    if (tipoReceta === "antimicrobianos") {
      if (medicamentosAntimicrobianos >= 3) {
        toast.warning(
          "Límite alcanzado para antimicrobianos",
          {
            description: "Solo se permiten hasta 3 medicamentos antimicrobianos por receta."
          }
        );
        return;
      }
    }

    onAddMedicine();
  };

  // Determinar color de alerta según límites
  const getAlertVariant = (): "default" | "destructive" => {
    if (tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos") {
      return medicamentosControlados >= 1 ? "destructive" : "default";
    }
    if (tipoReceta === "antimicrobianos") {
      return medicamentosAntimicrobianos >= 3 ? "destructive" : "default";
    }
    return "default";
  };

  return (
    <div className="space-y-4">
      {/* Información del tipo de receta y límites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Control de Medicamentos por Receta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tipo de receta actual */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Receta Actual</p>
              <p className="font-medium">{tipoReceta.toUpperCase()}</p>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              {totalMedicamentos} / {maxMedicamentosPermitidos === Infinity ? "∞" : maxMedicamentosPermitidos}
            </Badge>
          </div>

          {/* Contadores por tipo */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Controlados</p>
              <p className={`text-2xl font-bold ${medicamentosControlados >= 1 ? 'text-red-600' : 'text-green-600'}`}>
                {medicamentosControlados}
              </p>
              <p className="text-xs text-muted-foreground">
                {(tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos") ? "Máx: 1" : "N/A"}
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Antimicrobianos</p>
              <p className={`text-2xl font-bold ${medicamentosAntimicrobianos >= 3 ? 'text-red-600' : 'text-blue-600'}`}>
                {medicamentosAntimicrobianos}
              </p>
              <p className="text-xs text-muted-foreground">
                {tipoReceta === "antimicrobianos" ? "Máx: 3" : "N/A"}
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Libres</p>
              <p className="text-2xl font-bold text-green-600">
                {medicamentosLibres}
              </p>
              <p className="text-xs text-muted-foreground">Sin límite</p>
            </div>
          </div>

          {/* Alertas según límites */}
          {(tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos") && medicamentosControlados >= 1 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Límite Alcanzado</AlertTitle>
              <AlertDescription>
                Ha alcanzado el máximo de medicamentos controlados permitidos (1 por receta).
                Para prescribir más medicamentos controlados, debe crear una nueva receta.
                Puede continuar agregando medicamentos de receta libre.
              </AlertDescription>
            </Alert>
          )}

          {tipoReceta === "antimicrobianos" && medicamentosAntimicrobianos >= 3 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Límite Alcanzado</AlertTitle>
              <AlertDescription>
                Ha alcanzado el máximo de medicamentos antimicrobianos permitidos (3 por receta).
                Para prescribir más antimicrobianos, debe crear una nueva receta.
              </AlertDescription>
            </Alert>
          )}

          {/* Información general */}
          {tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos" ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Normativa de Medicamentos Controlados</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Máximo 1 medicamento controlado por receta</li>
                  <li>Requiere firma digital obligatoria</li>
                  <li>Puede agregar medicamentos libres adicionales</li>
                  <li>Período máximo: 30 días (salvo excepciones)</li>
                </ul>
              </AlertDescription>
            </Alert>
          ) : tipoReceta === "antimicrobianos" ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Normativa de Antimicrobianos</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Máximo 3 medicamentos antimicrobianos por receta</li>
                  <li>Diagnóstico obligatorio (CIE-10)</li>
                  <li>Requiere firma digital o doble factor de autenticación</li>
                  <li>Verificación de uso racional de antimicrobianos</li>
                </ul>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Receta Libre</AlertTitle>
              <AlertDescription>
                No hay límite en la cantidad de medicamentos no regulados que puede prescribir.
              </AlertDescription>
            </Alert>
          )}

          {/* Botón para agregar medicamento */}
          <Button
            onClick={handleAgregarMedicamento}
            className="w-full"
            disabled={
              (tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos") && medicamentosControlados >= 1 ||
              (tipoReceta === "antimicrobianos" && medicamentosAntimicrobianos >= 3)
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Medicamento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}