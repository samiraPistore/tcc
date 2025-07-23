// routes/analise.js
import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Roda o script Python quando acessar /analise/executar
router.get('/executar', (req, res) => {
  const pyPath = path.join(__dirname, '../prevent/analise.py');

  const processo = spawn('python', [pyPath]);

  processo.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  processo.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  processo.on('close', (code) => {
    console.log(`Script Python finalizado com código ${code}`);
    res.send({ status: 'Análise executada com sucesso', code });
  });
});

export default router;
