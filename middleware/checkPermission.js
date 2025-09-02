// const permissions = require('../config/permissions');


// function checkPermission(action) {
//   return (req, res, next) => {
//     const role = req.user.role; // authMiddleware me set hota hai
//     req.permissions = permissions[role] || {}; // extra: so controllers can access
//     if (permissions[role]?.[action]) {
//       return next();
//     }
//     return res.status(403).json({ message: 'Access Denied' });
//   };
// }

// module.exports = checkPermission;


const permissions = require('../config/permissions');

function checkPermission(module, action) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    const role = req.user.role.toLowerCase().replace(/\s+/g, '_');
    const rolePermissions = permissions[module]?.[role] || {};

    if (!rolePermissions[action]) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    req.permissions = rolePermissions; // optional for controller
    next();
  };
}

module.exports = checkPermission;
