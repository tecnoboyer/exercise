import { Request, Response } from 'express';
import { createUserSchema, updateUserSchema } from '../validation/user.schema';
import * as userService from '../services/user.service';

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = createUserSchema.parse(req.body);
    const user = await userService.createUser(parsed);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const parsed = updateUserSchema.parse(req.body);
    const user = await userService.updateUser(req.params.id, parsed);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
