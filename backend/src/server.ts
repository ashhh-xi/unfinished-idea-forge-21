
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import collaborationRoutes from './routes/collaborations';
import commentRoutes from './routes/comments';
import transactionRoutes from './routes/transactions';
import notificationRoutes from './routes/notifications';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Add routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/collaborations', collaborationRoutes);
app.use('/comments', commentRoutes);
app.use('/transactions', transactionRoutes);
app.use('/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Unfinished Ideas Marketplace API',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
