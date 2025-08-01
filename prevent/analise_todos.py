import psycopg2
from datetime import datetime
import subprocess
from dotenv import load_dotenv
from os import getenv

load_dotenv()
conn = psycopg2.connect(getenv("DATABASE_URL"))
cursor = conn.cursor()

cursor.execute("""
    SELECT
      e.id AS equipamento_id,
      e.nome_equipamento,
      m.data_manutencao,
      a.temperatura,
      a.vibracao,
      a.data AS data_analise
    FROM equipamentos e
    LEFT JOIN manutencao m ON m.equipamento_id = e.id
      AND m.data_manutencao = (
        SELECT MAX(data_manutencao) FROM manutencao WHERE equipamento_id = e.id
      )
    LEFT JOIN analises a ON a.equipamento_id = e.id
      AND a.data = (
        SELECT MAX(data) FROM analises WHERE equipamento_id = e.id
      )
    ORDER BY e.nome_equipamento;
""")

resultados_raw = cursor.fetchall()
resultados = []

for equipamento_id, nome_equipamento, data_manutencao, temperatura, vibracao, data_analise in resultados_raw:
    if data_manutencao is None or temperatura is None or vibracao is None:
        continue

    dias_desde_ultima = (datetime.now().date() - data_manutencao).days

    comando = [
        "python", "prevent/prever.py",
        str(temperatura),
        str(vibracao),
        str(dias_desde_ultima)
    ]
    resultado = subprocess.run(comando, capture_output=True, text=True)

    if resultado.returncode != 0:
        print(f"Erro ao rodar prever.py para {nome_equipamento}: {resultado.stderr}")
        continue

    try:
        dias_para_proxima = int(resultado.stdout.strip())
    except ValueError:
        print(f"Resultado inesperado do prever.py para {nome_equipamento}: {resultado.stdout}")
        continue

    resultados.append({
        "equipamento": nome_equipamento,
        "dias_para_proxima_manutencao": dias_para_proxima
    })

cursor.close()
conn.close()

for r in resultados:
    print(f"{r['equipamento']}: próxima manutenção em {r['dias_para_proxima_manutencao']} dias")
