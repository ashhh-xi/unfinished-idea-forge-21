
import { Router } from 'express';
import { supabaseServer } from '../lib/supabaseServer';
import { authMiddleware } from '../middleware/auth';
import { ApiResponse, CreateNotificationRequest } from '../types';

const router = Router();

// Create a notification
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, message, type, link }: CreateNotificationRequest = req.body;
    
    if (!userId || !message || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Only admins can create notifications for other users
    if (req.user?.id !== userId) {
      // Check if user is an admin
      const { data: isAdmin } = await supabaseServer.rpc('is_admin', { user_id: req.user?.id });
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to create notifications for other users'
        });
      }
    }
    
    const { data, error } = await supabaseServer
      .from('notifications')
      .insert({
        user_id: userId,
        message,
        type,
        link
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({
        success: false,
        error: 'Error creating notification'
      });
    }
    
    return res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Create notification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all notifications for a user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify that the requesting user is viewing their own notifications
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only view your own notifications'
      });
    }
    
    const { data, error } = await supabaseServer
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({
        success: false,
        error: 'Error fetching notifications'
      });
    }
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Mark notifications as read
router.post('/mark-read', authMiddleware, async (req, res) => {
  try {
    const { notificationIds, userId } = req.body;
    
    if (!notificationIds || !Array.isArray(notificationIds) || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters'
      });
    }
    
    // Verify that the requesting user is updating their own notifications
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own notifications'
      });
    }
    
    const { data, error } = await supabaseServer
      .from('notifications')
      .update({ read: true })
      .in('id', notificationIds)
      .eq('user_id', userId)
      .select();
      
    if (error) {
      console.error('Error marking notifications as read:', error);
      return res.status(500).json({
        success: false,
        error: 'Error marking notifications as read'
      });
    }
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Mark notifications as read error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
