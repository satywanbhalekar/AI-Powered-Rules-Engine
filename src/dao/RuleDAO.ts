import { supabase } from '../config/db';
import { Rule } from '../interface/Rule.interface';
export class RuleDAO {
 
   
    static async saveRule(rule: any, tenant_Id: string) {
        const { data, error } = await supabase
          .from('rules')
          .insert([
            {
              tenant_id: tenant_Id,
              name: rule.name,
              description: rule.description || '',
              conditions: rule.conditions,
              event: rule.event,
              is_active: true

            }
          ])
          .select()
          .single();
    
        if (error) throw new Error(`Supabase insert error: ${error.message}`);
        return data;
      }

      static async updateRuleByName(ruleName: string, tenant_Id: string, updates: any) {
        const { data, error } = await supabase
          .from('rules')
          .update({
            description: updates.description,
            conditions: updates.conditions,
            event: updates.event,
            updated_at: new Date().toISOString()
          })
          .eq('name', ruleName)
          .eq('tenant_id', tenant_Id)
          .select()
          .single();
      
        if (error) throw new Error(`Supabase update error: ${error.message}`);
        return data;
      }
      
    
      static async getActiveRulesByTenant(tenantId: string) {
        const { data, error } = await supabase
          .from('rules')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('is_active', true);
      
        if (error) throw new Error(`Supabase fetch error: ${error.message}`);
        return data || [];
      }


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
  static async insertRule(rule: {
    tenant_id: string;
    name: string;
    description?: string;
    conditions: any;
    event: any;
    is_active?: boolean;
  }): Promise<Rule> {
    const { data, error } = await supabase
      .from('rules')
      .insert([
        {
          tenant_id: rule.tenant_id,
          name: rule.name,
          description: rule.description || '',
          conditions: rule.conditions,
          event: rule.event,
          is_active: rule.is_active ?? true
        }
      ])
      .select()
      .single();
  
    if (error) throw new Error(`Supabase insert error: ${error.message}`);
    return data as Rule;
  }
  
}