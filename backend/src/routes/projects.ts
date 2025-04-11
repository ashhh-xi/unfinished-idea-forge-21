
import { Router } from 'express';
import { supabaseServer } from '../lib/supabaseServer';
import { authMiddleware } from '../middleware/auth';
import { ApiResponse, CreateProjectRequest } from '../types';

const router = Router();

// Create a new project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      ownerId,
      title,
      description,
      tags,
      stage,
      licensing,
      price,
      visibility,
      attachments
    }: CreateProjectRequest = req.body;
    
    if (!ownerId || !title || !description || !tags) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Verify that the requesting user is creating a project for themselves
    if (req.user?.id !== ownerId) {
      return res.status(403).json({
        success: false,
        error: 'You can only create projects for yourself'
      });
    }
    
    const { data, error } = await supabaseServer
      .from('projects')
      .insert({
        owner_id: ownerId,
        title,
        description,
        tags,
        stage: stage || 'idea',
        licensing,
        price,
        visibility: visibility || 'public',
        attachments
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({
        success: false,
        error: 'Error creating project'
      });
    }
    
    return res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all public projects
router.get('/public', async (req, res) => {
  try {
    const { data, error } = await supabaseServer
      .from('project_details') // Using the view we created
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching public projects:', error);
      return res.status(500).json({
        success: false,
        error: 'Error fetching public projects'
      });
    }
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get public projects error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get a specific project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseServer
      .from('project_details') // Using the view we created
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching project:', error);
      return res.status(500).json({
        success: false,
        error: 'Error fetching project'
      });
    }
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // If project is private, check if requesting user is the owner
    if (data.visibility === 'private') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
          success: false,
          error: 'This project is private'
        });
      }
      
      const token = authHeader.replace('Bearer ', '');
      const { data: userData, error: userError } = await supabaseServer.auth.getUser(token);
      
      if (userError || !userData.user || userData.user.id !== data.owner_id) {
        return res.status(403).json({
          success: false,
          error: 'This project is private'
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all projects by a specific user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // If not viewing own projects, only allow viewing public projects
    const isOwnProjects = req.user?.id === userId;
    
    let query = supabaseServer
      .from('project_details')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });
      
    if (!isOwnProjects) {
      query = query.eq('visibility', 'public');
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching user projects:', error);
      return res.status(500).json({
        success: false,
        error: 'Error fetching user projects'
      });
    }
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get user projects error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
