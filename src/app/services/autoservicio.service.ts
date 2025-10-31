import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  UserProfile, 
  PasswordChangeRequest, 
  PasswordStrength, 
  ValidationResult,
  Message,
  Conversation,
  MessageTopic,
  MessagingStats,
  SecurityPolicy
} from '../interfaces/autoservicio.interface';

@Injectable({
  providedIn: 'root'
})
export class AutoservicioService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  public conversations$ = this.conversationsSubject.asObservable();

  // Políticas de seguridad según NIST 800-63B
  private readonly PASSWORD_POLICIES: SecurityPolicy = {
    MIN_LENGTH: 12,
    MIN_CHAR_TYPES: 3,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: true
  };

  // Tópicos de mensajería disponibles
  private readonly MESSAGE_TOPICS: MessageTopic[] = [
    {
      value: 'consulta-general',
      label: 'Consulta general',
      description: 'Preguntas generales sobre el sistema'
    },
    {
      value: 'soporte-tecnico',
      label: 'Soporte técnico',
      description: 'Problemas técnicos y errores'
    },
    {
      value: 'solicitud-permisos',
      label: 'Solicitud de permisos',
      description: 'Solicitar acceso a módulos o funciones'
    },
    {
      value: 'reporte-problema',
      label: 'Reporte de problema',
      description: 'Reportar errores o problemas del sistema'
    },
    {
      value: 'sugerencia-mejora',
      label: 'Sugerencia de mejora',
      description: 'Propuestas de mejoras al sistema'
    }
  ];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Usuario actual mock
    const mockUser: UserProfile = {
      id: 'user-001',
      fullName: 'Dr. Juan Pérez',
      email: 'juan.perez@hospital.com',
      phone: '+506 8888-9999',
      address: 'San José, Costa Rica',
      specialty: 'Medicina General',
      department: 'Consulta Externa',
      username: 'jperez'
    };
    this.currentUserSubject.next(mockUser);

    // Mensajes mock desde localStorage o datos por defecto
    this.loadMessagesFromStorage();
    this.loadConversationsFromStorage();
  }

  // ============================================
  // GESTIÓN DE PERFIL DE USUARIO
  // ============================================

  getCurrentUser(): Observable<UserProfile | null> {
    return this.currentUser$;
  }

  updateUserProfile(profile: Partial<UserProfile>): Observable<boolean> {
    return of(true).pipe(
      delay(1500),
      map(() => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...profile };
          this.currentUserSubject.next(updatedUser);
          
          // Simular registro en auditoría
          console.log('🔐 Actualización de perfil registrada:', {
            userId: currentUser.id,
            changes: profile,
            timestamp: new Date().toISOString(),
            compliance: 'HIPAA, FDA 21 CFR Part 11'
          });
        }
        return true;
      })
    );
  }

  // ============================================
  // GESTIÓN DE CONTRASEÑAS
  // ============================================

  changePassword(request: PasswordChangeRequest): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      map(() => {
        // Simular cambio de contraseña exitoso
        console.log('🔐 Cambio de contraseña registrado:', {
          userId: this.currentUserSubject.value?.id,
          timestamp: new Date().toISOString(),
          compliance: 'NIST 800-63B, HIPAA, FDA 21 CFR Part 11'
        });
        return true;
      })
    );
  }

  validatePasswordStrength(password: string, userInfo?: Partial<UserProfile>): PasswordStrength {
    let score = 0;
    let issues: string[] = [];

    // Longitud mínima
    if (password.length >= this.PASSWORD_POLICIES.MIN_LENGTH) {
      score += 25;
    } else {
      issues.push(`Mínimo ${this.PASSWORD_POLICIES.MIN_LENGTH} caracteres`);
    }

    // Mayúsculas
    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      issues.push('Incluir mayúsculas');
    }

    // Minúsculas
    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      issues.push('Incluir minúsculas');
    }

    // Números
    if (/[0-9]/.test(password)) {
      score += 20;
    } else {
      issues.push('Incluir números');
    }

    // Símbolos especiales
    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 15;
    } else {
      issues.push('Incluir símbolos especiales');
    }

    // Verificar que no contenga información personal
    if (userInfo) {
      const personalInfo = [
        userInfo.username?.toLowerCase(),
        userInfo.email?.split('@')[0]?.toLowerCase(),
        userInfo.fullName?.toLowerCase().split(' ')
      ].flat().filter(Boolean);

      const passwordLower = password.toLowerCase();
      const hasPersonalInfo = personalInfo.some(info => 
        info && passwordLower.includes(info)
      );

      if (hasPersonalInfo) {
        score = Math.max(0, score - 30);
        issues.push('No debe contener información personal');
      }
    }

    // Determinar etiqueta y color
    let label: string;
    let color: string;
    let valid: boolean;

    if (score >= 80) {
      label = 'Muy fuerte';
      color = 'bg-green-500';
      valid = true;
    } else if (score >= 60) {
      label = 'Fuerte';
      color = 'bg-blue-500';
      valid = true;
    } else if (score >= 40) {
      label = 'Moderada';
      color = 'bg-yellow-500';
      valid = false;
    } else {
      label = 'Débil';
      color = 'bg-red-500';
      valid = false;
    }

    return {
      strength: score,
      label,
      color,
      valid
    };
  }

  validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) {
      return {
        valid: false,
        message: 'Las contraseñas no coinciden'
      };
    }
    return { valid: true };
  }

  validatePasswordDifferent(currentPassword: string, newPassword: string): ValidationResult {
    if (currentPassword === newPassword) {
      return {
        valid: false,
        message: 'La nueva contraseña debe ser diferente a la actual'
      };
    }
    return { valid: true };
  }

  // ============================================
  // GESTIÓN DE MENSAJERÍA
  // ============================================

  getMessageTopics(): MessageTopic[] {
    return this.MESSAGE_TOPICS;
  }

  getMessagingStats(userId: string): MessagingStats {
    const messages = this.messagesSubject.value;
    const conversations = this.conversationsSubject.value;

    return {
      totalConversations: conversations.length,
      activeConversations: conversations.filter(c => c.status === 'active').length,
      unreadMessages: messages.filter(m => m.toUserId === userId && m.status === 'sent').length,
      draftMessages: messages.filter(m => m.fromUserId === userId && m.status === 'draft').length
    };
  }

  getConversations(userId: string): Observable<Conversation[]> {
    return this.conversations$.pipe(
      map(conversations => 
        conversations.filter(c => c.participants.includes(userId))
      )
    );
  }

  getConversationMessages(conversationId: string): Observable<Message[]> {
    return this.messages$.pipe(
      map(messages => 
        messages
          .filter(m => m.conversationId === conversationId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      )
    );
  }

  sendMessage(message: Partial<Message>): Observable<Message> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          conversationId: message.conversationId || `conv-${Date.now()}`,
          fromUserId: message.fromUserId!,
          fromUserName: message.fromUserName!,
          toUserId: 'admin-001',
          toUserName: 'Administración',
          subject: message.subject!,
          content: message.content!,
          topic: message.topic!,
          priority: message.priority || 'normal',
          status: message.status || 'sent',
          createdAt: new Date(),
          attachments: message.attachments || []
        };

        const currentMessages = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, newMessage]);
        this.saveMessagesToStorage();

        // Crear o actualizar conversación
        this.updateOrCreateConversation(newMessage);

        return newMessage;
      })
    );
  }

  private updateOrCreateConversation(message: Message): void {
    const conversations = this.conversationsSubject.value;
    let conversation = conversations.find(c => c.id === message.conversationId);

    if (!conversation) {
      conversation = {
        id: message.conversationId,
        subject: message.subject,
        topic: message.topic,
        participants: [message.fromUserId, message.toUserId!],
        lastMessage: message,
        unreadCount: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.conversationsSubject.next([...conversations, conversation]);
    } else {
      conversation.lastMessage = message;
      conversation.updatedAt = new Date();
      this.conversationsSubject.next([...conversations]);
    }

    this.saveConversationsToStorage();
  }

  // ============================================
  // PERSISTENCIA EN LOCALSTORAGE
  // ============================================

  /**
   * Método público para recargar datos desde localStorage
   */
  public reloadMessagingData(): void {
    this.loadMessagesFromStorage();
    this.loadConversationsFromStorage();
  }

  /**
   * Método público para agregar mensajes desde otras partes del sistema (ej: Centro de Ayuda)
   */
  public addExternalMessage(messageData: {
    subject: string;
    content: string;
    topic?: string;
    priority?: 'normal' | 'high';
    fromUserName?: string;
  }): Observable<Message> {
    const userId = 'user-001'; // En producción, obtener del contexto
    const topic = this.MESSAGE_TOPICS.find(t => t.value === (messageData.topic || 'consulta-general')) || this.MESSAGE_TOPICS[0];
    
    return this.sendMessage({
      topic,
      subject: messageData.subject,
      content: messageData.content,
      fromUserId: userId,
      fromUserName: messageData.fromUserName || 'Usuario',
      priority: messageData.priority || 'normal',
      status: 'sent'
    });
  }

  private loadMessagesFromStorage(): void {
    try {
      const stored = localStorage.getItem('autoservicio_messages');
      if (stored) {
        const messages = JSON.parse(stored).map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
          readAt: m.readAt ? new Date(m.readAt) : undefined
        }));
        this.messagesSubject.next(messages);
      } else {
        // Datos mock iniciales
        this.createMockMessages();
      }
    } catch (error) {
      console.error('Error loading messages from storage:', error);
      this.createMockMessages();
    }
  }

  private loadConversationsFromStorage(): void {
    try {
      const stored = localStorage.getItem('autoservicio_conversations');
      if (stored) {
        const conversations = JSON.parse(stored).map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }));
        this.conversationsSubject.next(conversations);
      } else {
        // Datos mock iniciales
        this.createMockConversations();
      }
    } catch (error) {
      console.error('Error loading conversations from storage:', error);
      this.createMockConversations();
    }
  }

  private saveMessagesToStorage(): void {
    try {
      const messages = this.messagesSubject.value;
      localStorage.setItem('autoservicio_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  }

  private saveConversationsToStorage(): void {
    try {
      const conversations = this.conversationsSubject.value;
      localStorage.setItem('autoservicio_conversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations to storage:', error);
    }
  }

  private createMockMessages(): void {
    const mockMessages: Message[] = [
      // Conversación 1: Error al generar PDF de receta
      {
        id: 'msg-001',
        conversationId: 'conv-001',
        fromUserId: 'user-001',
        fromUserName: 'Dr. Juan Pérez',
        toUserId: 'admin-001',
        toUserName: 'Administración',
        subject: 'Error al generar PDF de receta',
        content: 'Hola, tengo problemas para generar el PDF de las recetas. Cuando hago clic en "Generar PDF" aparece un error y no se descarga el archivo.',
        topic: this.MESSAGE_TOPICS[1], // soporte-tecnico
        priority: 'normal',
        status: 'sent',
        createdAt: new Date(Date.now() - 86400000 - 3600000), // 1 día y 1 hora atrás
        attachments: []
      },
      {
        id: 'msg-002',
        conversationId: 'conv-001',
        fromUserId: 'admin-001',
        fromUserName: 'Administración',
        toUserId: 'user-001',
        toUserName: 'Dr. Juan Pérez',
        subject: 'Re: Error al generar PDF de receta',
        content: 'Hemos identificado el problema con la generación de PDFs. Se solucionará en la próxima actualización del sistema. Mientras tanto, puede usar la opción de "Imprimir" como alternativa.',
        topic: this.MESSAGE_TOPICS[1], // soporte-tecnico
        priority: 'normal',
        status: 'sent',
        createdAt: new Date(Date.now() - 86400000), // 1 día atrás
        attachments: []
      },
      // Conversación 2: Solicitud acceso a módulo de reportes (cerrada)
      {
        id: 'msg-003',
        conversationId: 'conv-002',
        fromUserId: 'user-001',
        fromUserName: 'Dr. Juan Pérez',
        toUserId: 'admin-001',
        toUserName: 'Administración',
        subject: 'Solicitud acceso a módulo de reportes',
        content: 'Solicito acceso al módulo de reportes para poder generar estadísticas de mis prescripciones.',
        topic: this.MESSAGE_TOPICS[2], // solicitud-permisos
        priority: 'normal',
        status: 'sent',
        createdAt: new Date(Date.now() - 172800000 - 1800000), // 2 días y 30 min atrás
        attachments: []
      },
      {
        id: 'msg-004',
        conversationId: 'conv-002',
        fromUserId: 'admin-001',
        fromUserName: 'Administración',
        toUserId: 'user-001',
        toUserName: 'Dr. Juan Pérez',
        subject: 'Re: Solicitud acceso a módulo de reportes',
        content: 'Su solicitud de acceso al módulo de reportes ha sido aprobada. Ya puede acceder desde el menú principal. La conversación se marca como cerrada.',
        topic: this.MESSAGE_TOPICS[2], // solicitud-permisos
        priority: 'normal',
        status: 'sent',
        createdAt: new Date(Date.now() - 172800000), // 2 días atrás
        attachments: []
      },
      // Conversación 3: Consulta sobre cambio de contraseña
      {
        id: 'msg-005',
        conversationId: 'conv-003',
        fromUserId: 'user-001',
        fromUserName: 'Dr. Juan Pérez',
        toUserId: 'admin-001',
        toUserName: 'Administración',
        subject: 'Consulta sobre cambio de contraseña',
        content: '¿Cada cuánto tiempo debo cambiar mi contraseña? ¿Hay alguna política específica que deba seguir?',
        topic: this.MESSAGE_TOPICS[0], // consulta-general
        priority: 'normal',
        status: 'sent',
        createdAt: new Date(Date.now() - 259200000), // 3 días atrás
        attachments: []
      }
    ];

    this.messagesSubject.next(mockMessages);
    this.saveMessagesToStorage();
  }

  private createMockConversations(): void {
    const mockConversations: Conversation[] = [
      {
        id: 'conv-001',
        subject: 'Error al generar PDF de receta',
        topic: this.MESSAGE_TOPICS[1], // soporte-tecnico
        participants: ['user-001', 'admin-001'],
        unreadCount: 1,
        status: 'active',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        id: 'conv-002',
        subject: 'Solicitud acceso a módulo de reportes',
        topic: this.MESSAGE_TOPICS[2], // solicitud-permisos
        participants: ['user-001', 'admin-001'],
        unreadCount: 0,
        status: 'closed',
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000)
      },
      {
        id: 'conv-003',
        subject: 'Consulta sobre cambio de contraseña',
        topic: this.MESSAGE_TOPICS[0], // consulta-general
        participants: ['user-001', 'admin-001'],
        unreadCount: 0,
        status: 'active',
        createdAt: new Date(Date.now() - 259200000), // 3 días atrás
        updatedAt: new Date(Date.now() - 259200000)
      },
      {
        id: 'conv-004',
        subject: 'Problema con la firma digital',
        topic: this.MESSAGE_TOPICS[1], // soporte-tecnico
        participants: ['user-001', 'admin-001'],
        unreadCount: 0,
        status: 'archived',
        createdAt: new Date(Date.now() - 604800000), // 7 días atrás
        updatedAt: new Date(Date.now() - 604800000)
      }
    ];

    this.conversationsSubject.next(mockConversations);
    this.saveConversationsToStorage();
  }
}