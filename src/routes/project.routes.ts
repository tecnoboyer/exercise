import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// Temporary placeholder route
router.get('/', (req, res) => {
  res.json([{ id: 101, name: 'Example Project' }]);
});
router.get(
  '/admin-dashboard',
  authenticateJWT,
  authorizeRoles('admin'),
  (req, res) => {
    res.json({ message: 'Welcome admin!' });
  }
);

export default router;
