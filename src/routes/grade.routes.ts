import express from 'express';
import { getAllGrades } from '../controllers/grade.controller';

const router = express.Router();

router.get('/', getAllGrades);

export default router;
