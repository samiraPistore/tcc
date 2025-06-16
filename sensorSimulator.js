setInterval(async () => {
  try {
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
  } catch (error) {
    console.error('[X] Erro ao inserir leituras:', error);
  }
}, 5000);
