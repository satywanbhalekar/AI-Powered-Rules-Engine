import { Request, Response } from 'express';
import { RuleService } from '../services/RuleService';
import NLPService from '../services/NLPService';

export class RuleController {
  static  async parseAndSave(req: Request, res: Response) {
        const { input } = req.body;
        const tenantId = req.headers['x-tenant-id'] as string;
    
        if (!input || !tenantId) {
           res.status(400).json({ error: 'Missing input or tenant ID' });
        }
    console.log("parse and save ");
    
        try {
          const result = await RuleService.parseAndSave(input, tenantId);
          res.json(result);
        } catch (err) {
          res.status(500).json({ error: (err as Error).message });
        }
      }

    //   static async parseAndUpdateByName(req: Request, res: Response) {
    //     const { input } = req.body;
    //     const tenantId = req.headers['x-tenant-id'] as string;
      
    //     if (!input || !tenantId) {
    //        res.status(400).json({ error: 'Missing input or tenant ID' });
    //     }
      
    //     try {
    //       // Parse updated rule using Gemini
    //       const parsedRule = await NLPService.parseToRule(input);
    //       const ruleName = parsedRule.name;
      
    //       // Update the rule by name
    //       const updated = await RuleService.updateRuleByName(ruleName, tenantId, parsedRule);
      
    //       res.json({
    //         message: `✅ Rule "${ruleName}" updated successfully`,
    //         rule: updated
    //       });
    //     } catch (err) {
    //       res.status(500).json({ error: (err as Error).message });
    //     }
    //   }
      
    static async parseAndUpdateByName(req: Request, res: Response) {
        const { input } = req.body;
        const tenantId = req.headers['x-tenant-id'] as string;
      
        if (!input || !tenantId) {
           res.status(400).json({ error: 'Missing input or tenant ID' });
        }
      
        try {
          // ✅ Extract rule name from input
          const matches = input.match(/update a rule (\w+)/i);
          if (!matches || matches.length < 2) {
             res.status(400).json({
              error: '❌ Could not extract rule name. Use: "update a rule <ruleName> ..."'
            });
          }
          const ruleName = matches[1]; // e.g., "assignGradeC"
      
          // ✅ Remove rule name from input before sending to Gemini
          const cleanedInput = input.replace(/update a rule \w+/i, 'update a rule');
      
          // ✅ Parse the rule using Gemini
          const parsedRule = await NLPService.parseToRule(cleanedInput);
      
          // ✅ Force the correct rule name from user input
          parsedRule.name = ruleName;
      
          // ✅ Update rule in DB
          const updated = await RuleService.updateRuleByName(ruleName, tenantId, parsedRule);
      
          res.json({
            message: `✅ Rule "${ruleName}" updated successfully`,
            rule: updated
          });
        } catch (err) {
          res.status(500).json({ error: (err as Error).message });
        }
      }
      

  static async create(req: Request, res: Response) {
    try {
      const rule = await RuleService.createRule(req.body);
      res.status(201).json(rule);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const rules = await RuleService.listRules(req.params.tenantId);
      res.json(rules);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const rule = await RuleService.updateRule(req.params.id, req.body);
      res.json(rule);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await RuleService.deleteRule(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}