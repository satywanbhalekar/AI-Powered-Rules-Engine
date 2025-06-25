// import { RuleDAO } from '../dao/RuleDAO';
// import { Rule } from '../interface/Rule.interface';

// export class RuleService {
//   static async createRule(rule: Rule): Promise<Rule> {
//     return await RuleDAO.create(rule);
//   }

//   static async listRules(tenantId: string): Promise<Rule[]> {
//     return await RuleDAO.findAllByTenant(tenantId);
//   }

//   static async updateRule(id: string, updates: Partial<Rule>): Promise<Rule> {
//     return await RuleDAO.update(id, updates);
//   }

//   static async deleteRule(id: string): Promise<void> {
//     await RuleDAO.delete(id);
//   }
// }


import { RuleDAO } from '../dao/RuleDAO';
import { Rule } from '../interface/Rule.interface';
import { Engine } from 'json-rules-engine';

export class RuleService {
  static async createRule(rule: Rule): Promise<Rule> {
    return await RuleDAO.create(rule);
  }

  static async listRules(tenantId: string): Promise<Rule[]> {
    return await RuleDAO.findAllByTenant(tenantId);
  }

  static async updateRule(id: string, updates: Partial<Rule>): Promise<Rule> {
    return await RuleDAO.update(id, updates);
  }

  static async deleteRule(id: string): Promise<void> {
    await RuleDAO.delete(id);
  }

  static async applyRules(rules: Rule[], inputData: Record<string, any>): Promise<any[]> {
    const engine = new Engine();

    rules.filter(r => r.is_Active).forEach(rule => {
      const jsonRule = {
        conditions: { all: rule.conditions.map(c => ({ fact: c.field, operator: c.operator, value: c.value })) },
        event: { type: rule.name, params: rule.actions.map(a => ({ type: a.type, params: a.params })) }
      };
      engine.addRule(jsonRule);
    });

    const results: any[] = [];

    await engine.run(inputData).then(events => {
      events.events.forEach(event => {
        results.push({ rule: event.type, actions: event.params });
      });
    }).catch(err => {
      console.error('Rule engine error:', err);
    });

    return results;
  }
}
