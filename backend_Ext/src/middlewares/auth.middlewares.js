import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
        
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
      req.user = await User.findById(decoded.userId).select('-password');
        console.log(req.user)
      return next(); // ✅ Return early to prevent further execution
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
