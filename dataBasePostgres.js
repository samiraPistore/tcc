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


  async createLeitura(leitura) {
    const id = randomUUID();
    const { sensor_id, valor, timestamp, falha } = leitura;
    await sql`
      INSERT INTO leituras (id, sensor_id, valor, timestamp)
      VALUES (${id}, ${sensor_id}, ${valor}, ${timestamp})
    `;
  }


  // MANUTENÇÃO
  async listManutencao() {
    return await sql`SELECT * FROM manutencao`;
  }


  async createManutencao(manutencao) {
    const id = randomUUID();
    const { equipamento_id, data_manutencao, status, responsavel_id } = manutencao;
    await sql`
      INSERT INTO manutencao (id, equipamento_id, data_manutencao, status, responsavel_id)
      VALUES (${id}, ${equipamento_id}, ${data_manutencao}, ${status}, ${responsavel_id})
    `;
  }


  async getManutencaoById(id) {
    const result = await sql`SELECT * FROM manutencao WHERE id = ${id}`;
    return result[0];
  }


  async updateManutencao(id, manutencao) {
    const { equipamento_id, data_manutencao, status, responsavel_id } = manutencao;
    await sql`
      UPDATE manutencao
      SET equipamento_id = ${equipamento_id},
          data_manutencao = ${data_manutencao},
          status = ${status},
          responsavel_id = ${responsavel_id}
      WHERE id = ${id}
    `;
  }


  async deleteManutencao(id) {
    await sql`DELETE FROM manutencao WHERE id = ${id}`;
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


  // AGENDAMENTOS
  async createAgendamento({ equipamento_id, data_agendada, status, responsavel, observacoes }) {
    const id = randomUUID();
    await sql`
      INSERT INTO agendamentos (id, equipamento_id, data_agendada, status, responsavel, observacoes)
      VALUES (${id}, ${equipamento_id}, ${data_agendada}, ${status}, ${responsavel}, ${observacoes})
    `;
  }


  async listAgendamentos() {
    return await sql`SELECT * FROM agendamentos`;
  }

  async criarAnalise(analise) {
  const id = randomUUID();
  const { equipamento_id, resultado, descricao, gravidade, data } = analise;
  await sql`
    INSERT INTO analises (id, equipamento_id, resultado, descricao, gravidade, data)
    VALUES (${id}, ${equipamento_id}, ${resultado}, ${descricao}, ${gravidade}, ${data})
  `;
}

}


