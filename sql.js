//import de dependências neon 
import { neon} from '@neondatabase/serverless'
import 'dotenv/config'

// Inicializa a conexão com o banco de dados
export const sql = neon(process.env.DATABASE_URL)