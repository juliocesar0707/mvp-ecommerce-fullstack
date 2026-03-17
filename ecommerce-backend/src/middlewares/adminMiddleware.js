// src/middlewares/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    if (req.usuario.role !== 'ADMIN') {
        return res.status(403).json({ erro: 'Acesso negado. Requer privilégios de administrador.' });
    }
    next();
};

module.exports = adminMiddleware;