import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  platform: z.string().min(1),
});

export const updateUserSchema = z.object({
  username: z.string().email().optional(),
  password: z.string().min(6).optional(),
  platform: z.string().optional(),
});
