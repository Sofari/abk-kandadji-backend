const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const deadlineController = require('../controllers/deadlineController');

router.get('/', authenticate, deadlineController.getAllDeadlines);
router.get('/urgent', authenticate, deadlineController.getUrgentDeadlines);
router.get('/:id', authenticate, deadlineController.getDeadlineById);
router.post('/', authenticate, authorize('admin', 'juriste'), deadlineController.createDeadline);
router.put('/:id', authenticate, authorize('admin', 'juriste', 'consultant'), deadlineController.updateDeadline);
router.put('/:id/complete', authenticate, deadlineController.completeDeadline);
router.delete('/:id', authenticate, authorize('admin'), deadlineController.deleteDeadline);

module.exports = router;