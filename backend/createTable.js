import { sql } from './sql.js'

//Cria a tabela users no 
await sql`
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha
    )
`;
//testar a criação de outras tabelas posteriormente