import { supabase } from '../config/db';

export class GradeDAO {
  static async getGradesByTenant(tenantId: string) {
    const { data, error } = await supabase
      .from('grade')
      .select('*')
      .eq('tenant_id', tenantId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    return data;
  }

  static async updateGradeForStudent(studentId: string, grade: string, mark: number) {
    const { error } = await supabase
      .from('grade')
      .update({ grade, marks: mark })  // ✅ include marks here
      .eq('id', studentId);
  
    if (error) throw new Error(`Update failed: ${error.message}`);
  }
  
}
