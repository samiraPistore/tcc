import psycopg2
from joblib import load
from datetime import datetime
import os
from dotenv import load_dotenv
import uuid

load_dotenv()  # carrega variáveis do .env

# Conecta ao banco
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cursor = conn.cursor()

# Carrega o modelo treinado
modelo = load(os.path.join(os.path.dirname(__file__), 'modelo.pkl'))

# Pega todos os equipamentos únicos
cursor.execute("""
    SELECT equipamento_id FROM sensores GROUP BY equipamento_id
""")
equipamentos = cursor.fetchall()

for (equipamento_id,) in equipamentos:
    # Consulta as leituras mais recentes por tipo de sensor para esse equipamento
    cursor.execute("""
        SELECT s.tipo, l.valor
        FROM sensores s
        JOIN leituras l ON l.sensor_id = s.id
        WHERE s.equipamento_id = %s
          AND l.timestamp = (
            SELECT MAX(l2.timestamp)
            FROM leituras l2
            WHERE l2.sensor_id = s.id
          )
    """, (equipamento_id,))

    leituras = cursor.fetchall()

    # Pega a leitura mais recente de cada tipo (temperatura, vibração, pressão)
    valores = {'temperatura': None, 'vibração': None, 'pressão': None}
    for tipo, valor in leituras:
        # Importante: normalize nomes para evitar problemas de acentuação/caixa
        chave = tipo.lower()
        if chave in valores:
            valores[chave] = float(valor)

    if None in valores.values():
        print(f"Valores incompletos para equipamento {equipamento_id}, pulando...")
        continue

    entrada_modelo = [[valores['temperatura'], valores['vibração'], valores['pressão']]]
    predicao = modelo.predict(entrada_modelo)[0]

    print(f"Equipamento {equipamento_id}: Predição = {predicao}")

    # Insere resultado da análise
    analise_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO analises (id, equipamento_id, resultado, descricao, gravidade, data)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        analise_id,
        equipamento_id,
        int(predicao),
        'Falha detectada' if predicao == 1 else 'Operação normal',
        'Alta' if predicao == 1 else 'Baixa',
        datetime.now()
    ))


    if predicao == 1:
        # Gera id único para alerta
        alerta_id = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO alertas (id, equipamento_id, data_alerta, descricao, nivel_gravidade)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            alerta_id,
            equipamento_id,
            datetime.now().date(),
            'Falha preditiva',
            3
        ))

        # Ordem de Serviço
        os_id = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO os (id, equipamento_id, descricao, status, data_abertura)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            os_id,
            equipamento_id,
            'OS gerada automaticamente por predição de falha',
            'aberta',
            datetime.now().date()
        ))

conn.commit()
cursor.close()
conn.close()
