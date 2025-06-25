import { supabase } from '../config/db';
import { Rule } from '../interface/Rule.interface';

export class RuleDAO {
  static async create(rule: Rule): Promise<Rule> {
    const { data, error } = await supabase.from('rules').insert(rule).select().single();
    if (error) throw new Error(error.message);
    return data as Rule;
  }

  static async findAllByTenant(tenantId: string): Promise<Rule[]> {
    const { data, error } = await supabase.from('rules').select('*').eq('tenant_id', tenantId);
    if (error) throw new Error(error.message);
    return data as Rule[];
  }

  static async update(id: string, updates: Partial<Rule>): Promise<Rule> {
    const { data, error } = await supabase.from('rules').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data as Rule;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('rules').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}