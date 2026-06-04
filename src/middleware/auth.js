/**
 * =====================================================
 * Middleware d'Authentification JWT
 * =====================================================
 * 
 * Gère :
 * - Vérification des tokens JWT
 * - Extraction de l'utilisateur
 * - Contrôle d'accès basé sur les rôles (RBAC)
 * 
 * Utilisation dans les routes :
 * router.get('/contracts', authenticate, getAllContracts);
 * router.delete('/contracts/:id', authenticate, authorize('admin'), deleteContract);
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');

// =====================================================
// Middleware : Vérifier le token JWT
// =====================================================

/**
 * Middleware d'authentification
 * Vérifie la présence et la validité du token JWT
 */
const authenticate = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token manquant ou format invalide',
        code: 'NO_TOKEN',
      });
    }
    
    // Extraire le token (sans "Bearer ")
    const token = authHeader.substring(7);
    
    // Vérifier le token
    const decoded = jwt.verify(token, config.JWT.SECRET);
    
    // Ajouter les infos utilisateur à la requête
    req.user = {
      id: decoded.id,
      email: decoded.email,
      nom_prenom: decoded.nom_prenom,
      role: decoded.role,
      departement: decoded.departement,
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expiré',
        code: 'TOKEN_EXPIRED',
        expiredAt: error.expiredAt,
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token invalide',
        code: 'INVALID_TOKEN',
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la vérification du token',
      code: 'AUTH_ERROR',
    });
  }
};

// =====================================================
// Middleware : Contrôle d'Accès Basé sur les Rôles
// =====================================================

/**
 * Middleware d'autorisation basée sur les rôles
 * @param {...string} allowedRoles - Rôles autorisés
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Non authentifié',
        code: 'NOT_AUTHENTICATED',
      });
    }
    
    // Vérifier le rôle
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Accès refusé - permissions insuffisantes',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles,
        userRole: req.user.role,
      });
    }
    
    next();
  };
};

// =====================================================
// Middleware : Vérifier les permissions spécifiques
// =====================================================

/**
 * Permissions par rôle
 */
const permissions = {
  admin: [
    'read_contracts',
    'create_contracts',
    'update_contracts',
    'delete_contracts',
    'manage_users',
    'view_audit_logs',
    'configure_alerts',
  ],
  juriste: [
    'read_contracts',
    'create_contracts',
    'update_contracts',
    'view_audit_logs',
    'manage_clauses',
  ],
  consultant: [
    'read_contracts',
    'create_contracts',
    'update_contracts',
    'manage_documents',
    'update_deadlines',
  ],
  viewer: [
    'read_contracts',
  ],
};

/**
 * Middleware pour vérifier une permission spécifique
 * @param {string} permission - Permission requise
 */
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Non authentifié',
        code: 'NOT_AUTHENTICATED',
      });
    }
    
    const userPermissions = permissions[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: 'Permission refusée',
        code: 'PERMISSION_DENIED',
        requiredPermission: permission,
        userRole: req.user.role,
      });
    }
    
    next();
  };
};

// =====================================================
// Middleware : Token de Rafraîchissement
// =====================================================

/**
 * Vérifier le token de rafraîchissement (refresh token)
 */
const authenticateRefresh = (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token manquant',
        code: 'NO_REFRESH_TOKEN',
      });
    }
    
    const decoded = jwt.verify(refreshToken, config.JWT.REFRESH_SECRET);
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Refresh token invalide ou expiré',
      code: 'INVALID_REFRESH_TOKEN',
    });
  }
};

// =====================================================
// Fonctions utilitaires pour générer les tokens
// =====================================================

/**
 * Générer un JWT token
 * @param {object} payload - Données à inclure dans le token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXPIRY,
  });
};

/**
 * Générer un refresh token
 * @param {object} payload - Données à inclure dans le token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.JWT.REFRESH_SECRET, {
    expiresIn: config.JWT.REFRESH_EXPIRY,
  });
};

/**
 * Vérifier et décoder un token (sans l'exigence d'expiration)
 * @param {string} token - Token à vérifier
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT.SECRET);
  } catch (error) {
    return null;
  }
};

// =====================================================
// Export
// =====================================================

module.exports = {
  authenticate,
  authorize,
  checkPermission,
  authenticateRefresh,
  generateToken,
  generateRefreshToken,
  verifyToken,
  permissions,
};
