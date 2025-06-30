

import { Engine } from 'json-rules-engine';
import { RuleDAO } from '../dao/RuleDAO';
import { supabase } from '../config/db';
import axios from 'axios';
import { GradeDAO } from '../dao/GradeDAO';
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
  
  static async applyGradingRulesFromNL(input: string, tenantId: string) {
    console.log('📊 Applying grading rules via NLP');
    console.log('📝 Raw input:', input);
  
    const rules = await RuleDAO.getActiveRulesByTenant(tenantId);
    console.log('📜 Active rules fetched:', rules.map(r => r.name));
  
    if (!rules.length) {
      return { message: '❌ No active rules found', result: [], success: false };
    }
  
    const sanitizeOperator = (op: string): string => {
      switch (op) {
        case '>': return 'greaterThan';
        case '>=': return 'greaterThanInclusive';
        case '<': return 'lessThan';
        case '<=': return 'lessThanInclusive';
        default: return op;
      }
    };
  
    const sanitizeConditions = (conditions: any): any => {
      if (conditions.all) {
        conditions.all = conditions.all.map((cond: any) => ({
          ...cond,
          operator: sanitizeOperator(cond.operator)
        }));
      }
      if (conditions.any) {
        conditions.any = conditions.any.map((cond: any) => ({
          ...cond,
          operator: sanitizeOperator(cond.operator)
        }));
      }
      return conditions;
    };
  
    // 🧠 Extract students (e.g., "Anu 85", or "Anu scored 85 marks")
    const nameMarksPairs = [...input.matchAll(/\b([A-Z][a-z]+)\s+(\d{1,3})\b/g)];
    const scoredFormat = [...input.matchAll(/\b([A-Z][a-z]+)\s+scored\s+(\d{1,3})\s+marks\b/gi)];
  
    const extractedStudents = [...nameMarksPairs, ...scoredFormat].map(match => ({
      name: match[1],
      marks: parseInt(match[2], 10)
    }));
  
    console.log('🧾 Extracted students from input:', extractedStudents);
  
    if (!extractedStudents.length) {
      return {
        message: '⚠️ No student name and mark pairs found in input',
        result: [],
        success: false
      };
    }
  
    const allStudents = await GradeDAO.getGradesByTenant(tenantId);
    console.log('📚 All student records from DB:', allStudents.map(s => ({ name: s.name, marks: s.marks })));
  
    const engine = new Engine();
    rules.forEach((r) => {
      const safeConditions = sanitizeConditions(r.conditions);
      console.log(`⚙️ Adding rule to engine: ${r.name}`, safeConditions);
      engine.addRule({
        name: r.name,
        conditions: safeConditions,
        event: r.event
      });
    });
  
    const results: any[] = [];
  
    for (const extracted of extractedStudents) {
      const dbStudent = allStudents.find(s => s.name === extracted.name);
  
      if (!dbStudent) {
        console.log(`❌ Student "${extracted.name}" not found in DB`);
        results.push({
          name: extracted.name,
          inputMarks: extracted.marks,
          message: 'Student not found in database'
        });
        continue;
      }
  
      if (dbStudent.marks !== extracted.marks) {
        console.log(`⚠️ Marks mismatch for ${extracted.name}: input=${extracted.marks}, DB=${dbStudent.marks}`);
        results.push({
          name: dbStudent.name,
          inputMarks: extracted.marks,
          actualMarks: dbStudent.marks,
          message: `Student exists but marks mismatch (expected ${extracted.marks}, found ${dbStudent.marks} No rule matched)`
        });
        continue;
      }
  
      const facts = {
        name: dbStudent.name,
        marks: dbStudent.marks
      };
  
      console.log(`🔍 Evaluating: ${facts.name} with marks: ${facts.marks}`);
      const { events } = await engine.run(facts);
      console.log('📌 Events matched:', events);
  
      if (events.length) {
        const gradeAssigned = events[0].params?.grade || null;
        results.push({
          name: dbStudent.name,
          marks: dbStudent.marks,
          grade: gradeAssigned
        });
      } else {
        results.push({
          name: dbStudent.name,
          marks: dbStudent.marks,
          grade: null,
          message: 'No rule matched'
        });
      }
    }
    
  
    // return {
    //   message: results.length
    //     ? `📋 Evaluated ${results.length} students`
    //     : '⚠️ No matches evaluated',
    //   result: results,
    //   success: true
    // };


    const summary = results.map(r => {
      if ('marks' in r && 'grade' in r) {
        return `name: ${r.name}, marks: ${r.marks}, grade: ${r.grade}`;
      } else if ('message' in r) {
        return `name: ${r.name}, message: ${r.message}`;
      } else {
        return `name: ${r.name}, info: incomplete`;
      }
    }).join(', ');
    
    return {
      message: results.length
        ? `📋 Evaluated ${results.length} students — ${summary}`
        : '⚠️ No matches evaluated',
      result: results,
      success: true
    };
    

  }
  
  
}


