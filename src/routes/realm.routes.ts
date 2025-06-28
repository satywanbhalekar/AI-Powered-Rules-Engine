import { Router } from 'express';
import { createRealm, deleteRealm, getAllRealms } from '../controllers/realm.controller';

const router = Router();

router.post('/', createRealm);
router.get('/realms', getAllRealms);
router.delete('/:realmName', deleteRealm); 
export default router;
