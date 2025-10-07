import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
  // Temporary placeholder
  res.json([{ id: 1, name: 'John Doe' }]);
};