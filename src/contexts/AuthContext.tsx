
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { User, Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Profile } from '@/types/profile';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Omit<Profile, 'id'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useSupabaseAuth();
  
  const { data: profile, isLoading: profileLoading, refetch } = useQuery({
    queryKey: ['profile', auth.user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!auth.user) return null;
      
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.error || 'Failed to fetch profile');
        }
      } catch (error: any) {
        // Don't show toast for unauthorized errors - it's expected when not logged in
        if (!error.response || error.response.status !== 401) {
          toast.error(error.message || 'Error fetching profile');
        }
        return null;
      }
    },
    enabled: !!auth.user,
  });
  
  // Refetch profile when user changes
  useEffect(() => {
    if (auth.user) {
      refetch();
    }
  }, [auth.user, refetch]);
  
  const updateProfile = async (data: Partial<Omit<Profile, 'id'>>) => {
    if (!auth.user) throw new Error('Not authenticated');
    
    try {
      const response = await api.post('/auth/update-profile', {
        ...data,
        userId: auth.user.id,
      });
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        refetch();
      } else {
        throw new Error(response.data.error || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{
        ...auth,
        profile,
        profileLoading,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
