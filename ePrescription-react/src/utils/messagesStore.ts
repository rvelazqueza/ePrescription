/**
 * Messages Store - Sistema de mensajería interno
 * Siguiendo estándares HIPAA para comunicación segura
 */

export type MessageTopic = 
  | "consulta-general"
  | "problemas-tecnicos"
  | "solicitud-permisos"
  | "reportar-error"
  | "solicitud-soporte"
  | "cambio-datos"
  | "consulta-seguridad"
  | "actualizacion-sistema"
  | "otro";

export interface Message {
  id: string;
  conversationId: string;
  topic: MessageTopic;
  subject: string;
  content: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: "user" | "admin";
  toUserId?: string; // Si es específico a un usuario
  status: "draft" | "sent" | "read" | "archived" | "deleted";
  priority: "low" | "normal" | "high" | "urgent";
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
  parentMessageId?: string; // Para hilos de conversación
  createdAt: string;
  sentAt?: string;
  readAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isEncrypted: boolean;
  requiresAcknowledgment: boolean;
  acknowledgedAt?: string;
}

export interface Conversation {
  id: string;
  topic: MessageTopic;
  subject: string;
  participants: Array<{
    userId: string;
    userName: string;
    role: "user" | "admin";
  }>;
  status: "active" | "closed" | "archived";
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
  closedAt?: string;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "conv-001",
    topic: "problemas-tecnicos",
    subject: "Error al generar PDF de receta",
    participants: [
      { userId: "user-001", userName: "Dr. Carlos Martínez", role: "user" },
      { userId: "admin-001", userName: "Soporte Técnico", role: "admin" }
    ],
    status: "active",
    messageCount: 3,
    lastMessageAt: "2025-01-14T10:30:00Z",
    createdAt: "2025-01-13T09:00:00Z"
  },
  {
    id: "conv-002",
    topic: "solicitud-permisos",
    subject: "Solicitud acceso a módulo de reportes",
    participants: [
      { userId: "user-001", userName: "Dr. Carlos Martínez", role: "user" },
      { userId: "admin-002", userName: "Admin Seguridad", role: "admin" }
    ],
    status: "closed",
    messageCount: 5,
    lastMessageAt: "2025-01-12T16:45:00Z",
    createdAt: "2025-01-10T08:00:00Z",
    closedAt: "2025-01-12T16:45:00Z"
  }
];

const mockMessages: Message[] = [
  {
    id: "msg-001",
    conversationId: "conv-001",
    topic: "problemas-tecnicos",
    subject: "Error al generar PDF de receta",
    content: "Al intentar exportar una receta a PDF, el sistema muestra el error 'PDF-ERROR-500'. He intentado con Chrome y Firefox, mismo resultado.",
    fromUserId: "user-001",
    fromUserName: "Dr. Carlos Martínez",
    fromUserRole: "user",
    status: "sent",
    priority: "high",
    createdAt: "2025-01-13T09:00:00Z",
    sentAt: "2025-01-13T09:00:00Z",
    readAt: "2025-01-13T09:15:00Z",
    isEncrypted: true,
    requiresAcknowledgment: false
  },
  {
    id: "msg-002",
    conversationId: "conv-001",
    topic: "problemas-tecnicos",
    subject: "Re: Error al generar PDF de receta",
    content: "Hola Dr. Martínez, hemos recibido su reporte. Estamos investigando el error. ¿Podría indicarnos el número de receta que intentó exportar?",
    fromUserId: "admin-001",
    fromUserName: "Soporte Técnico",
    fromUserRole: "admin",
    toUserId: "user-001",
    status: "sent",
    priority: "high",
    parentMessageId: "msg-001",
    createdAt: "2025-01-13T09:15:00Z",
    sentAt: "2025-01-13T09:15:00Z",
    readAt: "2025-01-13T09:20:00Z",
    isEncrypted: true,
    requiresAcknowledgment: false
  },
  {
    id: "msg-003",
    conversationId: "conv-001",
    topic: "problemas-tecnicos",
    subject: "Re: Error al generar PDF de receta",
    content: "El número de receta es RX-2025-00145. También probé con RX-2025-00146 y mismo error.",
    fromUserId: "user-001",
    fromUserName: "Dr. Carlos Martínez",
    fromUserRole: "user",
    status: "sent",
    priority: "high",
    parentMessageId: "msg-002",
    createdAt: "2025-01-14T10:30:00Z",
    sentAt: "2025-01-14T10:30:00Z",
    isEncrypted: true,
    requiresAcknowledgment: false
  }
];

