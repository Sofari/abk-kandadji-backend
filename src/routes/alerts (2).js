/**
 * =====================================================
 * Routes : Alertes
 * =====================================================
 * 
 * Endpoints pour gérer les alertes multi-canaux
 */

const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middleware/auth');
const alertController = require('../controllers/alertController');

// =====================================================
// GET : Lister les alertes
// =====================================================

/**
 * GET /api/alerts
 * Lister toutes les alertes avec pagination
 * 
 * Query params:
 * - page: numéro de page
 * - limit: résultats par page
 * - statut: active, deactivee, envoyee, echouee
 */
router.get('/', authenticate, alertController.getAllAlerts);

/**
 * GET /api/alerts/:id/history
 * Historique d'envoi d'une alerte
 */
router.get('/:id/history', authenticate, alertController.getAlertHistory);

// =====================================================
// POST : Créer une alerte
// =====================================================

/**
 * POST /api/alerts
 * Créer une nouvelle alerte
 * 
 * Rôles : admin, juriste
 * 
 * Body:
 * {
 *   "deadline_id": 1,
 *   "type_alerte": "email",
 *   "jours_avant_date_action": 7,
 *   "jours_avant_date_limite": 3,
 *   "destinataires_emails": ["dg@abk.ne", "directeur@abk.ne"],
 *   "destinataires_phones": ["+227 92 12 34 56"],
 *   "sujet_email": "Rappel : Inspection terrain",
 *   "corps_email": "Vous devez soumettre un rapport d'avancement..."
 * }
 */
router.post(
  '/',
  authenticate,
  authorize('admin', 'juriste'),
  alertController.createAlert
);

// =====================================================
// PUT : Mettre à jour une alerte
// =====================================================

/**
 * PUT /api/alerts/:id
 * Mettre à jour une alerte
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'juriste'),
  alertController.updateAlert
);

// =====================================================
// PUT : Activer/Désactiver une alerte
// =====================================================

/**
 * PUT /api/alerts/:id/toggle
 * Activer ou désactiver une alerte
 * 
 * Body:
 * { "active": true }  // ou false
 */
router.put(
  '/:id/toggle',
  authenticate,
  authorize('admin', 'juriste'),
  alertController.toggleAlert
);

// =====================================================
// POST : Tester l'envoi d'une alerte
// =====================================================

/**
 * POST /api/alerts/:id/test
 * Envoyer une alerte de test
 * Utile pour tester la configuration
 * 
 * Rôles : admin seulement
 * 
 * Body:
 * { "email": "test@example.com" }
 */
router.post(
  '/:id/test',
  authenticate,
  authorize('admin'),
  alertController.testAlertSend
);

// =====================================================
// DELETE : Supprimer une alerte
// =====================================================

/**
 * DELETE /api/alerts/:id
 * Supprimer une alerte
 * 
 * Rôles : admin seulement
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  alertController.deleteAlert
);

module.exports = router;
