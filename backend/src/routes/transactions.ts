
import { Router } from 'express';
import { supabaseServer } from '../lib/supabaseServer';
import { authMiddleware } from '../middleware/auth';
import { ApiResponse, CreateTransactionRequest, UpdateTransactionRequest } from '../types';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });

// Create a transaction
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { projectId, buyerId, amount }: CreateTransactionRequest = req.body;
    
    if (!projectId || !buyerId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Verify that the requesting user is creating a transaction for themselves
    if (req.user?.id !== buyerId) {
      return res.status(403).json({
        success: false,
        error: 'You can only create transactions for yourself'
      });
    }
    
    // Check if project exists and is available for purchase
    const { data: project, error: projectError } = await supabaseServer
      .from('projects')
      .select('owner_id, title, price, visibility')
      .eq('id', projectId)
      .single();
      
    if (projectError || !project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // Prevent buying own project
    if (project.owner_id === buyerId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot purchase your own project'
      });
    }
    
    // Check if project is private
    if (project.visibility === 'private') {
      return res.status(403).json({
        success: false,
        error: 'This project is not available for purchase'
      });
    }
    
    // Check if the amount matches the project price
    if (project.price && amount !== project.price) {
      return res.status(400).json({
        success: false,
        error: 'Transaction amount must match project price'
      });
    }
    
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      description: `Purchase of project: ${project.title}`,
      metadata: {
        projectId,
        buyerId,
        sellerId: project.owner_id
      }
    });
    
    // Create transaction record
    const { data, error } = await supabaseServer
      .from('transactions')
      .insert({
        project_id: projectId,
        buyer_id: buyerId,
        amount,
        status: 'pending',
        stripe_id: paymentIntent.id
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating transaction:', error);
      return res.status(500).json({
        success: false,
        error: 'Error creating transaction'
      });
    }
    
    return res.status(201).json({
      success: true,
      data: {
        transaction: data,
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update a transaction status
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { transactionId, status, stripeId }: UpdateTransactionRequest = req.body;
    
    if (!transactionId || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Get the transaction to verify permissions and current status
    const { data: transaction, error: getError } = await supabaseServer
      .from('transactions')
      .select('buyer_id, project_id, status')
      .eq('id', transactionId)
      .single();
      
    if (getError || !transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    // Only the buyer or an admin should be able to update the transaction
    if (req.user?.id !== transaction.buyer_id) {
      // Check if user is an admin
      const { data: isAdmin } = await supabaseServer.rpc('is_admin', { user_id: req.user?.id });
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this transaction'
        });
      }
    }
    
    // Don't allow updating already completed transactions
    if (transaction.status !== 'pending' && status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update a completed transaction'
      });
    }
    
    // Update the transaction
    const { data, error } = await supabaseServer
      .from('transactions')
      .update({
        status,
        stripe_id: stripeId || undefined
      })
      .eq('id', transactionId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating transaction:', error);
      return res.status(500).json({
        success: false,
        error: 'Error updating transaction'
      });
    }
    
    // If transaction is successful, notify the project owner
    if (status === 'success') {
      // Get project owner
      const { data: project } = await supabaseServer
        .from('projects')
        .select('owner_id')
        .eq('id', transaction.project_id)
        .single();
        
      if (project) {
        await supabaseServer
          .from('notifications')
          .insert({
            user_id: project.owner_id,
            message: 'Your project has been purchased',
            type: 'transaction',
            link: `/transactions/${transactionId}`
          });
      }
      
      // Also notify the buyer
      await supabaseServer
        .from('notifications')
        .insert({
          user_id: transaction.buyer_id,
          message: 'Your purchase was successful',
          type: 'transaction',
          link: `/projects/${transaction.project_id}`
        });
    }
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all transactions for a user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify that the requesting user is viewing their own transactions
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only view your own transactions'
      });
    }
    
    // Get transactions where user is buyer
    const { data: purchases, error: purchasesError } = await supabaseServer
      .from('transactions')
      .select(`
        *,
        project:projects(id, title, owner_id)
      `)
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });
      
    if (purchasesError) {
      console.error('Error fetching purchases:', purchasesError);
      return res.status(500).json({
        success: false,
        error: 'Error fetching purchase transactions'
      });
    }
    
    // Get transactions where user is seller
    const { data: sales, error: salesError } = await supabaseServer
      .from('transactions')
      .select(`
        *,
        project:projects(id, title, owner_id),
        buyer:profiles(id, username)
      `)
      .eq('project.owner_id', userId)
      .order('created_at', { ascending: false });
      
    if (salesError) {
      console.error('Error fetching sales:', salesError);
      return res.status(500).json({
        success: false,
        error: 'Error fetching sales transactions'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        purchases,
        sales
      }
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
