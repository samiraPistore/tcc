import express from "express";
import { PythonShell } from "python-shell";
import { sql } from "../sql.js";

const router = express.Router();

router.post("/previsao-proxima-manutencao", async (req, res) => {
  try {
    const { equipamento_id } = req.body;

    if (!equipamento_id) {
      return res.status(400).json({ error: "equipamento_id é obrigatório" });
    }

    // Executa o script Python que atualiza as previsões
    await new Promise((resolve, reject) => {
      PythonShell.run("proximaManu.py", null, function (err, results) {
        if (err) {
          console.error("Erro ao executar script Python:", err);
          reject(err);
        } else {
          console.log("Script executado:", results);
          resolve(results);
        }
      });
    });

    // Agora busca do banco a previsão gerada
    const previsao = await sql`
      SELECT * FROM manutencao_prevista
      WHERE equipamento_id = ${equipamento_id}
      ORDER BY data_geracao DESC
      LIMIT 1;
    `;

    if (previsao.length === 0) {
      return res.status(404).json({ error: "Nenhuma previsão encontrada para esse equipamento" });
    }

    const { dias, data_prevista } = previsao[0];

    res.json({
      equipamento_id,
      dias_ate_manutencao: dias,
      data_prevista,
    });

  } catch (error) {
    console.error("Erro ao prever manutenção:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

export default router;
