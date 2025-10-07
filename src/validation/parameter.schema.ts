import z from 'zod';

export const usernameparameterSchema = z.object({
  username: z.string().min(3).max(30),
});