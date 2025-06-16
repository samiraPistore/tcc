import pandas as pd
import psycopg2
from joblib import load

# 🔗 Conexão com PostgreSQL
conexao = psycopg2.connect(
    host='localhost',
    database='seubanco',
    user='seuusuario',
    password='suasenha',
    port='5432'  # ajuste se for diferente
)

equipamento_id = '00000000-0000-0000-0000-000000000001'  # ID do equipamento que você quer consultar

# 🔍 Consulta os últimos dados dos sensores
query = f"""
SELECT tipo, valor
FROM sensores
WHERE equipamento_id = '{equipamento_id}'
ORDER BY horario DESC;
"""

df = pd.read_sql_query(query, conexao)

# 🏗️ Organiza os dados
# Pega o último valor de cada sensor
dados = {}
for tipo in ['temperatura', 'vibracao', 'ruido']:
    filtro = df[df['tipo'] == tipo]
    if not filtro.empty:
        dados[tipo] = filtro.iloc[0]['valor']
    else:
        dados[tipo] = 0  # se não tiver dado, coloca 0 (evita erro)

print("\n🟦 Dados coletados dos sensores:")
print(dados)

# 🔮 Carrega o modelo treinado
modelo = load('modelo.pkl')

# Prepara os dados pro modelo
entrada = pd.DataFrame([dados])

# Faz a previsão
resultado = modelo.predict(entrada)

# Mostra o resultado
if resultado[0] == 1:
    print("\n⚠️  Atenção: Alto risco de FALHA no equipamento!")
else:
    print("\n✅ Equipamento operando normalmente.")

# 🔚 Fecha conexão
conexao.close()
