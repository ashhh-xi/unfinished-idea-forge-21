
import { Database } from '../../src/integrations/supabase/types';

// Supabase types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type CollaborationRequest = Database['public']['Tables']['collaboration_requests']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// Request types
export interface CreateProfileRequest {
  userId: string;
  username: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  role?: 'maker' | 'buyer' | 'collaborator';
}

export interface CreateProjectRequest {
  ownerId: string;
  title: string;
  description: string;
  tags: string[];
  stage?: 'idea' | 'half-built' | 'ready';
  licensing?: string;
  price?: number;
  visibility?: 'public' | 'private';
  attachments?: Record<string, any>;
}

export interface CollaborationRequestRequest {
  projectId: string;
  senderId: string;
  message: string;
}

export interface CollaborationResponseRequest {
  requestId: string;
  status: 'accepted' | 'declined';
}

export interface CreateCommentRequest {
  userId: string;
  projectId: string;
  content: string;
}

export interface CreateTransactionRequest {
  projectId: string;
  buyerId: string;
  amount: number;
  stripePaymentIntentId?: string;
}

export interface UpdateTransactionRequest {
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  stripeId?: string;
}

export interface CreateNotificationRequest {
  userId: string;
  message: string;
  type: string;
  link?: string;
}

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
