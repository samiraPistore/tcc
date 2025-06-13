import { randomUUID } from 'crypto';
import { sql } from './sql.js';
import bcrypt from 'bcrypt';

export class DatabasePostgres {
  
    // cria os usuários
  async list(search) {
    if (search) {
      return await sql`SELECT * FROM users WHERE name ILIKE ${'%' + search + '%'}`;
    }
    return await sql`SELECT * FROM users`;
  }

  async getUserById(id) {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`;
    return result[0];
  }

  async create(user) {
    const id = randomUUID();
    const { name, email, senha, cargo } = user;
    await sql`
      INSERT INTO users (id, name, email, senha, cargo)
      VALUES (${id}, ${name}, ${email}, ${senha}, ${cargo})
    `;
  }

  async update(id, user) {
    const { name, email, senha, cargo
      
    } = user;
    await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, senha = ${senha}, cargo = ${cargo}
      WHERE id = ${id}
    `;
  }

  async delete(id) {
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
    const { nome_equipamento, tipo, local, estado_atual } = equipamento;
    await sql`
      INSERT INTO equipamentos (id, nome_equipamento, tipo, local, estado_atual)
      VALUES (${id}, ${nome_equipamento}, ${tipo}, ${local}, ${estado_atual})
    `;
  }


  //SENSORES

  // MANUTENÇÃO
  async listManutencao() {
    return await sql`SELECT * FROM manutencao`;
  }

  async createManutencao(manutencao) {
    const id = randomUUID();
    const { equipamento_id, data_manutencao, estado_atual_equipamento, responsavel_id } = manutencao;
    await sql`
      INSERT INTO manutencao (id, equipamento_id, data_manutencao, estado_atual_equipamento, responsavel_id)
      VALUES (${id}, ${equipamento_id}, ${data_manutencao}, ${estado_atual_equipamento}, ${responsavel_id})
    `;
  }

  // ALERTAS
  async listAlertas() {
    return await sql`SELECT * FROM alertas ORDER BY data_alerta DESC`;
  }

  async createAlerta(alerta) {
    const id = randomUUID();
    const { equipamento_id, tipo, descricao, nivel_gravidade } = alerta;
    await sql`
      INSERT INTO alertas (id, equipamento_id, tipo, descricao, nivel_gravidade)
      VALUES (${id}, ${equipamento_id}, ${tipo}, ${descricao}, ${nivel_gravidade})
    `;
  }

  async resolverAlerta(id) {
    await sql`
      UPDATE alertas SET resolvido = TRUE WHERE id = ${id}
    `;
  }
}