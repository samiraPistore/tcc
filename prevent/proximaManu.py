import psycopg2
from joblib import load
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import uuid  # <-- use isso em vez de 'randomUUID'

load_dotenv()

# Conecta ao banco
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cursor = conn.cursor()

# Carrega o modelo de regressão
modelo = load(os.path.join(os.path.dirname(__file__), 'modeloRegreMan.pkl'))

# Busca todos os equipamentos com os dados necessários
cursor.execute("""
    SELECT equipamento_id, dias_uso_total, horas_dia, ultima_manutencao_dias, trocou_peca, falha_recente
    FROM dados_manutencao
""")
equipamentos = cursor.fetchall()

for equipamento in equipamentos:
    equipamento_id, dias_uso_total, horas_dia, ultima_manutencao_dias, trocou_peca, falha_recente = equipamento

    # Cria vetor de entrada do modelo
    entrada_modelo = [[dias_uso_total, horas_dia, ultima_manutencao_dias, trocou_peca, falha_recente]]

    # Faz a previsão com o modelo
    dias_ate_manutencao = int(modelo.predict(entrada_modelo)[0])

    # Gera ID
    id = str(uuid.uuid4())

    # Insere previsão na tabela
    cursor.execute("""
        INSERT INTO previsoes_manutencao (
            id, equipamento_id, dias_ate_manutencao, data_prevista, modelo_usado
        )
        VALUES (%s, %s, %s, %s, %s)
    """, (
        id,
        equipamento_id,
        dias_ate_manutencao,
        (datetime.now() + timedelta(days=dias_ate_manutencao)).date(),
        'Regressão Linear'
    ))

# Finaliza
conn.commit()
cursor.close()
conn.close()
print("Previsões salvas com sucesso!")
