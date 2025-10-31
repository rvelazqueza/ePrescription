import { Injectable } from '@angular/core';
import { AutoservicioService } from './autoservicio.service';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/autoservicio.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagingBridgeService {

  constructor(private autoservicioService: AutoservicioService) {}

  /**
   * Envía un mensaje desde el centro de ayuda al sistema de autoservicio
   */
  sendHelpMessage(messageData: {
    subject: string;
    content: string;
    category?: string;
    priority?: 'normal' | 'high';
  }): Observable<Message> {
    // Mapear categorías de ayuda a tópicos de autoservicio
    const topicMapping: Record<string, string> = {
      'prescripciones': 'consulta-general',
      'dispensacion': 'consulta-general',
      'pacientes': 'consulta-general',
      'inventario': 'consulta-general',
      'seguridad': 'soporte-tecnico',
      'reportes': 'consulta-general',
      'firma-digital': 'soporte-tecnico',
      'interoperabilidad': 'soporte-tecnico',
      'alertas': 'reporte-problema',
      'configuracion': 'soporte-tecnico',
      'general': 'consulta-general'
    };

    const topic = topicMapping[messageData.category || 'general'] || 'consulta-general';

    return this.autoservicioService.addExternalMessage({
      subject: messageData.subject,
      content: messageData.content,
      topic: topic,
      priority: messageData.priority || 'normal',
      fromUserName: 'Centro de Ayuda'
    });
  }

  /**
   * Obtiene las estadísticas de mensajería para mostrar en otros módulos
   */
  getMessagingStats() {
    return this.autoservicioService.getMessagingStats('user-001');
  }

  /**
   * Recarga los datos de mensajería
   */
  reloadMessagingData(): void {
    this.autoservicioService.reloadMessagingData();
  }
}