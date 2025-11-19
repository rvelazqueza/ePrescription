/**
 * Helpers para crear notificaciones de usuario desde diferentes partes del sistema
 */

import { addUserNotification, type UserNotification } from './userNotificationsStore';

/**
 * Crea una notificación cuando se emite una receta
 */
export function notifyPrescriptionEmitted(
  prescriptionId: string,
  patientName: string
): UserNotification {
  return addUserNotification({
    type: 'prescription',
    title: 'Receta emitida correctamente',
    message: `La receta ${prescriptionId} para el paciente ${patientName} ha sido emitida y está lista para dispensar`,
    priority: 'medium',
    actionUrl: '/prescripciones/emitidas',
    metadata: {
      prescriptionId,
      patientName
    }
  });
}

/**
 * Crea una notificación cuando se dispensa una receta
 */
export function notifyPrescriptionDispensed(
  prescriptionId: string,
  patientName: string,
  pharmacyName: string,
  pharmacyId: string
): UserNotification {
  return addUserNotification({
    type: 'dispensation',
    title: 'Medicamento dispensado',
    message: `${pharmacyName} ha dispensado la receta ${prescriptionId} del paciente ${patientName}`,
    priority: 'low',
    actionUrl: '/prescripciones/emitidas',
    metadata: {
      prescriptionId,
      patientName,
      pharmacyId
    }
  });
}

/**
 * Crea una notificación de alerta de interacción medicamentosa
 */
export function notifyDrugInteraction(
  prescriptionId: string,
  drug1: string,
  drug2: string,
  severity: 'high' | 'medium' | 'low'
): UserNotification {
  return addUserNotification({
    type: 'alert',
    title: 'Alerta de interacción medicamentosa',
    message: `Se detectó una posible interacción entre ${drug1} y ${drug2} en receta ${prescriptionId}`,
    priority: severity === 'high' ? 'high' : 'medium',
    actionUrl: '/alertas/bandeja',
    metadata: {
      prescriptionId
    }
  });
}

/**
 * Crea una notificación de receta próxima a vencer
 */
export function notifyPrescriptionExpiring(
  prescriptionId: string,
  patientName: string,
  daysRemaining: number
): UserNotification {
  return addUserNotification({
    type: 'expiration',
    title: 'Receta próxima a vencer',
    message: `La receta ${prescriptionId} del paciente ${patientName} vencerá en ${daysRemaining} días`,
    priority: daysRemaining <= 3 ? 'high' : 'medium',
    actionUrl: '/prescripciones/emitidas',
    metadata: {
      prescriptionId,
      patientName
    }
  });
}

/**
 * Crea una notificación cuando se rechaza una receta
 */
export function notifyPrescriptionRejected(
  prescriptionId: string,
  pharmacyName: string,
  pharmacyId: string,
  reason: string
): UserNotification {
  return addUserNotification({
    type: 'rejection',
    title: 'Receta rechazada por farmacia',
    message: `La receta ${prescriptionId} fue rechazada por ${pharmacyName}. Motivo: ${reason}`,
    priority: 'high',
    actionUrl: '/dispensacion/rechazos',
    metadata: {
      prescriptionId,
      pharmacyId
    }
  });
}

/**
 * Crea una notificación de usuario aprobado
 */
export function notifyUserApproved(
  userName: string,
  userId: string
): UserNotification {
  return addUserNotification({
    type: 'approval',
    title: 'Usuario aprobado',
    message: `El usuario ${userName} (${userId}) ha sido aprobado y activado en el sistema`,
    priority: 'low',
    actionUrl: '/seguridad/usuarios'
  });
}

/**
 * Crea una notificación de actualización del sistema
 */
export function notifySystemUpdate(
  version: string,
  description: string
): UserNotification {
  return addUserNotification({
    type: 'system',
    title: 'Actualización del sistema',
    message: `Nueva versión ${version} disponible: ${description}`,
    priority: 'low',
    actionUrl: '/documentacion'
  });
}

/**
 * Crea una notificación de alerta de stock bajo
 */
export function notifyLowStock(
  medicineName: string,
  currentStock: number,
  minimumStock: number
): UserNotification {
  return addUserNotification({
    type: 'alert',
    title: 'Alerta de stock bajo',
    message: `El medicamento ${medicineName} tiene stock bajo (${currentStock} unidades, mínimo: ${minimumStock})`,
    priority: 'high',
    actionUrl: '/inventario/alertas'
  });
}

/**
 * Crea una notificación de medicamento próximo a vencer
 */
export function notifyMedicineExpiring(
  medicineName: string,
  loteNumber: string,
  expirationDate: string
): UserNotification {
  return addUserNotification({
    type: 'expiration',
    title: 'Medicamento próximo a vencer',
    message: `El lote ${loteNumber} de ${medicineName} vence el ${expirationDate}`,
    priority: 'medium',
    actionUrl: '/inventario/lotes'
  });
}

/**
 * Crea una notificación personalizada
 */
export function notifyCustom(
  title: string,
  message: string,
  type: UserNotification['type'] = 'system',
  priority: 'high' | 'medium' | 'low' = 'medium',
  actionUrl?: string
): UserNotification {
  return addUserNotification({
    type,
    title,
    message,
    priority,
    actionUrl
  });
}
