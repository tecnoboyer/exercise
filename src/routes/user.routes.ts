import { Router } from 'express';
import {
  createUser,
  getUserByUsername,
//   getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

router.post('/', createUser);     // POST /api/users
router.get('/', getAllUsers);     // GET /api/users
// router.get('/:id', getUser);      // GET /api/users/:id
router.get('/username/:username', getUserByUsername);     // GET /api/users


router.put('/:id', updateUser);   // PUT /api/users/:id
router.delete('/:id', deleteUser);// DELETE /api/users/:id

export default router;
