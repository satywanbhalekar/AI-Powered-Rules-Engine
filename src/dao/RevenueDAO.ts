// revenue.dao.ts
import { supabase } from '../config/db';
import { camelCase } from 'lodash';
export class RevenueDAO {
  static async getRevenueDataByTenant(tenantId: string) {
    const { data, error } = await supabase
      .from('revenue')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'Active');

    if (error) throw new Error(error.message);
   
// 🔁 Convert all rows' keys to camelCase
console.log("data.map(keysToCamelCase)data.map(keysToCamelCase)",data.map(keysToCamelCase));
return data.map(keysToCamelCase);


  }
}


function keysToCamelCase(obj: any) {
  return Object.fromEntries(Object.entries(obj).map(
    ([key, value]) => [camelCase(key), value]
  ));
}