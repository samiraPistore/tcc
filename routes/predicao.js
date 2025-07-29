import express from "express";
import { v4 as uuidv4 } from "uuid";
import { sql } from "../sql.js";

const router = express.Router();

// Endpoint para previsão de próxima manutenção
router.post("/previsao-proxima-manutencao", async (req, res) => {
  try {
    const { equipamento_id } = req.body;

    if (!equipamento_id) {
      return res.status(400).json({ error: "equipamento_id é obrigatório" });
    }

    // Aqui você aplicaria o modelo de regressão. Por enquanto, simulação:
    const diasPrevistos = Math.floor(Math.random() * 30) + 15; // de 15 a 45 dias
    const hoje = new Date();
    const dataPrevista = new Date(hoje);
    dataPrevista.setDate(hoje.getDate() + diasPrevistos);

    await sql.salvarPrevisaoManutencao({
      equipamento_id,
      dias: diasPrevistos,
      data_prevista: dataPrevista.toISOString().split("T")[0],
      modelo: "Simulação",
    });

    // Retorna a resposta
    res.json({
      equipamento_id,
      dias_ate_manutencao: diasPrevistos,
      data_prevista: dataPrevista.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Erro ao prever próxima manutenção:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

export default router;
