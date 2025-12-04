import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Separator } from "./ui/separator";
import { PrescriptionBookletsAPI, ConfigurationAPI, BookletPurchase, BookletType } from "../utils/prescriptionBookletsStore";
import { toast } from "sonner@2.0.3";
import { 
  ShoppingCart, 
  CreditCard, 
  Receipt, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  User, 
  Loader2, 
  ShieldCheck, 
  Wallet, 
  Building2,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { BookletInvoiceDialog } from "./BookletInvoiceDialog";

interface BookletPurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
  doctorLicense: string;
  onPurchaseComplete?: () => void;
  preselectedType?: BookletType; // NUEVO: Tipo pre-seleccionado
}

export function BookletPurchaseDialog({
  isOpen,
  onClose,
  doctorId,
  doctorName,
  doctorLicense,
  onPurchaseComplete,
  preselectedType
}: BookletPurchaseDialogProps) {
  // Estados de navegación - NUEVO: Solo 2 pasos
  // Paso 1: Resumen Profesional + Tipo de Talonario
  // Paso 2: Método de Pago
  const [currentStep, setCurrentStep] = useState(1);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    // Tipo de talonario - PRESELECCIONADO si viene el parámetro
    tipo: "receta" as "receta" | "despacho",
    subTipo: preselectedType || "",
    cantidad: 1,
    
    // Pago
    metodoPago: "",
    numeroTarjeta: "",
    nombreTitular: "",
    fechaExpiracion: "",
    cvv: "",
    sinpeMovil: "",
    sinpeNombreTitular: "",
    sinpeBanco: "",
    sinpeCedula: "",
    numeroTransferencia: "",
    bancoTransferencia: "Banco Nacional de Costa Rica",
    cuentaIBAN: "CR12 0151 0000 1234 5678 90",
    titularCuenta: "Sistema ePrescription"
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [completedPurchase, setCompletedPurchase] = useState<BookletPurchase | null>(null);
  const [newBalance, setNewBalance] = useState(0);
  const [validatingSinpe, setValidatingSinpe] = useState(false);
  const [sinpeValidated, setSinpeValidated] = useState(false);

  const config = ConfigurationAPI.getAllConfig();
  const slipsPerBooklet = config.slipsPerBooklet;
  const costPerSlip = config.costPerSlip;

  // Obtener saldo por tipo de talonario
  const balanceByType = PrescriptionBookletsAPI.getDoctorAvailableSlipsByType(doctorId);
  const totalBalance = PrescriptionBookletsAPI.getDoctorAvailableSlips(doctorId);

  // Sincronizar con tipo pre-seleccionado cuando se abre el diálogo
  useEffect(() => {
    if (isOpen) {
      if (preselectedType) {
        setFormData(prev => ({
          ...prev,
          tipo: "receta",
          subTipo: preselectedType
        }));
      }
      // SIEMPRE empezar en el paso 1 (Resumen + Tipo)
      setCurrentStep(1);
      setShowInvoice(false);
      setCompletedPurchase(null);
    }
  }, [isOpen, preselectedType]);

  // Límites según tipo
  const LIMITES_TALONARIOS = {
    receta: {
      antimicrobiano: 5,
      estupefaciente: 3,
      psicotropico: 4,
      normal: 10
    },
    despacho: {
      normal: 15
    }
  };

  // Obtener límite de cantidad
  const obtenerLimiteCantidad = (): number => {
    if (formData.tipo === "receta" && formData.subTipo) {
      return LIMITES_TALONARIOS.receta[formData.subTipo as keyof typeof LIMITES_TALONARIOS.receta] || 1;
    }
    if (formData.tipo === "despacho") {
      return LIMITES_TALONARIOS.despacho.normal;
    }
    return 1;
  };

  // Calcular precio total
  const calcularPrecioTotal = (): number => {
    const totalSlips = formData.cantidad * slipsPerBooklet;
    return totalSlips * costPerSlip;
  };

  // ELIMINADO: validarCodigoProfesional - ya no es necesario
  // El profesional ya está validado desde el login

  // Validar SINPE (simulado)
  const validarSinpe = async () => {
    if (!formData.sinpeMovil || formData.sinpeMovil.length < 8) {
      toast.error("Ingrese un número de teléfono válido");
      return;
    }

    setValidatingSinpe(true);
    
    // Simulación de integración con sistema bancario
    setTimeout(() => {
      setFormData({
        ...formData,
        sinpeNombreTitular: doctorName,
        sinpeBanco: "Banco Nacional de Costa Rica",
        sinpeCedula: "1-1234-5678"
      });
      setSinpeValidated(true);
      setValidatingSinpe(false);
      toast.success("Cuenta SINPE validada correctamente");
    }, 1500);
  };

  // Validar paso actual - NUEVO: Solo 2 pasos
  const validarPasoActual = (): boolean => {
    // Paso 1: Tipo de Talonario
    if (currentStep === 1) {
      if (!formData.tipo) {
        toast.error("Seleccione el uso del talonario");
        return false;
      }
      if (formData.tipo === "receta" && !formData.subTipo) {
        toast.error("Seleccione el tipo de receta");
        return false;
      }
      if (formData.cantidad < 1 || formData.cantidad > obtenerLimiteCantidad()) {
        toast.error(`La cantidad debe estar entre 1 y ${obtenerLimiteCantidad()}`);
        return false;
      }
      return true;
    }

    // Paso 2: Método de Pago
    if (currentStep === 2) {
      if (!formData.metodoPago) {
        toast.error("Seleccione un método de pago");
        return false;
      }
      
      if (formData.metodoPago === "tarjeta") {
        if (!formData.numeroTarjeta || !formData.nombreTitular || !formData.fechaExpiracion || !formData.cvv) {
          toast.error("Complete todos los datos de la tarjeta");
          return false;
        }
      }
      
      if (formData.metodoPago === "sinpe") {
        if (!formData.sinpeMovil) {
          toast.error("Ingrese el número de teléfono");
          return false;
        }
        if (!sinpeValidated) {
          toast.error("Debe validar la cuenta SINPE");
          return false;
        }
      }
      
      if (formData.metodoPago === "transferencia") {
        if (!formData.numeroTransferencia) {
          toast.error("Ingrese el número de confirmación de la transferencia");
          return false;
        }
      }
      
      return true;
    }

    return true;
  };

  // Navegación - NUEVO: Solo 2 pasos
  const handleNext = () => {
    if (validarPasoActual()) {
      setCurrentStep(prev => Math.min(prev + 1, 2));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Procesar compra
  const handlePurchase = async () => {
    if (!validarPasoActual()) return;

    setIsProcessing(true);

    // Simular procesamiento
    setTimeout(() => {
      const paymentMethodLabel = 
        formData.metodoPago === "tarjeta" ? `Tarjeta ${formData.numeroTarjeta.slice(-4)}` :
        formData.metodoPago === "sinpe" ? `SINPE Móvil ${formData.sinpeMovil}` :
        `Transferencia ${formData.numeroTransferencia}`;

      // Mapear subTipo a BookletType
      let bookletType: BookletType = "libre";
      if (formData.tipo === "receta") {
        if (formData.subTipo === "estupefaciente") bookletType = "estupefaciente";
        else if (formData.subTipo === "psicotropico") bookletType = "psicotropico";
        else if (formData.subTipo === "antimicrobiano") bookletType = "antimicrobiano";
        else bookletType = "libre"; // normal = libre
      }

      const result = PrescriptionBookletsAPI.purchaseBooklets(
        doctorId,
        doctorName,
        doctorLicense,
        formData.cantidad,
        slipsPerBooklet,
        paymentMethodLabel,
        bookletType
      );

      if (result.success && result.purchase) {
        const updatedBalance = PrescriptionBookletsAPI.getDoctorAvailableSlips(doctorId);
        setNewBalance(updatedBalance);
        setCompletedPurchase(result.purchase);
        setIsProcessing(false);
        
        // Cerrar el modal de compra ANTES de mostrar el invoice
        onClose();
        
        // Mostrar el invoice después de un pequeño delay
        setTimeout(() => {
          setShowInvoice(true);
        }, 300);
        
        if (onPurchaseComplete) {
          onPurchaseComplete();
        }
      } else {
        setIsProcessing(false);
        toast.error(result.error || "Error al procesar la compra");
      }
    }, 2000);
  };

  // Reiniciar
  const handleReset = () => {
    setCurrentStep(1);
    setFormData({
      tipo: "receta",
      subTipo: preselectedType || "",
      cantidad: 1,
      metodoPago: "",
      numeroTarjeta: "",
      nombreTitular: "",
      fechaExpiracion: "",
      cvv: "",
      sinpeMovil: "",
      sinpeNombreTitular: "",
      sinpeBanco: "",
      sinpeCedula: "",
      numeroTransferencia: "",
      bancoTransferencia: "Banco Nacional de Costa Rica",
      cuentaIBAN: "CR12 0151 0000 1234 5678 90",
      titularCuenta: "Sistema ePrescription"
    });
    setSinpeValidated(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleReset}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <ShoppingCart className="size-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle>Comprar Talonarios de Recetas</DialogTitle>
                <DialogDescription>
                  Paso {currentStep} de 2: {
                    currentStep === 1 ? "Selección de Talonario" :
                    "Método de Pago"
                  }
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Indicador de pasos - NUEVO: Solo 2 pasos */}
          <div className="flex items-center justify-between mb-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center size-8 rounded-full font-semibold ${
                  step === currentStep ? 'bg-blue-600 text-white' :
                  step < currentStep ? 'bg-green-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircle2 className="size-5" /> : step}
                </div>
                {step < 2 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6 py-4">
            {/* PASO 1: Resumen Profesional + Selección de Talonario */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {/* Saldo actual por tipo de talonario */}
                <Card className="border-indigo-200 bg-indigo-50">
                  <CardContent className="p-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="size-4 text-indigo-700" />
                        <span className="font-medium text-indigo-900">Boletas Disponibles por Tipo</span>
                      </div>
                      
                      {/* Desglose por tipo */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-indigo-700">🔴 Estupefacientes:</span>
                          <Badge variant="outline" className={`${
                            (balanceByType.estupefaciente || 0) === 0 ? 'border-red-500 text-red-700 bg-red-50' : 
                            (balanceByType.estupefaciente || 0) <= 5 ? 'border-amber-500 text-amber-700 bg-amber-50' : 
                            'border-green-500 text-green-700 bg-green-50'
                          }`}>
                            {balanceByType.estupefaciente || 0}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-indigo-700">🟠 Psicotrópicos:</span>
                          <Badge variant="outline" className={`${
                            (balanceByType.psicotropico || 0) === 0 ? 'border-red-500 text-red-700 bg-red-50' : 
                            (balanceByType.psicotropico || 0) <= 5 ? 'border-amber-500 text-amber-700 bg-amber-50' : 
                            'border-green-500 text-green-700 bg-green-50'
                          }`}>
                            {balanceByType.psicotropico || 0}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-indigo-700">🟡 Antimicrobianos:</span>
                          <Badge variant="outline" className={`${
                            (balanceByType.antimicrobiano || 0) === 0 ? 'border-red-500 text-red-700 bg-red-50' : 
                            (balanceByType.antimicrobiano || 0) <= 5 ? 'border-amber-500 text-amber-700 bg-amber-50' : 
                            'border-green-500 text-green-700 bg-green-50'
                          }`}>
                            {balanceByType.antimicrobiano || 0}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-indigo-700">🟢 Libre / Normal:</span>
                          <Badge variant="outline" className={`${
                            (balanceByType.libre || 0) === 0 ? 'border-red-500 text-red-700 bg-red-50' : 
                            (balanceByType.libre || 0) <= 10 ? 'border-amber-500 text-amber-700 bg-amber-50' : 
                            'border-green-500 text-green-700 bg-green-50'
                          }`}>
                            {balanceByType.libre || 0}
                          </Badge>
                        </div>
                        
                        <Separator className="bg-indigo-300" />
                        
                        <div className="flex justify-between items-center pt-1">
                          <span className="font-medium text-indigo-900">Total General:</span>
                          <Badge variant="secondary" className="bg-indigo-600 text-white">
                            {totalBalance} boletas
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs text-indigo-600 italic mt-2">
                        * Cada tipo de boleta es exclusiva para su categoría de medicamento
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Resumen del Profesional (Solo lectura - Ya validado) */}
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-900">Profesional Validado</AlertTitle>
                  <AlertDescription>
                    <div className="space-y-1 mt-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-green-700"><strong>Nombre:</strong></p>
                          <p className="text-green-900">{doctorName}</p>
                        </div>
                        <div>
                          <p className="text-green-700"><strong>Licencia:</strong></p>
                          <p className="text-green-900">{doctorLicense}</p>
                        </div>
                        <div>
                          <p className="text-green-700"><strong>Colegio:</strong></p>
                          <p className="text-green-900">Colegio de Médicos y Cirujanos de CR</p>
                        </div>
                        <div>
                          <p className="text-green-700"><strong>Estado:</strong></p>
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            ACTIVO
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Selección de Tipo de Talonario */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    <h4 className="font-medium">Tipo de Talonario</h4>
                    {preselectedType && (
                      <Badge className="ml-auto bg-blue-100 text-blue-800">
                        Valor por defecto
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Uso del Talonario *</Label>
                      {preselectedType && (
                        <p className="text-xs text-muted-foreground">
                          Valor preseleccionado según su última acción. Puede cambiarlo si lo desea.
                        </p>
                      )}
                      <RadioGroup
                        value={formData.tipo}
                        onValueChange={(value: "receta" | "despacho") => {
                          // Si cambia a despacho, limpiar subTipo
                          if (value === "despacho") {
                            setFormData({ ...formData, tipo: value, subTipo: "", cantidad: 1 });
                          } else {
                            // Si cambia a receta, mantener subTipo actual
                            setFormData({ ...formData, tipo: value, cantidad: 1 });
                          }
                        }}
                        className="flex gap-3"
                      >
                        <label
                          htmlFor="receta"
                          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
                            formData.tipo === 'receta' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <RadioGroupItem value="receta" id="receta" />
                          <span className="font-normal">Receta médica</span>
                        </label>
                        <label
                          htmlFor="despacho"
                          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
                            formData.tipo === 'despacho' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <RadioGroupItem value="despacho" id="despacho" />
                          <span className="font-normal">Despacho de farmacia</span>
                        </label>
                      </RadioGroup>
                    </div>

                    {formData.tipo === "receta" && (
                      <div className="space-y-3">
                        <Label>Tipo de Receta *</Label>
                        {preselectedType && (
                          <p className="text-xs text-muted-foreground">
                            Valor preseleccionado según su última acción. Puede cambiarlo si lo desea.
                          </p>
                        )}
                        <RadioGroup
                          value={formData.subTipo}
                          onValueChange={(value) => setFormData({ ...formData, subTipo: value, cantidad: 1 })}
                          className="grid grid-cols-2 gap-3"
                        >
                          <label
                            htmlFor="normal"
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
                              formData.subTipo === 'normal' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <RadioGroupItem value="normal" id="normal" />
                            <span className="font-normal">Normal / Libre</span>
                          </label>
                          <label
                            htmlFor="antimicrobiano"
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
                              formData.subTipo === 'antimicrobiano' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <RadioGroupItem value="antimicrobiano" id="antimicrobiano" />
                            <span className="font-normal">Antimicrobiano</span>
                          </label>
                          <label
                            htmlFor="estupefaciente"
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
                              formData.subTipo === 'estupefaciente' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <RadioGroupItem value="estupefaciente" id="estupefaciente" />
                            <span className="font-normal">Estupefaciente</span>
                          </label>
                          <label
                            htmlFor="psicotropico"
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
                              formData.subTipo === 'psicotropico' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <RadioGroupItem value="psicotropico" id="psicotropico" />
                            <span className="font-normal">Psicotrópico</span>
                          </label>
                        </RadioGroup>
                        {preselectedType && (
                          <Alert className="border-blue-200 bg-blue-50">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-sm text-blue-900">
                              Este tipo fue preseleccionado automáticamente, pero puede cambiarlo según sus necesidades.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    {(formData.tipo === "despacho" || (formData.tipo === "receta" && formData.subTipo)) && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cantidad">
                            Cantidad de Talonarios * (Máximo: {obtenerLimiteCantidad()})
                          </Label>
                          <Input
                            id="cantidad"
                            type="number"
                            min="1"
                            max={obtenerLimiteCantidad()}
                            value={formData.cantidad}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              cantidad: Math.min(parseInt(e.target.value) || 1, obtenerLimiteCantidad()) 
                            })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Límite regulado por tipo de receta según normativa vigente
                          </p>
                        </div>

                        <Separator />

                        {/* Resumen de precio */}
                        <Card className="border-green-200 bg-green-50">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="size-5 text-green-700" />
                              <span className="font-medium text-green-900">Resumen de Compra</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-green-700">Talonarios:</span>
                                <span className="font-medium text-green-900">{formData.cantidad}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-green-700">Boletas por talonario:</span>
                                <span className="font-medium text-green-900">{slipsPerBooklet}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-green-700">Total de boletas:</span>
                                <Badge variant="secondary" className="bg-green-600 text-white">
                                  {formData.cantidad * slipsPerBooklet} boletas
                                </Badge>
                              </div>
                              <Separator className="bg-green-300" />
                              <div className="flex justify-between items-center pt-2">
                                <span className="font-semibold text-green-900">Total a pagar:</span>
                                <span className="text-lg font-bold text-green-900">
                                  ${calcularPrecioTotal().toLocaleString('es-CO')}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}


            {/* PASO 2: Método de Pago */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {/* Resumen */}
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Resumen de Compra</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Tipo:</span>
                        <span>{formData.tipo === "receta" ? `Receta - ${formData.subTipo}` : "Despacho"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cantidad:</span>
                        <span>{formData.cantidad} talonarios</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${calcularPrecioTotal().toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Método de pago */}
                <div className="space-y-3">
                  <Label>Seleccione Método de Pago *</Label>
                  <RadioGroup
                    value={formData.metodoPago}
                    onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}
                    className="space-y-2"
                  >
                    <label
                      htmlFor="tarjeta"
                      className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <RadioGroupItem value="tarjeta" id="tarjeta" />
                      <CreditCard className="w-4 h-4" />
                      <span className="font-normal">Tarjeta de Crédito/Débito</span>
                    </label>

                    <label
                      htmlFor="sinpe"
                      className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <RadioGroupItem value="sinpe" id="sinpe" />
                      <Wallet className="w-4 h-4" />
                      <span className="font-normal">SINPE Móvil</span>
                    </label>

                    <label
                      htmlFor="transferencia"
                      className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <RadioGroupItem value="transferencia" id="transferencia" />
                      <Building2 className="w-4 h-4" />
                      <span className="font-normal">Transferencia Bancaria</span>
                    </label>
                  </RadioGroup>
                </div>

                {/* Formulario de tarjeta */}
                {formData.metodoPago === "tarjeta" && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-medium">Datos de la Tarjeta</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="numeroTarjeta">Número de Tarjeta *</Label>
                        <Input
                          id="numeroTarjeta"
                          placeholder="1234 5678 9012 3456"
                          maxLength={16}
                          value={formData.numeroTarjeta}
                          onChange={(e) => setFormData({ ...formData, numeroTarjeta: e.target.value.replace(/\s/g, "") })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nombreTitular">Nombre del Titular *</Label>
                        <Input
                          id="nombreTitular"
                          placeholder="Como aparece en la tarjeta"
                          value={formData.nombreTitular}
                          onChange={(e) => setFormData({ ...formData, nombreTitular: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fechaExpiracion">Fecha de Expiración *</Label>
                          <Input
                            id="fechaExpiracion"
                            placeholder="MM/AA"
                            maxLength={5}
                            value={formData.fechaExpiracion}
                            onChange={(e) => setFormData({ ...formData, fechaExpiracion: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            type="password"
                            placeholder="123"
                            maxLength={4}
                            value={formData.cvv}
                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SINPE Móvil */}
                {formData.metodoPago === "sinpe" && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-medium">SINPE Móvil</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sinpeMovil">Número de Teléfono *</Label>
                        <div className="flex gap-2">
                          <Input
                            id="sinpeMovil"
                            placeholder="+506 8888-8888"
                            value={formData.sinpeMovil}
                            onChange={(e) => setFormData({ ...formData, sinpeMovil: e.target.value })}
                            disabled={sinpeValidated}
                          />
                          <Button
                            onClick={validarSinpe}
                            disabled={!formData.sinpeMovil || sinpeValidated || validatingSinpe}
                            size="sm"
                          >
                            {validatingSinpe ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : sinpeValidated ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Formato: +506 ####-####
                        </p>
                      </div>

                      {sinpeValidated && (
                        <Alert>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertTitle>Cuenta Validada</AlertTitle>
                          <AlertDescription>
                            <div className="space-y-1 mt-2 text-sm">
                              <p><strong>Titular:</strong> {formData.sinpeNombreTitular}</p>
                              <p><strong>Banco:</strong> {formData.sinpeBanco}</p>
                              <p><strong>Cédula:</strong> {formData.sinpeCedula}</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                )}

                {/* Transferencia */}
                {formData.metodoPago === "transferencia" && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-medium">Transferencia Bancaria</h4>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Información Bancaria</AlertTitle>
                      <AlertDescription>
                        <div className="mt-2 space-y-1 text-sm">
                          <p><strong>Banco:</strong> {formData.bancoTransferencia}</p>
                          <p><strong>Cuenta IBAN:</strong> {formData.cuentaIBAN}</p>
                          <p><strong>Titular:</strong> {formData.titularCuenta}</p>
                          <p><strong>Monto:</strong> ${calcularPrecioTotal().toLocaleString('es-CO')}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <Label htmlFor="numeroTransferencia">Número de Confirmación *</Label>
                      <Input
                        id="numeroTransferencia"
                        placeholder="Ingrese el número de confirmación"
                        value={formData.numeroTransferencia}
                        onChange={(e) => setFormData({ ...formData, numeroTransferencia: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isProcessing}
              >
                <ArrowLeft className="size-4 mr-2" />
                Atrás
              </Button>
            )}
            
            {currentStep < 2 ? (
              <Button
                onClick={handleNext}
                disabled={isProcessing}
              >
                Siguiente
                <ArrowRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4 mr-2" />
                    Confirmar Compra
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Factura */}
      {showInvoice && completedPurchase && (
        <BookletInvoiceDialog
          isOpen={showInvoice}
          onClose={() => {
            setShowInvoice(false);
            setCompletedPurchase(null);
            setNewBalance(0);
            // Resetear estados para la próxima compra
            setCurrentStep(1);
            setFormData({
              tipo: "receta",
              subTipo: "",
              cantidad: 1,
              metodoPago: "",
              numeroTarjeta: "",
              nombreTitular: "",
              fechaExpiracion: "",
              cvv: "",
              sinpeMovil: "",
              sinpeNombreTitular: "",
              sinpeBanco: "",
              sinpeCedula: "",
              numeroTransferencia: "",
              bancoTransferencia: "Banco Nacional de Costa Rica",
              cuentaIBAN: "CR12 0151 0000 1234 5678 90",
              titularCuenta: "Sistema ePrescription"
            });
            setSinpeValidated(false);
            // NO llamar onClose() aquí porque el modal de compra ya está cerrado
          }}
          purchase={completedPurchase}
          newBalance={newBalance}
        />
      )}
    </>
  );
}