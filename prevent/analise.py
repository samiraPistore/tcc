import psycopg2
from joblib import load
from datetime import datetime
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime
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
    # Coleta as últimas leituras por tipo de sensor
    cursor.execute("""
        SELECT s.tipo, l.valor
        FROM sensores s
        JOIN leituras l ON l.sensor_id = s.id
        WHERE s.equipamento_id = %s 

    """, (equipamento_id,))
    
    leituras = cursor.fetchall()

    # Pega o valor mais recente de cada tipo
    valores = {'temperatura': None, 'vibração': None, 'pressão': None}
    for tipo, valor in leituras:
        if tipo in valores and valores[tipo] is None:
            valores[tipo] = float(valor)

    if None in valores.values():
        print(f" Valores incompletos para equipamento {equipamento_id}, pulando...")
        continue

    entrada_modelo = [[valores['temperatura'], valores['vibração'], valores['pressão']]]
    predicao = modelo.predict(entrada_modelo)[0]

    print(f"Equipamento {equipamento_id}: Predição = {predicao}")


    # Insere na tabela de análises
    
    cursor.execute("""
        INSERT INTO analises (id, equipamento_id, resultado, descricao, gravidade, data)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        str(uuid.uuid4()),  # gera UUID para id
        equipamento_id,
        int(predicao),
        'Falha detectada' if predicao == 1 else 'Operação normal',
        'Alta' if predicao == 1 else 'Baixa',
        datetime.now()
    ))
    if predicao == 1:
        cursor.execute("""
            INSERT INTO alertas (id, equipamento_id, data_alerta, tipo, descricao, nivel_gravidade)
            VALUES (gen_random_uuid(), %s, %s, %s, %s, %s)
        """, (
            equipamento_id,
            datetime.now().date(),
            'Falha preditiva',
            'Alta probabilidade de falha detectada',
            3
        ))

conn.commit()
cursor.close()
conn.close()
