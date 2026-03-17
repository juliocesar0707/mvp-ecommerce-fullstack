// src/controllers/produtoController.js
const db = require('../config/db');

// Rota Pública
exports.listar = async (req, res) => {
    // Paginação e filtros
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const busca = req.query.busca || '';
    const categoria = req.query.categoria || '';

    try {
        let query = 'SELECT p.*, c.nome as categoria_nome FROM produtos p JOIN categorias c ON p.categoria_id = c.id WHERE p.nome LIKE ?';
        const queryParams = [`%${busca}%`];

        if (categoria) {
            query += ' AND p.categoria_id = ?';
            queryParams.push(categoria);
        }

        query += ' LIMIT ? OFFSET ?';
        // É importante passar os limites numéricos explicitamente para evitar erros de string no MySQL
        queryParams.push(Number(limit), Number(offset));

        const [produtos] = await db.query(query, queryParams);
        
        // Conta o total para o frontend saber quantas páginas existem
        const [totalRows] = await db.query('SELECT COUNT(*) as total FROM produtos WHERE nome LIKE ?', [`%${busca}%`]);

        res.json({
            produtos,
            total: totalRows[0].total,
            paginaAtual: page,
            totalPaginas: Math.ceil(totalRows[0].total / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar produtos.' });
    }
};

// Rota Privada (Admin)
exports.criar = async (req, res) => {
    const { categoria_id, nome, descricao, preco, estoque, imagem_url } = req.body;
    try {
        const [resultado] = await db.query(
            'INSERT INTO produtos (categoria_id, nome, descricao, preco, estoque, imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
            [categoria_id, nome, descricao, preco, estoque, imagem_url]
        );
        res.status(201).json({ id: resultado.insertId, mensagem: 'Produto criado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao criar produto.' });
    }
};

// ... (Aqui também iriam os métodos atualizar e deletar seguindo o mesmo padrão do 'criar')