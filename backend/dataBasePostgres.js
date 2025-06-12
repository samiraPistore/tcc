import { randomUUID } from "node:crypto" // Importa função para gerar UUIDs aleatório
import { sql } from "./sql.js" // Importa instâncias para executar as queries


export class DatabasePostgres{
    // Lista usuários
    async list(search){
        let users


        if(search){
            users = await sql`select * from users where name ilike ${'%' + search + '%'}`
        } else{
            users = await sql`select * from users`
        }


        return users
    }

    // Busca um usuário pelo id
    async getById(id) {
        const result = await sql`SELECT * FROM users WHERE id = ${id}`
        
        return result[0]
    }
    
    //cria usuário novo
    async create(user){
        const userId = randomUUID()
        const { name, email } = user


        await sql`insert into users(id, name, email) VALUES (${userId}, ${name}, ${email})`
    }

    //Atualiza os dados do usuário pelo id
    async update(id, user){
        const { name, email } = user


        await sql`update users set name = ${name}, email = ${email} where id = ${id}`
    }

    //Deleta por id
    async delete(id){
        await sql`delete from users where id = ${id}`
    }
   
}
