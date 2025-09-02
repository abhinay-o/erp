const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role.toLowerCase().replace(/\s+/g, '_'))) {
      return res.status(403).json({ message: 'Access denied. Insufficient role' });
    }
    next();
  };
};


module.exports = authorize;
