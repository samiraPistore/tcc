# prever.py
import sys
from joblib import load
import pandas as pd

# Coleta os argumentos que chegam do backend
media_temp = float(sys.argv[1])
max_vibracao = float(sys.argv[2])
dias_desde_ultima = float(sys.argv[3])

# Carrega o modelo salvo
modelo = load("modeloRegreMan.pkl")

# Monta os dados para prever
exemplo = pd.DataFrame([{
    "media_temp": media_temp,
    "max_vibracao": max_vibracao,
    "dias_desde_ultima": dias_desde_ultima
}])

# Faz a previsão e imprime (backend vai capturar isso)
previsao = modelo.predict(exemplo)[0]
print(int(previsao))
