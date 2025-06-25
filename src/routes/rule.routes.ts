import { Router } from 'express';
import { RuleController } from '../controllers/RuleController';
import { verifyTokenLocal } from '../middlewares/keycloak-verifyToken';
import { protectKeycloak } from '../middlewares/keycloak-protect';
import { keycloakEnforcer } from '../middlewares/keycloak-enforcer';

const router = Router();

router.post('/',verifyTokenLocal(),protectKeycloak(`resource-permission`),keycloakEnforcer(`resource-permission`), RuleController.create);
router.get('/:tenantId', RuleController.list);
router.put('/:id', RuleController.update);
router.delete('/:id', RuleController.delete);

export default router;


