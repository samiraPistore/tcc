from sklearn.ensemble import RandomForestClassifier
from joblib import dump
import numpy as np


# Dados de exemplo para treinar [temperatura, vibracao, ruido]
X = np.array([
    [35, 100, 70],
    [40, 110, 72],
    [42, 115, 73],
    [60, 180, 85],
    [70, 200, 95],
    [75, 220, 98],
    [30, 90, 68],
    [33, 95, 66],
    [34, 85, 65],
    [65, 210, 92]
])


# Classes correspondentes (0 = normal, 1 = falha)
y = [0, 0, 0, 1, 1, 1, 0, 0, 0, 1]


# Treinar o modelo
modelo = RandomForestClassifier()
modelo.fit(X, y)


# Salvar o modelo
dump(modelo, 'modelo.pkl')
print(" Modelo salvo com sucesso!")
