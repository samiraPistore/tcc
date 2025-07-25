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

  let stdoutData = '';
  let stderrData = '';

  processo.stdout.on('data', (data) => {
    const text = data.toString();
    stdoutData += text;
    console.log(`stdout: ${text}`);
  });

  processo.stderr.on('data', (data) => {
    const text = data.toString();
    stderrData += text;
    console.error(`stderr: ${text}`);
  });

  processo.on('error', (err) => {
    console.error('Erro ao iniciar o script Python:', err);
    res.status(500).json({ status: 'Erro ao executar análise', error: err.message });
  });

  processo.on('close', (code) => {
    console.log(`Script Python finalizado com código ${code}`);

    if (code === 0) {
      res.json({
        status: 'Análise executada com sucesso',
        codigoSaida: code,
        stdout: stdoutData.trim(),
        stderr: stderrData.trim()
      });
    } else {
      res.status(500).json({
        status: 'Erro na execução do script Python',
        codigoSaida: code,
        stdout: stdoutData.trim(),
        stderr: stderrData.trim()
      });
    }
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
