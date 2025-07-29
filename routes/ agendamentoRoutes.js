const express = require('express')
const router = express.Router()
const { verifyToken } = require('./auth')
const bloquearAdmin = require('./middlewares/bloquearAdmin')

// rota protegida e **bloqueando admins**
router.post('/agendamentos', verifyToken, bloquearAdmin, (req, res) => {
// lógica para criar agendamento
res.json({ msg: 'Agendamento criado com sucesso!' })
})
