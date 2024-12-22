import jwt from 'jsonwebtoken';
import { Users } from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization; 
    if (!token) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.jwt);
      const user = await Users.findByPk(decoded.UserId); 
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      req.user = user; 
      next(); 
    } catch (err) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };