import { randomUUID } from "crypto";
import { sql } from "./sql.js";
import bcrypt from "bcrypt";

export class DatabasePostgres {
  // USERS
  async listUsers() {
    try {
      return await sql`SELECT * FROM users;`;
    } catch (err) {
      console.log("Erro ao listar usuários: ", err);
      return [];
    }
  }

  async findByEmail(email) {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result[0];
  }

  async findByCargo(cargo) {
    const result = await sql`SELECT * FROM users WHERE cargo = ${cargo}`;
    return result[0];
  }

  async getUserById(id) {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`;
    return result[0];
  }

  async createUser(user) {
    const id = randomUUID();
    const { name, email, senha, cargo } = user;
    const hashedSenha = await bcrypt.hash(senha, 10);

    await sql`
      INSERT INTO users (id, name, email, senha, cargo)
      VALUES (${id}, ${name}, ${email}, ${hashedSenha}, ${cargo})
    `;
  }

  async updateUser(id, user) {
    const { name, email, senha, cargo } = user;
    if (senha) {
      const hashedSenha = await bcrypt.hash(senha, 10);
      await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, senha = ${hashedSenha}, cargo = ${cargo}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, cargo = ${cargo}
        WHERE id = ${id}
      `;
    }
  }

  async deleteUser(id) {
    await sql`DELETE FROM users WHERE id = ${id}`;
  }

  // EQUIPAMENTOS
  async listEquipamentos() {
    return await sql`SELECT * FROM equipamentos`;
  }

  async createEquipamento(equipamento) {
    const id = randomUUID();
    const { nome_equipamento, modelo, local, status, fabricante, ano_aquisicao, descricao } = equipamento;
    await sql`
      INSERT INTO equipamentos (id, nome_equipamento, modelo, local, status, fabricante, ano_aquisicao, descricao)
      VALUES (${id}, ${nome_equipamento}, ${modelo}, ${local}, ${status}, ${fabricante}, ${ano_aquisicao}, ${descricao})
    `;
  }

  async getEquipamentoById(id) {
    const result = await sql`SELECT * FROM equipamentos WHERE id = ${id}`;
    return result[0];
  }

  async updateEquipamento(id, equipamento) {
    const { nome_equipamento, modelo, local, status, fabricante, ano_aquisicao, descricao } = equipamento;
    await sql`
      UPDATE equipamentos
      SET nome_equipamento = ${nome_equipamento}, modelo = ${modelo}, local = ${local}, status = ${status},
          fabricante = ${fabricante}, ano_aquisicao = ${ano_aquisicao}, descricao = ${descricao}
      WHERE id = ${id}
    `;
  }

  async deleteEquipamento(id) {
    await sql`DELETE FROM equipamentos WHERE id = ${id}`;
  }

  // SENSORES
  async listSensores() {
    return await sql`SELECT * FROM sensores`;
  }

  async createSensor(sensor) {
    const id = randomUUID();
    const { equipamento_id, nome, tipo } = sensor;
    await sql`
      INSERT INTO sensores (id, equipamento_id, nome, tipo)
      VALUES (${id}, ${equipamento_id}, ${nome}, ${tipo})
    `;
  }

  async getSensorById(id) {
    const result = await sql`SELECT * FROM sensores WHERE id = ${id}`;
    return result[0];
  }

  async updateSensor(id, sensor) {
    const { equipamento_id, nome, tipo } = sensor;
    await sql`
      UPDATE sensores
      SET equipamento_id = ${equipamento_id}, nome = ${nome}, tipo = ${tipo}
      WHERE id = ${id}
    `;
  }

  async deleteSensor(id) {
    await sql`DELETE FROM sensores WHERE id = ${id}`;
  }

  // LEITURAS
  async listLeiturasBySensor(sensor_id) {
    return await sql`
      SELECT * FROM leituras WHERE sensor_id = ${sensor_id} ORDER BY timestamp DESC
    `;
  }

  async listLeituras() {
    return await sql`SELECT * FROM leituras ORDER BY timestamp DESC`;
  }

  async createLeitura(leitura) {
    const id = randomUUID();
    const { sensor_id, valor, timestamp } = leitura;
    await sql`
      INSERT INTO leituras (id, sensor_id, valor, timestamp)
      VALUES (${id}, ${sensor_id}, ${valor}, ${timestamp})
    `;
  }

  // MANUTENÇÃO
  async listManutencoes() {
    return await sql`
      SELECT m.*, e.nome_equipamento, u.name AS nome_responsavel
      FROM manutencao m
      JOIN equipamentos e ON m.equipamento_id = e.id
      JOIN users u ON m.responsavel_id = u.id
      ORDER BY m.data_manutencao DESC
    `;
  }

  async createManutencao(manutencao) {
    const id = randomUUID();
    const { equipamento_id, data_manutencao, status, descricao, responsavel_id } = manutencao;
    await sql`
      INSERT INTO manutencao (id, equipamento_id, data_manutencao, status, descricao, responsavel_id)
      VALUES (${id}, ${equipamento_id}, ${data_manutencao}, ${status}, ${descricao}, ${responsavel_id})
    `;
  }

  async getManutencaoById(id) {
    const result = await sql`SELECT * FROM manutencao WHERE id = ${id}`;
    return result[0];
  }

  async updateManutencao(id, manutencao) {
    const { equipamento_id, data_manutencao, status, descricao, responsavel_id } = manutencao;
    await sql`
      UPDATE manutencao
      SET equipamento_id = ${equipamento_id},
          data_manutencao = ${data_manutencao},
          status = ${status},
          descricao = ${descricao},
          responsavel_id = ${responsavel_id}
      WHERE id = ${id}
    `;
  }

  async deleteManutencao(id) {
    await sql`DELETE FROM manutencao WHERE id = ${id}`;
  }

  async atualizarStatusManutencao(id, novoStatus) {
    try {
      await sql`
        UPDATE manutencao
        SET status = ${novoStatus}
        WHERE id = ${id}
      `;
    } catch (error) {
      throw new Error('Erro ao atualizar status da manutenção');
    }
  }

 async resumoManutencoes() {
  try {
    const resultado = await sql`
      SELECT e.nome_equipamento, m.status
      FROM manutencao m
      JOIN equipamentos e ON e.id = m.equipamento_id
      ORDER BY m.data_manutencao DESC
      LIMIT 5;
    `;
    return resultado;
  } catch (err) {
    console.error('Erro ao buscar resumo de manutenções:', err);
    throw err;
  }
}



  // ALERTAS
  async listAlertas() {
    return await sql`SELECT * FROM alertas ORDER BY data_alerta DESC`;
  }

  async createAlerta(alerta) {
    const id = randomUUID();
    const { equipamento_id, tipo, descricao, nivel_gravidade, data_alerta } = alerta;
    await sql`
      INSERT INTO alertas (id, equipamento_id, tipo, descricao, nivel_gravidade, data_alerta)
      VALUES (${id}, ${equipamento_id}, ${tipo}, ${descricao}, ${nivel_gravidade}, ${data_alerta})
    `;
  }

  async deleteAlerta(id) {
    await sql`DELETE FROM alertas WHERE id = ${id}`;
  }

  async resolverAlerta(id) {
    await sql`UPDATE alertas SET resolvido = TRUE WHERE id = ${id}`;
  }

  // ORDENS DE SERVIÇO (OS)
  async listOS() {
    return await sql`SELECT * FROM os`;
  }

  async createOS(os) {
    const id = randomUUID();
    const { equipamento_id, descricao, status, data_abertura, data_fechamento } = os;
    await sql`
      INSERT INTO os (id, equipamento_id, descricao, status, data_abertura, data_fechamento)
      VALUES (${id}, ${equipamento_id}, ${descricao}, ${status}, ${data_abertura}, ${data_fechamento})
    `;
  }

  async getOSById(id) {
    const result = await sql`SELECT * FROM os WHERE id = ${id}`;
    return result[0];
  }

  async updateOS(id, os) {
    const { equipamento_id, descricao, status, data_abertura, data_fechamento } = os;
    await sql`
      UPDATE os
      SET equipamento_id = ${equipamento_id},
          descricao = ${descricao},
          status = ${status},
          data_abertura = ${data_abertura},
          data_fechamento = ${data_fechamento}
      WHERE id = ${id}
    `;
  }

  async deleteOS(id) {
    await sql`DELETE FROM os WHERE id = ${id}`;
  }

  // RELATÓRIOS
  async listRelatorios() {
    return await sql`SELECT * FROM relatorios`;
  }

  async getQuantidadeOrdensPorData() {
    return await sql`
      SELECT 
        DATE(data_abertura) AS data,
        COUNT(*) FILTER (WHERE status = 'aberta') AS abertas,
        COUNT(*) FILTER (WHERE status = 'fechada') AS fechadas
      FROM os
      GROUP BY DATE(data_abertura)
      ORDER BY DATE(data_abertura);
    `;
  }

  async getQuantidadeOrdensPorStatus() {
    return await sql`
      SELECT 
        status,
        COUNT(*) AS quantidade
      FROM os
      GROUP BY status;
    `;
  }

  // AGENDAMENTOS
  async createAgendamento({ equipamento_id, data_agendada, status, responsavel, observacoes }) {
    const id = randomUUID();
    await sql`
      INSERT INTO agendamentos (id, equipamento_id, data_agendada, status, responsavel, observacoes)
      VALUES (${id}, ${equipamento_id}, ${data_agendada}, ${status}, ${responsavel}, ${observacoes})
    `;
  }

  async listAgendamentos() {
    return await sql`SELECT * FROM agendamentos ORDER BY data_agendada DESC`;
  }

  // ANALISES
  // Ajustado para as colunas existentes da tabela 'analises'
  async criarAnalise(analise) {
    const id = randomUUID();
    const { equipamento_id, temperatura, vibracao, ruido, resultado, timestamp } = analise;
    await sql`
      INSERT INTO analises (id, equipamento_id, temperatura, vibracao, ruido, resultado, timestamp)
      VALUES (${id}, ${equipamento_id}, ${temperatura}, ${vibracao}, ${ruido}, ${resultado}, ${timestamp})
    `;
  }

  async countAnalises() {
    const result = await sql`SELECT COUNT(*) FROM analises`;
    return parseInt(result[0].count);
  }

  async countAnalisesByResultado(valor) {
    const result = await sql`SELECT COUNT(*) FROM analises WHERE resultado = ${valor}`;
    return parseInt(result[0].count);
  }

  async calcularIntervaloPreventivo() {
  const result = await sql`
    SELECT data_manutencao
    FROM manutencao
    ORDER BY data_manutencao ASC
  `;

  const datas = result.map(r => new Date(r.data_manutencao));
  if (datas.length < 2) return null;

  let somaIntervalos = 0;
  for (let i = 1; i < datas.length; i++) {
    const dias = (datas[i] - datas[i - 1]) / (1000 * 60 * 60 * 24);
    somaIntervalos += dias;
  }

  const media = somaIntervalos / (datas.length - 1);
  return parseFloat(media.toFixed(1)); // dias
}


  async salvarPrevisaoManutencao({ id, equipamento_id, dias, data_prevista, modelo }) {
    await sql`
      INSERT INTO previsoes_manutencao (id, equipamento_id, dias_ate_manutencao, data_prevista, modelo_usado)
      VALUES (${id}, ${equipamento_id}, ${dias}, ${data_prevista}, ${modelo})
      ON CONFLICT (equipamento_id) DO UPDATE SET
        dias_ate_manutencao = EXCLUDED.dias_ate_manutencao,
        data_prevista = EXCLUDED.data_prevista,
        modelo_usado = EXCLUDED.modelo_usado,
        data_geracao = NOW()
    `;
  }

  // CONFIGURAÇÕES
  async salvarConfiguracoes({ emailNotif, smsNotif, pushNotif }) {
    const existe = await sql`SELECT id FROM configuracoes LIMIT 1`;

    if (existe.length > 0) {
      await sql`
        UPDATE configuracoes
        SET email_notif = ${emailNotif}, sms_notif = ${smsNotif}, push_notif = ${pushNotif}
        WHERE id = ${existe[0].id}
      `;
    } else {
      await sql`
        INSERT INTO configuracoes (email_notif, sms_notif, push_notif)
        VALUES (${emailNotif}, ${smsNotif}, ${pushNotif})
      `;
    }
  }

  async obterConfiguracoes() {
    const resultado = await sql`SELECT * FROM configuracoes LIMIT 1`;
    return resultado[0] ?? { email_notif: true, sms_notif: false, push_notif: true };
  }
  async countAnalisePorEquipamento() {
  try {
    // Consulta SQL que conta quantas análises existem por equipamento
    const resultado = await sql`
      SELECT equipamento_id, COUNT(*) AS total_analises
      FROM analises
      GROUP BY equipamento_id
      ORDER BY equipamento_id;
    `;
    return resultado; // retorna um array com { equipamento_id, total_analises }
  } catch (err) {
    console.error("Erro ao contar análises por equipamento:", err);
    throw err;
  }
}

}

