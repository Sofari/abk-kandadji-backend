const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const contractController = require('../controllers/contractController');

router.get('/', authenticate, contractController.getAllContracts);
router.get('/:id', authenticate, contractController.getContractById);
router.post('/', authenticate, authorize('admin', 'juriste'), contractController.createContract);
router.put('/:id', authenticate, authorize('admin', 'juriste', 'consultant'), contractController.updateContract);
router.delete('/:id', authenticate, authorize('admin'), contractController.deleteContract);

module.exports = router;