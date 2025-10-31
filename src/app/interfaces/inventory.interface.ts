export interface InventoryItem {
  id: string;
  medicineId: string;
  medicineName: string;
  presentation: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unitCost: number;
  totalValue: number;
  location: string;
  supplier: string;
  lastRestockDate: string;
  lastMovementDate: string;
  status: 'adequate' | 'low' | 'critical' | 'out' | 'overstocked';
  activeSubstance: string;
  averageConsumption: number;
  daysOfStock: number;
  batches: number;
  nearestExpiry: string;
}

export interface StockAlert {
  id: string;
  medicineId: string;
  medicineName: string;
  presentation: string;
  currentStock: number;
  minStock: number;
  status: 'out' | 'critical' | 'low';
  priority: 'critical' | 'high' | 'medium';
  daysWithoutStock: number;
  affectedPrescriptions: number;
  estimatedDemand: number;
  suggestedOrder: number;
  lastRestockDate: string;
  supplier: string;
  location: string;
  category: string;
}

export interface StockAdjustment {
  id: string;
  date: string;
  time: string;
  type: 'entry' | 'exit' | 'adjustment';
  medicineId: string;
  medicineName: string;
  presentation: string;
  quantity: number;
  reason: string;
  previousStock: number;
  newStock: number;
  unitCost: number;
  totalValue: number;
  responsible: string;
  documentNumber: string;
  supplier: string;
  batch: string;
  expiryDate: string;
  notes: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Batch {
  id: string;
  batchNumber: string;
  medicineId: string;
  medicineName: string;
  presentation: string;
  supplier: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  remainingQuantity: number;
  location: string;
  status: 'active' | 'near_expiry' | 'expired';
  daysToExpiry: number;
  unitCost: number;
  totalValue: number;
  entryDate: string;
  documentNumber: string;
}

export interface InventoryQuery {
  id: string;
  medicamentoId: string;
  medicamentoNombre: string;
  medicamentoCodigo: string;
  presentacion: string;
  farmaciaId: string;
  farmaciaNombre: string;
  farmaciaCode: string;
  provinciaId: string;
  cantonId: string;
  distritoId: string;
  direccionEspecifica: string;
  telefono: string;
  stock: number;
  stockMinimo: number;
  stockMaximo: number;
  lote: string;
  fechaVencimiento: string;
  ultimaActualizacion: string;
}