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
    let query;

    if (senha) {
      const hashedSenha = await bcrypt.hash(senha, 10);
      query = sql`
        UPDATE users
        SET name = ${name}, email = ${email}, senha = ${hashedSenha}, cargo = ${cargo}
        WHERE id = ${id}
      `;
    } else {
      query = sql`
        UPDATE users
        SET name = ${name}, email = ${email}, cargo = ${cargo}
        WHERE id = ${id}
      `;
    }

    await query;
  }

  async deleteUser(id) {
    await sql`DELETE FROM users WHERE id = ${id}`;
  }

  // CARGOS
  async listCargos() {
    return await sql`SELECT * FROM cargos`;
  }

  async createCargo(cargo) {
    const id = randomUUID();
    const { nome, descricao } = cargo;
    await sql`
      INSERT INTO cargos (id, nome, descricao)
      VALUES (${id}, ${nome}, ${descricao})
    `;
  }

  // PERMISSÕES
  async listPermissoes() {
    return await sql`SELECT * FROM permissoes`;
  }

  async createPermissao(permissao) {
    const id = randomUUID();
    const { nome, descricao } = permissao;
    await sql`
      INSERT INTO permissoes (id, nome, descricao)
      VALUES (${id}, ${nome}, ${descricao})
    `;
  }

  // EQUIPAMENTOS
  async listEquipamentos() {
    return await sql`SELECT * FROM equipamentos`;
  }

  async createEquipamento(equipamento) {
    const id = randomUUID();
    const { nome, modelo, localizacao, status } = equipamento;
    await sql`
      INSERT INTO equipamentos (id, nome, modelo, localizacao, status)
      VALUES (${id}, ${nome}, ${modelo}, ${localizacao}, ${status})
    `;
  }

  async getEquipamentoById(id) {
    const result = await sql`SELECT * FROM equipamentos WHERE id = ${id}`;
    return result[0];
  }

  async updateEquipamento(id, equipamento) {
    const { nome, modelo, localizacao, status } = equipamento;
    await sql`
      UPDATE equipamentos
      SET nome = ${nome}, modelo = ${modelo}, localizacao = ${localizacao}, status = ${status}
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

  async createLeitura(leitura) {
    const id = randomUUID();
    const { sensor_id, valor, timestamp } = leitura;
    await sql`
      INSERT INTO leituras (id, sensor_id, valor, timestamp)
      VALUES (${id}, ${sensor_id}, ${valor}, ${timestamp})
    `;
  }

  // MANUTENÇÕES
  async listManutencoes() {
    return await sql`SELECT * FROM manutencoes`;
  }

  async createManutencao(manutencao) {
    const id = randomUUID();
    const {
      equipamento_id,
      data_manutencao,
      estado_atual_equipamento,
      responsavel_id,
    } = manutencao;
    await sql`
      INSERT INTO manutencoes (id, equipamento_id, data_manutencao, estado_atual_equipamento, responsavel_id)
      VALUES (${id}, ${equipamento_id}, ${data_manutencao}, ${estado_atual_equipamento}, ${responsavel_id})
    `;
  }

  async getManutencaoById(id) {
    const result = await sql`SELECT * FROM manutencoes WHERE id = ${id}`;
    return result[0];
  }

  async updateManutencao(id, manutencao) {
    const {
      equipamento_id,
      data_manutencao,
      estado_atual_equipamento,
      responsavel_id,
    } = manutencao;
    await sql`
      UPDATE manutencoes
      SET equipamento_id = ${equipamento_id},
          data_manutencao = ${data_manutencao},
          estado_atual_equipamento = ${estado_atual_equipamento},
          responsavel_id = ${responsavel_id}
      WHERE id = ${id}
    `;
  }

  async deleteManutencao(id) {
    await sql`DELETE FROM manutencoes WHERE id = ${id}`;
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
    await sql`
      UPDATE alertas SET resolvido = TRUE WHERE id = ${id}
    `;
  }

  // ORDENS DE SERVIÇO (OS)
  async listOS() {
    return await sql`SELECT * FROM os`;
  }

  async createOS(os) {
    const id = randomUUID();
    // Ajuste as colunas conforme sua tabela os
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

  // Dentro de class DatabasePostgres
async createAgendamento({ equipamento_id, data_agendada, tipo, responsavel, observacoes }) {
  await this.client.query(`
    INSERT INTO agendamentos (equipamento_id, data_agendada, tipo, responsavel, observacoes)
    VALUES ($1, $2, $3, $4, $5)
  `, [equipamento_id, data_agendada, tipo, responsavel, observacoes]);
}

async listAgendamentos() {
  const result = await this.client.query('SELECT * FROM agendamentos');
  return result.rows;
}

}

