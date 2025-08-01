import express from 'express';
import { exec } from 'child_process';

const router = express.Router(); //

router.post("/", async (req, res) => {
  const { media_temp, max_vibracao, dias_desde_ultima } = req.body;

  exec(`python prevent/prever.py ${media_temp} ${max_vibracao} ${dias_desde_ultima}`, (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: stderr });

    res.json({ dias_para_proxima: Number(stdout.trim()) });
  });
});

export default router;
