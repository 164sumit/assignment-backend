import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Change this to your JWT secret key

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Extract token from request headers or cookies
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Token not found' });
    return;
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Attach userId to req object
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
