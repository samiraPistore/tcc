const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { DatabasePostgres } = require('./dataBasePostgres');
const db = new DatabasePostgres();
const jwt = require('jsonwebtoken');



const SECRET = 'segredo123';

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await db.findByEmail(email);
  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    return res.status(401).json({ message: 'Senha incorreta' });
  }

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
