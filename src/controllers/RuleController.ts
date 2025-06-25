import { Request, Response } from 'express';
import { RuleService } from '../services/RuleService';

export class RuleController {
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