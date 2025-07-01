import { GradeDAO } from '../dao/GradeDAO';

export class GradeService {
  static async getAllGrades() {
    return await GradeDAO.getAllGrades();
  }
}
