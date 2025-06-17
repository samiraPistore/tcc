const db = require('../db');

// Listar todos os usuários ativos
exports.list = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, cargo FROM users WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

// Criar novo usuário
exports.create = async (req, res) => {
  const { name, email, senha, cargo } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (id, name, email, senha, cargo, active) VALUES (gen_random_uuid(), $1, $2, $3, $4, true) RETURNING id, name, email, cargo',
      [name, email, senha, cargo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // erro de chave única (email duplicado)
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

// Atualizar usuário pelo id
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, email, senha, cargo } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET name=$1, email=$2, senha=$3, cargo=$4, updated_at=NOW() WHERE id=$5 AND active=true RETURNING id, name, email, cargo',
      [name, email, senha, cargo, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Desativar usuário (soft delete)
exports.deactivate = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE users SET active=false, updated_at=NOW() WHERE id=$1 AND active=true',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário desativado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao desativar usuário' });
  }
};


