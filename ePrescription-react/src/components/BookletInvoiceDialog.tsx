import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Receipt, Download, Printer, CheckCircle2, Calendar, CreditCard, User, FileText, Building2, Package } from "lucide-react";
import { BookletPurchase, BookletUtils, PrescriptionBookletsAPI } from "../utils/prescriptionBookletsStore";

interface BookletInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: BookletPurchase;
  newBalance: number;
}

export function BookletInvoiceDialog({
  isOpen,
  onClose,
  purchase,
  newBalance
}: BookletInvoiceDialogProps) {

  // Obtener los talonarios generados
  const generatedBooklets = purchase.bookletsGenerated.map(bookletId => {
    const booklets = PrescriptionBookletsAPI.getDoctorBooklets(purchase.doctorId);
    return booklets.find(b => b.id === bookletId);
  }).filter(Boolean);

  // Generar HTML para talonarios
  const generateBookletsHTML = () => {
    return generatedBooklets.map((booklet, index) => {
      if (!booklet) return '';
      const firstSlip = booklet.slips[0]?.slipNumber || "0001";
      const lastSlip = booklet.slips[booklet.slips.length - 1]?.slipNumber || String(booklet.totalSlips).padStart(4, '0');
      
      return `
        <div style="
          background: linear-gradient(to right, #eef2ff, #ffffff);
          border: 1px solid #c7d2fe;
          border-left: 4px solid #6366f1;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 12px;
        ">
          <div style="margin-bottom: 10px;">
            <span style="
              display: inline-block;
              background: #e0e7ff;
              color: #3730a3;
              padding: 4px 10px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: bold;
              margin-right: 8px;
            ">Talonario #${index + 1}</span>
            <span style="
              display: inline-block;
              background: ${booklet.bookletType === 'estupefaciente' ? '#fef2f2' : 
                         booklet.bookletType === 'psicotropico' ? '#fff7ed' :
                         booklet.bookletType === 'antimicrobiano' ? '#fefce8' : '#f0fdf4'};
              color: ${booklet.bookletType === 'estupefaciente' ? '#991b1b' : 
                      booklet.bookletType === 'psicotropico' ? '#9a3412' :
                      booklet.bookletType === 'antimicrobiano' ? '#854d0e' : '#166534'};
              border: 1px solid ${booklet.bookletType === 'estupefaciente' ? '#fca5a5' : 
                                 booklet.bookletType === 'psicotropico' ? '#fdba74' :
                                 booklet.bookletType === 'antimicrobiano' ? '#fde047' : '#86efac'};
              padding: 4px 10px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: bold;
            ">${BookletUtils.getBookletTypeLabel(booklet.bookletType)}</span>
          </div>
          
          <div style="font-size: 13px; color: #374151; line-height: 1.8;">
            <div style="margin-bottom: 6px;">
              <span style="color: #6b7280;">Número de Talonario:</span>
              <strong style="font-family: 'Courier New', monospace; color: #3730a3; margin-left: 8px;">
                ${booklet.bookletNumber}
              </strong>
            </div>
            
            <div style="margin-bottom: 6px;">
              <span style="color: #6b7280;">Rango de Boletas:</span>
              <strong style="font-family: 'Courier New', monospace; color: #4f46e5; margin-left: 8px;">
                Del ${firstSlip} al ${lastSlip}
              </strong>
              <span style="
                display: inline-block;
                background: #dbeafe;
                color: #1e40af;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: bold;
                margin-left: 8px;
              ">${booklet.totalSlips} boletas</span>
            </div>
            
            <div style="color: #059669; font-size: 11px;">
              ✓ Todas las boletas disponibles
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura ${purchase.invoiceNumber} - ePrescription</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px;
            color: #1f2937;
          }
          .invoice-container { 
            max-width: 800px; 
            margin: 0 auto;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white; 
            padding: 30px;
            text-align: center;
          }
          .header h1 { 
            font-size: 28px; 
            margin-bottom: 8px;
            font-weight: bold;
          }
          .header p { 
            font-size: 14px; 
            opacity: 0.95;
          }
          .content { padding: 30px; }
          .section { margin-bottom: 25px; }
          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #6366f1;
            text-transform: uppercase;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e0e7ff;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
          }
          .info-label {
            color: #6b7280;
            font-size: 13px;
          }
          .info-value {
            font-weight: 600;
            color: #1f2937;
            font-size: 13px;
          }
          .totals-box {
            background: #f0fdf4;
            border: 1px solid #86efac;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }
          .totals-row.final {
            border-top: 2px solid #22c55e;
            margin-top: 10px;
            padding-top: 12px;
            font-size: 18px;
            font-weight: bold;
            color: #15803d;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            background: #dcfce7;
            color: #166534;
          }
          .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
          }
          .watermark {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 11px;
          }
          @media print {
            body { padding: 0; }
            .invoice-container { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>✓ FACTURA DE COMPRA</h1>
            <p>Sistema ePrescription - Compra de Talonarios de Recetas</p>
          </div>
          
          <div class="content">
            <!-- Información de la factura -->
            <div class="section">
              <div class="section-title">📄 Información de la Factura</div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Número de Factura:</span>
                  <span class="info-value">${purchase.invoiceNumber}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Número de Orden:</span>
                  <span class="info-value">${purchase.id}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Fecha de Emisión:</span>
                  <span class="info-value">${new Date(purchase.purchaseDate).toLocaleString('es-CO')}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Estado:</span>
                  <span class="badge">COMPLETADO</span>
                </div>
              </div>
            </div>

            <!-- Información del profesional -->
            <div class="section">
              <div class="section-title">👨‍⚕️ Datos del Profesional</div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Nombre:</span>
                  <span class="info-value">${purchase.doctorName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Licencia:</span>
                  <span class="info-value">${purchase.doctorLicense}</span>
                </div>
              </div>
            </div>

            <!-- Detalle de la compra -->
            <div class="section">
              <div class="section-title">📦 Detalle de la Compra</div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Tipo de Talonario:</span>
                  <span class="info-value">${BookletUtils.getBookletTypeLabel(purchase.bookletType)}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Cantidad de Talonarios:</span>
                  <span class="info-value">${purchase.quantity}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Boletas por Talonario:</span>
                  <span class="info-value">${purchase.slipsPerBooklet}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Total de Boletas:</span>
                  <span class="info-value">${purchase.quantity * purchase.slipsPerBooklet}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Método de Pago:</span>
                  <span class="info-value">${purchase.paymentMethod}</span>
                </div>
              </div>
            </div>

            <!-- Talonarios Generados -->
            <div class="section">
              <div class="section-title">📋 Talonarios Generados</div>
              ${generateBookletsHTML()}
            </div>

            <!-- Totales -->
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>$${purchase.totalCost.toLocaleString('es-CO')}</span>
              </div>
              <div class="totals-row">
                <span>IVA (0%):</span>
                <span>$0</span>
              </div>
              <div class="totals-row final">
                <span>TOTAL A PAGAR:</span>
                <span>$${purchase.totalCost.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <div class="watermark">
              <p>Este es un documento electrónico generado por ePrescription</p>
              <p>Sistema de Prescripción Electrónica - Sector Salud</p>
              <p>Fecha de generación: ${new Date().toLocaleString('es-CO')}</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>ePrescription</strong> - Sistema Profesional de Prescripción Médica</p>
            <p>Cumplimiento normativo: HL7, FDA, OMS</p>
            <p>Para consultas: soporte@eprescription.com | Tel: +57 (1) 123-4567</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleDownload = () => {
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Factura ${purchase.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; color: #1f2937; }
    .invoice-container { max-width: 800px; margin: 0 auto; border: 2px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 8px; font-weight: bold; }
    .header p { font-size: 14px; opacity: 0.95; }
    .content { padding: 30px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 14px; font-weight: bold; color: #6366f1; text-transform: uppercase; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e0e7ff; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-item { display: flex; justify-content: space-between; padding: 8px 0; }
    .info-label { color: #6b7280; font-size: 13px; }
    .info-value { font-weight: 600; color: #1f2937; font-size: 13px; }
    .totals-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin-top: 20px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .totals-row.final { border-top: 2px solid #22c55e; margin-top: 10px; padding-top: 12px; font-size: 18px; font-weight: bold; color: #15803d; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; background: #dcfce7; color: #166534; }
    .footer { background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 12px; color: #6b7280; margin-bottom: 8px; }
    .watermark { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 11px; }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>✓ FACTURA DE COMPRA</h1>
      <p>Sistema ePrescription - Compra de Talonarios de Recetas</p>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">📄 Información de la Factura</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Número de Factura:</span>
            <span class="info-value">${purchase.invoiceNumber}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Número de Orden:</span>
            <span class="info-value">${purchase.id}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Fecha de Emisión:</span>
            <span class="info-value">${new Date(purchase.purchaseDate).toLocaleString('es-CO')}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Estado:</span>
            <span class="badge">COMPLETADO</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">👨‍⚕️ Datos del Profesional</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Nombre:</span>
            <span class="info-value">${purchase.doctorName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Licencia:</span>
            <span class="info-value">${purchase.doctorLicense}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📦 Detalle de la Compra</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Tipo de Talonario:</span>
            <span class="info-value">${BookletUtils.getBookletTypeLabel(purchase.bookletType)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Cantidad de Talonarios:</span>
            <span class="info-value">${purchase.quantity}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Boletas por Talonario:</span>
            <span class="info-value">${purchase.slipsPerBooklet}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Total de Boletas:</span>
            <span class="info-value">${purchase.quantity * purchase.slipsPerBooklet}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Método de Pago:</span>
            <span class="info-value">${purchase.paymentMethod}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📋 Talonarios Generados</div>
        ${generateBookletsHTML()}
      </div>

      <div class="totals-box">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>$${purchase.totalCost.toLocaleString('es-CO')}</span>
        </div>
        <div class="totals-row">
          <span>IVA (0%):</span>
          <span>$0</span>
        </div>
        <div class="totals-row final">
          <span>TOTAL A PAGAR:</span>
          <span>$${purchase.totalCost.toLocaleString('es-CO')}</span>
        </div>
      </div>

      <div class="watermark">
        <p>Este es un documento electrónico generado por ePrescription</p>
        <p>Sistema de Prescripción Electrónica - Sector Salud</p>
        <p>Fecha de generación: ${new Date().toLocaleString('es-CO')}</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>ePrescription</strong> - Sistema Profesional de Prescripción Médica</p>
      <p>Cumplimiento normativo: HL7, FDA, OMS</p>
      <p>Para consultas: soporte@eprescription.com | Tel: +57 (1) 123-4567</p>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Factura_${purchase.invoiceNumber}_${purchase.doctorName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle2 className="size-6 text-green-600" />
            </div>
            <div>
              <DialogTitle>¡Compra Realizada Exitosamente!</DialogTitle>
              <DialogDescription>
                Tu factura ha sido generada y los talonarios están disponibles
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Resumen visual de éxito */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Receipt className="size-8 text-green-700" />
                  <div>
                    <p className="font-semibold text-green-900">Pago Procesado</p>
                    <p className="text-sm text-green-700">
                      {purchase.quantity} talonario{purchase.quantity > 1 ? 's' : ''} - {purchase.quantity * purchase.slipsPerBooklet} boletas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-700">Nuevo Saldo</p>
                  <p className="text-2xl font-bold text-green-900">{newBalance}</p>
                  <p className="text-xs text-green-600">boletas disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Factura */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="size-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">Información de la Factura</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Número de Factura</p>
                  <p className="font-mono font-semibold">{purchase.invoiceNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Número de Orden</p>
                  <p className="font-mono font-semibold">{purchase.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Fecha de Emisión</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3 text-muted-foreground" />
                    <p className="font-semibold">{new Date(purchase.purchaseDate).toLocaleString('es-CO')}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Estado</p>
                  <Badge className="bg-green-100 text-green-800">COMPLETADO</Badge>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2 mb-3">
                <User className="size-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">Datos del Profesional</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Nombre</p>
                  <p className="font-semibold">{purchase.doctorName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Licencia</p>
                  <p className="font-mono font-semibold">{purchase.doctorLicense}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="size-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">Detalle de la Compra</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2 space-y-1">
                  <p className="text-muted-foreground">Tipo de Talonario</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs border ${BookletUtils.getBookletTypeColor(purchase.bookletType)}`}
                  >
                    {BookletUtils.getBookletTypeLabel(purchase.bookletType)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Límite: {BookletUtils.getMedicationLimit(purchase.bookletType)} medicamento{BookletUtils.getMedicationLimit(purchase.bookletType) === 1 ? '' : 's'} por receta
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Cantidad de Talonarios</p>
                  <p className="font-semibold">{purchase.quantity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Boletas por Talonario</p>
                  <p className="font-semibold">{purchase.slipsPerBooklet}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Total de Boletas</p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {purchase.quantity * purchase.slipsPerBooklet} boletas
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Método de Pago</p>
                  <p className="font-semibold">{purchase.paymentMethod}</p>
                </div>
              </div>

              <Separator />

              {/* Detalle de Talonarios Generados */}
              <div className="flex items-center gap-2 mb-3">
                <Package className="size-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">Talonarios Generados</h3>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {generatedBooklets.map((booklet, index) => {
                  if (!booklet) return null;
                  const firstSlip = booklet.slips[0]?.slipNumber || "0001";
                  const lastSlip = booklet.slips[booklet.slips.length - 1]?.slipNumber || String(booklet.totalSlips).padStart(4, '0');
                  
                  return (
                    <Card key={booklet.id} className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-white">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-indigo-100 border-indigo-300 text-indigo-800">
                                Talonario #{index + 1}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${BookletUtils.getBookletTypeColor(booklet.bookletType)}`}
                              >
                                {BookletUtils.getBookletTypeLabel(booklet.bookletType)}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Número de Talonario:</span>
                                <span className="font-mono font-bold text-indigo-900">{booklet.bookletNumber}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Rango de Boletas:</span>
                                <span className="font-mono font-semibold text-indigo-700">
                                  Del {firstSlip} al {lastSlip}
                                </span>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                  {booklet.totalSlips} boletas
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="size-3 text-green-600" />
                                <span>Todas las boletas disponibles</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Separator className="mt-4" />

              {/* Totales */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Subtotal:</span>
                    <span className="font-semibold text-green-900">
                      ${purchase.totalCost.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">IVA (0%):</span>
                    <span className="font-semibold text-green-900">$0</span>
                  </div>
                  <Separator className="bg-green-300" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-green-900">TOTAL A PAGAR:</span>
                    <span className="text-2xl font-bold text-green-900">
                      ${purchase.totalCost.toLocaleString('es-CO')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="size-4" />
            Descargar HTML
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="gap-2"
          >
            <Printer className="size-4" />
            Imprimir
          </Button>
          <Button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            <CheckCircle2 className="size-4" />
            Finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}