
import { Router } from 'express';
import { supabaseServer } from '../lib/supabaseServer';
import { authMiddleware } from '../middleware/auth';
import { ApiResponse, CreateCommentRequest } from '../types';

const router = Router();

// Add a comment to a project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, projectId, content }: CreateCommentRequest = req.body;
    
    if (!userId || !projectId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Verify that the requesting user is creating a comment for themselves
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only create comments for yourself'
      });
    }
    
    // Check if project exists and is accessible
    const { data: project, error: projectError } = await supabaseServer
      .from('projects')
      .select('owner_id, visibility')
      .eq('id', projectId)
      .single();
      
    if (projectError || !project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // If project is private, only allow owner to comment
    if (project.visibility === 'private' && project.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Cannot comment on private projects'
      });
    }
    
    // Create comment
    const { data, error } = await supabaseServer
      .from('comments')
      .insert({
        user_id: userId,
        project_id: projectId,
        content
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({
        success: false,
        error: 'Error creating comment'
      });
    }
    
    // Create notification for project owner (if commenter is not the owner)
    if (project.owner_id !== userId) {
      await supabaseServer
        .from('notifications')
        .insert({
          user_id: project.owner_id,
          message: 'New comment on your project',
          type: 'comment',
          link: `/projects/${projectId}`
        });
    }
    
    return res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all comments for a specific project
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists and is accessible
    const { data: project, error: projectError } = await supabaseServer
      .from('projects')
      .select('owner_id, visibility')
      .eq('id', projectId)
      .single();
      
    if (projectError || !project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // If project is private, check if requesting user is the owner
    if (project.visibility === 'private') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
          success: false,
          error: 'This project is private'
        });
      }
      
      const token = authHeader.replace('Bearer ', '');
      const { data: userData, error: userError } = await supabaseServer.auth.getUser(token);
      
      if (userError || !userData.user || userData.user.id !== project.owner_id) {
        return res.status(403).json({
          success: false,
          error: 'This project is private'
        });
      }
    }
    
    // Get comments with user information
    const { data, error } = await supabaseServer
      .from('comments')
      .select(`
        *,
        profile:profiles(id, username, avatar_url)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({
        success: false,
        error: 'Error fetching comments'
      });
    }
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
