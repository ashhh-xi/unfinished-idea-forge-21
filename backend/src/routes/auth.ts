
import { Router } from 'express';
import { supabaseServer, getSupabaseClient } from '../lib/supabaseServer';
import { authMiddleware } from '../middleware/auth';
import { ApiResponse, CreateProfileRequest } from '../types';

const router = Router();

// Create a new user profile
router.post('/create-profile', async (req, res) => {
  try {
    const { userId, username, fullName, bio, avatarUrl, role }: CreateProfileRequest = req.body;
    
    if (!userId || !username || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Check if username is already taken
    const { data: existingUser, error: checkError } = await supabaseServer
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();
      
    if (checkError) {
      return res.status(500).json({
        success: false,
        error: 'Error checking username availability'
      });
    }
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Username already taken'
      });
    }
    
    // Create profile
    const { data, error } = await supabaseServer
      .from('profiles')
      .upsert({
        id: userId,
        username,
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
        role: role || 'maker'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating profile:', error);
      return res.status(500).json({
        success: false,
        error: 'Error creating profile'
      });
    }
    
    return res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Create profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get logged-in user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }
    
    const { data, error } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({
        success: false,
        error: 'Error fetching profile'
      });
    }
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Webhook endpoint for auto-creating profiles on signup
router.post('/webhook', async (req, res) => {
  try {
    // Validate webhook secret (you should add proper validation in production)
    const webhookSecret = req.headers['x-webhook-secret'];
    if (webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return res.status(401).json({
        success: false,
        error: 'Invalid webhook secret'
      });
    }
    
    const { event, record } = req.body;
    
    if (event !== 'INSERT' || !record || !record.id) {
      return res.status(400).json({
        success: false,
        error: 'Invalid webhook payload'
      });
    }
    
    // Auto-create profile with default values
    const { data, error } = await supabaseServer
      .from('profiles')
      .upsert({
        id: record.id,
        username: `user_${record.id.slice(0, 8)}`, // Generate default username
        full_name: record.email?.split('@')[0] || 'New User',
        role: 'maker'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error auto-creating profile:', error);
      return res.status(500).json({
        success: false,
        error: 'Error auto-creating profile'
      });
    }
    
    return res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
