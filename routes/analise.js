// routes/analise.js
import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { sql } from "../sql.js";

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


router.get("/resumo/geral", async (req, res) => {
  try {
    const { rows } = await sql`
      SELECT resultado, COUNT(*) as quantidade
      FROM analises
      GROUP BY resultado
    `;
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar resumo de análises:", err);
    res.status(500).json({ msg: "Erro interno" });
  }
});

export default router;