export const messagesStore = {
  // Obtener conversaciones del usuario
  getUserConversations: (userId: string, status?: Conversation["status"]): Conversation[] => {
    let conversations = mockConversations.filter(conv => 
      conv.participants.some(p => p.userId === userId)
    );
    
    if (status) {
      conversations = conversations.filter(c => c.status === status);
    }
    
    return conversations.sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  },

  // Obtener mensajes de una conversación
  getConversationMessages: (conversationId: string): Message[] => {
    return mockMessages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  },

  // Obtener borradores del usuario
  getUserDrafts: (userId: string): Message[] => {
    return mockMessages
      .filter(msg => msg.fromUserId === userId && msg.status === "draft")
      .sort((a, b) => 
        new Date(b.updatedAt || b.createdAt).getTime() - 
        new Date(a.updatedAt || a.createdAt).getTime()
      );
  },

  // Crear nuevo mensaje/conversación
  createMessage: async (data: {
    topic: MessageTopic;
    subject: string;
    content: string;
    fromUserId: string;
    fromUserName: string;
    priority: Message["priority"];
    status: "draft" | "sent";
    conversationId?: string;
    parentMessageId?: string;
  }): Promise<{ success: boolean; messageId?: string; conversationId?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const messageId = `msg-${Date.now()}`;
    let conversationId = data.conversationId;

    // Si no hay conversación, crear una nueva
    if (!conversationId) {
      conversationId = `conv-${Date.now()}`;
      const newConversation: Conversation = {
        id: conversationId,
        topic: data.topic,
        subject: data.subject,
        participants: [
          { userId: data.fromUserId, userName: data.fromUserName, role: "user" },
          { userId: "admin-001", userName: "Administración", role: "admin" }
        ],
        status: "active",
        messageCount: 1,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      mockConversations.unshift(newConversation);
    }

    const newMessage: Message = {
      id: messageId,
      conversationId,
      topic: data.topic,
      subject: data.subject,
      content: data.content,
      fromUserId: data.fromUserId,
      fromUserName: data.fromUserName,
      fromUserRole: "user",
      status: data.status,
      priority: data.priority,
      createdAt: new Date().toISOString(),
      sentAt: data.status === "sent" ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
      isEncrypted: true,
      requiresAcknowledgment: data.priority === "urgent",
      parentMessageId: data.parentMessageId
    };

    mockMessages.push(newMessage);

    // Actualizar contador de mensajes en conversación
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (conversation && data.status === "sent") {
      conversation.messageCount++;
      conversation.lastMessageAt = newMessage.createdAt;
    }

    return { success: true, messageId, conversationId };
  },

  // Actualizar mensaje (para borradores)
  updateMessage: async (messageId: string, updates: Partial<Message>): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const index = mockMessages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      mockMessages[index] = {
        ...mockMessages[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }

    return { success: true };
  },

  // Enviar borrador
  sendDraft: async (messageId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const message = mockMessages.find(m => m.id === messageId);
    if (message) {
      message.status = "sent";
      message.sentAt = new Date().toISOString();
      message.updatedAt = new Date().toISOString();

      // Actualizar conversación
      const conversation = mockConversations.find(c => c.id === message.conversationId);
      if (conversation) {
        conversation.messageCount++;
        conversation.lastMessageAt = message.sentAt;
      }
    }

    return { success: true };
  },

  // Eliminar mensaje
  deleteMessage: async (messageId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const index = mockMessages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      mockMessages[index].status = "deleted";
      mockMessages[index].deletedAt = new Date().toISOString();
    }

    return { success: true };
  },

  // Marcar como leído
  markAsRead: async (messageId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const message = mockMessages.find(m => m.id === messageId);
    if (message && !message.readAt) {
      message.readAt = new Date().toISOString();
    }

    return { success: true };
  },

  // Cerrar conversación
  closeConversation: async (conversationId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const conversation = mockConversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.status = "closed";
      conversation.closedAt = new Date().toISOString();
    }

    return { success: true };
  },

  // Obtener tópicos disponibles
  getTopics: (): Array<{ value: MessageTopic; label: string; description: string }> => {
    return [
      {
        value: "consulta-general",
        label: "Consulta general",
        description: "Preguntas generales sobre el sistema"
      },
      {
        value: "problemas-tecnicos",
        label: "Problemas técnicos",
        description: "Reportar errores o problemas técnicos"
      },
      {
        value: "solicitud-permisos",
        label: "Solicitud de permisos",
        description: "Solicitar acceso a módulos o funcionalidades"
      },
      {
        value: "reportar-error",
        label: "Reportar error",
        description: "Reportar errores del sistema o datos incorrectos"
      },
      {
        value: "solicitud-soporte",
        label: "Solicitud de soporte",
        description: "Solicitar ayuda o capacitación"
      },
      {
        value: "cambio-datos",
        label: "Cambio de datos",
        description: "Solicitar cambios en información personal"
      },
      {
        value: "consulta-seguridad",
        label: "Consulta de seguridad",
        description: "Preguntas sobre seguridad y privacidad"
      },
      {
        value: "actualizacion-sistema",
        label: "Actualización del sistema",
        description: "Información sobre actualizaciones"
      },
      {
        value: "otro",
        label: "Otro",
        description: "Otros temas no listados"
      }
    ];
  },

  // Obtener estadísticas de mensajería
  getMessagingStats: (userId: string): {
    totalConversations: number;
    activeConversations: number;
    unreadMessages: number;
    draftMessages: number;
  } => {
    const userConversations = mockConversations.filter(conv => 
      conv.participants.some(p => p.userId === userId)
    );

    const userMessages = mockMessages.filter(msg => 
      msg.fromUserId === userId || msg.toUserId === userId
    );

    return {
      totalConversations: userConversations.length,
      activeConversations: userConversations.filter(c => c.status === "active").length,
      unreadMessages: userMessages.filter(m => 
        m.toUserId === userId && m.status === "sent" && !m.readAt
      ).length,
      draftMessages: userMessages.filter(m => 
        m.fromUserId === userId && m.status === "draft"
      ).length
    };
  },

  // Enviar mensaje directo a soporte
  sendSupportMessage: async (data: {
    fromUserId: string;
    fromUserName: string;
    subject: string;
    message: string;
    priority: "normal" | "high";
  }): Promise<{ success: boolean; conversationId?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const conversationId = `conv-support-${Date.now()}`;
    const messageId = `msg-support-${Date.now()}`;

    const newConversation: Conversation = {
      id: conversationId,
      topic: "solicitud-soporte",
      subject: data.subject,
      participants: [
        { userId: data.fromUserId, userName: data.fromUserName, role: "user" },
        { userId: "admin-support", userName: "Equipo de Soporte", role: "admin" }
      ],
      status: "active",
      messageCount: 1,
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const newMessage: Message = {
      id: messageId,
      conversationId,
      topic: "solicitud-soporte",
      subject: data.subject,
      content: data.message,
      fromUserId: data.fromUserId,
      fromUserName: data.fromUserName,
      fromUserRole: "user",
      toUserId: "admin-support",
      status: "sent",
      priority: data.priority,
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      isEncrypted: true,
      requiresAcknowledgment: data.priority === "high"
    };

    mockConversations.unshift(newConversation);
    mockMessages.push(newMessage);

    return { success: true, conversationId };
  }
};
