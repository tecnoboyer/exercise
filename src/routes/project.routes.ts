import { Router } from 'express';

const router = Router();

// Temporary placeholder route
router.get('/', (req, res) => {
  res.json([{ id: 101, name: 'Example Project' }]);
});

export default router;
