

import { Engine } from 'json-rules-engine';
import { RuleDAO } from '../dao/RuleDAO';
import { supabase } from '../config/db';
import axios from 'axios';
export default class ExecutionService {
  // 1️⃣ Already working — keep as-is
  
  static async applyRulesFromNL(nlInput: string, tenantId: string) {
    console.log('🤖 AIExecutionService.aiApplyRules: input =', nlInput);

    // 1️⃣ Load all active rules for this tenant
    const rules = await RuleDAO.getActiveRulesByTenant(tenantId);
    console.log('📦 Active rules:', rules);

    if (!rules.length) {
      return {
        message: '❌ No active rules found for tenant',
        result: [],
        success: false
      };
    }

    const rulesJson = rules.map((r) => ({
      name: r.name,
      description: r.description,
      conditions: r.conditions,
      event: r.event
    }));
const prompt = `
Given this natural language input:

"${nlInput}"

And the following rules (in JSON format):

${JSON.stringify(rulesJson, null, 2)}

1. Decide which rules (if any) match the input based on their conditions.

2. Return a JSON object with:
- "message": a dynamic user-friendly summary message (e.g., "✅ John gets 5% bonus 🎉")
- "result": a JSON array of matching events (same as before)

If no rules match, return:
{
  "message": "ℹ️ No rules matched using AI",
  "result": []
}

Only return a pure JSON object. No markdown, no explanation.
`;

    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          params: { key: process.env.GEMINI_API_KEY },
          headers: { 'Content-Type': 'application/json' }
        }
      );
    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!raw) throw new Error('Gemini returned empty output');
    
    // Try to extract a JSON array from raw Gemini output
    const match = raw.match(/\{[\s\S]*\}/); // Match the entire JSON object
if (!match) throw new Error('Gemini output did not contain a valid JSON object');

const parsed = JSON.parse(match[0]);

return {
  message: parsed.message,
  result: parsed.result,
  success: true
};

    } catch (err: any) {
      console.error('❌ AI rule matching failed:', err.message);
      return {
        message: '❌ Failed to apply rules using AI',
        result: [],
        success: false
      };
    }
  }

  // 2️⃣ 🆕 Add this method to apply rules to revenue table
// static async applyRulesToRevenue(tenantId: string) {
//     console.log('📊 ExecutionService.applyRulesToRevenue');
  
//     const rules = await RuleDAO.getActiveRulesByTenant(tenantId);
//     if (!rules.length) {
//       return {
//         message: '❌ No active rules found for tenant',
//         result: [],
//         success: false
//       };
//     }
  
//     const { data: revenues, error } = await supabase.from('revenue').select('*');
//     if (error) throw new Error(`Failed to fetch revenue data: ${error.message}`);
  
//     const engine = new Engine();
//     rules.forEach((r) =>
//       engine.addRule({
//         name: r.name,
//         conditions: r.conditions,
//         event: r.event
//       })
//     );
  
//     const matches = [];
  
//     for (const row of revenues) {
//       const facts = {
//         department: row.department,
//         region: row.region,
//         revenueGrowth: parseFloat(row.growth_percent),
//         teamSize: row.team_size
//       };
  
//       const { events } = await engine.run(facts);
  
//       for (const event of events) {
//         matches.push({
//           region: row.region,
//           message: `✅ ${row.department} team in ${row.region} gets ${event.params?.reward || 'a reward'} 🎉`,
//           event: {
//             type: event.type,
//             params: event.params
//           }
//         });
//       }
//     }
  
//     return {
//       message: matches.length
//         ? `✅ ${matches.length} regions matched rules 🎯`
//         : 'ℹ️ No rules matched on revenue data',
//       result: matches,
//       success: true
//     };
//   }

static async applyRulesToRevenue(tenantId: string) {
    console.log('📊 ExecutionService.applyRulesToRevenue');
  
    const rules = await RuleDAO.getActiveRulesByTenant(tenantId);
    if (!rules.length) {
      return {
        message: '❌ No active rules found for tenant',
        result: [],
        success: false
      };
    }
  
    const { data: revenues, error } = await supabase.from('revenue').select('*');
    if (error) throw new Error(`Failed to fetch revenue data: ${error.message}`);
  
    const engine = new Engine();
    rules.forEach((r) =>
      engine.addRule({
        name: r.name,
        conditions: r.conditions,
        event: r.event
      })
    );
  
    const matches: any[] = [];
  
    for (const row of revenues) {
      const facts = {
        department: row.department,
        region: row.region,
        revenueGrowth: parseFloat(row.growth_percent),
        teamSize: row.team_size
      };
  
      const { events } = await engine.run(facts);
  
      for (const event of events) {
        matches.push({
          region: row.region,
          message: `✅ ${row.department} team in ${row.region} gets ${event.params?.reward || 'a reward'} 🎉`,
          event: {
            type: event.type,
            params: {
              ...event.params,
              bonusType: event.params?.bonusType || 'growth-based' // fallback if not present
            }
          }
        });
      }
    }
  
    return {
      message: matches.length
        ? `✅ ${matches.length} regions matched rules 🎯`
        : 'ℹ️ No rules matched on revenue data',
      result: matches,
      success: true
    };
  }
  
}


