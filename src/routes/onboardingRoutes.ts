// src/routes/onboardingRoutes.ts
import { Router } from 'express';
import { OnboardingController } from '../controllers/OnboardingController';
import { authenticateToken } from '../middlewares/authenticateToken';

const router = Router();

router.post('/login', OnboardingController.login); // login or signup
router.post('/signup', OnboardingController.signup); 
router.post('/',authenticateToken, OnboardingController.handleMessage); // conversational steps

export default router;
