const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_example';

function verifyToken(req, res, next) {
  let authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token proporcionado' });

  let token = null;

  // Caso 1: viene con prefijo "Bearer <token>" o "JWT <token>"
  const parts = authHeader.split(' ');
  if (parts.length === 2 && (parts[0] === 'Bearer' || parts[0] === 'JWT')) {
    token = parts[1];
  }
  // Caso 2: viene solo el token sin prefijo
  else if (parts.length === 1) {
    token = parts[0];
  } else {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, correo, rol }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

function permitRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (!allowedRoles.includes(req.user.rol)) return res.status(403).json({ message: 'Acceso restringido por rol' });
    next();
  };
}

module.exports = { verifyToken, permitRoles };
