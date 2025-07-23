
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DatabasePostgres } from '../dataBasePostgres.js';

const router = express.Router();
const db = new DatabasePostgres();

const SECRET = process.env.JWT_SECRET || 'segredo123';

router.post('/register', async (req, res) => {
  const { name, email, senha, cargo } = req.body;

  const existingUser = await db.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ msg: 'Email já está cadastrado!' });
  }

  const hashedSenha = await bcrypt.hash(senha, 10);
  await db.createUser({ name, email, senha: hashedSenha, cargo });
  res.status(201).json({ msg: 'Usuário criado!' });
});

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

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, cargo: usuario.cargo },
    SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    msg: 'Login realizado!',
    token,
    user: { id: usuario.id, name: usuario.name, email: usuario.email },
  });
});

export default router;