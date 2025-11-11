export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  specialty?: string;
  department?: string;
  username: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
  valid: boolean;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
  errors?: Record<string, string>;
  messages?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId?: string;
  toUserName?: string;
  subject: string;
  content: string;
  topic: MessageTopic;
  priority: 'normal' | 'high';
  status: 'draft' | 'sent' | 'read' | 'archived';
  createdAt: Date;
  readAt?: Date;
  attachments?: MessageAttachment[];
}

export interface Conversation {
  id: string;
  subject: string;
  topic: MessageTopic;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  status: 'active' | 'closed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageTopic {
  value: string;
  label: string;
  description: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface MessagingStats {
  totalConversations: number;
  activeConversations: number;
  unreadMessages: number;
  draftMessages: number;
}

export interface SecurityPolicy {
  MIN_LENGTH: number;
  MIN_CHAR_TYPES: number;
  REQUIRE_UPPERCASE: boolean;
  REQUIRE_LOWERCASE: boolean;
  REQUIRE_NUMBERS: boolean;
  REQUIRE_SYMBOLS: boolean;
}