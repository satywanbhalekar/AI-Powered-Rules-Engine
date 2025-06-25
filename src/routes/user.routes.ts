import { Router } from 'express';
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

router.post('/:realm', createUser);
router.get('/:realm', getUsers);
router.put('/:realm/:userId', updateUser);
router.delete('/:realm/:userId', deleteUser);

export default router;
