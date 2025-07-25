import express from 'express';
import cors from "cors";
import { DatabasePostgres } from './dataBasePostgres.js';
import './createTable.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import './routes/analise.js'; // Isso dispara a análise contínua
import cron from 'node-cron';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const database = new DatabasePostgres();

// Cadastro
app.post('/auth/register', async (req, res) => {
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
app.post('/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await database.findByEmail(email);

    if (!user) return res.status(400).json({ msg: 'Usuário não encontrado' });


    const isSenhaValid = await bcrypt.compare(senha, user.senha);
    if (!isSenhaValid) return res.status(401).json({ msg: 'Senha inválida!' });

    const token = jwt.sign({ id: user.id, email: user.email, cargo:user.cargo }, process.env.JWT_SECRET || 'minhaChaveSuperSecreta', { expiresIn: '1d' });

    return res.json({ msg: 'Login realizado!', token, user: { id: user.id, name: user.name, email: user.email } });


  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ msg: 'Erro interno no servidor' });
  }
});


// USERS
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
  const { name, email, senha, cargo } = req.body;
  if (!name || !email || !senha) {
    return res.status(400).json({ msg: 'Preencha todos os campos!' });
  }








  const existingUser = await database.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ msg: 'Email já está cadastrado!' });
  }








  await database.createUser({ name, email, senha, cargo });
  res.status(201).json({ msg: 'Usuário criado com sucesso!' });
});








app.put('/users/:id', async (req, res) => {
  const { name, email, senha, cargo } = req.body;
  const user = {};








  if (name) user.name = name;
  if (email) user.email = email;
  if (senha) user.senha = await bcrypt.hash(senha, 10);
  if (cargo) user.cargo = cargo;








  await database.updateUser(req.params.id, user);
  res.status(204).send();
});








app.delete('/users/:id', async (req, res) => {
  await database.deleteUser(req.params.id);
  res.status(204).send();
});







// EQUIPAMENTOS
app.post('/equipamentos', async (req, res) => { 
  const { nome_equipamento, modelo, local, status, fabricante, ano_aquisicao, descricao } = req.body;
  await database.createEquipamento({ nome_equipamento, modelo, local, status, fabricante, ano_aquisicao, descricao });
  res.status(201).send();
});




app.get('/equipamentos', async (req, res) => {
  const equipamentos = await database.listEquipamentos();
  res.json(equipamentos);
});






app.get('/equipamentos', async (req, res) => {
  try {
    const equipamentos = await database.getAllEquipamentos(); // exemplo de função
    res.json(equipamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar equipamentos' });
  }
});





app.put('/equipamentos/:id', async (req, res) => {
  await database.updateEquipamento(req.params.id, req.body);
  res.status(204).send();
});




app.delete('/equipamentos/:id', async (req, res) => {
  await database.deleteEquipamento(req.params.id);
  res.status(204).send();
});




// SENSORES
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


// LEITURAS
// Endpoint para criar leitura
app.post('/leituras', async (req, res) => {
  const { sensor_id, valor, timestamp } = req.body;

  console.log('Recebido no POST /leituras:', { sensor_id, valor, timestamp });

  if (!sensor_id || valor === undefined || valor === null) {
    return res.status(400).json({ msg: 'Campos obrigatórios ausentes ou inválidos' });
  }

  try {
    // Chamada sem falha, só com os campos que existem
    await database.createLeitura({ sensor_id, valor, timestamp });
    res.status(201).send();
  } catch (error) {
    console.error('Erro ao criar leitura:', error);
    res.status(500).json({ error: 'Erro interno ao criar leitura' });
  }
});


// MANUTENÇÕES
app.post('/manutencoes', async (req, res) => {
  await database.createManutencao(req.body);
  res.status(201).send();
});




app.get('/manutencoes', async (req, res) => {
  const manutencoes = await database.listManutencoes();
  res.json(manutencoes);
});


app.put('/manutencoes/:id', async (req, res) => {
  await database.updateManutencao(req.params.id, req.body);
  res.status(204).send();
});




app.delete('/manutencoes/:id', async (req, res) => {
  await database.deleteManutencao(req.params.id);
  res.status(204).send();
});




// OS
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




// ALERTAS
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




// RELATÓRIOS
app.get('/relatorios', async (req, res) => {
  const relatorios = await database.listRelatorios();
  res.json(relatorios);
});




app.post('/relatorios', async (req, res) => {
  await database.gerarRelatorio(req.body);
  res.status(201).send();
})






app.post('/agendamentos', async (req, res) => {
  const { equipamento_id, data_agendada, status, responsavel, observacoes } = req.body;




  if (!equipamento_id || !data_agendada || !status || !responsavel) {
    return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios!' });
  }




  try {
    await database.createAgendamento({ equipamento_id, data_agendada, status, responsavel, observacoes });
    res.status(201).json({ msg: 'Agendamento criado com sucesso!' });
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    res.status(500).json({ msg: 'Erro interno ao agendar manutenção.' });
  }
});




app.get('/agendamentos', async (req, res) => {
  try {
    const agendamentos = await database.listAgendamentos();
    res.json(agendamentos);
  } catch (err) {
    console.error('Erro ao listar agendamentos:', err);
    res.status(500).json({ msg: 'Erro interno ao buscar agendamentos.' });
  }
});


//TESTES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pyPath = path.join(__dirname, 'prevent', 'analise.py');

// Executa uma vez na inicialização
const pyProcess = spawn('python', [pyPath]);
pyProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});
pyProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});
pyProcess.on('close', (code) => {
  console.log(`processo python finalizado com código ${code}`);
});

// Agendamento a cada minuto
cron.schedule('*/1 * * * *', () => {
  console.log('Executando análise automática (a cada 1 minutos)...');
  const processo = spawn('python', [pyPath]);
  processo.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  processo.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  processo.on('close', (code) => {
    console.log(`processo python finalizado com código ${code}`);
  });
});



// START
app.listen(process.env.PORT ?? 3010, () => {
  console.log('Servidor rodando na porta 3010');
});
