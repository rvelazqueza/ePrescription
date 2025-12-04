import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { PrescriptionBookletsAPI, BookletPurchase } from "../utils/prescriptionBookletsStore";
import { Receipt, Download, Eye, Calendar, CreditCard, Package } from "lucide-react";
import { BookletInvoiceDialog } from "./BookletInvoiceDialog";

interface BookletPurchaseHistoryPanelProps {
  doctorId: string;
}

export function BookletPurchaseHistoryPanel({ doctorId }: BookletPurchaseHistoryPanelProps) {
  const [selectedPurchase, setSelectedPurchase] = useState<BookletPurchase | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const purchases = PrescriptionBookletsAPI.getDoctorPurchases(doctorId);

  const handleViewInvoice = (purchase: BookletPurchase) => {
    // Calcular el nuevo saldo en ese momento sumando todas las compras hasta esa fecha
    const purchasesUpToDate = purchases
      .filter(p => new Date(p.purchaseDate) <= new Date(purchase.purchaseDate))
      .reduce((sum, p) => sum + (p.quantity * p.slipsPerBooklet), 0);
    
    setSelectedPurchase(purchase);
    setShowInvoice(true);
  };

  const getPaymentMethodLabel = (method: string): string => {
    const labels: Record<string, string> = {
      "credit_card": "Tarjeta de Crédito",
      "debit_card": "Tarjeta de Débito",
      "bank_transfer": "Transferencia Bancaria"
    };
    return labels[method] || method;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="size-5 text-indigo-600" />
              <CardTitle>Historial de Compras</CardTitle>
            </div>
            <Badge variant="outline" className="text-sm">
              {purchases.length} compra{purchases.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="size-12 mx-auto mb-3 opacity-50" />
              <p>No hay compras registradas</p>
              <p className="text-sm mt-1">Las compras aparecerán aquí una vez realizadas</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Factura</TableHead>
                    <TableHead>Talonarios</TableHead>
                    <TableHead>Boletas</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {new Date(purchase.purchaseDate).toLocaleDateString('es-CO')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(purchase.purchaseDate).toLocaleTimeString('es-CO')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">{purchase.invoiceNumber}</div>
                        <div className="text-xs text-muted-foreground">{purchase.id}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{purchase.quantity}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="size-3 text-muted-foreground" />
                          <span className="font-semibold">{purchase.quantity * purchase.slipsPerBooklet}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="size-4 text-muted-foreground" />
                          <span className="text-sm">{getPaymentMethodLabel(purchase.paymentMethod)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">${purchase.totalCost.toLocaleString('es-CO')}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            purchase.status === "completed" 
                              ? "bg-green-100 text-green-800" 
                              : purchase.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {purchase.status === "completed" ? "COMPLETADO" : 
                           purchase.status === "pending" ? "PENDIENTE" : "CANCELADO"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(purchase)}
                          className="gap-2"
                        >
                          <Eye className="size-4" />
                          Ver Factura
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de compras */}
      {purchases.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Compras</CardTitle>
              <Receipt className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length}</div>
              <p className="text-xs text-muted-foreground">
                Transacciones completadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Boletas Compradas</CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {purchases.reduce((sum, p) => sum + (p.quantity * p.slipsPerBooklet), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                En {purchases.reduce((sum, p) => sum + p.quantity, 0)} talonarios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Inversión Total</CardTitle>
              <CreditCard className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${purchases.reduce((sum, p) => sum + p.totalCost, 0).toLocaleString('es-CO')}
              </div>
              <p className="text-xs text-muted-foreground">
                En todas las compras
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Diálogo de Factura */}
      {showInvoice && selectedPurchase && (
        <BookletInvoiceDialog
          isOpen={showInvoice}
          onClose={() => {
            setShowInvoice(false);
            setSelectedPurchase(null);
          }}
          purchase={selectedPurchase}
          newBalance={PrescriptionBookletsAPI.getDoctorAvailableSlips(doctorId)}
        />
      )}
    </div>
  );
}
