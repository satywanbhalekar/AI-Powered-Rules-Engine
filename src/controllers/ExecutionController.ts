
import { Request, Response } from 'express';
import ExecutionService from '../services/ExecutionService';

export default {
async apply(req: Request, res: Response) {
const { input } = req.body;
const tenantId = req.headers['x-tenant-id'] as string;


if (!input || !tenantId) {
   res.status(400).json({ error: 'Missing input or tenant ID' });
}

try {
  const result = await ExecutionService.applyRulesFromNL(input, tenantId);
  console.log('result', result);

  

   res.json({
    success: true,
    result
  });
} catch (err: any) {
  console.error('❌ Apply failed:', err.message);
   res.status(500).json({ error: err.message });
}
}
};



