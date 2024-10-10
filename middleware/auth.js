const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.headers['x-auth-token'] || req.headers['authorization'];

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded.user;
    if (next) {
      next();
    }
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
