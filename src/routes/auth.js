const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/refresh', authController.refreshTokenEndpoint);
router.get('/profile', authenticate, authController.getProfile);
router.post('/logout', authenticate, authController.logout);

module.exports = router;