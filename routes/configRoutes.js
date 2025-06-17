import express from 'express';
import { configController } from '../controllers/configController.js';

const router = express.Router();

// Parâmetros da Análise Preditiva
router.get('/parametros', configController.getParametros);
router.put('/parametros', configController.updateParametros);

// Notificações e Alertas
router.get('/alertas', configController.getAlertas);
router.put('/alertas', configController.updateAlertas);

// Agendamentos e Postamento
router.get('/agendamentos', configController.getAgendamentosAutomaticos);
router.put('/agendamentos', configController.updateAgendamentosAutomaticos);

// Segurança
router.get('/seguranca', configController.getSeguranca);
router.put('/seguranca', configController.updateSeguranca);

export default router;
