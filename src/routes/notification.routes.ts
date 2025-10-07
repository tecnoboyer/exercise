// src/routes/notification.routes.ts
import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth.middleware';
import socketService from '../services/socket.service';

const router = Router();

// Send test notification to yourself
router.post('/test', authenticateJWT, (req: AuthRequest, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  socketService.notifyUser(userId, {
    type: 'test',
    message: 'This is a test notification! 🎉',
    data: { timestamp: new Date().toISOString() }
  });

  res.json({ 
    message: 'Test notification sent',
    userId,
    online: socketService.isUserOnline(userId)
  });
});

// Broadcast message to all users (admin only)
router.post(
  '/broadcast',
  authenticateJWT,
  (req: AuthRequest, res) => {
    const { message, type } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    socketService.broadcast('announcement', {
      type: type || 'info',
      message
    });

    res.json({ 
      message: 'Broadcast sent',
      recipients: socketService.getConnectedUsersCount()
    });
  }
);

// Check if user is online
router.get('/status/:userId', authenticateJWT, (req, res) => {
  const { userId } = req.params;
  const isOnline = socketService.isUserOnline(userId);
  
  res.json({ userId, isOnline });
});

// Get connection stats
router.get('/stats', authenticateJWT, (req, res) => {
  const count = socketService.getConnectedUsersCount();
  res.json({ 
    connectedUsers: count,
    timestamp: new Date().toISOString()
  });
});

export default router;