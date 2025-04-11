
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  role: 'maker' | 'collaborator' | 'buyer';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'comment' | 'collaboration_request' | 'collaboration_response' | 'transaction';
  link?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}
