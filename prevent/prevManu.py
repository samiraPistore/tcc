import pandas as pd
from datetime import datetime
from joblib import dump

# Exemplo simplificado de dados simulados
dados = [
    {"equipamento_id": "A1", "data_manutencao": "2024-01-10", "media_temp": 55.3, "max_vibracao": 8.7},
    {"equipamento_id": "A1", "data_manutencao": "2024-06-04", "media_temp": 62.1, "max_vibracao": 9.4},
    {"equipamento_id": "A1", "data_manutencao": "2024-11-11", "media_temp": 64.8, "max_vibracao": 10.2},
]

df = pd.DataFrame(dados)
df['data_manutencao'] = pd.to_datetime(df['data_manutencao'])
df['dias_desde_ultima'] = df['data_manutencao'].diff().dt.days
df['dias_ate_proxima'] = df['data_manutencao'].shift(-1) - df['data_manutencao']
df['dias_ate_proxima'] = df['dias_ate_proxima'].dt.days

df = df.dropna()  # remove última linha, que não tem "próxima"

# MODELO
from sklearn.linear_model import LinearRegression

X = df[['media_temp', 'max_vibracao', 'dias_desde_ultima']]
y = df['dias_ate_proxima']

modelo = LinearRegression()
modelo.fit(X, y)

# Previsão para novo caso:
exemplo = pd.DataFrame([{
    "media_temp": 65,
    "max_vibracao": 9.8,
    "dias_desde_ultima": 150
}])

previsao_dias = modelo.predict(exemplo)[0]
print(f"Previsão: próxima manutenção em {int(previsao_dias)} dias")


dump(modelo, 'modeloRegreMan.pkl')