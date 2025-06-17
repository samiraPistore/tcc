import sys
import pandas as pd
from joblib import load
import json

# 👇 Verifica se foi passado argumento via linha de comando
try:
    dados_json = sys.argv[1]
    dados = json.loads(dados_json)
except IndexError:
    print("Nenhum dado recebido.")
    exit(1)
except json.JSONDecodeError as e:
    print(f"Erro ao decodificar JSON: {e}")
    exit(1)

# 👇 Carrega o modelo treinado
try:
    modelo = load('modelo.pkl')
except FileNotFoundError:
    print("Arquivo modelo.pkl não encontrado.")
    exit(1)
except Exception as e:
    print(f"Erro ao carregar o modelo: {e}")
    exit(1)

# 👇 Prepara os dados para predição
entrada = pd.DataFrame([dados])

# 👇 Faz a predição
try:
    resultado = modelo.predict(entrada)
    print("FALHA" if resultado[0] == 1 else "OK")
except Exception as e:
    print(f"Erro durante predição: {e}")
    exit(1)
