import { sql } from './sql.js';




await sql`
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    cargo TEXT NOT NULL
  );
`


await sql`
  CREATE TABLE IF NOT EXISTS equipamentos (
    id UUID PRIMARY KEY,
    nome_equipamento TEXT NOT NULL,
    modelo TEXT,
    local TEXT NOT NULL,
    status TEXT NOT NULL,
    fabricante TEXT,
    ano_aquisicao INT,
    descricao TEXT  
  );
`;


await sql`
  CREATE TABLE IF NOT EXISTS sensores (
    id UUID PRIMARY KEY,
    equipamento_id UUID REFERENCES equipamentos(id),
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL
  );
`


await sql`
  CREATE TABLE IF NOT EXISTS leituras (
    id UUID PRIMARY KEY,
    sensor_id UUID NOT NULL REFERENCES sensores(id),
    valor DECIMAL NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`


await sql`
  CREATE TABLE IF NOT EXISTS manutencao (
    id UUID PRIMARY KEY,
    equipamento_id UUID NOT NULL REFERENCES equipamentos(id),
    data_manutencao DATE NOT NULL,
    status TEXT NOT NULL,
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
  CREATE TABLE IF NOT EXISTS OS (
    id UUID PRIMARY KEY,
    equipamento_id UUID NOT NULL REFERENCES equipamentos(id),
    descricao TEXT NOT NULL,
    status TEXT NOT NULL,
    data_abertura DATE NOT NULL,
    data_fechamento DATE
  );
`
await sql`
  CREATE TABLE IF NOT EXISTS relatorios (
    id UUID PRIMARY KEY,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`


await sql`
  CREATE TABLE IF NOT EXISTS agendamentos (
    id UUID PRIMARY KEY,
    equipamento_id UUID NOT NULL REFERENCES equipamentos(id),
    data_agendada DATE NOT NULL,
    status TEXT NOT NULL,
    tecnico TEXT,
    descriçao TEXT
  );
`
await sql`
  CREATE TABLE  IF NOT EXISTS analises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipamento_id UUID REFERENCES equipamentos(id),
    temperatura DECIMAL,
    vibracao DECIMAL,
    ruido DECIMAL,
    resultado BOOLEAN, -- 0 ou 1
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`