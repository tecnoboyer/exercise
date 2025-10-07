// src/routes/index.ts
import { Router } from 'express';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import authRoutes from './auth.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes);

export default router;
