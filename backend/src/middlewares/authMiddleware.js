const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware Express pour proteger 
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // prend le token: Bearer <token>
      token = req.headers.authorization.split(' ')[1];

      //  décoder le token avec la clé secrète du .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attacher l'utilisateur à la requête (sans le mot de passe)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }
};

module.exports = { protect };