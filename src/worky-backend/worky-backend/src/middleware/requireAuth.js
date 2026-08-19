const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization; // formato esperado: "Bearer <token>"

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No hay token de sesión. Iniciá sesión primero.' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = payload.usuarioId;
    req.usuarioRol = payload.rol;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o vencido. Iniciá sesión de nuevo.' });
  }
}

module.exports = requireAuth;
