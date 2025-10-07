// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log('authHeader: ' + authHeader);
  
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  console.log('Extracted token:', token);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = { id: decoded.id, role: decoded.role };
    console.log('Decoded successfully - role:', decoded.role);
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}