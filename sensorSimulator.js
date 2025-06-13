import { sql } from './sql.js';
import { randomUUID } from 'crypto';

const equipamentoId = '00000000-0000-0000-0000-000000000001'; // use o ID real do seu equipamento

setInterval(async () => {
  const horario = new Date().toISOString();

  const temperatura = +(Math.random() * 50 + 20).toFixed(2);
  const vibracao = +(Math.random() * 150 + 70).toFixed(2);
  const ruido = +(Math.random() * 40 + 60).toFixed(2);

  await sql`
    INSERT INTO sensores (id, equipamento_id, tipo, valor, horario)
    VALUES
      (${randomUUID()}, ${equipamentoId}, 'temperatura', ${temperatura}, ${horario}),
      (${randomUUID()}, ${equipamentoId}, 'vibracao', ${vibracao}, ${horario}),
      (${randomUUID()}, ${equipamentoId}, 'ruido', ${ruido}, ${horario});
  `;

  console.log(`[✓] Leituras inseridas: T=${temperatura}°C | V=${vibracao} | R=${ruido}`);
}, 5000);
