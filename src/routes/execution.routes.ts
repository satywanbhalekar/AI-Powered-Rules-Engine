import express from 'express';
import ExecutionController from '../controllers/ExecutionController';

const router = express.Router();

//router.post('/apply', ExecutionController.apply);
router.post('/apply', ExecutionController.applyGrading);

export default router;
