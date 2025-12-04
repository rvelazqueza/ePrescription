import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { PageBanner } from "../components/PageBanner";
import { 
  Receipt, 
  Package, 
  ShoppingCart, 
  FileText, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Calendar
} from "lucide-react";
import { PrescriptionBookletsAPI } from "../utils/prescriptionBookletsStore";
import { BookletPurchaseDialog } from "../components/BookletPurchaseDialog";
import { BookletPurchaseHistoryPanel } from "../components/BookletPurchaseHistoryPanel";

// Mock de profesionales para demo
const mockDoctors = [
  {
    id: "DOC-001",
    name: "Dr. Carlos Alberto Mendoza Herrera",
    license: "RM-12345-COL",
  },
  {
    id: "DOC-002",
    name: "Dra. María Elena Rodríguez Silva",
    license: "RM-67890-COL",
  },
  {
    id: "DOC-003",
    name: "Dr. Jorge Luis Ramírez Castro",
    license: "RM-78901-COL",
  },
];

export function TalonariosIntegradosPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(mockDoctors[0]);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePurchaseComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  const stats = PrescriptionBookletsAPI.getDoctorStatistics(selectedDoctor.id);
  const availableSlips = PrescriptionBookletsAPI.getDoctorAvailableSlips(selectedDoctor.id);
  const booklets = PrescriptionBookletsAPI.getDoctorBooklets(selectedDoctor.id);
  const activeBooklets = booklets.filter(b => b.status === "active");

  return (
    <div className="space-y-6">
      {/* Banner */}
      <PageBanner
        icon={Receipt}
        title="Gestión de Talonarios"
        description="Control y administración de talonarios de recetas médicas"
      />

      {/* Selector de profesional para demo */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                <FileText className="size-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-indigo-700">Profesional Seleccionado</p>
                <p className="font-semibold text-indigo-900">{selectedDoctor.name}</p>
                <p className="text-xs text-indigo-600 font-mono">{selectedDoctor.license}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {mockDoctors.map((doc) => (
                <Button
                  key={doc.id}
                  variant={selectedDoctor.id === doc.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDoctor(doc)}
                  className={selectedDoctor.id === doc.id ? "bg-indigo-600" : ""}
                >
                  {doc.name.split(' ')[1]}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Boletas Disponibles</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableSlips}</div>
            <p className="text-xs text-muted-foreground">
              {activeBooklets.length} talonario{activeBooklets.length !== 1 ? 's' : ''} activo{activeBooklets.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Boletas Usadas</CardTitle>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usedSlips}</div>
            <p className="text-xs text-muted-foreground">
              De {stats.totalSlips} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Uso de Talonarios</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usagePercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Tasa de utilización
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Talonarios</CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooklets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedBooklets} completados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acción rápida de compra */}
      <Card className={
        availableSlips === 0 ? "border-red-200 bg-red-50" : 
        availableSlips <= 10 ? "border-amber-200 bg-amber-50" : 
        "border-green-200 bg-green-50"
      }>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className={`size-8 ${
                availableSlips === 0 ? "text-red-600" : 
                availableSlips <= 10 ? "text-amber-600" : 
                "text-green-600"
              }`} />
              <div>
                <p className={`font-semibold ${
                  availableSlips === 0 ? "text-red-900" : 
                  availableSlips <= 10 ? "text-amber-900" : 
                  "text-green-900"
                }`}>
                  {availableSlips === 0 ? "Sin boletas disponibles" : 
                   availableSlips <= 10 ? "Saldo bajo de boletas" : 
                   "Saldo suficiente de boletas"}
                </p>
                <p className={`text-sm ${
                  availableSlips === 0 ? "text-red-700" : 
                  availableSlips <= 10 ? "text-amber-700" : 
                  "text-green-700"
                }`}>
                  {availableSlips === 0 
                    ? "Debes comprar talonarios para poder emitir recetas" 
                    : availableSlips <= 10
                    ? "Considera comprar más talonarios pronto"
                    : "Tienes suficientes boletas para prescribir"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowPurchaseDialog(true)}
              className={
                availableSlips === 0 ? "bg-red-600 hover:bg-red-700" : 
                availableSlips <= 10 ? "bg-amber-600 hover:bg-amber-700" : 
                "bg-green-600 hover:bg-green-700"
              }
            >
              <ShoppingCart className="size-4 mr-2" />
              Comprar Talonarios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Mis Talonarios y Historial */}
      <Tabs defaultValue="booklets" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="booklets">
            <Package className="size-4 mr-2" />
            Mis Talonarios
          </TabsTrigger>
          <TabsTrigger value="history">
            <Receipt className="size-4 mr-2" />
            Historial de Compras
          </TabsTrigger>
        </TabsList>

        <TabsContent value="booklets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Talonarios Activos</CardTitle>
            </CardHeader>
            <CardContent>
              {activeBooklets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="size-12 mx-auto mb-3 opacity-50" />
                  <p>No hay talonarios activos</p>
                  <p className="text-sm mt-1">Compra talonarios para comenzar a prescribir</p>
                  <Button
                    onClick={() => setShowPurchaseDialog(true)}
                    className="mt-4"
                  >
                    <ShoppingCart className="size-4 mr-2" />
                    Comprar Ahora
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Fecha de Compra</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Usadas</TableHead>
                        <TableHead>Disponibles</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Progreso</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeBooklets.map((booklet) => {
                        const progress = (booklet.usedSlips / booklet.totalSlips) * 100;
                        return (
                          <TableRow key={booklet.id}>
                            <TableCell>
                              <div className="font-mono text-sm">{booklet.bookletNumber}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="size-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {new Date(booklet.purchaseDate).toLocaleDateString('es-CO')}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{booklet.totalSlips}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">{booklet.usedSlips}</span>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  booklet.availableSlips === 0 ? "border-red-500 text-red-700 bg-red-50" :
                                  booklet.availableSlips <= 5 ? "border-amber-500 text-amber-700 bg-amber-50" :
                                  "border-green-500 text-green-700 bg-green-50"
                                }
                              >
                                {booklet.availableSlips}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">
                                ACTIVO
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{progress.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all ${
                                      progress >= 90 ? "bg-red-500" :
                                      progress >= 70 ? "bg-amber-500" :
                                      "bg-green-500"
                                    }`}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Talonarios completados */}
              {booklets.filter(b => b.status === "completed").length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                    Talonarios Completados ({booklets.filter(b => b.status === "completed").length})
                  </h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número</TableHead>
                          <TableHead>Fecha de Compra</TableHead>
                          <TableHead>Total Boletas</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {booklets
                          .filter(b => b.status === "completed")
                          .map((booklet) => (
                            <TableRow key={booklet.id}>
                              <TableCell>
                                <div className="font-mono text-sm text-muted-foreground">
                                  {booklet.bookletNumber}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(booklet.purchaseDate).toLocaleDateString('es-CO')}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="opacity-50">
                                  {booklet.totalSlips} / {booklet.totalSlips}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-gray-100 text-gray-800">
                                  COMPLETADO
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <BookletPurchaseHistoryPanel 
            key={refreshKey}
            doctorId={selectedDoctor.id} 
          />
        </TabsContent>
      </Tabs>

      {/* Diálogo de compra */}
      <BookletPurchaseDialog
        isOpen={showPurchaseDialog}
        onClose={() => setShowPurchaseDialog(false)}
        doctorId={selectedDoctor.id}
        doctorName={selectedDoctor.name}
        doctorLicense={selectedDoctor.license}
        onPurchaseComplete={handlePurchaseComplete}
      />
    </div>
  );
}
