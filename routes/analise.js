import { Router } from 'express';                
import { spawn } from 'child_process';           
import path from 'path';                          
import { fileURLToPath } from 'url';              
import { sql } from "../sql.js";                  

const router = Router();                           // Cria uma instância do Router
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);       

// Rota para executar o script Python quando acessar /analise/executar
router.get('/executar', (req, res) => {
  const pyPath = path.join(__dirname, '../prevent/analise.py');

  // Executa o script Python usando spawn
  const processo = spawn('python', [pyPath]);

 
  let stdoutData = '';
  let stderrData = '';

  // Captura dados enviados para stdout (saída padrão) pelo script Python
  processo.stdout.on('data', (data) => {
    const text = data.toString();    
    stdoutData += text;               
    console.log(`stdout: ${text}`);  
  });

  // Captura dados enviados para stderr (erros) pelo script Python
  processo.stderr.on('data', (data) => {
    const text = data.toString();
    stderrData += text;               
    console.error(`stderr: ${text}`); 
  });

  // Caso ocorra erro ao iniciar o processo Python, envia resposta de erro
  processo.on('error', (err) => {
    console.error('Erro ao iniciar o script Python:', err);
    res.status(500).json({ status: 'Erro ao executar análise', error: err.message });
  });

  // Quando o processo Python terminar, verifica o código de saída
  processo.on('close', (code) => {
    console.log(`Script Python finalizado com código ${code}`);

    if (code === 0) { // Código 0 indica sucesso
      res.json({
        status: 'Análise executada com sucesso',
        codigoSaida: code,
        stdout: stdoutData.trim(),
        stderr: stderrData.trim()
      });
    } else {          // Código diferente de 0 indica erro na execução
      res.status(500).json({
        status: 'Erro na execução do script Python',
        codigoSaida: code,
        stdout: stdoutData.trim(),
        stderr: stderrData.trim()
      });
    }
  });
});

// Rota para obter um resumo geral dos resultados das análises
router.get("/resumo/geral", async (req, res) => {
  try {
    const resultado = await sql`
      SELECT resultado, COUNT(*) as quantidade
      FROM analises
      GROUP BY resultado
    `;

    res.json(resultado);  // Envia o resultado da consulta como JSON

  } catch (err) {
    console.error("Erro ao buscar resumo de análises:", err);
    res.status(500).json({ msg: "Erro interno" }); 
  }
});

export default router;  // Exporta o router para uso no arquivo principal do servidor
