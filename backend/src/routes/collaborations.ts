
import { Router } from 'express';
import { supabaseServer } from '../lib/supabaseServer';
import { authMiddleware } from '../middleware/auth';
import { ApiResponse, CollaborationRequestRequest, CollaborationResponseRequest } from '../types';

const router = Router();

// Create a collaboration request
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { projectId, senderId, message }: CollaborationRequestRequest = req.body;
    
    if (!projectId || !senderId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Verify that the requesting user is creating a request for themselves
    if (req.user?.id !== senderId) {
      return res.status(403).json({
        success: false,
        error: 'You can only create collaboration requests for yourself'
      });
    }
    
    // Check if project exists
    const { data: project, error: projectError } = await supabaseServer
      .from('projects')
      .select('owner_id')
      .eq('id', projectId)
      .single();
      
    if (projectError || !project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // Don't allow requesting collaboration on your own project
    if (project.owner_id === senderId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot request collaboration on your own project'
      });
    }
    
    // Check if a pending or accepted request already exists
    const { data: existingRequest, error: checkError } = await supabaseServer
      .from('collaboration_requests')
      .select('*')
      .eq('project_id', projectId)
      .eq('sender_id', senderId)
      .in('status', ['pending', 'accepted'])
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking existing requests:', checkError);
      return res.status(500).json({
        success: false,
        error: 'Error checking existing requests'
      });
    }
    
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        error: 'You already have a pending or accepted collaboration request for this project'
      });
    }
    
    // Create collaboration request
    const { data, error } = await supabaseServer
      .from('collaboration_requests')
      .insert({
        project_id: projectId,
        sender_id: senderId,
        message,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating collaboration request:', error);
      return res.status(500).json({
        success: false,
        error: 'Error creating collaboration request'
      });
    }
    
    // Create notification for the project owner
    await supabaseServer
      .from('notifications')
      .insert({
        user_id: project.owner_id,
        message: `New collaboration request for your project`,
        type: 'collaboration_request',
        link: `/projects/${projectId}/collaborations`
      });
    
    return res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Create collaboration request error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Respond to a collaboration request (accept/decline)
router.post('/respond', authMiddleware, async (req, res) => {
  try {
    const { requestId, status }: CollaborationResponseRequest = req.body;
    
    if (!requestId || !status || !['accepted', 'declined'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid required fields'
      });
    }
    
    // Get the request to check if user has permission to respond
    const { data: request, error: requestError } = await supabaseServer
      .from('collaboration_requests')
      .select('project_id, sender_id, status')
      .eq('id', requestId)
      .single();
      
    if (requestError || !request) {
      return res.status(404).json({
        success: false,
        error: 'Collaboration request not found'
      });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'This request has already been processed'
      });
    }
    
    // Get project to check ownership
    const { data: project, error: projectError } = await supabaseServer
      .from('projects')
      .select('owner_id')
      .eq('id', request.project_id)
      .single();
      
    if (projectError || !project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // Verify that the requesting user is the project owner
    if (req.user?.id !== project.owner_id) {
      return res.status(403).json({
        success: false,
        error: 'Only the project owner can respond to collaboration requests'
      });
    }
    
    // Update the collaboration request status
    const { data, error } = await supabaseServer
      .from('collaboration_requests')
      .update({ status })
      .eq('id', requestId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating collaboration request:', error);
      return res.status(500).json({
        success: false,
        error: 'Error updating collaboration request'
      });
    }
    
    // Create notification for the request sender
    await supabaseServer
      .from('notifications')
      .insert({
        user_id: request.sender_id,
        message: `Your collaboration request was ${status}`,
        type: 'collaboration_response',
        link: `/projects/${request.project_id}`
      });
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Collaboration response error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all collaboration requests for a user (both sent and received)
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify that the requesting user is viewing their own requests
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only view your own collaboration requests'
      });
    }
    
    // Get requests sent by the user
    const { data: sentRequests, error: sentError } = await supabaseServer
      .from('collaboration_requests')
      .select(`
        *,
        project:projects(id, title, owner_id),
        sender:profiles(id, username, avatar_url)
      `)
      .eq('sender_id', userId)
      .order('created_at', { ascending: false });
      
    if (sentError) {
      console.error('Error fetching sent requests:', sentError);
      return res.status(500).json({
        success: false,
        error: 'Error fetching sent collaboration requests'
      });
    }
    
    // Get requests received by the user (as project owner)
    const { data: receivedRequests, error: receivedError } = await supabaseServer
      .from('collaboration_requests')
      .select(`
        *,
        project:projects(id, title, owner_id),
        sender:profiles(id, username, avatar_url)
      `)
      .eq('project.owner_id', userId)
      .order('created_at', { ascending: false });
      
    if (receivedError) {
      console.error('Error fetching received requests:', receivedError);
      return res.status(500).json({
        success: false,
        error: 'Error fetching received collaboration requests'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        sent: sentRequests,
        received: receivedRequests
      }
    });
  } catch (error) {
    console.error('Get collaboration requests error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
