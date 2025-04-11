
import { Request, Response, NextFunction } from 'express';
import { supabaseServer } from '../lib/supabaseServer';

// Define a custom interface to extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: string;
      };
    }
  }
}

// Middleware to verify JWT and attach user to request
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT using Supabase Auth
    const { data, error } = await supabaseServer.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    }
    
    // Attach user data to request for use in route handlers
    req.user = {
      id: data.user.id,
      email: data.user.email
    };
    
    // Check if user has a profile and get role if available
    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
    
    if (profile) {
      req.user.role = profile.role;
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during authentication' });
  }
};

// Middleware to check if user has a specific role
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Authentication required' });
    }
    
    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};
