const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Privadas (Cliente logado)
router.post('/checkout', authMiddleware, pedidoController.checkout);

module.exports = router;