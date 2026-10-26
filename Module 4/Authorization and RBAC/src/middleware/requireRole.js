module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // 1. Responds 401 if req.user is missing
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication required'
        }
      });
    }

    // 2. Responds 403 if req.user.role is NOT in allowedRoles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    // 3. Otherwise call next()
    next();
  };
};
