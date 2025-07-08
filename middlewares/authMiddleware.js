const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET; // à mettre dans .env plus tard

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format : "Bearer TOKEN"

  if (!token) return res.status(401).json({ error: 'Token manquant' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user; // on attache l'utilisateur à la requête
    next();
  });
}

module.exports = authenticateToken;
