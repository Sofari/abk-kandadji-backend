/**
 * =====================================================
 * Middleware de Gestion d'Erreurs Global
 * =====================================================
 * 
 * Centralise le traitement de toutes les erreurs
 * Formats cohérents des réponses d'erreur
 * 
 * Utilisation :
 * app.use(errorHandler); // À la fin de app.js
 */

const logger = require('../utils/logger');

// =====================================================
// Classe d'erreur personnalisée
// =====================================================

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// =====================================================
// Erreurs courantes
// =====================================================

const ErrorTypes = {
  // 400 - Bad Request
  VALIDATION_ERROR: {
    statusCode: 400,
    code: 'VALIDATION_ERROR',
    message: 'Données invalides',
  },
  MISSING_FIELD: {
    statusCode: 400,
    code: 'MISSING_FIELD',
    message: 'Champ requis manquant',
  },
  INVALID_FORMAT: {
    statusCode: 400,
    code: 'INVALID_FORMAT',
    message: 'Format invalide',
  },
  
  // 401 - Unauthorized
  UNAUTHORIZED: {
    statusCode: 401,
    code: 'UNAUTHORIZED',
    message: 'Non authentifié',
  },
  INVALID_CREDENTIALS: {
    statusCode: 401,
    code: 'INVALID_CREDENTIALS',
    message: 'Email ou mot de passe incorrect',
  },
  
  // 403 - Forbidden
  FORBIDDEN: {
    statusCode: 403,
    code: 'FORBIDDEN',
    message: 'Accès refusé',
  },
  INSUFFICIENT_PERMISSIONS: {
    statusCode: 403,
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'Permissions insuffisantes',
  },
  
  // 404 - Not Found
  NOT_FOUND: {
    statusCode: 404,
    code: 'NOT_FOUND',
    message: 'Ressource non trouvée',
  },
  CONTRACT_NOT_FOUND: {
    statusCode: 404,
    code: 'CONTRACT_NOT_FOUND',
    message: 'Contrat non trouvé',
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    code: 'USER_NOT_FOUND',
    message: 'Utilisateur non trouvé',
  },
  DEADLINE_NOT_FOUND: {
    statusCode: 404,
    code: 'DEADLINE_NOT_FOUND',
    message: 'Échéance non trouvée',
  },
  ALERT_NOT_FOUND: {
    statusCode: 404,
    code: 'ALERT_NOT_FOUND',
    message: 'Alerte non trouvée',
  },
  
  // 409 - Conflict
  CONFLICT: {
    statusCode: 409,
    code: 'CONFLICT',
    message: 'Conflit avec les données existantes',
  },
  DUPLICATE_ENTRY: {
    statusCode: 409,
    code: 'DUPLICATE_ENTRY',
    message: 'Cet enregistrement existe déjà',
  },
  EMAIL_ALREADY_EXISTS: {
    statusCode: 409,
    code: 'EMAIL_ALREADY_EXISTS',
    message: 'Cet email est déjà utilisé',
  },
  CONTRACT_NUMBER_EXISTS: {
    statusCode: 409,
    code: 'CONTRACT_NUMBER_EXISTS',
    message: 'Ce numéro de contrat existe déjà',
  },
  
  // 422 - Unprocessable Entity
  UNPROCESSABLE_ENTITY: {
    statusCode: 422,
    code: 'UNPROCESSABLE_ENTITY',
    message: 'Impossible de traiter la requête',
  },
  
  // 429 - Too Many Requests
  RATE_LIMIT_EXCEEDED: {
    statusCode: 429,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Trop de requêtes. Veuillez réessayer plus tard.',
  },
  
  // 500 - Internal Server Error
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Erreur serveur interne',
  },
  DATABASE_ERROR: {
    statusCode: 500,
    code: 'DATABASE_ERROR',
    message: 'Erreur de base de données',
  },
};

// =====================================================
// Middleware : Gestionnaire d'erreurs
// =====================================================

/**
 * Middleware global de gestion d'erreurs
 * IMPORTANT : Doit être APRÈS tous les autres middlewares
 * et routes dans app.js
 */
const errorHandler = (err, req, res, next) => {
  // ===== Extraire les infos d'erreur =====
  
  let error = {
    statusCode: err.statusCode || 500,
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Une erreur est survenue',
  };
  
  // ===== Erreurs de validation Joi =====
  if (err.isJoi) {
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    error.details = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      type: detail.type,
    }));
  }
  
  // ===== Erreurs PostgreSQL =====
  if (err.code === '23505') {
    // Duplicate key
    error.statusCode = 409;
    error.code = 'DUPLICATE_ENTRY';
    error.message = 'Cette valeur existe déjà dans la base de données';
  }
  
  if (err.code === '23503') {
    // Foreign key violation
    error.statusCode = 422;
    error.code = 'INVALID_REFERENCE';
    error.message = 'Référence invalide (clé étrangère)';
  }
  
  // ===== Logs =====
  
  const logLevel = error.statusCode >= 500 ? 'error' : 'warn';
  
  logger[logLevel]({
    message: 'HTTP Error',
    statusCode: error.statusCode,
    code: error.code,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    userEmail: req.user?.email,
    stack: err.stack,
    originalError: err.message,
  });
  
  // ===== Réponse =====
  
  const response = {
    success: false,
    error: error.message,
    code: error.code,
    timestamp: new Date().toISOString(),
  };
  
  // Ajouter les détails en développement
  if (process.env.NODE_ENV === 'development') {
    response.details = {
      originalError: err.message,
      stack: err.stack ? err.stack.split('\n').slice(0, 5) : undefined,
    };
  }
  
  // Ajouter les détails de validation s'ils existent
  if (error.details) {
    response.validationErrors = error.details;
  }
  
  res.status(error.statusCode).json(response);
};

// =====================================================
// Middleware : 404 - Route non trouvée
// =====================================================

const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route non trouvée: ${req.method} ${req.path}`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

// =====================================================
// Wrapper pour les contrôleurs async
// =====================================================

/**
 * Wrapper pour capturer les erreurs dans les contrôleurs async
 * @param {function} fn - Fonction contrôleur async
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// =====================================================
// Export
// =====================================================

module.exports = {
  AppError,
  ErrorTypes,
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
