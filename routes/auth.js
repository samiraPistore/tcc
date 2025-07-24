import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

export default (database) => {
  // Cadastro
  router.post('/register', async (req, res) => {
    const { name, email, senha, cargo } = req.body;

    const existingUser = await database.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: 'Email já está cadastrado!' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    await database.createUser({ name, email, senha: hashedSenha, cargo });
    res.status(201).json({ msg: 'Usuário criado!' });
  });

  // Login
  router.post('/login', async (req, res) => {
    try {
      const { email, senha } = req.body;
      const user = await database.findByEmail(email);

      if (!user) return res.status(400).json({ msg: 'Usuário não encontrado' });

      const isSenhaValid = await bcrypt.compare(senha, user.senha);
      if (!isSenhaValid) return res.status(401).json({ msg: 'Senha inválida!' });

      const token = jwt.sign(
        { id: user.id, email: user.email, cargo: user.cargo },
        process.env.JWT_SECRET || 'minhaChaveSuperSecreta',
        { expiresIn: '1d' }
      );

      return res.json({
        msg: 'Login realizado!',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (err) {
      console.error('Erro no login:', err);
      return res.status(500).json({ msg: 'Erro interno no servidor' });
    }
  });

  return router;
};
