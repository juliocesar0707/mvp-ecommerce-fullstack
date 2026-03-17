// src/controllers/pedidoController.js
const db = require('../config/db');

exports.checkout = async (req, res) => {
    const usuario_id = req.usuario.id;
    const { itens } = req.body; // Array de { produto_id, quantidade }

    if (!itens || itens.length === 0) {
        return res.status(400).json({ erro: 'O carrinho está vazio.' });
    }

    // Pega uma conexão dedicada do pool para garantir a transação
    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        let subtotalPedido = 0;
        const itensParaInserir = [];

        // 1. Validar estoque e calcular o total real baseado no banco de dados
        for (const item of itens) {
            const [produtoData] = await conn.query('SELECT preco, estoque, nome FROM produtos WHERE id = ?', [item.produto_id]);
            
            if (produtoData.length === 0) {
                throw new Error(`Produto ID ${item.produto_id} não encontrado.`);
            }

            const produto = produtoData[0];

            if (produto.estoque < item.quantidade) {
                throw new Error(`Estoque insuficiente para o produto: ${produto.nome}.`);
            }

            subtotalPedido += parseFloat(produto.preco) * item.quantidade;
            
            // Guarda para a próxima etapa da inserção
            itensParaInserir.push({
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco_unitario: produto.preco // Grava o preço da hora da compra
            });
        }

        // 2. Criar o pedido (Tabela pedidos)
        const [resultPedido] = await conn.query(
            'INSERT INTO pedidos (usuario_id, total, status) VALUES (?, ?, ?)',
            [usuario_id, subtotalPedido, 'PENDENTE']
        );
        const pedidoId = resultPedido.insertId;

        // 3. Inserir os itens e abater o estoque
        for (const item of itensParaInserir) {
            // Insere na tabela de ligação
            await conn.query(
                'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
                [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
            );

            // Abate o estoque do produto
            await conn.query(
                'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
                [item.quantidade, item.produto_id]
            );
        }

        // Se tudo deu certo, efetiva as mudanças no banco
        await conn.commit();
        res.status(201).json({ mensagem: 'Pedido realizado com sucesso!', pedidoId, total: subtotalPedido });

    } catch (error) {
        // Se qualquer query falhar ou estourar um "throw new Error", desfaz TUDO!
        await conn.rollback();
        res.status(400).json({ erro: error.message || 'Erro ao processar checkout.' });
    } finally {
        // Libera a conexão de volta para o Pool
        conn.release();
    }
};