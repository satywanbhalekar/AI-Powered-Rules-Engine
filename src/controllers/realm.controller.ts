import { Request, Response } from 'express';
import { RealmService } from '../services/realm.service';

export const createRealm = async (req: Request, res: Response) => {
  try {
    await RealmService.createRealm(req.body);
    res.status(201).json({ message: 'Realm created successfully' });
  } catch (err: any) {
    res.status(err?.response?.status || 500).json({
      error: err?.response?.data?.error || err.message,
    });
  }
  
};
export const deleteRealm = async (req: Request, res: Response) => {
    try {
      const { realmName } = req.params;
      await RealmService.deleteRealm(realmName);
      res.status(200).json({ message: `Realm '${realmName}' deleted successfully` });
    } catch (err: any) {
      res.status(err?.response?.status || 500).json({
        error: err?.response?.data?.error || err.message,
      });
    }
  };
  
