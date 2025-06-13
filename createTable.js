import { sql } from './sql.js';

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    cargo TEXT NOT NULL
  )
`;


await sql`
  CREATE TABLE IF NOT EXISTS permissoes (
    id UUID PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT
  )
`;
await sql`
  CREATE TABLE equipamentos (
    id UUID PRIMARY KEY,
    nome_equipamento TEXT NOT NULL,
    tipo TEXT NOT NULL,
    local TEXT NOT NULL,
    estado_atual TEXT NOT NULL
  );
`
await sql`
CREATE TABLE sensores (
  id UUID PRIMARY KEY,
  equipamento_id UUID REFERENCES equipamentos(id),
  tipo TEXT NOT NULL, -- 'temperatura', 'vibracao', 'ruido'
  valor DECIMAL NOT NULL,
  horario TIMESTAMP NOT NULL
);
`



await sql`
  CREATE TABLE IF NOT EXISTS manutencao (
    id UUID PRIMARY KEY,
    equipamento_id UUID NOT NULL REFERENCES equipamentos(id),
    data_manutencao DATE NOT NULL,
    estado_atual_equipamento TEXT NOT NULL,
    responsavel_id UUID REFERENCES users(id)
  )
`;


await sql`
  CREATE TABLE IF NOT EXISTS alertas (
    id UUID PRIMARY KEY,
    equipamento_id UUID REFERENCES equipamentos(id),
    data_alerta date NOT NULL,
    tipo TEXT NOT NULL,
    descricao TEXT,
    nivel_gravidade INT NOT NULL,
    resolvido BOOLEAN DEFAULT FALSE
  )
`;


await sql`
  CREATE TABLE sensores_simulados (
  id UUID PRIMARY KEY,
  temperatura FLOAT,
  vibracao FLOAT,
  ruido FLOAT,
  falha INT,
  horario TIMESTAMP
)
`;

