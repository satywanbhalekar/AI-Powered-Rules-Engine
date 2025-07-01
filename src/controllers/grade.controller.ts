import { Request, Response } from 'express';
import { GradeService } from '../services/grade.service';

export const getAllGrades = async (req: Request, res: Response) => {
  try {
    const grades = await GradeService.getAllGrades();
    res.status(200).json(grades);
  } catch (err: any) {
    console.error('[Controller:getAllGrades] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
