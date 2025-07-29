from sklearn.ensemble import RandomForestClassifier
from joblib import dump
import numpy as np


# Dados ajustados
X = np.array([
    # Normais (mais variados)
    [35, 50, 30], [45, 60, 25], [22, 10, 15], [55, 70, 40], [85, 99, 45],
    [86, 80, 40], [87, 70, 35], [88, 60, 30], [89, 55, 25], [84, 60, 35],
    # Falha temperatura
    [95, 60, 30], [100, 80, 20],
    # Falha vibração
    [50, 150, 30], [60, 130, 25],
    # Falha pressão
    [60, 70, 60], [70, 80, 70],
    # Falhas combinadas
    [95, 120, 55], [100, 150, 65]
])
y = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    1, 1,
    1, 1,
    1, 1,
    1, 1
]


# Treinar com parâmetros ajustados
modelo = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
modelo.fit(X, y)


# Salvar
dump(modelo, 'C:/tcc/backend/prevent/modelo.pkl')
print("✔ Modelo treinado e salvo com sucesso!")
