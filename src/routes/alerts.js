const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const alertController = require('../controllers/alertController');

router.get('/', authenticate, alertController.getAllAlerts);
router.get('/:id/history', authenticate, alertController.getAlertHistory);
router.post('/', authenticate, authorize('admin', 'juriste'), alertController.createAlert);
router.put('/:id', authenticate, authorize('admin', 'juriste'), alertController.updateAlert);
router.put('/:id/toggle', authenticate, authorize('admin', 'juriste'), alertController.toggleAlert);
router.post('/:id/test', authenticate, authorize('admin'), alertController.testAlertSend);
router.delete('/:id', authenticate, authorize('admin'), alertController.deleteAlert);

module.exports = router;