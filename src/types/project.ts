
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stage: 'idea' | 'half-built' | 'ready';
  licensing?: string;
  price?: number;
  visibility: 'public' | 'private';
  created_at: string;
  updated_at: string;
  owner_id: string;
  owner_username?: string;
  owner_name?: string;
  owner_avatar?: string;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface CollaborationRequest {
  id: string;
  project_id: string;
  sender_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  project?: Project;
  sender?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface Transaction {
  id: string;
  project_id: string;
  buyer_id: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  stripe_id?: string;
  created_at: string;
  updated_at: string;
  project?: Project;
  buyer?: {
    id: string;
    username: string;
  };
}
