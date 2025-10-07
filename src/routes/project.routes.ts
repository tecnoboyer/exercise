// src/routes/project.routes.ts
import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import socketService from '../services/socket.service';

const router = Router();

// Get all projects
router.get('/', (req, res) => {
  res.json([{ id: 101, name: 'Example Project' }]);
});

// Create new project with real-time notification
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('admin', 'client'),
  (req: AuthRequest, res) => {
    const { name, description, requiredSkills, budget } = req.body;

    // Validate input
    if (!name || !requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ 
        error: 'Invalid project data. Name and requiredSkills array are required.' 
      });
    }

    if (requiredSkills.length === 0) {
      return res.status(400).json({ 
        error: 'At least one required skill must be specified.' 
      });
    }

    // Create project (in real app, save to MongoDB)
    const newProject = {
      id: Date.now(),
      name,
      description: description || '',
      requiredSkills,
      budget: budget || 0,
      createdBy: req.user?.id,
      createdAt: new Date().toISOString()
    };

    console.log('📝 New project created:', newProject.name);
    console.log('   Required skills:', requiredSkills.join(', '));

    // Emit real-time notification to users with matching skills
    socketService.notifyMatchingUsers(newProject);

    res.status(201).json({
      message: 'Project created and notifications sent',
      project: newProject
    });
  }
);

// Get admin dashboard with connection stats
router.get(
  '/admin-dashboard',
  authenticateJWT,
  authorizeRoles('admin'),
  (req, res) => {
    const connectedUsers = socketService.getConnectedUsersCount();
    
    res.json({ 
      message: 'Welcome admin!',
      stats: {
        connectedUsers,
        timestamp: new Date().toISOString()
      }
    });
  }
);

export default router;