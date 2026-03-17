// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.registrar = async (req, res) => {
    const { nome, email, senha, role } = req.body;

    try {
        // Verifica se usuário já existe
        const [usuarios] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (usuarios.length > 0) {
            return res.status(400).json({ erro: 'E-mail já cadastrado.' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Insere no banco
        const tipoRole = role === 'ADMIN' ? 'ADMIN' : 'CLIENTE';
        const [resultado] = await db.query(
            'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)',
            [nome, email, senhaHash, tipoRole]
        );

        res.status(201).json({ mensagem: 'Usuário criado com sucesso!', id: resultado.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (usuarios.length === 0) {
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
        }

        const usuario = usuarios[0];
        
        // Verifica a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
        }

        // Gera o Token JWT
        const token = jwt.sign(
            { id: usuario.id, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Expira em 1 dia
        );

        res.json({
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};