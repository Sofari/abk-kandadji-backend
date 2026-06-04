/**
 * =====================================================
 * Routes : Authentification
 * =====================================================
 * 
 * Endpoints d'authentification JWT simple
 */

const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

// =====================================================
// POST : Login
// =====================================================

/**
 * POST /api/auth/login
 * Authentifier l'utilisateur et retourner un token JWT
 * 
 * Body:
 * {
 *   "email": "dg@abk.ne",
 *   "password": "motdepasse"
 * }
 * 
 * Réponse (200):
 * {
 *   "success": true,
 *   "data": {
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "user": {
 *       "id": 1,
 *       "email": "dg@abk.ne",
 *       "nom_prenom": "Amadou Maïga",
 *       "role": "admin"
 *     }
 *   }
 * }
 */
router.post('/login', authController.login);

// =====================================================
// POST : Refresh Token
// =====================================================

/**
 * POST /api/auth/refresh
 * Rafraîchir le token JWT expiré
 * 
 * Body:
 * { "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 * 
 * Réponse (200):
 * {
 *   "success": true,
 *   "data": { "token": "nouveau-token..." }
 * }
 */
router.post('/refresh', authController.refreshTokenEndpoint);

// =====================================================
// GET : Profil utilisateur
// =====================================================

/**
 * GET /api/auth/profile
 * Récupérer le profil de l'utilisateur actuellement authentifié
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Réponse (200):
 * {
 *   "success": true,
 *   "data": {
 *     "user": {
 *       "id": 1,
 *       "email": "dg@abk.ne",
 *       "nom_prenom": "Amadou Maïga",
 *       "role": "admin",
 *       "departement": "Direction Générale",
 *       "is_active": true,
 *       "last_login": "2025-05-20T10:30:00Z"
 *     }
 *   }
 * }
 */
router.get('/profile', authenticate, authController.getProfile);

// =====================================================
// POST : Logout
// =====================================================

/**
 * POST /api/auth/logout
 * Logout de l'utilisateur
 * 
 * Note: Le logout réel se fait côté client en supprimant le token
 * Cet endpoint juste enregistre l'action pour l'audit
 * 
 * Headers:
 * Authorization: Bearer <token>
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router;
