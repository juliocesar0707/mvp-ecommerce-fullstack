const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Públicas
router.get('/', produtoController.listar);

// Privadas (Admin)
router.post('/', authMiddleware, adminMiddleware, produtoController.criar);

module.exports = router;