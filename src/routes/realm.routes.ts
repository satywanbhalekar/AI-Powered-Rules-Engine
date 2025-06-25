import { Router } from 'express';
import { createRealm, deleteRealm } from '../controllers/realm.controller';

const router = Router();

router.post('/', createRealm);
router.delete('/:realmName', deleteRealm); 
export default router;
