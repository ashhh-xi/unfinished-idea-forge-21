
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { User, Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Profile } from '@/types/profile';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  
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

  // Save the current path when redirecting to login
  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      setRedirectAfterLogin(location.pathname);
    }
  }, [location.pathname]);
  
  // Handle navigation after login/signup
  useEffect(() => {
    if (auth.user && !auth.loading) {
      const timer = setTimeout(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
          if (redirectAfterLogin && redirectAfterLogin !== '/' && redirectAfterLogin !== '/login' && redirectAfterLogin !== '/register') {
            navigate(redirectAfterLogin);
          } else {
            navigate('/dashboard');
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [auth.user, auth.loading, location.pathname, navigate, redirectAfterLogin]);
  
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

  // Enhanced sign in function with toast notifications
  const signIn = async (email: string, password: string) => {
    try {
      const result = await auth.signIn(email, password);
      if (result.error) {
        toast.error(result.error.message || 'Failed to sign in');
      } else {
        toast.success('Signed in successfully');
      }
      return result;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign in');
      return { data: null, error };
    }
  };

  // Enhanced sign up function with additional feedback
  const signUp = async (email: string, password: string) => {
    try {
      const result = await auth.signUp(email, password);
      if (result.error) {
        toast.error(result.error.message || 'Failed to sign up');
      } else {
        toast.success('Signed up successfully');
      }
      return result;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      return { data: null, error };
    }
  };

  // Enhanced sign out function with redirect
  const signOut = async () => {
    try {
      await auth.signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{
        ...auth,
        profile,
        profileLoading,
        updateProfile,
        signIn,
        signUp,
        signOut,
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
