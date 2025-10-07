import { Request, Response } from 'express';
import { ZodError } from 'zod'; // 👈 import ZodError
import { createUserSchema } from '../validation/user.schema';
import { usernameparameterSchema} from '../validation/parameter.schema';
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

/**
 * GET /users/username/:username
 * Fetch a user by their username
 */
export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    // ✅ Validate and extract username from route params
    const  {username}  = usernameparameterSchema.parse(req.params);
    console.log('suername: '+username);

    // ✅ Fetch user (service should exclude sensitive fields like password)
    const user = await userService.getUserByUsername(username);
    // const resul1=user.delete(password);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    // 🔒 Handle Zod validation errors (e.g., username too short/long, invalid chars)
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Invalid username format',
        details: error.errors,
      });
    }

    // 🛑 Handle unexpected errors (log internally, don't expose details)
    console.error('Error fetching user by username:', error);
    return res.status(500).json({ error: 'Failed to retrieve user' });
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
    const parsed = parameter.parse(req.body);
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
