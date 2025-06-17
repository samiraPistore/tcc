import sys
import json
import pandas as pd
from joblib import load
import psycopg2

def prever(dados):
    modelo = load('modelo.pkl')
    entrada = pd.DataFrame([dados])
    resultado = modelo.predict(entrada)
    return resultado[0]

def dados_do_banco():
    conexao = psycopg2.connect(
        host='localhost',
        database='semj_tech',
        user='postgres',
        password='1234',
        port='5432'
    )

    equipamento_id = '00000000-0000-0000-0000-000000000001'

    query = f"""
    SELECT tipo, valor
    FROM sensores
    WHERE equipamento_id = '{equipamento_id}'
    ORDER BY horario DESC;
    """

    df = pd.read_sql_query(query, conexao)
    conexao.close()

    dados = {}
    for tipo in ['temperatura', 'vibracao', 'ruido']:
        filtro = df[df['tipo'] == tipo]
        dados[tipo] = filtro.iloc[0]['valor'] if not filtro.empty else 0
    return dados

def main():
    if len(sys.argv) > 1:
        # 📥 Modo manual via argumento JSON (vindo do Node.js)
        try:
            dados = json.loads(sys.argv[1])
        except Exception as e:
            print(f"Erro ao ler argumentos: {e}")
            sys.exit(1)
    else:
        # 🛢️ Modo automático via banco de dados
        print("🔄 Nenhum argumento recebido, buscando dados do banco...")
        dados = dados_do_banco()

    resultado = prever(dados)

    # 🔍 Saída clara e única para facilitar leitura pelo Node.js
    print("FALHA" if resultado == 1 else "OK")

if __name__ == "__main__":
    main()
