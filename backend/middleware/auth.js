const jwt = require('jsonwebtoken');
const SECRET = '1234'; // Usa el mismo que en index.js

exports.verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = { id: decoded.id, rol: decoded.rol };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};