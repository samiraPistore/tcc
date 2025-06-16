import express from 'express';
import cors from "cors";
import { DatabasePostgres } from './dataBasePostgres.js';
import './createTable.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


const database = new DatabasePostgres();




// Cadastro
app.post('/auth/register', async (req, res) => {
  const { name, email, senha } = req.body;
  if (!name || !email || !senha) {
    return res.status(400).json({ msg: 'Preencha todos os campos!' });
  }


  const existingUser = await database.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ msg: 'Email já está cadastrado!' });
  }


  const hashedSenha = await bcrypt.hash(senha, 10);
  await database.create({ name, email, senha: hashedSenha });
  res.status(201).json({ msg: 'Usuário criado!' });
});




// Login
app.post('/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ msg: 'Preencha email e senha!' });
  }


  const user = await database.findByEmail(email);
  if (!user) {
    return res.status(400).json({ msg: 'Usuário não encontrado!' });
  }


  const isSenhaValid = await bcrypt.compare(senha, user.senha);
  if (!isSenhaValid) {
    return res.status(401).json({ msg: 'Senha inválida!' });
  }


  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'minhaChaveSuperSecreta',
    { expiresIn: '1d' }
  );


  res.json({
    msg: 'Login realizado!',
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});




// Rota protegida de teste
app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: 'Token não fornecido!' });


  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'minhaChaveSuperSecreta');
    res.json({ msg: 'Acesso autorizado!', decoded });
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido!' });
  }
});




// de Users
app.get('/users', async (req, res) => {
  const users = await database.listUsers();
  const usersSemSenha = users.map(({ senha, ...rest }) => rest);
  res.json(usersSemSenha);
});


app.get('/users/:id', async (req, res) => {
  const user = await database.getUserById(req.params.id);
  if (user) {
    const { senha, ...userSemSenha } = user;
    res.json(userSemSenha);
  } else {
    res.status(404).json({ msg: 'Usuário não encontrado!' });
  }
});


app.post('/users', async (req, res) => {
  const { name, email, senha } = req.body;
  if (!name || !email || !senha) {
    return res.status(400).json({ msg: 'Preencha todos os campos!' });
  }


  const existingUser = await database.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ msg: 'Email já está cadastrado!' });
  }


  const hashedSenha = await bcrypt.hash(senha, 10);
  await database.createUser({ name, email, senha: hashedSenha });
  res.status(201).json({ msg: 'Usuário criado com sucesso!' });
});


app.put('/users/:id', async (req, res) => {
  const { name, email, senha } = req.body;
  const user = {};


  if (name) user.name = name;
  if (email) user.email = email;
  if (senha) user.senha = await bcrypt.hash(senha, 10);


  await database.updateUser(req.params.id, user);
  res.status(204).send();
});


app.delete('/users/:id', async (req, res) => {
  await database.deleteUser(req.params.id);
  res.status(204).send();
});




// Equipamentos
app.post('/equipamentos', async (req, res) => {
  const { nome, modelo, localizacao, status } = req.body;
  await database.createEquipamento({ nome, modelo, localizacao, status });
  res.status(201).send();
});


app.get('/equipamentos', async (req, res) => {
  const equipamentos = await database.listEquipamentos();
  res.json(equipamentos);
});


app.get('/equipamentos/:id', async (req, res) => {
  const equipamento = await database.getEquipamentoById(req.params.id);
  res.json(equipamento);
});


app.put('/equipamentos/:id', async (req, res) => {
  await database.updateEquipamento(req.params.id, req.body);
  res.status(204).send();
});


app.delete('/equipamentos/:id', async (req, res) => {
  await database.deleteEquipamento(req.params.id);
  res.status(204).send();
});




// Sensores
app.post('/sensores', async (req, res) => {
  const { nome, tipo, equipamento_id } = req.body;
  await database.createSensor({ nome, tipo, equipamento_id });
  res.status(201).send();
});


app.get('/sensores', async (req, res) => {
  const sensores = await database.listSensores();
  res.json(sensores);
});


app.get('/sensores/:id', async (req, res) => {
  const sensor = await database.getSensorById(req.params.id);
  res.json(sensor);
});


app.put('/sensores/:id', async (req, res) => {
  await database.updateSensor(req.params.id, req.body);
  res.status(204).send();
});


app.delete('/sensores/:id', async (req, res) => {
  await database.deleteSensor(req.params.id);
  res.status(204).send();
});




// Leituras de Sensores
app.post('/leituras', async (req, res) => {
  const { sensor_id, valor, timestamp } = req.body;
  await database.createLeitura({ sensor_id, valor, timestamp });
  res.status(201).send();
});


app.get('/leituras', async (req, res) => {
  const { sensorId } = req.query;
  const leituras = await database.listLeiturasBySensor(sensorId);
  res.json(leituras);
});




// Manutenções
app.post('/manutencoes', async (req, res) => {
  await database.createManutencao(req.body);
  res.status(201).send();
});


app.get('/manutencoes', async (req, res) => {
  const manutencoes = await database.listManutencoes();
  res.json(manutencoes);
});


app.get('/manutencoes/:id', async (req, res) => {
  const manutencao = await database.getManutencaoById(req.params.id);
  res.json(manutencao);
});


app.put('/manutencoes/:id', async (req, res) => {
  await database.updateManutencao(req.params.id, req.body);
  res.status(204).send();
});


app.delete('/manutencoes/:id', async (req, res) => {
  await database.deleteManutencao(req.params.id);
  res.status(204).send();
});




// Ordens de Serviço
app.post('/os', async (req, res) => {
  await database.createOS(req.body);
  res.status(201).send();
});


app.get('/os', async (req, res) => {
  const ordens = await database.listOS();
  res.json(ordens);
});


app.get('/os/:id', async (req, res) => {
  const ordem = await database.getOSById(req.params.id);
  res.json(ordem);
});


app.put('/os/:id', async (req, res) => {
  await database.updateOS(req.params.id, req.body);
  res.status(204).send();
});


app.delete('/os/:id', async (req, res) => {
  await database.deleteOS(req.params.id);
  res.status(204).send();
});




// Alertas
app.get('/alertas', async (req, res) => {
  const alertas = await database.listAlertas();
  res.json(alertas);
});


app.post('/alertas', async (req, res) => {
  await database.createAlerta(req.body);
  res.status(201).send();
});


app.delete('/alertas/:id', async (req, res) => {
  await database.deleteAlerta(req.params.id);
  res.status(204).send();
});




// Relatórios
app.get('/relatorios', async (req, res) => {
  const relatorios = await database.listRelatorios();
  res.json(relatorios);
});


app.post('/relatorios', async (req, res) => {
  await database.gerarRelatorio(req.body);
  res.status(201).send();
});




// Start do servidor
app.listen(process.env.PORT ?? 3010, () => {
  console.log('Servidor rodando na porta 3010');
});
