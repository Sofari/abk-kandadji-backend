/**
 * =====================================================
 * Routes : Échéances
 * =====================================================
 * 
 * Endpoints pour gérer les échéances avec Date 1 et Date 2
 */

const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middleware/auth');
const deadlineController = require('../controllers/deadlineController');

// =====================================================
// GET : Lister les échéances
// =====================================================

/**
 * GET /api/deadlines
 * Lister toutes les échéances avec pagination et filtres
 * 
 * Query params:
 * - page: numéro de page
 * - limit: résultats par page
 * - statut: filtrer par statut (planifiee, en_attente, en_cours, completée, depassée)
 * - contrat_id: filtrer par contrat
 */
router.get('/', authenticate, deadlineController.getAllDeadlines);

/**
 * GET /api/deadlines/urgent
 * Récupérer les échéances urgentes (prochains 60 jours)
 */
router.get('/urgent', authenticate, deadlineController.getUrgentDeadlines);

/**
 * GET /api/deadlines/:id
 * Détail d'une échéance + alertes associées
 */
router.get('/:id', authenticate, deadlineController.getDeadlineById);

// =====================================================
// POST : Créer une échéance
// =====================================================

/**
 * POST /api/deadlines
 * Créer une nouvelle échéance
 * 
 * Rôles : admin, juriste
 * 
 * Body:
 * {
 *   "contract_id": 1,
 *   "date_action": "2025-06-01",
 *   "date_limite": "2025-07-01",
 *   "description": "Rapport d'avancement",
 *   "type_echéance": "inspection",
 *   "responsable_id": 2,
 *   "condition_requise": "50% des travaux achevés",
 *   "priorite": 5
 * }
 */
router.post(
  '/',
  authenticate,
  authorize('admin', 'juriste'),
  deadlineController.createDeadline
);

// =====================================================
// PUT : Mettre à jour une échéance
// =====================================================

/**
 * PUT /api/deadlines/:id
 * Mettre à jour une échéance
 * 
 * Rôles : admin, juriste, consultant
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'juriste', 'consultant'),
  deadlineController.updateDeadline
);

// =====================================================
// PUT : Marquer comme complétée
// =====================================================

/**
 * PUT /api/deadlines/:id/complete
 * Marquer une échéance comme complétée
 * Désactive automatiquement les alertes associées
 * 
 * Body (optionnel):
 * {
 *   "date_satisfaction": "2025-06-25"
 * }
 */
router.put(
  '/:id/complete',
  authenticate,
  deadlineController.completeDeadline
);

// =====================================================
// DELETE : Supprimer une échéance
// =====================================================

/**
 * DELETE /api/deadlines/:id
 * Supprimer une échéance
 * 
 * Rôles : admin seulement
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  deadlineController.deleteDeadline
);

module.exports = router;
