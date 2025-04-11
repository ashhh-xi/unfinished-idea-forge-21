
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if user is logged in
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        // Unauthorized - could trigger a sign-in modal or redirect
        console.error('Authentication error:', error.response.data);
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        toast.error('You do not have permission to perform this action');
      } else if (status === 404) {
        // Not found
        console.error('Resource not found:', error.response.data);
      } else if (status === 500) {
        // Server error
        toast.error('An unexpected server error occurred. Please try again later.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
